"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff",
          fontSize: "14px",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: "#10B981",
            secondary: "#fff",
          },
          style: {
            background: "#10B981",
            color: "#fff",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#EF4444",
            secondary: "#fff",
          },
          style: {
            background: "#EF4444",
            color: "#fff",
          },
        },
        loading: {
          style: {
            background: "#3B82F6",
            color: "#fff",
          },
        },
      }}
    />
  );
} 