
import React from 'react';

interface ShieldCheckIconProps {
  className?: string;
}

const ShieldCheckIcon: React.FC<ShieldCheckIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className || "h-6 w-6"} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 009 2.056c4.56-1.037 8.135-4.896 8.618-9.752z" 
    />
  </svg>
);

export default ShieldCheckIcon;
