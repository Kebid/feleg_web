"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import { AcademicCapIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    childName: "",
    childAge: "",
    interests: "",
    document: null as File | null,
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth error:", error);
          toast.error("Authentication error. Please try logging in again.");
        } else if (!session?.user) {
          toast.error("You must be logged in to apply for programs.");
        } else {
          setUser(session.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Failed to verify authentication.");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return;
      
      try {
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
          setProgram(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    };

    fetchProgram();
  }, [id]);

  const validate = () => {
    const errs: any = {};
    if (!form.childName) errs.childName = "Child's name is required.";
    if (!form.childAge) errs.childAge = "Child's age is required.";
    if (!form.interests) errs.interests = "Interests are required.";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "document") {
      setForm({ ...form, document: files[0] || null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Check if user is authenticated
    if (!user) {
      toast.error("You must be logged in to apply for programs.");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      // Insert application into Supabase
      const { data, error } = await supabase
        .from("applications")
        .insert({
          parent_id: user.id,
          program_id: id,
          child_name: form.childName,
          child_age: parseInt(form.childAge),
          interests: form.interests,
          document_url: null, // Placeholder for now
          status: "Pending"
        })
        .select()
        .single();

      if (error) {
        console.error("Application submission error:", error);
        toast.error(error.message || "Failed to submit application. Please try again.");
      } else {
        toast.success("Application submitted successfully!");
        setForm({ childName: "", childAge: "", interests: "", document: null });
        
        // Redirect to parent dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard/parent");
        }, 2000);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500">Program not found.</div>
        <Link href="/dashboard/parent" className="mt-4 text-blue-600 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <Link href={`/programs/${id}`} className="text-blue-600 hover:underline">&larr; Back to Program</Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <AcademicCapIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Apply to {program.title}</h1>
        </div>
        {/* Program Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 mb-6 flex items-center gap-4">
          <UserCircleIcon className="w-8 h-8 text-blue-400" />
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Program Details:</h3>
            <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <div><span className="font-medium">Type:</span> {program.program_type}</div>
              <div><span className="font-medium">Location:</span> {program.location}</div>
              <div><span className="font-medium">Age Group:</span> {program.age_group}</div>
              <div><span className="font-medium">Cost:</span> {program.cost}</div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Child's Full Name *</label>
            <input
              type="text"
              name="childName"
              value={form.childName}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
              disabled={submitting}
            />
            {errors.childName && <div className="text-red-500 text-sm mt-1">{errors.childName}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Child's Age *</label>
            <input
              type="number"
              name="childAge"
              value={form.childAge}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
              disabled={submitting}
            />
            {errors.childAge && <div className="text-red-500 text-sm mt-1">{errors.childAge}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Interests *</label>
            <textarea
              name="interests"
              value={form.interests}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
              required
              disabled={submitting}
            />
            {errors.interests && <div className="text-red-500 text-sm mt-1">{errors.interests}</div>}
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow hover:scale-105 transition-transform text-lg mt-2"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 