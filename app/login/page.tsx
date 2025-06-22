"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const inputVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.08 } }),
};

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("parent");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Login user
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (loginError || !data.user) {
        toast.error(loginError?.message || "Login failed");
        return;
      }
      
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Profile fetch error:", profileError);
        toast.error("Failed to load profile");
        return;
      }
      
      if (!profile) {
        // Profile doesn't exist, create one
        console.log("Creating profile for user:", data.user.id);
        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          name: data.user.email?.split('@')[0] || 'New User',
          email: data.user.email || '',
          role: role, // Use the role selected in the form
        });
        
        if (insertError) {
          console.error("Profile creation error:", insertError);
          toast.error("Failed to create profile");
          return;
        }
        
        // Redirect based on selected role
        toast.success("Welcome! Your profile has been created.");
        if (role === "parent") {
          router.push("/dashboard/parent");
        } else {
          router.push("/dashboard/provider");
        }
      } else {
        // Profile exists, redirect based on stored role
        toast.success("Welcome back!");
        if (profile.role === "parent") {
          router.push("/dashboard/parent");
        } else if (profile.role === "provider") {
          router.push("/dashboard/provider");
        } else {
          toast.error("Unknown role");
        }
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/">
                <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight cursor-pointer">
                  Feleg
                </span>
              </Link>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 mt-6 mb-2"
            >
              Welcome back! 👋
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Sign in to your account to continue
            </motion.p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  icon="📧"
                />
              </motion.div>

              <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  icon="🔒"
                />
              </motion.div>

              <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Show password</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Forgot password?
                  </Link>
                </div>
              </motion.div>

              <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("parent")}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        role === "parent"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-lg mb-1">👨‍👩‍👧‍👦</div>
                      <div className="text-sm font-medium">Parent</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("provider")}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        role === "provider"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-lg mb-1">🏢</div>
                      <div className="text-sm font-medium">Provider</div>
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div custom={4} variants={inputVariants} initial="hidden" animate="visible">
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="lg"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 