'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import GradientButton from '@/components/ui/GradientButton';
import ModernCard from '@/components/ui/ModernCard';
import StoryCard from '@/components/story/StoryCard';

const AddIcon = () => <div className="w-5 h-5">+</div>;
const BookIcon = () => <div className="w-6 h-6">📚</div>;
const MagicIcon = () => <div className="w-6 h-6">✨</div>;
const TrendingIcon = () => <div className="w-6 h-6">📈</div>;

type Story = {
  id: string;
  title: string;
  genre: string;
  created_at: string;
  content: string;
};

export default function Dashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStories = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/stories');
        if (response.ok) {
          const data = await response.json();
          setStories(data);
        }
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [user]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your stories..." />;
  }

  const stats = [
    { label: 'Total Stories', value: stories.length, icon: <BookIcon />, color: 'from-blue-500 to-cyan-500' },
    { label: 'This Month', value: stories.filter(s => new Date(s.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, icon: <TrendingIcon />, color: 'from-green-500 to-emerald-500' },
    { label: 'Genres Explored', value: new Set(stories.map(s => s.genre)).size, icon: <MagicIcon />, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <Box className="space-y-8">
      {/* Welcome Header */}
      <Box className="text-center py-8">
        <Typography variant="h2" className="text-gradient mb-4">
          Welcome back, Creator! 
        </Typography>
        <Typography variant="h6" color="text.secondary" className="mb-6 max-w-2xl mx-auto">
          Ready to craft your next masterpiece? Let your imagination run wild with AI-powered storytelling.
        </Typography>
        <Link href="/">
          <GradientButton className="px-8 py-3">
            <AddIcon />
            <span className="ml-2">Create New Story</span>
          </GradientButton>
        </Link>
      </Box>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index}>
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
          </div>
        ))}
      </div>

      {/* Stories Section */}
      <Box>
        <Box className="flex items-center justify-between mb-6">
          <Box>
            <Typography variant="h4" className="font-bold text-gray-900 mb-2">
              Your Stories
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Continue your creative journey
            </Typography>
          </Box>
          <Chip 
            label={`${stories.length} stories`}
            className="bg-primary-100 text-primary-800 font-semibold"
          />
        </Box>

        {stories.length === 0 ? (
          <ModernCard className="text-center py-12">
            <Box className="max-w-md mx-auto">
              <Avatar 
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
              >
                <BookIcon />
              </Avatar>
              <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                No stories yet
              </Typography>
              <Typography variant="body1" color="text.secondary" className="mb-6">
                Start your creative journey by generating your first AI-powered story.
              </Typography>
              <Link href="/">
                <GradientButton>
                  <MagicIcon />
                  <span className="ml-2">Create Your First Story</span>
                </GradientButton>
              </Link>
            </Box>
          </ModernCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div key={story.id}>
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        )}
      </Box>
    </Box>
  );
}