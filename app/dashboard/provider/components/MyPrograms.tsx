"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import EditProgram from "./EditProgram";
import { AcademicCapIcon, MapPinIcon, DeviceTabletIcon, CheckCircleIcon, XCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function MyPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [editingProgram, setEditingProgram] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchPrograms = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("programs")
        .select("id, title, program_type, location, delivery_mode, duration, age_group, cost, date, provider_id, is_active")
        .eq("provider_id", user.id)
        .order("date", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setPrograms(data || []);
      }
      setLoading(false);
    };
    fetchPrograms();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    const { error } = await supabase.from("programs").delete().eq("id", id);
    if (!error) {
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete program: " + error.message);
    }
  };

  const handleEdit = (programId: string) => {
    setEditingProgram(programId);
  };

  const handleCloseEdit = () => {
    setEditingProgram(null);
  };

  const handleProgramUpdate = () => {
    // Refresh the programs list
    if (user) {
      const fetchPrograms = async () => {
        const { data, error } = await supabase
          .from("programs")
          .select("id, title, program_type, location, delivery_mode, duration, age_group, cost, date, provider_id, is_active")
          .eq("provider_id", user.id)
          .order("date", { ascending: false });
        if (!error) {
          setPrograms(data || []);
        }
      };
      fetchPrograms();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Programs</h1>
      <div className="mb-4">
        <Link href="/dashboard/provider/post-program" className="text-blue-600 hover:underline">+ Post New Program</Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 animate-pulse h-40" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : programs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No programs posted yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition-all p-6 flex flex-col gap-3 border border-blue-100 dark:border-gray-800 relative"
            >
              <div className="flex items-center gap-3 mb-2">
                <AcademicCapIcon className="w-7 h-7 text-blue-500" />
                <div>
                  <div className="font-bold text-lg text-gray-900 dark:text-white">{program.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{program.location} • {program.delivery_mode}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <DeviceTabletIcon className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">{program.program_type}</span>
                <span className="mx-1">|</span>
                <span>{program.age_group}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <MapPinIcon className="w-4 h-4" />
                <span>{program.location}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {program.is_active !== false ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"><CheckCircleIcon className="w-4 h-4" /> Active</span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold"><XCircleIcon className="w-4 h-4" /> Inactive</span>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(program.id)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-xl shadow hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <PencilSquareIcon className="w-5 h-5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(program.id)}
                  className="flex-1 bg-red-100 text-red-700 font-semibold py-2 rounded-xl shadow hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* Edit Program Modal */}
      {editingProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <EditProgram
            programId={editingProgram}
            onClose={handleCloseEdit}
            onUpdate={handleProgramUpdate}
          />
        </div>
      )}
    </div>
  );
} 