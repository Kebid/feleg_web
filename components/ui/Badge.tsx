import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'orange' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  animated = false,
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold tracking-tight rounded-full transition-all duration-300';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    error: 'bg-red-100 text-red-800 hover:bg-red-200',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (animated) {
    return (
      <motion.span
        className={classes}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={classes}>
      {children}
    </span>
  );
} 