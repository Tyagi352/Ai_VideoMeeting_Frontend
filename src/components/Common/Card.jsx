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
  const baseClasses = 'nc-card bg-[#111113] rounded-[20px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.18)]';
  const paddingClasses = padded ? 'p-7' : '';
  const hoverClasses = hoverable ? 'hover:shadow-[0_18px_50px_rgba(0,0,0,0.3)] hover:border-white/20 transition duration-200 ease-out' : '';
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
