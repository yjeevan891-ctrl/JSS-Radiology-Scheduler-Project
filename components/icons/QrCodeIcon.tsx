import React from 'react';

export const QrCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg" 
    shapeRendering="crispEdges"
  >
    <rect width="100" height="100" fill="#fff" />
    <rect x="10" y="10" width="25" height="25" fill="#000" />
    <rect x="15" y="15" width="15" height="15" fill="#fff" />
    <rect x="17.5" y="17.5" width="10" height="10" fill="#000" />
    
    <rect x="65" y="10" width="25" height="25" fill="#000" />
    <rect x="70" y="15" width="15" height="15" fill="#fff" />
    <rect x="72.5" y="17.5" width="10" height="10" fill="#000" />

    <rect x="10" y="65" width="25" height="25" fill="#000" />
    <rect x="15" y="70" width="15" height="15" fill="#fff" />
    <rect x="17.5" y="72.5" width="10" height="10" fill="#000" />

    <rect x="40" y="10" width="5" height="5" fill="#000" />
    <rect x="50" y="10" width="5" height="5" fill="#000" />
    <rect x="60" y="10" width="5" height="5" fill="#000" />
    <rect x="40" y="20" width="5" height="5" fill="#000" />
    <rect x="45" y="25" width="5" height="5" fill="#000" />
    <rect x="55" y="20" width="5" height="5" fill="#000" />

    <rect x="10" y="40" width="5" height="5" fill="#000" />
    <rect x="20" y="40" width="5" height="5" fill="#000" />
    <rect x="30" y="40" width="5" height="5" fill="#000" />
    <rect x="10" y="50" width="5" height="5" fill="#000" />
    <rect x="25" y="45" width="5" height="5" fill="#000" />
    <rect x="20" y="55" width="5" height="5" fill="#000" />

    <rect x="40" y="40" width="5" height="25" fill="#000" />
    <rect x="50" y="45" width="15" height="5" fill="#000" />
    <rect x="60" y="55" width="5" height="15" fill="#000" />
    <rect x="45" y="65" width="10" height="5" fill="#000" />
    <rect x="75" y="45" width="5" height="25" fill="#000" />
    <rect x="65" y="75" width="25" height="5" fill="#000" />
    <rect x="85" y="65" width="5" height="5" fill="#000" />
  </svg>
);
