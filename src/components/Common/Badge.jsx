// Badge.jsx - Badge Component
import React from 'react';

export default function Badge({
  children,
  variant = 'default', // default, success, warning, error, recording
  size = 'md', // sm, md
  className = '',
}) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    recording: 'bg-red-100 text-red-800 animate-pulse',
  };

  return (
    <span
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full font-medium inline-block ${className}`}
    >
      {children}
    </span>
  );
}
