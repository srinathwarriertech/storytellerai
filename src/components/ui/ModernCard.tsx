'use client';

import { Card, CardContent, Box } from '@mui/material';
import { ReactNode } from 'react';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export default function ModernCard({ 
  children, 
  className = '', 
  hover = true,
  glass = false 
}: ModernCardProps) {
  const baseClasses = glass 
    ? "glass-effect" 
    : "gradient-card shadow-modern";
  
  const hoverClasses = hover 
    ? "transition-all duration-300 hover:shadow-glow hover:-translate-y-1" 
    : "";

  return (
    <Card 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      elevation={0}
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}