"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { motion } from "framer-motion";

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
  programs: {
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
  };
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
        } else {
          setApplications(data || []);
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
    <>
      {/* Notification Banner */}
      {unreadNotifications > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔔</span>
              <div>
                <h4 className="font-semibold text-blue-900">
                  You have {unreadNotifications} new notification{unreadNotifications > 1 ? 's' : ''}!
                </h4>
                <p className="text-blue-700 text-sm">
                  Check your application status updates.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View all
            </button>
          </div>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Program Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Child Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submission Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
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
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleViewDetails(app)}
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-700">Application Details</h2>
              <button
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Application Status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Application Status</h3>
                  <p className="text-sm text-gray-600">
                    Submitted on {new Date(selectedApplication.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
              </div>
            </div>

            {/* Child Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Child Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Child Name</label>
                  <p className="text-gray-900">{selectedApplication.child_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <p className="text-gray-900">{selectedApplication.child_age} years old</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Interests</label>
                  <p className="text-gray-900">{selectedApplication.interests}</p>
                </div>
              </div>
            </div>

            {/* Program Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Program Information</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  {selectedApplication.programs.title}
                </h4>
                <p className="text-blue-800 mb-4">{selectedApplication.programs.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Program Type</label>
                    <p className="text-blue-900">{selectedApplication.programs.program_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Location</label>
                    <p className="text-blue-900">{selectedApplication.programs.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Delivery Mode</label>
                    <p className="text-blue-900">{selectedApplication.programs.delivery_mode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Duration</label>
                    <p className="text-blue-900">{selectedApplication.programs.duration || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Age Group</label>
                    <p className="text-blue-900">{selectedApplication.programs.age_group}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Cost</label>
                    <p className="text-blue-900">{selectedApplication.programs.cost}</p>
                  </div>
                </div>

                {(selectedApplication.programs.contact_email || selectedApplication.programs.website) && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <h5 className="font-medium text-blue-700 mb-2">Contact Information</h5>
                    <div className="space-y-1">
                      {selectedApplication.programs.contact_email && (
                        <p className="text-blue-900">
                          <span className="font-medium">Email:</span> {selectedApplication.programs.contact_email}
                        </p>
                      )}
                      {selectedApplication.programs.website && (
                        <p className="text-blue-900">
                          <span className="font-medium">Website:</span>{" "}
                          <a 
                            href={selectedApplication.programs.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedApplication.programs.website}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status-specific information */}
            {selectedApplication.status === "Accepted" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎉 Congratulations!</h4>
                <p className="text-green-700">
                  Your application has been accepted! The provider will contact you with next steps 
                  and additional information about the program.
                </p>
              </div>
            )}

            {selectedApplication.status === "Rejected" && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Application Update</h4>
                <p className="text-yellow-700">
                  Your application was not accepted for this program. Don't worry - there are many 
                  other great programs available. Keep exploring and applying!
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={closeDetails}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 