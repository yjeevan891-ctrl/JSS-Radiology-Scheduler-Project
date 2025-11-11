// This is a placeholder file. You should replace this with the actual JSS Hospital logo SVG or component.
import React from 'react';

const JssHospitalLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 200 200" 
    xmlns="http://www.w3.org/2000/svg" 
    aria-label="JSS Hospital Logo"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#005f73', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0a9396', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    
    <circle cx="100" cy="100" r="95" fill="url(#logoGradient)" />
    
    <text x="100" y="115" fontFamily="Arial, sans-serif" fontSize="80" fontWeight="bold" fill="white" textAnchor="middle">
      JSS
    </text>
  </svg>
);

// FIX: Added a default export to make the component importable as a module.
export default JssHospitalLogo;
