import React from 'react';

interface BadgeProps {
  text: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  className?: string;
}

export default function Badge({
  text,
  color = 'blue',
  className = '',
}: BadgeProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const classes = `${baseClasses} ${colorClasses[color]} ${className}`;

  return (
    <span className={classes}>
      {text}
    </span>
  );
} 