'use client';

import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  gradient?: 'cyan-teal' | 'teal-cyan' | 'cyan-dark' | 'cyan-light';
}

const gradientClasses = {
  'cyan-teal': 'from-cyan-600 to-teal-600',
  'teal-cyan': 'from-teal-600 to-cyan-600', 
  'cyan-dark': 'from-cyan-700 to-teal-700',
  'cyan-light': 'from-cyan-400 to-teal-400',
};

export const GradientText = ({ 
  children, 
  className = '', 
  gradient = 'cyan-teal' 
}: GradientTextProps) => {
  return (
    <span 
      className={`bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent ${className}`}
      style={{ 
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {children}
    </span>
  );
};