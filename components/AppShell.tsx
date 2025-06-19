"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/login") || pathname.startsWith("/signup");
  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
} 