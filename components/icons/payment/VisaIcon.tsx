import React from 'react';

export const VisaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="#1A1F71" d="M8.4,17H5.2L2,7h3.2l1.7,7.1c0.1,0.5,0.2,0.9,0.3,1.3H7.3c0.1-0.4,0.1-0.8,0.2-1.3L9.2,7h3.2L8.4,17z"/>
        <path fill="#1A1F71" d="M22,7h-2.1l-2.4,10h3.2L22,7z M12.8,7l-2,10h3.1l2-10H12.8z"/>
        <path fill="#F7B600" d="M13.6,15.6l-0.7-3.4c-0.1-0.5-0.5-1.5-0.5-1.5s-0.1,0.8-0.2,1.1l-1.1,3.8H8.8l3.1-10h3.3c0,0-2.4,8.5-2.7,10H13.6z"/>
    </svg>
);
