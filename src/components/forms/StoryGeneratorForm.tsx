'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip,
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import GradientButton from '@/components/ui/GradientButton';
import ModernCard from '@/components/ui/ModernCard';

const MagicIcon = () => <div className="w-5 h-5">✨</div>;

export default function StoryGeneratorForm() {
  const [formData, setFormData] = useState({
    genre: 'fantasy',
    theme: 'a journey of self-discovery',
    length: 'medium',
    style: 'whimsical',
    additionalContext: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const genres = [
    { value: 'fantasy', label: 'Fantasy', emoji: '🧙‍♂️' },
    { value: 'sci-fi', label: 'Sci-Fi', emoji: '🚀' },
    { value: 'mystery', label: 'Mystery', emoji: '🔍' },
    { value: 'romance', label: 'Romance', emoji: '💕' },
    { value: 'adventure', label: 'Adventure', emoji: '⚔️' },
    { value: 'horror', label: 'Horror', emoji: '👻' },
  ];

  const styles = [
    { value: 'whimsical', label: 'Whimsical' },
    { value: 'descriptive', label: 'Descriptive' },
    { value: 'concise', label: 'Concise' },
    { value: 'poetic', label: 'Poetic' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'dark', label: 'Dark' },
  ];

  const lengths = [
    { value: 'short', label: 'Short Story', description: '~500 words' },
    { value: 'medium', label: 'Medium Story', description: '~1000 words' },
    { value: 'long', label: 'Long Story', description: '~2000+ words' },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate story');
      const data = await response.json();
      router.push(`/dashboard/stories/${data.story.id}`);
    } catch (err) {
      setError('Failed to generate story. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ModernCard className="max-w-4xl mx-auto">
      <Box className="text-center mb-8">
        <Box className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
            <MagicIcon />
          </div>
        </Box>
        <Typography variant="h3" className="text-gradient mb-2">
          Create Your Story
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let AI craft a unique, engaging story tailored to your preferences
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Genre Selection */}
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            Choose Your Genre
          </Typography>
          <Box className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {genres.map((genre) => (
              <Box
                key={genre.value}
                onClick={() => handleChange('genre', genre.value)}
                className={`
                  p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${formData.genre === genre.value 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }
                `}
              >
                <Box className="text-center">
                  <Typography variant="h5" className="mb-1">
                    {genre.emoji}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {genre.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Theme Input */}
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            Story Theme
          </Typography>
          <TextField
            fullWidth
            value={formData.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            placeholder="Enter your story theme or prompt..."
            multiline
            rows={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          />
        </Box>

        {/* Length and Style */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Box>
            <Typography variant="h6" className="mb-3 font-semibold">
              Story Length
            </Typography>
            <FormControl fullWidth>
              <Select
                value={formData.length}
                onChange={(e) => handleChange('length', e.target.value)}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {lengths.map((length) => (
                  <MenuItem key={length.value} value={length.value}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {length.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {length.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="h6" className="mb-3 font-semibold">
              Writing Style
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <Chip
                  key={style.value}
                  label={style.label}
                  onClick={() => handleChange('style', style.value)}
                  variant={formData.style === style.value ? 'filled' : 'outlined'}
                  color={formData.style === style.value ? 'primary' : 'default'}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Additional Context */}
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            Additional Context <span className="text-gray-400 font-normal">(Optional)</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.additionalContext}
            onChange={(e) => handleChange('additionalContext', e.target.value)}
            placeholder="Any specific characters, settings, or plot elements you'd like to include..."
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" className="rounded-xl">
            {error}
          </Alert>
        )}

        <Box className="pt-4">
          <GradientButton
            type="submit"
            loading={isGenerating}
            disabled={isGenerating}
            className="w-full py-4 text-lg"
          >
            {isGenerating ? 'Crafting Your Story...' : 'Generate My Story'}
          </GradientButton>
        </Box>
      </form>
    </ModernCard>
  );
}