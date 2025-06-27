"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { motion } from "framer-motion";
import { UserGroupIcon, AcademicCapIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

function statusColor(status: string) {
  if (status === "Accepted") return "text-green-600 bg-green-100";
  if (status === "Pending") return "text-yellow-700 bg-yellow-100";
  if (status === "Rejected") return "text-red-600 bg-red-100";
  return "text-gray-600 bg-gray-100";
}

interface Application {
  id: string;
  child_name: string;
  child_age: number;
  interests: string;
  status: string;
  submitted_at: string;
  program: {
    title: string;
    description: string;
    program_type: string;
    location: string;
    delivery_mode: string;
    duration: string;
    age_group: string;
    cost: string;
    start_date: string;
    deadline: string;
    contact_email: string;
    website: string;
    provider_id: string;
  } | null;
}

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Get current user
        const { data: { session }, error: userError } = await supabase.auth.getSession();
        const user = session?.user;
        if (userError || !user) {
          setError("Failed to get user information");
          setLoading(false);
          return;
        }

        // Fetch applications for the current user
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
              title,
              description,
              program_type,
              location,
              delivery_mode,
              duration,
              age_group,
              cost,
              start_date,
              deadline,
              contact_email,
              website,
              provider_id
            )
          `)
          .eq("parent_id", user.id)
          .order("submitted_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching applications:", fetchError);
          setError("Failed to load applications");
        } else if (data && Array.isArray(data)) {
          // Unwrap program array if needed
          const fixed = data.map(app => ({
            ...app,
            program: Array.isArray(app.program) ? app.program[0] || null : app.program,
          }));
          setApplications(fixed);
        } else {
          setApplications([]);
        }

        // Fetch unread notifications count
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);

        setUnreadNotifications(count || 0);
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
  };

  const closeDetails = () => {
    setSelectedApplication(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
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
          className="text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">No applications submitted yet.</div>
        <div className="text-sm text-gray-400">
          Browse programs and submit your first application to see it here.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((app, i) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 * i }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition-all p-6 flex flex-col gap-3 border border-blue-100 dark:border-gray-800 relative"
        >
          <div className="flex items-center gap-3 mb-2">
            <AcademicCapIcon className="w-7 h-7 text-blue-500" />
            <div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">{app.program?.title || 'Program'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{app.program?.location || 'Location'} • {app.program?.delivery_mode || 'Mode'}</div>
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
              onClick={() => handleViewDetails(app)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-xl shadow hover:scale-105 transition-transform"
            >
              View Details
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 