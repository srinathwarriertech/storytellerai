'use client';

import { Box, Typography, Container, useTheme } from '@mui/material';
import StoryGeneratorForm from '@/components/forms/StoryGeneratorForm';

export default function Home() {
  const theme = useTheme();

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 50%, ${theme.palette.secondary.light} 100%)`,
        py: 12,
        px: 2
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h1"
            sx={{ 
              mb: 4,
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'float 6s ease-in-out infinite',
              '@keyframes float': {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' },
                '100%': { transform: 'translateY(0px)' }
              },
              [theme.breakpoints.down('md')]: {
                fontSize: '2.5rem'
              },
              [theme.breakpoints.up('md')]: {
                fontSize: '4rem'
              }
            }}
          >
            AI StoryTeller
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ 
              mb: 6, 
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              [theme.breakpoints.down('sm')]: {
                fontSize: '1.25rem'
              }
            }}
          >
            Unleash your creativity with AI-powered storytelling. 
            Generate unique, captivating stories tailored to your imagination.
          </Typography>
        </Box>

        {/* Story Generator Form */}
        <StoryGeneratorForm />

        {/* Features Section */}
        <Box className="mt-16 text-center">
          <Typography variant="h4" className="font-bold text-gray-900 mb-8">
            Why Choose AI StoryTeller?
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Creative Freedom',
                description: 'Express your unique vision with customizable genres, themes, and writing styles.'
              },
              {
                icon: '⚡',
                title: 'Instant Generation',
                description: 'Get professionally crafted stories in seconds, not hours.'
              },
              {
                icon: '🌟',
                title: 'Endless Possibilities',
                description: 'From fantasy epics to sci-fi adventures, explore unlimited storytelling potential.'
              }
            ].map((feature, index) => (
              <Box key={index} className="p-6">
                <Typography variant="h2" className="mb-4">
                  {feature.icon}
                </Typography>
                <Typography variant="h6" className="font-bold text-gray-900 mb-2">
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-secondary-200 to-primary-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full opacity-30 animate-pulse-slow"></div>
      </div>
    </Box>
  );
}