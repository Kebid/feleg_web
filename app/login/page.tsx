"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tab } from '@headlessui/react';
import { Phone, Mail } from 'lucide-react';

const inputVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.08 } }),
};

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["parent", "provider"]),
});

type LoginForm = z.infer<typeof loginSchema>;

const ethiopianPhoneRegex = /^(\+251|0)?9\d{8}$/;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("parent");
  const router = useRouter();
  const [tab, setTab] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "parent",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (loginError || !loginData.user) {
        toast.error(loginError?.message || "Login failed");
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", loginData.user.id)
        .maybeSingle();
      if (profileError) {
        toast.error("Failed to load profile");
        return;
      }
      if (!profile) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: loginData.user.id,
          name: loginData.user.email?.split('@')[0] || 'New User',
          email: loginData.user.email || '',
          role: data.role,
        });
        if (insertError) {
          toast.error("Failed to create profile");
          return;
        }
        toast.success("Welcome! Your profile has been created.");
        if (data.role === "parent") {
          router.push("/dashboard/parent");
        } else {
          router.push("/dashboard/provider");
        }
      } else {
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
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Phone login handlers
  const handlePhoneLogin = async (e: React.FormEvent) => {
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
        toast.success('Phone verified! Logged in.');
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl backdrop-blur-md p-0 md:p-0"
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
              className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-2"
            >
              Welcome back! 👋
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300"
            >
              Sign in to your account to continue
            </motion.p>
          </div>

          {/* Tabs for Phone/Email Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
          >
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
                {/* Phone Login Panel */}
                <Tab.Panel>
                  {!otpSent ? (
                    <form onSubmit={handlePhoneLogin} className="space-y-6">
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
                        {loading ? 'Verifying...' : 'Verify & Login'}
                      </motion.button>
                    </form>
                  )}
                </Tab.Panel>
                {/* Email Login Panel */}
                <Tab.Panel>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
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

                    <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
                      <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        required
                        disabled={loading}
                        icon="🔒"
                      />
                      {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>}
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
                            className={`py-2 rounded-lg font-semibold border transition-colors ${watch("role") === "parent" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                            onClick={() => setValue("role", "parent")}
                            disabled={loading}
                          >
                            Parent
                          </button>
                          <button
                            type="button"
                            className={`py-2 rounded-lg font-semibold border transition-colors ${watch("role") === "provider" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                            onClick={() => setValue("role", "provider")}
                            disabled={loading}
                          >
                            Provider
                          </button>
                        </div>
                        {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role.message}</div>}
                      </div>
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
                          Signing in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </motion.button>
                  </form>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 