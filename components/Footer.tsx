import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t py-4 text-center text-gray-500 text-sm w-full">
      &copy; {new Date().getFullYear()} Feleg. All rights reserved.
    </footer>
  );
} 