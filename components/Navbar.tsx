"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { HiOutlineUser } from "react-icons/hi2";
import { FaRocket } from "react-icons/fa6";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getUserAndProfile = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setUser(null);
          setProfile(null);
        } else {
          setUser(session?.user || null);
          if (session?.user) {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
            if (!profileError && profileData) {
              setProfile(profileData);
            }
          }
        }
      } catch (error) {
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);
    getUserAndProfile().finally(() => {
      clearTimeout(timeoutId);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (!error && profileData) {
            setProfile(profileData);
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out: " + error.message);
      } else {
        setUser(null);
        setProfile(null);
        toast.success("Signed out successfully");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Error signing out");
    } finally {
      setSigningOut(false);
    }
  };

  // Responsive menu links
  const navLinks = user ? [
    { href: "/programs", label: "Programs" },
    { href: "/dashboard/parent", label: "Dashboard" },
  ] : [];

  // Mobile menu animation
  const menuVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <nav className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/40 dark:border-gray-700/40 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight cursor-pointer">
                Feleg
              </span>
            </Link>
            <span className="block md:hidden"><ThemeToggle /></span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <LocaleSwitcher />
            {loading && !["/login","/signup","/forgot-password","/reset-password"].some(p => pathname.startsWith(p)) ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* User Avatar */}
                <motion.div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2" whileHover={{ scale: 1.02 }}>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {profile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {profile?.name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {profile?.role || 'User'}
                    </p>
                  </div>
                </motion.div>
                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  loading={signingOut}
                  className="hidden sm:flex"
                >
                  {signingOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-blue-600 text-blue-600 font-semibold shadow hover:bg-blue-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-400 transition-all text-base backdrop-blur-md"
                  >
                    <HiOutlineUser className="text-lg" /> Sign in
                  </button>
                </Link>
                <Link href="/signup">
                  <button
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-800 focus:ring-2 focus:ring-blue-400 transition-all text-base animate-pulse border-none"
                  >
                    <FaRocket className="text-lg" /> Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger for Mobile */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="exit"
            variants={menuVariants}
            className="fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white dark:bg-gray-900 shadow-2xl z-[100] flex flex-col p-6 gap-6"
            style={{ boxShadow: "-8px 0 32px 0 rgba(0,0,0,0.15)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Feleg</span>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-lg font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <ThemeToggle />
              <LocaleSwitcher />
              {user ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  loading={signingOut}
                  className="w-full"
                >
                  {signingOut ? "Signing out..." : "Sign out"}
                </Button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <button
                      className="flex items-center gap-2 w-full px-5 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-blue-600 text-blue-600 font-semibold shadow hover:bg-blue-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-400 transition-all text-base backdrop-blur-md mb-2"
                    >
                      <HiOutlineUser className="text-lg" /> Sign in
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)}>
                    <button
                      className="flex items-center gap-2 w-full px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-800 focus:ring-2 focus:ring-blue-400 transition-all text-base animate-pulse border-none"
                    >
                      <FaRocket className="text-lg" /> Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 