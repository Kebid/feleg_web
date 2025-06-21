import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
} 