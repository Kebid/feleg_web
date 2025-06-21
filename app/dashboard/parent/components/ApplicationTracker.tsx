"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

function statusColor(status: string) {
  if (status === "Accepted") return "text-green-600 bg-green-100";
  if (status === "Pending") return "text-yellow-700 bg-yellow-100";
  if (status === "Rejected") return "text-red-600 bg-red-100";
  return "text-gray-600 bg-gray-100";
}

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
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
            programs (
              title
            )
          `)
          .eq("parent_id", user.id)
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
  }, []);

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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Program Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Child Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submission Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {app.programs?.title || "Unknown Program"}
              </td>
              <td className="px-4 py-3 text-gray-700">{app.child_name}</td>
              <td className="px-4 py-3 text-gray-700">{app.child_age}</td>
              <td className="px-4 py-3 text-gray-700">
                {new Date(app.submitted_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(app.status)}`}>
                  {app.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 