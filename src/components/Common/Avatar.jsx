// Avatar.jsx - Avatar Component
import React from 'react';

export default function Avatar({
  src,
  name = 'User',
  size = 'md', // sm, md, lg, xl
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-linear-to-br from-violet-400 to-violet-600 text-white font-semibold flex items-center justify-center overflow-hidden ring-1 ring-white/15 ${className}`}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
