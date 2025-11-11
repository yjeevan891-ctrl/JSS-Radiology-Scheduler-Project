import React from 'react';

export const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V8a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-2" />
        <path d="M20 12h-8a2 2 0 00-2 2v2a2 2 0 002 2h8V12z" />
    </svg>
);
