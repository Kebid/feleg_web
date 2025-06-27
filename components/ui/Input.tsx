import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { FieldError } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | FieldError;
  icon?: React.ReactNode;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = 'text',
      icon,
      required = false,
      disabled = false,
      error,
      className = '',
      name,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    // Support controlled or uncontrolled
    const value = (rest.value ?? rest.defaultValue) as string | number | undefined;
    const hasValue = value !== undefined && value !== '' && value !== null;
    const errorMessage = typeof error === 'string' ? error : error?.message;

    const baseClasses = 'w-full px-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    const errorClasses = errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500';
    const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-gray-300';
    const classes = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

    const inputId = name || label || Math.random().toString(36).slice(2, 10);

    return (
      <div className="relative space-y-1">
        {label && (
          <motion.label
            htmlFor={inputId}
            className={`absolute left-4 text-sm font-medium transition-all duration-300 pointer-events-none ${
              isFocused || hasValue
                ? 'text-blue-600 -translate-y-6 scale-90'
                : 'text-gray-500 translate-y-2'
            }`}
            initial={false}
            animate={{
              y: isFocused || hasValue ? -24 : 8,
              scale: isFocused || hasValue ? 0.9 : 1,
              color: isFocused || hasValue ? '#2563EB' : '#6B7280',
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
            id={inputId}
            ref={ref}
            name={name}
            type={type}
            required={required}
            disabled={disabled}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? `${inputId}-error` : undefined}
            className={`${classes} ${icon ? 'pl-10' : ''}`}
            onFocus={e => {
              setIsFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              rest.onBlur?.(e);
            }}
            {...rest}
          />
        </div>

        {errorMessage && (
          <motion.p
            id={`${inputId}-error`}
            className="text-sm text-red-600 font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            {errorMessage}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 