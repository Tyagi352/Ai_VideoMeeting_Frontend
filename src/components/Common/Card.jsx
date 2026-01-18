// Card.jsx - Reusable Card Component
import React from 'react';

export default function Card({
  children,
  hoverable = false,
  padded = true,
  clickable = false,
  className = '',
  onClick,
  ...props
}) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200';
  const paddingClasses = padded ? 'p-6' : '';
  const hoverClasses = hoverable ? 'hover:shadow-lg hover:border-gray-300 transition duration-300 ease-in-out' : '';
  const cursorClasses = clickable ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${paddingClasses} ${hoverClasses} ${cursorClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
