import FindPrograms from "./components/FindPrograms";
import ApplicationTracker from "./components/ApplicationTracker";
import { motion } from "framer-motion";

export default function ParentDashboard() {
  // In a real app, fetch user info from context or Supabase
  const userName = "Parent User";

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl mx-auto mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-2">
          Welcome{userName ? `, ${userName}` : ""}!
        </h1>
        <p className="text-blue-700 text-base md:text-lg mb-4">
          This is your Parent Dashboard. Browse recommended programs and track your applications below.
        </p>
      </motion.div>

      {/* Recommended Programs Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.12 }
          }
        }}
        className="max-w-5xl mx-auto mb-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl font-bold mb-6 text-blue-700"
        >
          Recommended Programs
        </motion.h2>
        <FindPrograms />
      </motion.section>

      {/* My Applications Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl font-bold mb-6 text-blue-700"
        >
          My Applications
        </motion.h2>
        <ApplicationTracker />
      </motion.section>
    </div>
  );
} 