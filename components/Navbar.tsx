"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";

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
        }
      } else {
        setProfile(null);
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
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/">
          <span className="font-bold text-xl text-blue-700 tracking-tight cursor-pointer">Feleg</span>
        </Link>
        {(pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) && (
          <Link href="/" className="text-gray-700 hover:text-blue-700 text-sm">
            ← Back to Home
          </Link>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
        ) : user ? (
          <>
            {profile?.role === "parent" && (
              <Link 
                href="/dashboard/parent" 
                className={`hover:text-blue-700 ${pathname.startsWith("/dashboard/parent") ? "text-blue-700 font-semibold" : "text-gray-700"}`}
              >
                Parent Dashboard
              </Link>
            )}
            {profile?.role === "provider" && (
              <Link 
                href="/dashboard/provider" 
                className={`hover:text-blue-700 ${pathname.startsWith("/dashboard/provider") ? "text-blue-700 font-semibold" : "text-gray-700"}`}
              >
                Provider Dashboard
              </Link>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {user.email?.split('@')[0] || 'User'}
              </span>
              <button
                onClick={handleLogout}
                disabled={signingOut}
                className={`text-gray-700 hover:text-red-600 transition-colors ${signingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </>
        ) : (
          <>
            {!pathname.startsWith("/login") && (
              <Link href="/login" className="text-gray-700 hover:text-blue-700">
                Login
              </Link>
            )}
            {!pathname.startsWith("/signup") && (
              <Link href="/signup" className="text-gray-700 hover:text-blue-700">
                Sign Up
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
} 