import React from 'react';

export default function LanguageIcon({ icon, name, className = '' }) {
  if (!icon) return null;
  return (
    <img
      src={icon}
      alt={name}
      className={`w-6 h-6 mr-2 ${className}`}
    />
  );
}
