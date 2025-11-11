import React from 'react';

const HospitalLogoIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="currentColor"
    >
      <path d="M100 0 C44.77 0 0 44.77 0 100 C0 155.23 44.77 200 100 200 C155.23 200 200 155.23 200 100 C200 44.77 155.23 0 100 0 Z M100 180 C55.82 180 20 144.18 20 100 C20 55.82 55.82 20 100 20 C144.18 20 180 55.82 180 100 C180 144.18 144.18 180 100 180 Z"/>
      <path d="M132.5 145 L132.5 120 Q132.5 90 100 90 L67.5 90 L67.5 70 L100 70 Q150 70 150 120 L150 145 Z M67.5 145 L67.5 120 L50 120 L50 145 Z M100 130 C110 130 112.5 125 112.5 120 L112.5 110 L87.5 110 L87.5 120 C87.5 125 90 130 100 130 Z"/>
    </svg>
  );
};

export default HospitalLogoIcon;