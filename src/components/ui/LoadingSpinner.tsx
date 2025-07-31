'use client';

import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 40, 
  message = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <Box className={containerClass}>
      <Box className="flex flex-col items-center space-y-4">
        <CircularProgress 
          size={size} 
          thickness={4}
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        {message && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            className="animate-pulse-slow"
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}