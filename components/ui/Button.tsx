import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  variant = 'primary',
  onClick,
  type = 'button',
  children,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[#3B82F6] text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-[#F59E0B] text-white hover:bg-yellow-600 focus:ring-yellow-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
} 