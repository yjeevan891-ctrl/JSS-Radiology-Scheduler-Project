import React from 'react';

export const UpiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10h18M3 14h18" />
        <path d="M8 6h8" />
        <path d="M8 18h8" />
        <rect x="1" y="4" width="22" height="16" rx="2" />
    </svg>
);
