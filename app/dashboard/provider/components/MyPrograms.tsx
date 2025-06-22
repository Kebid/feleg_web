"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import EditProgram from "./EditProgram";

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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Programs</h1>
      <div className="mb-4">
        <Link href="/dashboard/provider/post-program" className="text-blue-600 hover:underline">+ Post New Program</Link>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading programs...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : programs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No programs posted yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Delivery</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className="border-t">
                  <td className="px-4 py-2 font-semibold">{program.title}</td>
                  <td className="px-4 py-2">{program.program_type}</td>
                  <td className="px-4 py-2">{program.location}</td>
                  <td className="px-4 py-2">{program.delivery_mode}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      program.is_active !== false 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {program.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{program.date || "-"}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleEdit(program.id)} 
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(program.id)} className="text-red-500 hover:underline mr-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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