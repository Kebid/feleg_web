"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Skeleton } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AcademicCapIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const programTypes = ["STEM", "Arts", "Sports", "Other"];
const deliveryModes = ["Online", "In-Person"];
const ageGroups = ["5-8", "9-12", "13-15", "16-18"];

const postProgramSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.string().min(2, 'Type is required'),
  delivery: z.string().min(2, 'Delivery mode is required'),
  duration: z.string().min(1, 'Duration is required'),
  ageGroup: z.string().min(1, 'Age group is required'),
  cost: z.string().min(1, 'Cost is required'),
  date: z.string().min(1, 'Date/Deadline is required'),
});

type PostProgramForm = z.infer<typeof postProgramSchema>;

export default function PostProgram() {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostProgramForm>({
    resolver: zodResolver(postProgramSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      type: 'STEM',
      delivery: 'Online',
      duration: '',
      ageGroup: '5-8',
      cost: '',
      date: '',
    },
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    getUser();
  }, []);

  const onSubmit = async (data: PostProgramForm) => {
    setSubmitting(true);
    setSuccess(false);
    const { error } = await supabase.from('programs').insert({
      title: data.title,
      description: data.description,
      location: data.location,
      program_type: data.type,
      delivery_mode: data.delivery,
      duration: data.duration,
      age_group: data.ageGroup,
      cost: data.cost,
      provider_id: userId,
      date: data.date,
    });
    if (error) {
      // Show error toast or message if needed
      setSubmitting(false);
      return;
    }
    setSuccess(true);
    reset();
    setSubmitting(false);
  };

  if (submitting) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <div className="bg-white rounded shadow p-6">
          <Skeleton width="220px" height="32px" className="mb-4" />
          {[...Array(7)].map((_, i) => (
            <div key={i} className="mb-4">
              <Skeleton width="120px" height="18px" className="mb-2" />
              <Skeleton width="100%" height="38px" />
            </div>
          ))}
          <Skeleton width="120px" height="38px" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <PlusCircleIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Post a New Program</h1>
        </div>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Program posted successfully!</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Program Title *</label>
            <input
              type="text"
              {...register("title")}
              className="w-full border p-2 rounded"
            />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title.message}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Description *</label>
            <textarea
              {...register('description')}
              className="w-full border p-2 rounded"
              rows={3}
            />
            {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description.message}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Location *</label>
            <input
              type="text"
              {...register('location')}
              className="w-full border p-2 rounded"
            />
            {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location.message}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Program Type *</label>
            <select
              {...register('type')}
              className="w-full border p-2 rounded"
            >
              {programTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Delivery Mode *</label>
            <select
              {...register('delivery')}
              className="w-full border p-2 rounded"
            >
              {deliveryModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Duration *</label>
            <input
              type="text"
              {...register('duration')}
              className="w-full border p-2 rounded"
            />
            {errors.duration && <div className="text-red-500 text-sm mt-1">{errors.duration.message}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Age Group *</label>
            <select
              {...register('ageGroup')}
              className="w-full border p-2 rounded"
            >
              {ageGroups.map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Cost *</label>
            <input
              type="text"
              {...register('cost')}
              className="w-full border p-2 rounded"
            />
            {errors.cost && <div className="text-red-500 text-sm mt-1">{errors.cost.message}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Date/Deadline *</label>
            <input
              type="date"
              {...register('date')}
              className="w-full border p-2 rounded"
            />
            {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date.message}</div>}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl font-semibold hover:scale-105 transition-transform shadow"
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post Program'}
          </button>
        </form>
      </motion.div>
    </div>
  );
} 