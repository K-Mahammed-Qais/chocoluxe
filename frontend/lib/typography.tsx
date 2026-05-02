'use client';

import { useResponsive } from './responsive';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function Heading({ children, className = '' }: TypographyProps) {
  const { isMobile } = useResponsive();
  
  return (
    <h1 
      className={`font-bold text-2xl ${isMobile ? 'text-xl' : 'text-3xl'} ${className}`}
    >
      {children}
    </h1>
  );
}

export function Subheading({ children, className = '' }: TypographyProps) {
  const { isMobile } = useResponsive();
  
  return (
    <h2 
      className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} ${className}`}
    >
      {children}
    </h2>
  );
}

export function BodyText({ children, className = '' }: TypographyProps) {
  const { isMobile } = useResponsive();
  
  return (
    <p 
      className={`${isMobile ? 'text-sm' : 'text-base'} ${className}`}
    >
      {children}
    </p>
  );
}

export function Caption({ children, className = '' }: TypographyProps) {
  const { isMobile } = useResponsive();
  
  return (
    <span 
      className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} ${className}`}
    >
      {children}
    </span>
  );
}