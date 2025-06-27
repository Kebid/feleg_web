"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { supabase } from "@/utils/supabaseClient";
import HowFelegWorks from "@/components/HowFelegWorks";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function HomePage() {
  const router = useRouter();
  const [featuredPrograms, setFeaturedPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      setError("");
      // Try to fetch up to 3 featured programs, fallback to latest 3 if none are marked featured
      let { data, error } = await supabase
        .from("programs")
        .select("id, title, description, program_type, location, cost, featured")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) {
        setError("Failed to load featured programs");
        setLoading(false);
        return;
      }
      if (!data || data.length === 0) {
        // fallback: get latest 3
        const { data: fallback, error: fallbackError } = await supabase
          .from("programs")
          .select("id, title, description, program_type, location, cost, featured")
          .order("created_at", { ascending: false })
          .limit(3);
        if (fallbackError) {
          setError("Failed to load programs");
          setLoading(false);
          return;
        }
        setFeaturedPrograms(fallback || []);
      } else {
        setFeaturedPrograms(data);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            >
              Discover Amazing
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Programs
              </span>
              <br />
              for Your Child
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with the best enrichment programs in your area. From STEM to arts, 
              sports to music — find the perfect program to nurture your child's passions.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/programs">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🚀 Explore Programs
                </motion.button>
              </Link>
              
              <Link href="/signup">
                <motion.button
                  className="px-8 py-4 bg-white/90 dark:bg-gray-900/90 border-2 border-blue-600 text-blue-600 dark:text-blue-300 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✨ Join Feleg
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Programs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover some of our most popular enrichment programs
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-gray-500">Loading featured programs...</div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : featuredPrograms.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No featured programs available yet.</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full bg-white/80 dark:bg-gray-900/80 border border-gray-100/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-md">
                  <div className="relative">
                    {program.featured && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ✨ Featured
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {program.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {program.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100/80 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 backdrop-blur-sm">
                          {program.program_type}
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {program.cost}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="mr-2">📍</span>
                      {program.location}
                    </div>
                    <Link href={`/programs/${program.id}`}>
                      <motion.button
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Learn More
                      </motion.button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* How Feleg Works Section */}
      <section className="relative">
        <HowFelegWorks />
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 dark:bg-gray-900/10 rounded-3xl p-12 backdrop-blur-md border border-white/20 dark:border-gray-700/20"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of parents who trust Feleg to find the perfect enrichment programs for their children.
            </p>
            <Link href="/signup">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your Account
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
