import React from 'react';

export const SimplIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.13 14.88l-3.75-3.75 1.41-1.41 2.34 2.34 5.66-5.66 1.41 1.41-7.07 7.07z" fill="#FF5F00"/>
    </svg>
);
