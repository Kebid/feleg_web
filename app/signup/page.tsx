"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const inputVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.08 } }),
};

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "parent",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Step 1: Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError || !data.user) {
        toast.error(signUpError?.message || "Signup failed");
        return;
      }

      // Step 2: Check if email confirmation is required
      if (data.session) {
        // User is immediately signed in (no email confirmation required)
        console.log("User signed in immediately");
        
        // Step 3: Insert the profile with the authenticated user's ID
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          name: form.name,
          email: form.email,
          role: form.role,
        });

        if (profileError) {
          console.error("Profile insert error:", profileError);
          toast.error(`Failed to create profile: ${profileError.message}`);
          return;
        }

        // Step 4: Success! Show message and redirect
        toast.success("Account created successfully!");
        
        // Redirect based on role
        if (form.role === "parent") {
          router.push("/dashboard/parent");
        } else {
          router.push("/dashboard/provider");
        }
      } else {
        // Email confirmation is required
        console.log("Email confirmation required");
        
        // For email confirmation, we need to handle profile creation differently
        // The profile will be created when the user confirms their email and logs in
        toast.success("Account created! Please check your email to verify your account before logging in.");
        
        // Redirect to login page
        router.push("/login");
      }

    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-4 md:p-8"
        >
          <h2 className="text-2xl font-bold text-center text-[#111827] mb-6">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                required
                disabled={loading}
              />
            </motion.div>
            <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                required
                disabled={loading}
              />
            </motion.div>
            <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 text-sm"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </motion.div>
            <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="role" className="block text-sm font-medium text-[#111827] mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                disabled={loading}
              >
                <option value="parent">Parent</option>
                <option value="provider">Provider</option>
              </select>
            </motion.div>
            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.03 }}
              className={`w-full py-2 rounded-lg font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2 mt-2 ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#3B82F6] text-white hover:bg-blue-700 focus:ring-blue-300"
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>
          <div className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#3B82F6] hover:underline font-medium">Login</Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 