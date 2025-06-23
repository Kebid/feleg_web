"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

export default function BrowseProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("programs")
        .select("id, title, description, program_type, location, cost, featured")
        .order("created_at", { ascending: false });
      if (error) {
        setError("Failed to load programs");
      } else {
        setPrograms(data || []);
      }
      setLoading(false);
    };
    fetchPrograms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Browse Programs</h1>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-500">Loading programs...</div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : programs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No programs available yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card hover className="h-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="relative">
                  {program.featured && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ✨ Featured
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {program.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {program.program_type}
                    </span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {program.cost}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="mr-2">📍</span>
                    {program.location}
                  </div>
                  <Link href={`/programs/${program.id}`}>
                    <motion.button
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-300 dark:bg-blue-700 dark:hover:bg-blue-800"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 