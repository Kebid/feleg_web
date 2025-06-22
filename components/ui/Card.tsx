import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
  variant = 'default',
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variants = {
    default: 'bg-white border border-gray-100 shadow-sm',
    elevated: 'bg-white border border-gray-100 shadow-lg',
    outlined: 'bg-white border-2 border-gray-200 shadow-sm',
  };

  const baseClasses = `rounded-xl transition-all duration-300 ${variants[variant]} ${paddingClasses[padding]} ${className}`;
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.02] hover:border-gray-200 cursor-pointer' : '';

  const Component = onClick || hover ? motion.div : 'div';
  const motionProps = onClick || hover ? {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${hoverClasses}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
} 