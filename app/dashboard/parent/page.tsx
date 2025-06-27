"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AcademicCapIcon, BellIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import FindPrograms from "./components/FindPrograms";
import ApplicationTracker from "./components/ApplicationTracker";
import Notifications from "./components/Notifications";

const tabs = [
  { label: "Find Programs", value: "programs", icon: <AcademicCapIcon className="w-6 h-6" /> },
  { label: "My Applications", value: "applications", icon: <UserGroupIcon className="w-6 h-6" /> },
  { label: "Notifications", value: "notifications", icon: <BellIcon className="w-6 h-6" /> },
];

const metrics = [
  { label: "Active Applications", value: 3, icon: <UserGroupIcon className="w-7 h-7 text-blue-500" /> },
  { label: "Approved", value: 1, icon: <AcademicCapIcon className="w-7 h-7 text-green-500" /> },
  { label: "Pending", value: 2, icon: <BellIcon className="w-7 h-7 text-yellow-500" /> },
];

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("programs");
  const userName = "Parent User";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto p-4 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{userName}!</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover amazing enrichment programs for your child and track your applications in one place.
          </p>
        </motion.div>
      </div>

      {/* Metrics Row */}
      <div className="max-w-7xl mx-auto p-4 pb-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow hover:shadow-lg transition-all p-5"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-md">
                {metric.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2"
        >
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === tab.value
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon}
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mt-6"
        >
          <AnimatePresence mode="wait">
            {activeTab === "programs" && (
              <motion.div
                key="programs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
                className="p-6"
              >
                <FindPrograms />
              </motion.div>
            )}
            {activeTab === "applications" && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
                className="p-6"
              >
                <ApplicationTracker />
              </motion.div>
            )}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
                className="p-6"
              >
                <Notifications />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
} 