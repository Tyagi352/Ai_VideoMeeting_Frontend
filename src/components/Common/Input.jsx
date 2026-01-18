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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2.5 rounded-md border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'} ${className}`}
        {...props}
      />
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
