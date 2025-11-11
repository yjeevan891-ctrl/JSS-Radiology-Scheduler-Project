import React from 'react';

export const PhonePeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#6739B7"/>
        <path d="M14.07 15.34h-1.63v-3.8h1.63a1.9 1.9 0 100-3.8h-4.2v9.5h5.83v-1.9z" fill="#FFF"/>
    </svg>
);
