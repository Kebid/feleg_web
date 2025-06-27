"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import ViewProviderProfile from "@/components/ViewProviderProfile";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { ImageOff, MapPin, Globe, Users, Calendar, BadgeDollarSign, Clock, UserCircle } from "lucide-react";
import Card from "@/components/ui/Card";

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
      <div className="relative min-h-screen flex flex-col items-center justify-center animated-gradient-bg overflow-hidden p-4">
        {/* Floating blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl backdrop-blur-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <div className="text-gray-500">Loading program details...</div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center animated-gradient-bg overflow-hidden p-4">
        {/* Floating blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl backdrop-blur-md p-6 text-center">
          <div className="text-gray-500">Program not found.</div>
          <Link href="/dashboard/parent" className="mt-4 text-blue-600 hover:underline block">Back to Search</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen animated-gradient-bg overflow-hidden">
      {/* Floating blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="relative z-10 py-10 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-4">
            <Link href="/dashboard/parent" className="text-blue-600 hover:underline">&larr; Back to Search</Link>
          </div>
          {/* Program Details */}
          <Card className="p-0 md:p-0 bg-white/80 dark:bg-gray-900/90 shadow-2xl rounded-2xl border-none mb-10 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Media Section */}
              <div className="flex flex-col items-center justify-center p-8">
                {program.media && program.media.length > 0 ? (
                  <img
                    src={program.media[0]}
                    alt="Program Media"
                    className="w-full h-56 object-cover rounded-xl mb-2 bg-gray-100 shadow"
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden mb-2">
                    <motion.div
                      className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-100/40 via-purple-100/40 to-blue-100/40 dark:from-gray-800/40 dark:via-gray-900/40 dark:to-gray-800/40"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    />
                    <ImageOff className="w-16 h-16 text-gray-300 z-10" />
                  </div>
                )}
              </div>
              {/* Details Section */}
              <div className="flex flex-col justify-between p-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">{program.title}</h1>
                  <p className="text-sm text-muted-foreground mb-4 text-gray-600 dark:text-gray-300">{program.description || "No description available."}</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold">Delivery:</span> {program.delivery_mode}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <MapPin className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold">Location:</span> {program.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <Users className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Age Group:</span> {program.age_group}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <BadgeDollarSign className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold">Cost:</span> {program.cost}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <Clock className="w-5 h-5 text-indigo-500" />
                      <span className="font-semibold">Duration:</span> {program.duration || "-"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <Calendar className="w-5 h-5 text-pink-500" />
                      <span className="font-semibold">Date/Deadline:</span> {program.start_date || program.deadline || "-"}
                    </div>
                    {program.contact_email && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <UserCircle className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold">Contact:</span> {program.contact_email}
                      </div>
                    )}
                    {program.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Website:</span>
                        <a href={program.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                  <Link
                    href={`/apply/${program.id}`}
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow hover:shadow-xl transition-all text-lg"
                  >
                    Apply Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </Card>
          {/* Provider Profile */}
          {program.provider_id && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow p-8 flex flex-col items-center mb-6 border-none">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
                className="flex flex-col items-center gap-2 mb-4"
              >
                <UserCircle className="w-14 h-14 text-blue-400" />
                <span className="font-bold text-lg text-gray-900 dark:text-white">Provider</span>
                <span className="text-sm text-gray-500 dark:text-gray-300">Trusted enrichment partner</span>
              </motion.div>
              <div className="w-full max-w-md">
                <ViewProviderProfile providerId={program.provider_id} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 