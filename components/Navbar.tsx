"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-blue-700 tracking-tight">Feleg</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/parent" className={`hover:text-blue-700 ${pathname.startsWith("/dashboard/parent") ? "text-blue-700 font-semibold" : "text-gray-700"}`}>Parent</Link>
        <Link href="/dashboard/provider" className={`hover:text-blue-700 ${pathname.startsWith("/dashboard/provider") ? "text-blue-700 font-semibold" : "text-gray-700"}`}>Provider</Link>
        <Link href="/login" className="text-gray-700 hover:text-blue-700">Login</Link>
        <Link href="/signup" className="text-gray-700 hover:text-blue-700">Sign Up</Link>
        {/* Placeholder for user info or avatar */}
      </div>
    </nav>
  );
} 