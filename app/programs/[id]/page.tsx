"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import ViewProviderProfile from "@/components/ViewProviderProfile";

export default function ProgramDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching program:", error);
          if (error.code === "PGRST116") {
            // No rows returned
            setProgram(null);
          } else {
            toast.error("Failed to load program details");
          }
        } else {
          console.log("Program data loaded:", data);
          console.log("Program fields:", Object.keys(data));
          console.log("Provider ID:", data.provider_id);
          setProgram(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-500">Loading program details...</div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500">Program not found.</div>
        <Link href="/dashboard/parent" className="mt-4 text-blue-600 hover:underline">Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/dashboard/parent" className="text-blue-600 hover:underline">&larr; Back to Search</Link>
      </div>
      
      {/* Program Details */}
      <div className="bg-white rounded shadow p-6 flex flex-col md:flex-row gap-6 mb-6">
        {/* Media Section */}
        <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center">
          {program.media && program.media.length > 0 ? (
            <img
              src={program.media[0]}
              alt="Program Media"
              className="w-full h-48 object-cover rounded mb-2 bg-gray-100"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-2">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        {/* Details Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{program.title}</h1>
          <p className="mb-4 text-gray-700">{program.description || "No description available."}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div><span className="font-semibold">Type:</span> {program.program_type}</div>
            <div><span className="font-semibold">Location:</span> {program.location}</div>
            <div><span className="font-semibold">Delivery:</span> {program.delivery_mode}</div>
            <div><span className="font-semibold">Duration:</span> {program.duration || "-"}</div>
            <div><span className="font-semibold">Age Group:</span> {program.age_group}</div>
            <div><span className="font-semibold">Cost:</span> {program.cost}</div>
            <div><span className="font-semibold">Date/Deadline:</span> {program.start_date || program.deadline || "-"}</div>
            {program.contact_email && (
              <div><span className="font-semibold">Contact:</span> {program.contact_email}</div>
            )}
            {program.website && (
              <div><span className="font-semibold">Website:</span> 
                <a href={program.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  Visit Website
                </a>
              </div>
            )}
          </div>
          <Link
            href={`/apply/${program.id}`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-2"
          >
            Apply Now
          </Link>
        </div>
      </div>

      {/* Provider Profile */}
      {program.provider_id && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Provider</h2>
          <ViewProviderProfile providerId={program.provider_id} />
        </div>
      )}
    </div>
  );
} 