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

      {/* Events Section */}
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
              Upcoming STEM Events
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join exciting STEM workshops and events designed to inspire young minds
            </p>
          </motion.div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-modern h-full">
              {[
                {
                  title: "Robotics Workshop",
                  date: "Dec 15, 2024",
                  time: "10:00 AM",
                  location: "Addis Ababa Science Center",
                  image: "🤖",
                  category: "Robotics"
                },
                {
                  title: "Coding for Kids",
                  date: "Dec 18, 2024",
                  time: "2:00 PM",
                  location: "Tech Hub Ethiopia",
                  image: "💻",
                  category: "Programming"
                },
                {
                  title: "Science Fair",
                  date: "Dec 22, 2024",
                  time: "9:00 AM",
                  location: "National Museum",
                  image: "🔬",
                  category: "Science"
                },
                {
                  title: "Math Olympiad",
                  date: "Dec 25, 2024",
                  time: "11:00 AM",
                  location: "University of Addis Ababa",
                  image: "📐",
                  category: "Mathematics"
                },
                {
                  title: "AI for Teens",
                  date: "Dec 28, 2024",
                  time: "3:00 PM",
                  location: "Innovation Center",
                  image: "🤖",
                  category: "Artificial Intelligence"
                }
              ].map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-80"
                >
                  <Card hover className="h-full bg-white/80 dark:bg-gray-900/80 border border-gray-100/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-md p-6">
                    <div className="text-4xl mb-4">{event.image}</div>
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100/80 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200 backdrop-blur-sm">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">⏰</span>
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        {event.location}
                      </div>
                    </div>
                    <motion.button
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Register Now
                    </motion.button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What People Think Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What People Think
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from parents and educators who have transformed their children's learning journey
            </p>
          </motion.div>

          <div className="relative h-80">
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-modern h-full">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Parent",
                  avatar: "👩‍👧",
                  quote: "Feleg helped me find the perfect coding class for my daughter. She's now building her own apps!",
                  rating: 5
                },
                {
                  name: "Dr. Michael Chen",
                  role: "Educator",
                  avatar: "👨‍🏫",
                  quote: "As an educator, I love how Feleg connects students with quality enrichment programs.",
                  rating: 5
                },
                {
                  name: "Amina Hassan",
                  role: "Parent",
                  avatar: "👩‍👦",
                  quote: "The variety of programs available is incredible. My son discovered his passion for robotics!",
                  rating: 5
                },
                {
                  name: "Prof. David Kim",
                  role: "Program Director",
                  avatar: "👨‍💼",
                  quote: "Feleg has revolutionized how we reach families interested in STEM education.",
                  rating: 5
                },
                {
                  name: "Maria Rodriguez",
                  role: "Parent",
                  avatar: "👩‍👧‍👦",
                  quote: "Finding quality programs was always a challenge. Feleg made it so easy and reliable!",
                  rating: 5
                },
                {
                  name: "Dr. James Wilson",
                  role: "STEM Coordinator",
                  avatar: "👨‍🔬",
                  quote: "The platform's commitment to quality education is evident in every program listed.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-80"
                >
                  <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 shadow-2xl backdrop-blur-md border border-white/20 dark:border-gray-700/20 h-full">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 italic text-sm">"{testimonial.quote}"</p>
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About Feleg
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                We're on a mission to democratize access to quality enrichment programs for children across Ethiopia.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://feleg.com/products', '_blank')}
              >
                Explore Our Products
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-md border border-white/20 dark:border-gray-700/20">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  To connect every child with the perfect enrichment program that nurtures their unique talents and passions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
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
              Trusted by Leading Organizations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Partnering with top educational institutions and organizations
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "Addis Ababa University", logo: "🏛️" },
              { name: "Ethiopian Science Academy", logo: "🔬" },
              { name: "Tech Hub Ethiopia", logo: "💻" },
              { name: "National Museum", logo: "🏛️" },
              { name: "Innovation Center", logo: "🚀" },
              { name: "STEM Ethiopia", logo: "⚡" }
            ].map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="w-20 h-20 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 dark:border-gray-700/20 flex items-center justify-center text-3xl mb-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {partner.logo}
                </motion.div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
                  {partner.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl p-12 backdrop-blur-md border border-white/20 dark:border-gray-700/20 text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest updates on new programs, events, and educational opportunities delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Experience Feleg on Mobile
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Download our mobile app for a seamless experience on the go. Find programs, track applications, and stay connected with your child's learning journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl mr-2">🍎</span>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </motion.button>
                <motion.button
                  className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl mr-2">🤖</span>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-md border border-white/20 dark:border-gray-700/20">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mobile App Features</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Browse programs on the go
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Track application status
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Receive notifications
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Bookmark favorite programs
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
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
