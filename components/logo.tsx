import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain outline */}
      <path d="M60 20 C40 20 25 35 25 50 C25 65 40 80 60 80 C80 80 95 65 95 50 C95 35 80 20 60 20 Z" fill="#374151"/>
      
      {/* Center division line */}
      <path d="M60 25 L60 75" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Left hemisphere neural pathway */}
      <path d="M30 70 Q45 60 55 50" stroke="#6b7280" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <circle cx="55" cy="50" r="3" fill="#6b7280"/>
      
      {/* Right hemisphere neural pathways */}
      <path d="M90 30 Q75 40 65 50" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <circle cx="65" cy="50" r="3" fill="#9ca3af"/>
      
      <path d="M85 50 L70 50" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <circle cx="70" cy="50" r="2.5" fill="#d1d5db"/>
      
      <path d="M80 65 L70 65" stroke="#e5e7eb" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="70" cy="65" r="2" fill="#e5e7eb"/>
    </svg>
  );
};

export default Logo; 