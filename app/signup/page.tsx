"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '@/components/ui/Input';
import { Tab } from '@headlessui/react';
import { Phone, Mail } from 'lucide-react';

const inputVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.08 } }),
};

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["parent", "provider"]),
});

type SignupForm = z.infer<typeof signupSchema>;

const ethiopianPhoneRegex = /^(\+251|0)?9\d{8}$/;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "parent",
    },
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [tab, setTab] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleSubmitForm = async (data: SignupForm) => {
    setLoading(true);
    
    try {
      // Step 1: Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError || !authData.user) {
        toast.error(signUpError?.message || "Signup failed");
        return;
      }

      // Step 2: Check if email confirmation is required
      if (authData.session) {
        // User is immediately signed in (no email confirmation required)
        console.log("User signed in immediately");
        
        // Step 3: Insert the profile with the authenticated user's ID
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          role: data.role,
        });

        if (profileError) {
          console.error("Profile insert error:", profileError);
          toast.error(`Failed to create profile: ${profileError.message}`);
          return;
        }

        // Step 4: Success! Show message and redirect
        toast.success("Account created successfully!");
        
        // Redirect based on role
        if (data.role === "parent") {
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

  // Phone signup handlers
  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setOtpError('');
    if (!ethiopianPhoneRegex.test(phone)) {
      setPhoneError('Enter a valid Ethiopian phone number');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: phone.startsWith('+') ? phone : '+251' + phone.replace(/^0/, '') });
      if (error) {
        setPhoneError(error.message);
      } else {
        setOtpSent(true);
        toast.success('OTP sent! Check your SMS.');
      }
    } catch (err) {
      setPhoneError('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone: phone.startsWith('+') ? phone : '+251' + phone.replace(/^0/, ''), token: otp, type: 'sms' });
      if (error) {
        setOtpError(error.message);
      } else {
        toast.success('Phone verified! Account created.');
        router.push('/dashboard/parent');
      }
    } catch (err) {
      setOtpError('Failed to verify OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm relative z-10 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl backdrop-blur-md p-4 md:p-8"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Create Your Account</h2>
          <Tab.Group selectedIndex={tab === 'phone' ? 0 : 1} onChange={i => setTab(i === 0 ? 'phone' : 'email')}>
            <Tab.List className="flex space-x-2 mb-6">
              <Tab className={({ selected }) => `flex-1 py-2 rounded-lg font-semibold transition focus:outline-none ${selected ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
                <Phone className="inline w-5 h-5 mr-1" /> Phone
              </Tab>
              <Tab className={({ selected }) => `flex-1 py-2 rounded-lg font-semibold transition focus:outline-none ${selected ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
                <Mail className="inline w-5 h-5 mr-1" /> Email
              </Tab>
            </Tab.List>
            <Tab.Panels>
              {/* Phone Signup Panel */}
              <Tab.Panel>
                {!otpSent ? (
                  <form onSubmit={handlePhoneSignup} className="space-y-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#111827] mb-1">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="09xxxxxxxx or +2519xxxxxxxx"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                        required
                        disabled={loading}
                      />
                      {phoneError && <div className="text-red-500 text-sm mt-1">{phoneError}</div>}
                    </div>
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
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </motion.button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                      <label htmlFor="otp" className="block text-sm font-medium text-[#111827] mb-1">Enter OTP</label>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        placeholder="Enter the code you received"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                        required
                        disabled={loading}
                      />
                      {otpError && <div className="text-red-500 text-sm mt-1">{otpError}</div>}
                    </div>
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
                      {loading ? 'Verifying...' : 'Verify & Create Account'}
                    </motion.button>
                  </form>
                )}
              </Tab.Panel>
              {/* Email Signup Panel */}
              <Tab.Panel>
                <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
                  <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
                    <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      placeholder="Your Name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      required
                      disabled={loading}
                    />
                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name.message}</div>}
                  </motion.div>
                  <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
                    <Input
                      label="Email Address"
                      type="email"
                      {...register("email")}
                      required
                      disabled={loading}
                      icon="📧"
                    />
                    {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>}
                  </motion.div>
                  <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
                    <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="••••••••"
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
                    {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>}
                  </motion.div>
                  <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
                    <label htmlFor="role" className="block text-sm font-medium text-[#111827] mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      {...register("role")}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      disabled={loading}
                    >
                      <option value="parent">Parent</option>
                      <option value="provider">Provider</option>
                    </select>
                    {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role.message}</div>}
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
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 