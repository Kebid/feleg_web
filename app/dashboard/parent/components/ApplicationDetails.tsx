"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import ViewProviderProfile from "@/components/ViewProviderProfile";

interface ApplicationDetailsProps {
  applicationId: string;
  onClose: () => void;
}

interface ApplicationData {
  id: string;
  child_name: string;
  child_age: number;
  interests: string;
  status: string;
  submitted_at: string;
  programs: Array<{
    id: string;
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
  }>;
}

export default function ApplicationDetails({ applicationId, onClose }: ApplicationDetailsProps) {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select(`
            id,
            child_name,
            child_age,
            interests,
            status,
            submitted_at,
            programs (
              id,
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
          .eq("id", applicationId)
          .single();

        if (error) {
          console.error("Error fetching application:", error);
          setError("Failed to load application details");
        } else {
          setApplication(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-yellow-700 bg-yellow-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const program = application?.programs?.[0];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-500">Loading application details...</div>
      </div>
    );
  }

  if (error || !application || !program) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">{error || "Application or program data not found"}</div>
        <button 
          onClick={onClose}
          className="text-blue-600 hover:underline"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-700">Application Details</h2>
        <button
          onClick={onClose}
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
              Submitted on {new Date(application.submitted_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </div>
      </div>

      {/* Child Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Child Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Child Name</label>
            <p className="text-gray-900">{application.child_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <p className="text-gray-900">{application.child_age} years old</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Interests</label>
            <p className="text-gray-900">{application.interests}</p>
          </div>
        </div>
      </div>

      {/* Program Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Program Information</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">
            {program.title}
          </h4>
          <p className="text-blue-800 mb-4">{program.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700">Program Type</label>
              <p className="text-blue-900">{program.program_type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700">Location</label>
              <p className="text-blue-900">{program.location}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700">Delivery Mode</label>
              <p className="text-blue-900">{program.delivery_mode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700">Duration</label>
              <p className="text-blue-900">{program.duration || "Not specified"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700">Age Group</label>
              <p className="text-blue-900">{program.age_group}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700">Cost</label>
              <p className="text-blue-900">{program.cost}</p>
            </div>
            {program.start_date && (
              <div>
                <label className="block text-sm font-medium text-blue-700">Start Date</label>
                <p className="text-blue-900">{new Date(program.start_date).toLocaleDateString()}</p>
              </div>
            )}
            {program.deadline && (
              <div>
                <label className="block text-sm font-medium text-blue-700">Application Deadline</label>
                <p className="text-blue-900">{new Date(program.deadline).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {(program.contact_email || program.website) && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h5 className="font-medium text-blue-700 mb-2">Contact Information</h5>
              <div className="space-y-1">
                {program.contact_email && (
                  <p className="text-blue-900">
                    <span className="font-medium">Email:</span> {program.contact_email}
                  </p>
                )}
                {program.website && (
                  <p className="text-blue-900">
                    <span className="font-medium">Website:</span>{" "}
                    <a 
                      href={program.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {program.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Provider Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Provider Information</h3>
        <ViewProviderProfile providerId={program.provider_id} />
      </div>

      {/* Status-specific information */}
      {application.status === "Accepted" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">🎉 Congratulations!</h4>
          <p className="text-green-700">
            Your application has been accepted! The provider will contact you with next steps 
            and additional information about the program.
          </p>
        </div>
      )}

      {application.status === "Rejected" && (
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
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
} 