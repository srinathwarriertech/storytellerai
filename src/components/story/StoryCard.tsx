'use client';

import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  IconButton,
  Avatar
} from '@mui/material';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const BookIcon = () => <div className="w-5 h-5">📖</div>;
const MoreIcon = () => <div className="w-5 h-5">⋯</div>;

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    genre: string;
    created_at: string;
    content: string;
  };
}

export default function StoryCard({ story }: StoryCardProps) {
  const getGenreColor = (genre: string) => {
    const colors = {
      fantasy: 'bg-purple-100 text-purple-800',
      'sci-fi': 'bg-blue-100 text-blue-800',
      mystery: 'bg-gray-100 text-gray-800',
      romance: 'bg-pink-100 text-pink-800',
      adventure: 'bg-green-100 text-green-800',
      horror: 'bg-red-100 text-red-800',
    };
    return colors[genre as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getGenreGradient = (genre: string) => {
    const gradients = {
      fantasy: 'from-purple-400 to-pink-400',
      'sci-fi': 'from-blue-400 to-cyan-400',
      mystery: 'from-gray-400 to-slate-400',
      romance: 'from-pink-400 to-rose-400',
      adventure: 'from-green-400 to-emerald-400',
      horror: 'from-red-400 to-orange-400',
    };
    return gradients[genre as keyof typeof gradients] || 'from-gray-400 to-slate-400';
  };

  return (
    <Card 
      className="group gradient-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      elevation={0}
      sx={{ borderRadius: '20px', overflow: 'hidden' }}
    >
      <Link href={`/dashboard/stories/${story.id}`}>
        <CardContent className="p-0">
          {/* Header with gradient */}
          <Box className={`h-24 bg-gradient-to-r ${getGenreGradient(story.genre)} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <Box className="absolute top-4 left-6 right-6 flex justify-between items-start">
              <Avatar 
                className="bg-white bg-opacity-20 backdrop-blur-sm"
                sx={{ width: 32, height: 32 }}
              >
                <BookIcon />
              </Avatar>
              <IconButton 
                size="small" 
                className="text-white hover:bg-white hover:bg-opacity-20"
                onClick={(e) => e.preventDefault()}
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Content */}
          <Box className="p-6">
            <Box className="flex items-start justify-between mb-3">
              <Typography 
                variant="h6" 
                className="font-bold text-gray-900 line-clamp-2 flex-1 mr-2"
                sx={{ 
                  fontSize: '1.125rem',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {story.title || 'Untitled Story'}
              </Typography>
              <Chip 
                label={story.genre}
                size="small"
                className={`${getGenreColor(story.genre)} font-semibold`}
                sx={{ 
                  borderRadius: '8px',
                  height: '24px',
                  fontSize: '0.75rem'
                }}
              />
            </Box>

            <Typography 
              variant="body2" 
              color="text.secondary"
              className="mb-4 line-clamp-3"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5
              }}
            >
              {story.content.substring(0, 150)}...
            </Typography>

            <Box className="flex items-center justify-between">
              <Typography 
                variant="caption" 
                color="text.secondary"
                className="font-medium"
              >
                {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
              </Typography>
              
              <Box className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <Typography variant="caption" color="text.secondary">
                  Published
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
}