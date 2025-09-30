'use client';

import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  gradient?: 'primary-secondary' | 'secondary-primary' | 'primary-tertiary' | 'tertiary-accent';
}

const gradientClasses = {
  'primary-secondary': 'from-primary-500 to-secondary-600',
  'secondary-primary': 'from-secondary-600 to-primary-500', 
  'primary-tertiary': 'from-primary-500 to-tertiary-500',
  'tertiary-accent': 'from-tertiary-500 to-accent-500',
};

export const GradientText = ({ 
  children, 
  className = '', 
  gradient = 'primary-secondary' 
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