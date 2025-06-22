"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MyPrograms from "./components/MyPrograms";
import PostProgram from "./components/PostProgram";
import Applications from "./components/Applications";
import EditProfile from "./components/EditProfile";

const tabs = [
  { label: "My Programs", value: "programs" },
  { label: "Post New Program", value: "post" },
  { label: "Applications", value: "applications" },
  { label: "Edit Profile", value: "profile" },
];

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("programs");
  const userName = "Provider User";

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#166534] mb-2">
          Welcome, {userName}!
        </h1>
        <p className="text-green-700 text-base md:text-lg mb-4">
          Manage your programs, post new ones, and view parent applications.
        </p>
      </div>
      {/* Tabs */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex gap-2 border-b border-green-200">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 font-semibold rounded-t-lg focus:outline-none transition-all duration-150
                ${activeTab === tab.value
                  ? "bg-white border-x border-t border-green-300 text-green-800 -mb-px shadow"
                  : "bg-green-50 text-green-600 hover:bg-white"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-b-2xl shadow p-4 min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === "programs" && (
              <motion.div
                key="programs"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.4 }}
              >
                <MyPrograms />
              </motion.div>
            )}
            {activeTab === "post" && (
              <motion.div
                key="post"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.4 }}
              >
                <PostProgram />
              </motion.div>
            )}
            {activeTab === "applications" && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.4 }}
              >
                <Applications />
              </motion.div>
            )}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.4 }}
              >
                <EditProfile />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 