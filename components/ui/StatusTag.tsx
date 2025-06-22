import React from 'react';
import { motion } from 'framer-motion';

interface StatusTagProps {
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Active' | 'Inactive';
  className?: string;
  animated?: boolean;
}

export default function StatusTag({ status, className = '', animated = false }: StatusTagProps) {
  const statusConfig = {
    Pending: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⏳',
      label: 'Pending'
    },
    Accepted: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '✅',
      label: 'Accepted'
    },
    Rejected: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '❌',
      label: 'Rejected'
    },
    Active: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🟢',
      label: 'Active'
    },
    Inactive: {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: '⚪',
      label: 'Inactive'
    }
  };

  const config = statusConfig[status];
  const baseClasses = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold tracking-tight border transition-all duration-300';
  const classes = `${baseClasses} ${config.color} ${className}`;

  if (animated) {
    return (
      <motion.span
        className={classes}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-base">{config.icon}</span>
        {config.label}
      </motion.span>
    );
  }

  return (
    <span className={classes}>
      <span className="text-base">{config.icon}</span>
      {config.label}
    </span>
  );
} 