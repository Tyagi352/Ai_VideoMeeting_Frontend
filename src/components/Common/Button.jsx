// Button.jsx - Reusable Button Component
import React from 'react';

export default function Button({
  children,
  variant = 'primary', // primary, secondary, ghost, danger
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) {
  const baseClasses = 'font-medium rounded-md transition duration-300 ease-in-out flex items-center justify-center gap-2';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  };

  const disabledClasses = disabled || loading ? 'opacity-60 cursor-not-allowed' : '';
  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${widthClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
}

// Spinner.jsx
function Spinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-transparent border-t-current rounded-full animate-spin`} />
  );
}
