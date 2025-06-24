"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import ViewProviderProfile from "@/components/ViewProviderProfile";
import { Skeleton } from '@/components/ui';

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
  program: {
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
  } | null;
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
            program:program_id (
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
          // Handle the case where Supabase returns program as an array
          const applicationData = data as any;
          const processedData: ApplicationData = {
            ...applicationData,
            program: Array.isArray(applicationData.program) 
              ? applicationData.program[0] || null 
              : applicationData.program
          };
          setApplication(processedData);
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
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "Pending":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "Rejected":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Skeleton width="200px" height="28px" />
          <Skeleton width="32px" height="32px" rounded="rounded-full" />
        </div>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <Skeleton width="160px" height="20px" className="mb-2" />
          <Skeleton width="120px" height="16px" />
        </div>
        <div className="mb-6">
          <Skeleton width="140px" height="20px" className="mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton width="100px" height="16px" className="mb-1" />
                <Skeleton width="80%" height="20px" />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <Skeleton width="160px" height="20px" className="mb-3" />
          <Skeleton width="100%" height="60px" />
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">{error || "Application not found"}</div>
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
          <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getStatusColor(application.status)}`}>
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
        {application.program ? (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">
              {application.program.title}
            </h4>
            <p className="text-blue-800 mb-4">{application.program.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700">Program Type</label>
                <p className="text-blue-900">{application.program.program_type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Location</label>
                <p className="text-blue-900">{application.program.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Delivery Mode</label>
                <p className="text-blue-900">{application.program.delivery_mode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Duration</label>
                <p className="text-blue-900">{application.program.duration || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Age Group</label>
                <p className="text-blue-900">{application.program.age_group}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Cost</label>
                <p className="text-blue-900">{application.program.cost}</p>
              </div>
              {application.program.start_date && (
                <div>
                  <label className="block text-sm font-medium text-blue-700">Start Date</label>
                  <p className="text-blue-900">{new Date(application.program.start_date).toLocaleDateString()}</p>
                </div>
              )}
              {application.program.deadline && (
                <div>
                  <label className="block text-sm font-medium text-blue-700">Application Deadline</label>
                  <p className="text-blue-900">{new Date(application.program.deadline).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {(application.program.contact_email || application.program.website) && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h5 className="font-medium text-blue-700 mb-2">Contact Information</h5>
                <div className="space-y-1">
                  {application.program.contact_email && (
                    <p className="text-blue-900">
                      <span className="font-medium">Email:</span> {application.program.contact_email}
                    </p>
                  )}
                  {application.program.website && (
                    <p className="text-blue-900">
                      <span className="font-medium">Website:</span>{" "}
                      <a 
                        href={application.program.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {application.program.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500">Program information not available</p>
          </div>
        )}
      </div>

      {/* Provider Information */}
      {application.program?.provider_id && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Provider Information</h3>
          <ViewProviderProfile providerId={application.program.provider_id} />
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
