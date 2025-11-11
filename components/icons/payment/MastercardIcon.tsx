import React from 'react';

export const MastercardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="8" cy="12" r="7" fill="#EA001B"/>
        <circle cx="16" cy="12" r="7" fill="#F79E1B"/>
        <path fill="#FF5F00" d="M12,12a7,7 0 0,1-3.5,6.06A7,7 0 0,0 12,19a7,7 0 0,0 3.5-1.06A7,7 0 0,1 12,12Z"/>
    </svg>
);
