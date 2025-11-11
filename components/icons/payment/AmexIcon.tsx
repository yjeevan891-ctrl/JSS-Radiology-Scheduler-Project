import React from 'react';

export const AmexIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect width="20" height="14" x="2" y="5" fill="#0077C8" rx="2"/>
        <path fill="white" d="M10.3 7.5h3.4l-1.7 4.5 1.7 4.5h-3.4l-1.7-4.5z"/>
        <path fill="white" d="M6.1 12h1.8v1.8H6.1zm0-3.6h1.8V10H6.1zm3.6 1.8h1.8v1.8H9.7zM6.1 13.8h1.8v1.8H6.1zm1.8-5.4h1.8V10H7.9zm0 3.6h1.8v1.8H7.9zm1.8-1.8h1.8v1.8H9.7z"/>
        <path fill="white" d="M14.1 7.5h1.8v9h-1.8z"/>
    </svg>
);
