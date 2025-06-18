import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12 py-4 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Feleg. All rights reserved.
    </footer>
  );
} 