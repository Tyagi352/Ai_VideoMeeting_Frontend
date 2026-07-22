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
    default: 'bg-white/10 text-zinc-300 border border-white/10',
    success: 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20',
    warning: 'bg-amber-400/10 text-amber-300 border border-amber-400/20',
    error: 'bg-red-400/10 text-red-300 border border-red-400/20',
    recording: 'bg-red-400/10 text-red-300 border border-red-400/20 animate-pulse',
  };

  return (
    <span
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full font-medium inline-block ${className}`}
    >
      {children}
    </span>
  );
}
