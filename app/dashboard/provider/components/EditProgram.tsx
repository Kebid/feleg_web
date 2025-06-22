"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";

interface ProgramForm {
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
  max_participants: number;
  is_active: boolean;
}

interface EditProgramProps {
  programId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditProgram({ programId, onClose, onUpdate }: EditProgramProps) {
  const [form, setForm] = useState<ProgramForm>({
    title: "",
    description: "",
    program_type: "",
    location: "",
    delivery_mode: "",
    duration: "",
    age_group: "",
    cost: "",
    start_date: "",
    deadline: "",
    contact_email: "",
    website: "",
    max_participants: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user || !programId) return;
    
    const fetchProgram = async () => {
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('id', programId)
          .eq('provider_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching program:", error);
          setError("Failed to load program or you don't have permission to edit it");
        } else if (data) {
          setForm({
            title: data.title || "",
            description: data.description || "",
            program_type: data.program_type || "",
            location: data.location || "",
            delivery_mode: data.delivery_mode || "",
            duration: data.duration || "",
            age_group: data.age_group || "",
            cost: data.cost || "",
            start_date: data.start_date || "",
            deadline: data.deadline || "",
            contact_email: data.contact_email || "",
            website: data.website || "",
            max_participants: data.max_participants || 0,
            is_active: data.is_active !== false
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [user, programId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from('programs')
        .update({
          ...form,
          updated_at: new Date().toISOString()
        })
        .eq('id', programId)
        .eq('provider_id', user.id);

      if (error) {
        console.error("Error updating program:", error);
        setError("Failed to update program: " + error.message);
      } else {
        setSuccess("Program updated successfully!");
        setTimeout(() => {
          onUpdate();
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProgramForm, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
        <div className="text-gray-500">Loading program...</div>
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
        <h2 className="text-xl font-bold text-green-700">Edit Program</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Type *
            </label>
            <select
              value={form.program_type}
              onChange={(e) => handleChange('program_type', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">Select Type</option>
              <option value="Academic">Academic</option>
              <option value="Arts">Arts</option>
              <option value="Sports">Sports</option>
              <option value="STEM">STEM</option>
              <option value="Music">Music</option>
              <option value="Language">Language</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Mode *
            </label>
            <select
              value={form.delivery_mode}
              onChange={(e) => handleChange('delivery_mode', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">Select Mode</option>
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="e.g., 8 weeks, 3 months"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Group *
            </label>
            <select
              value={form.age_group}
              onChange={(e) => handleChange('age_group', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">Select Age Group</option>
              <option value="3-5 years">3-5 years</option>
              <option value="6-8 years">6-8 years</option>
              <option value="9-12 years">9-12 years</option>
              <option value="13-15 years">13-15 years</option>
              <option value="16-18 years">16-18 years</option>
              <option value="All ages">All ages</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost *
            </label>
            <input
              type="text"
              value={form.cost}
              onChange={(e) => handleChange('cost', e.target.value)}
              required
              placeholder="e.g., $150, Free, $25/week"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              value={form.max_participants}
              onChange={(e) => handleChange('max_participants', parseInt(e.target.value) || 0)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            rows={4}
            placeholder="Describe your program, what children will learn, activities, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Program is active and accepting applications
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Program"}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 