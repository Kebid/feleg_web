"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import { Skeleton } from '@/components/ui';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const editProgramSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  program_type: z.string().min(2, "Program type is required"),
  location: z.string().min(2, "Location is required"),
  delivery_mode: z.string().min(2, "Delivery mode is required"),
  duration: z.string().min(1, "Duration is required"),
  age_group: z.string().min(1, "Age group is required"),
  cost: z.string().min(1, "Cost is required"),
  start_date: z.string().min(1, "Start date is required"),
  deadline: z.string().min(1, "Deadline is required"),
  contact_email: z.string().email("Invalid email"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  max_participants: z.coerce.number().min(1, "Max participants is required"),
  is_active: z.boolean().optional(),
});

type EditProgramForm = z.infer<typeof editProgramSchema>;

export default function EditProgram({ programId, onClose, onUpdate }: EditProgramProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<EditProgramForm>({
    resolver: zodResolver(editProgramSchema),
    defaultValues: {
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
      max_participants: 1,
      is_active: true,
    },
  });

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
          reset({
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
            max_participants: data.max_participants || 1,
            is_active: data.is_active !== false,
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
  }, [user, programId, reset]);

  const onSubmit = async (data: EditProgramForm) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { error } = await supabase
        .from("programs")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", programId)
        .eq("provider_id", user.id);

      if (error) {
        setError("Failed to update program: " + error.message);
      } else {
        setSuccess("Program updated successfully!");
        setTimeout(() => {
          onUpdate();
          onClose();
        }, 1500);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Skeleton width="180px" height="28px" />
          <Skeleton width="32px" height="32px" rounded="rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton width="120px" height="18px" />
              <Skeleton width="100%" height="38px" />
            </div>
          ))}
        </div>
        <Skeleton width="120px" height="38px" />
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Title *
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Type *
            </label>
            <select
              {...register("program_type")}
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
            {errors.program_type && <div className="text-red-500 text-sm mt-1">{errors.program_type.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              {...register("location")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Mode *
            </label>
            <select
              {...register("delivery_mode")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">Select Mode</option>
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {errors.delivery_mode && <div className="text-red-500 text-sm mt-1">{errors.delivery_mode.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              {...register("duration")}
              placeholder="e.g., 8 weeks, 3 months"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {errors.duration && <div className="text-red-500 text-sm mt-1">{errors.duration.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Group *
            </label>
            <select
              {...register("age_group")}
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
            {errors.age_group && <div className="text-red-500 text-sm mt-1">{errors.age_group.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost *
            </label>
            <input
              type="text"
              {...register("cost")}
              placeholder="e.g., $150, Free, $25/week"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {errors.cost && <div className="text-red-500 text-sm mt-1">{errors.cost.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              {...register("max_participants")}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {errors.max_participants && <div className="text-red-500 text-sm mt-1">{errors.max_participants.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              {...register("start_date")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {errors.start_date && <div className="text-red-500 text-sm mt-1">{errors.start_date.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline
            </label>
            <input
              type="date"
              {...register("deadline")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {errors.deadline && <div className="text-red-500 text-sm mt-1">{errors.deadline.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              {...register("contact_email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {errors.contact_email && <div className="text-red-500 text-sm mt-1">{errors.contact_email.message}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              {...register("website")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            {errors.website && <div className="text-red-500 text-sm mt-1">{errors.website.message}</div>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Describe your program, what children will learn, activities, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
          />
          {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description.message}</div>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            {...register("is_active")}
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