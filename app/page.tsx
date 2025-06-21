"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // router.replace("/login");
  }, [router]);

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const onScroll = () => {
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("opacity-100", "translate-y-0");
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-[#F9FAFB] min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <section className="bg-[#F9FAFB] py-12 flex justify-center">
        <div className="w-full max-w-6xl rounded-3xl bg-[#F9FAFB] p-6 md:p-12 flex flex-col md:flex-row items-center shadow-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 flex flex-col items-start justify-center space-y-6 md:pr-8"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] leading-tight">
              Feleg: Unlock your child's full potential
            </h1>
            <p className="text-lg md:text-xl text-[#111827]">
              Browse and apply to programs tailored to your child's age and interest
            </p>
            <div className="flex gap-4 mt-4">
              <motion.a
                href="/dashboard/parent"
                whileHover={{ scale: 1.05, boxShadow: "0 4px 24px 0 #3B82F655" }}
                className="inline-block bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              >
                Browse Programs
              </motion.a>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                className="inline-block border border-[#3B82F6] text-[#3B82F6] bg-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
              >
                Register as Provider
              </motion.a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="flex-1 flex justify-center items-center mt-10 md:mt-0"
          >
            <img
              src="/illustration.svg"
              alt="Learning illustration"
              className="max-w-full h-auto md:max-w-md lg:max-w-lg drop-shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Benefits Section */}
      <section className="py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center reveal opacity-0 translate-y-8 transition-all duration-700">
          <div className="mb-4 text-[#3B82F6] text-3xl">📈</div>
          <h3 className="font-bold text-lg text-[#111827] mb-2">Easy Application Tracking</h3>
          <p className="text-gray-600">Monitor your child's applications in one place.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center reveal opacity-0 translate-y-8 transition-all duration-700">
          <div className="mb-4 text-[#F59E0B] text-3xl">✅</div>
          <h3 className="font-bold text-lg text-[#111827] mb-2">Verified Providers</h3>
          <p className="text-gray-600">All programs are vetted for quality and safety.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center reveal opacity-0 translate-y-8 transition-all duration-700">
          <div className="mb-4 text-[#3B82F6] text-3xl">🌐</div>
          <h3 className="font-bold text-lg text-[#111827] mb-2">Online & In-Person Options</h3>
          <p className="text-gray-600">Choose what works best for your family's schedule.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center reveal opacity-0 translate-y-8 transition-all duration-700">
          <div className="mb-4 text-[#F59E0B] text-3xl">🎯</div>
          <h3 className="font-bold text-lg text-[#111827] mb-2">Age-Appropriate Filters</h3>
          <p className="text-gray-600">Find programs tailored to your child's age and interests.</p>
        </div>
      </section>

      {/* Testimonials Section (optional) */}
      <section className="py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-[#111827] mb-8 reveal opacity-0 translate-y-8 transition-all duration-700">What Parents Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 reveal opacity-0 translate-y-8 transition-all duration-700">
            <p className="text-gray-700 italic mb-4">"This platform made it so easy to find the perfect summer camp for my daughter!"</p>
            <div className="font-semibold text-[#3B82F6]">— Sarah K.</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 reveal opacity-0 translate-y-8 transition-all duration-700">
            <p className="text-gray-700 italic mb-4">"I love the verified provider feature. I feel confident in my choices."</p>
            <div className="font-semibold text-[#F59E0B]">— James L.</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 reveal opacity-0 translate-y-8 transition-all duration-700">
            <p className="text-gray-700 italic mb-4">"The online options were a lifesaver during the school break!"</p>
            <div className="font-semibold text-[#3B82F6]">— Priya S.</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-[#111827] font-bold text-lg mb-4 md:mb-0">Enrichment Finder</div>
          <nav className="flex gap-6 text-[#3B82F6] text-sm">
            <Link href="#"><span className="hover:underline">About</span></Link>
            <Link href="#"><span className="hover:underline">Contact</span></Link>
            <Link href="#"><span className="hover:underline">FAQ</span></Link>
            <Link href="#"><span className="hover:underline">Terms</span></Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
