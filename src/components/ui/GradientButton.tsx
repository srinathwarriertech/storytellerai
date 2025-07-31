'use client';

import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export default function GradientButton({ 
  children, 
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  ...props 
}: GradientButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'gradient-primary text-white shadow-modern hover:shadow-glow';
      case 'secondary':
        return 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-modern';
      case 'outline':
        return 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 bg-transparent';
      default:
        return 'gradient-primary text-white shadow-modern hover:shadow-glow';
    }
  };

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={`
        ${getVariantClasses()}
        transition-all duration-300 transform hover:scale-105 
        font-semibold py-3 px-6 rounded-xl
        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      sx={{
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: '12px',
        minHeight: '48px',
      }}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}