"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MyPrograms from "./components/MyPrograms";
import PostProgram from "./components/PostProgram";
import Applications from "./components/Applications";
import EditProviderProfile from "./components/EditProviderProfile";

const tabs = [
  { label: "My Programs", value: "programs", icon: "📚" },
  { label: "Post New Program", value: "post", icon: "✨" },
  { label: "Applications", value: "applications", icon: "📝" },
  { label: "Edit Profile", value: "profile", icon: "👤" },
];

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("programs");
  const userName = "Provider User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{userName}!</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Manage your programs, track applications, and connect with families looking for quality enrichment opportunities.
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-2"
        >
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === tab.value
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {activeTab === "programs" && (
              <motion.div
                key="programs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <MyPrograms />
              </motion.div>
            )}
            {activeTab === "post" && (
              <motion.div
                key="post"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <PostProgram />
              </motion.div>
            )}
            {activeTab === "applications" && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <Applications />
              </motion.div>
            )}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <EditProviderProfile />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
} 