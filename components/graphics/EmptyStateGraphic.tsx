import React from 'react';

const EmptyStateGraphic: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
      className={`mx-auto h-28 w-28 text-gray-400 ${className}`}
      viewBox="0 0 64 64" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M22 10h20a3 3 0 013 3v40a3 3 0 01-3 3H22a3 3 0 01-3-3V13a3 3 0 013-3z" fill="#F0F4F8"/>
        <path d="M28 5h8a3 3 0 013 3v5H25V8a3 3 0 013-3z" fill="#DDE7F0"/>
        <path d="M35 9a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2a1 1 0 011-1h6z" fill="#A0B8CC"/>
        <path d="M33 31v-6a1 1 0 00-2 0v6h-6a1 1 0 110 2h6v6a1 1 0 102 0v-6h6a1 1 0 110-2h-6z" fill="#3B82F6"/>
        <path d="M24 22h16a1 1 0 110 2H24a1 1 0 110-2zm0 6h10a1 1 0 110 2H24a1 1 0 110-2z" fill="#D1D9E1"/>
      </g>
    </svg>
);

export default EmptyStateGraphic;