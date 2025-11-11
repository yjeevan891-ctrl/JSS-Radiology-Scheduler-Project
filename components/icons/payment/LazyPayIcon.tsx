import React from 'react';

export const LazyPayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#00BAA5"/>
        <path d="M8.5 10.5C8.5 9.12 9.62 8 11 8h3.5c1.38 0 2.5 1.12 2.5 2.5S15.88 13 14.5 13H11c-1.38 0-2.5 1.12-2.5 2.5S9.62 18 11 18h4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
