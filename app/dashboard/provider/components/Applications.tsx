"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import { Skeleton } from '@/components/ui';
import { UserGroupIcon, AcademicCapIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

function statusColor(status: string) {
  if (status === "Accepted") return "text-green-600 bg-green-100";
  if (status === "Pending") return "text-yellow-700 bg-yellow-100";
  if (status === "Rejected") return "text-red-600 bg-red-100";
  return "text-gray-600 bg-gray-100";
}

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");
        
        // First, get the program IDs for this provider
        const { data: programs, error: programsError } = await supabase
          .from('programs')
          .select('id, title')
          .eq('provider_id', user.id);

        if (programsError) {
          console.error("Error fetching programs:", programsError);
          setError("Failed to load programs");
          setLoading(false);
          return;
        }

        if (!programs || programs.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }

        const programIds = programs.map(p => p.id);
        
        // Then fetch applications for those programs
        const { data, error: fetchError } = await supabase
          .from("applications")
          .select(`
            id,
            child_name,
            child_age,
            interests,
            status,
            submitted_at,
            program:program_id (
              id,
              title
            )
          `)
          .in('program_id', programIds)
          .order("submitted_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching applications:", fetchError);
          setError("Failed to load applications");
        } else {
          setApplications(data || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleAction = async (id: string, action: "Accepted" | "Rejected") => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .update({ status: action })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error updating application:", error);
        alert(`Failed to update application status: ${error.message}`);
      } else {
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: action } : app
          )
        );
        alert(`Application ${action.toLowerCase()} successfully!`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred");
    }
  };

  // Get unique program titles for filter dropdown
  const programTitles = Array.from(new Set(applications.map((a) => a.program?.title).filter(Boolean)));

  // Filtered applications
  const filteredApps = applications.filter((app) =>
    (statusFilter ? app.status === statusFilter : true) &&
    (programFilter ? app.program?.title === programFilter : true)
  );

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Program</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Child Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submitted</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-3"><Skeleton width="100px" height="20px" /></td>
                <td className="px-4 py-3"><Skeleton width="80px" height="20px" /></td>
                <td className="px-4 py-3"><Skeleton width="40px" height="20px" /></td>
                <td className="px-4 py-3"><Skeleton width="70px" height="20px" /></td>
                <td className="px-4 py-3"><Skeleton width="90px" height="20px" /></td>
                <td className="px-4 py-3"><Skeleton width="60px" height="20px" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="text-green-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-green-700">All Applications</h2>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={programFilter}
          onChange={e => setProgramFilter(e.target.value)}
          className="border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
        >
          <option value="">All Programs</option>
          {programTitles.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <UserGroupIcon className="w-12 h-12 text-green-200 mb-2" />
            <div className="text-center text-gray-500 font-medium">
              No applications found.
            </div>
          </div>
        )}
        {filteredApps.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition-all p-6 flex flex-col gap-3 border border-green-100 dark:border-gray-800 relative"
          >
            <div className="flex items-center gap-3 mb-2">
              <AcademicCapIcon className="w-7 h-7 text-blue-500" />
              <div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{app.program?.title || 'Program'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{app.program?.id || 'ID'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <UserGroupIcon className="w-5 h-5 text-purple-500" />
              <span className="font-semibold">{app.child_name}</span>
              <span className="mx-1">|</span>
              <span>Age {app.child_age}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="w-4 h-4" />
              <span>Submitted: {new Date(app.submitted_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {app.status === 'Accepted' && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"><CheckCircleIcon className="w-4 h-4" /> Accepted</span>}
              {app.status === 'Pending' && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold"><ClockIcon className="w-4 h-4" /> Pending</span>}
              {app.status === 'Rejected' && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold"><XCircleIcon className="w-4 h-4" /> Rejected</span>}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleAction(app.id, 'Accepted')}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-2 rounded-xl shadow hover:scale-105 transition-transform"
                disabled={app.status === 'Accepted'}
              >
                Accept
              </button>
              <button
                onClick={() => handleAction(app.id, 'Rejected')}
                className="flex-1 bg-red-100 text-red-700 font-semibold py-2 rounded-xl shadow hover:scale-105 transition-transform"
                disabled={app.status === 'Rejected'}
              >
                Reject
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}