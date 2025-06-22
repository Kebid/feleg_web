"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";

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
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
        <div className="text-gray-500">Loading applications...</div>
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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

      {filteredApps.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">
            {applications.length === 0 ? "No applications found." : "No applications match your filters."}
          </div>
          {applications.length === 0 && (
            <div className="text-sm text-gray-400">
              Applications will appear here once parents apply to your programs.
            </div>
          )}
        </div>
      ) : (
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
              {filteredApps.map((app) => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {app.program?.title || "Unknown Program"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{app.child_name}</td>
                  <td className="px-4 py-3 text-gray-700">{app.child_age}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(app.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {app.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(app.id, "Accepted")}
                          className="px-3 py-1 rounded bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(app.id, "Rejected")}
                          className="px-3 py-1 rounded bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}