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
  const baseClasses = 'font-medium rounded-[16px] transition duration-200 ease-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:ring-offset-2 focus:ring-offset-[#09090B] active:scale-[0.98]';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-violet-500 text-white hover:bg-violet-600 shadow-lg shadow-violet-950/30',
    secondary: 'bg-[#18181B] text-zinc-100 border border-white/10 hover:bg-[#27272A]',
    ghost: 'text-violet-300 hover:bg-violet-400/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    light: 'bg-white text-zinc-950 hover:bg-zinc-200',
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed saturate-50' : 'hover:-translate-y-px';
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
