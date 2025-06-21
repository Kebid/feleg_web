"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";

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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Apply to {program.title}</h1>
        
        {/* Program Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Program Details:</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-medium">Type:</span> {program.program_type}</div>
            <div><span className="font-medium">Location:</span> {program.location}</div>
            <div><span className="font-medium">Age Group:</span> {program.age_group}</div>
            <div><span className="font-medium">Cost:</span> {program.cost}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Child's Full Name *</label>
            <input
              type="text"
              name="childName"
              value={form.childName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={submitting}
            />
            {errors.childName && <div className="text-red-500 text-sm mt-1">{errors.childName}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Child's Age *</label>
            <input
              type="number"
              name="childAge"
              value={form.childAge}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min={1}
              max={18}
              disabled={submitting}
            />
            {errors.childAge && <div className="text-red-500 text-sm mt-1">{errors.childAge}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Interests *</label>
            <textarea
              name="interests"
              value={form.interests}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
              disabled={submitting}
              placeholder="Tell us about your child's interests, hobbies, and what they hope to learn..."
            />
            {errors.interests && <div className="text-red-500 text-sm mt-1">{errors.interests}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Document Upload (optional)</label>
            <input
              type="file"
              name="document"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              accept=".pdf,.jpg,.png,.doc,.docx"
              disabled={submitting}
            />
            {form.document && (
              <div className="text-sm text-gray-600 mt-1 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Selected: {form.document.name}
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
              submitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
            disabled={submitting || !user}
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 