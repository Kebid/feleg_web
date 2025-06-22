"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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

const featuredPrograms = [
  {
    id: "1",
    title: "🧠 STEM Robotics Workshop",
    description: "Learn coding and robotics through hands-on projects",
    type: "STEM",
    location: "San Francisco, CA",
    cost: "$150",
    featured: true,
  },
  {
    id: "2", 
    title: "🎨 Creative Arts & Design",
    description: "Express yourself through painting, drawing, and digital art",
    type: "Arts",
    location: "New York, NY",
    cost: "$120",
    featured: false,
  },
  {
    id: "3",
    title: "⚽ Youth Soccer Academy",
    description: "Develop skills, teamwork, and sportsmanship",
    type: "Sports",
    location: "Austin, TX",
    cost: "$200",
    featured: false,
  },
];

export default function HomePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
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
                  className="px-8 py-4 bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 dark:text-blue-300 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-lg"
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
      <section className="py-20 bg-white dark:bg-gray-900">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
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
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {program.type}
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
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-300 dark:bg-blue-700 dark:hover:bg-blue-800"
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
        </div>
      </section>

      {/* How Feleg Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Feleg Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple steps to find and enroll in the perfect program
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Discover</h3>
              <p className="text-gray-600 dark:text-gray-300">Browse programs by category, location, or age group</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Apply</h3>
              <p className="text-gray-600 dark:text-gray-300">Submit applications with just a few clicks</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enroll</h3>
              <p className="text-gray-600 dark:text-gray-300">Get accepted and start your child's journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of parents who trust Feleg to find the perfect enrichment programs for their children.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Create Your Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
