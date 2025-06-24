import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { FieldError } from 'react-hook-form';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | FieldError;
  className?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  error,
  className = '',
  icon,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  const errorMessage = typeof error === 'string' ? error : error?.message;

  const baseClasses = 'w-full px-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const errorClasses = errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500';
  const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-gray-300';
  
  const classes = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  return (
    <div className="relative space-y-1">
      {label && (
        <motion.label 
          className={`absolute left-4 text-sm font-medium transition-all duration-300 pointer-events-none ${
            isFocused || hasValue 
              ? 'text-blue-600 -translate-y-6 scale-90' 
              : 'text-gray-500 translate-y-2'
          }`}
          initial={false}
          animate={{
            y: isFocused || hasValue ? -24 : 8,
            scale: isFocused || hasValue ? 0.9 : 1,
            color: isFocused || hasValue ? '#2563EB' : '#6B7280'
          }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={!label ? placeholder : ''}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          disabled={disabled}
          className={`${classes} ${icon ? 'pl-10' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      
      {errorMessage && (
        <motion.p 
          className="text-sm text-red-600 font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {errorMessage}
        </motion.p>
      )}
    </div>
  );
} 