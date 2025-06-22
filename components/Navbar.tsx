"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const getUserAndProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          
          if (!error && profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserAndProfile();

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
          console.error("Error fetching profile:", error);
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
        console.error("Sign out error:", error);
        toast.error("Error signing out: " + error.message);
      } else {
        setUser(null);
        setProfile(null);
        toast.success("Signed out successfully");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Unexpected sign out error:", error);
      toast.error("Error signing out");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/">
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight cursor-pointer">
                Feleg
              </span>
            </Link>
            {(pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) && (
              <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
                ← Back to Home
              </Link>
            )}
          </motion.div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link href="/programs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Programs
                </Link>
                <Link href="/dashboard/parent" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* User Avatar */}
                <motion.div 
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {profile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">
                      {profile?.name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
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
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 