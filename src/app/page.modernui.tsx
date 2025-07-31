'use client';

import { Box, Typography, Container, Grid, Avatar, Chip } from '@mui/material';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/components/theme/mui-theme';
import { AuthProvider } from '@/contexts/AuthContext';
import StoryGeneratorForm from '@/components/forms/StoryGeneratorForm';
import ModernCard from '@/components/ui/ModernCard';
import GradientButton from '@/components/ui/GradientButton';
import StoryCard from '@/components/story/StoryCard';
import ModernNavbar from '@/components/navigation/ModernNavbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Mock data for preview
const mockStories = [
  {
    id: '1',
    title: 'The Crystal of Eternal Dreams',
    genre: 'fantasy',
    created_at: '2024-01-15T10:30:00Z',
    content: 'In a realm where dreams take physical form, young Aria discovers a crystal that holds the power to make any dream reality. But with great power comes great responsibility, and she must learn to control her newfound abilities before they consume her...'
  },
  {
    id: '2',
    title: 'Echoes from Tomorrow',
    genre: 'sci-fi',
    created_at: '2024-01-14T15:45:00Z',
    content: 'Dr. Sarah Chen receives mysterious messages from her future self, warning of an impending catastrophe. Racing against time, she must decode the cryptic warnings and prevent a disaster that could reshape humanity forever...'
  },
  {
    id: '3',
    title: 'The Midnight Garden Mystery',
    genre: 'mystery',
    created_at: '2024-01-13T09:20:00Z',
    content: 'When flowers in the town garden start blooming only at midnight, detective Emma Walsh uncovers a web of secrets that leads to a decades-old disappearance. Each midnight bloom reveals another clue in this enchanting mystery...'
  }
];

const mockUser = {
  id: '1',
  email: 'creator@storyteller.ai'
};

// Mock auth context for preview
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default function ModernUIPreview() {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <MockAuthProvider>
        <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          
          {/* Hero Section */}
          <Container maxWidth="lg" className="py-12">
            <Box className="text-center mb-12">
              <Typography 
                variant="h1" 
                className="text-gradient mb-6 animate-float"
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700 
                }}
              >
                AI StoryTeller
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                className="mb-8 max-w-3xl mx-auto"
                sx={{ lineHeight: 1.6 }}
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
              <Grid container spacing={4}>
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
                  <Grid item xs={12} md={4} key={index}>
                    <ModernCard className="text-center h-full">
                      <Typography variant="h2" className="mb-4">
                        {feature.icon}
                      </Typography>
                      <Typography variant="h6" className="font-bold text-gray-900 mb-2">
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </ModernCard>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Dashboard Preview Section */}
            <Box className="mt-20">
              <Typography variant="h4" className="font-bold text-gray-900 mb-8 text-center">
                Dashboard Preview
              </Typography>
              
              {/* Stats Cards */}
              <Grid container spacing={3} className="mb-8">
                {[
                  { label: 'Total Stories', value: 12, icon: '📚', color: 'from-blue-500 to-cyan-500' },
                  { label: 'This Month', value: 5, icon: '📈', color: 'from-green-500 to-emerald-500' },
                  { label: 'Genres Explored', value: 6, icon: '✨', color: 'from-purple-500 to-pink-500' },
                ].map((stat, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <ModernCard hover={false} className="text-center">
                      <Box className="flex flex-col items-center space-y-3">
                        <Avatar 
                          className={`w-12 h-12 bg-gradient-to-r ${stat.color} text-white`}
                        >
                          {stat.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h4" className="font-bold text-gray-900">
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.label}
                          </Typography>
                        </Box>
                      </Box>
                    </ModernCard>
                  </Grid>
                ))}
              </Grid>

              {/* Story Cards */}
              <Box className="mb-8">
                <Box className="flex items-center justify-between mb-6">
                  <Box>
                    <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                      Recent Stories
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Your latest creative works
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${mockStories.length} stories`}
                    className="bg-primary-100 text-primary-800 font-semibold"
                  />
                </Box>

                <Grid container spacing={4}>
                  {mockStories.map((story) => (
                    <Grid item xs={12} sm={6} lg={4} key={story.id}>
                      <StoryCard story={story} />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Loading Spinner Demo */}
              <Box className="mt-12">
                <Typography variant="h5" className="font-bold text-gray-900 mb-4 text-center">
                  Loading States
                </Typography>
                <ModernCard className="text-center">
                  <LoadingSpinner message="Generating your story..." />
                </ModernCard>
              </Box>

              {/* Button Variants */}
              <Box className="mt-12 text-center">
                <Typography variant="h5" className="font-bold text-gray-900 mb-6">
                  Button Variants
                </Typography>
                <Box className="flex flex-wrap justify-center gap-4">
                  <GradientButton variant="primary">
                    Primary Button
                  </GradientButton>
                  <GradientButton variant="secondary">
                    Secondary Button
                  </GradientButton>
                  <GradientButton variant="outline">
                    Outline Button
                  </GradientButton>
                  <GradientButton loading>
                    Loading Button
                  </GradientButton>
                </Box>
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
      </MockAuthProvider>
    </MUIThemeProvider>
  );
}