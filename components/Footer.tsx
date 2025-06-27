import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/20 py-6 text-center text-gray-600 dark:text-gray-300 text-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        &copy; {new Date().getFullYear()} Feleg. All rights reserved.
      </div>
    </footer>
  );
} 