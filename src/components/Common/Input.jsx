// Input.jsx - Input Component
import React from 'react';

export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = false,
  label = '',
  helperText = '',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={error || undefined}
        aria-describedby={helperText ? `${label.replace(/\s+/g, '-').toLowerCase()}-help` : undefined}
        className={`w-full px-4 py-3 rounded-[16px] border bg-[#18181B] text-zinc-100 transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-violet-400/30 ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-white/10 focus:border-violet-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
      {helperText && (
        <p id={label ? `${label.replace(/\s+/g, '-').toLowerCase()}-help` : undefined} className={`mt-2 text-sm ${error ? 'text-red-400' : 'text-zinc-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
