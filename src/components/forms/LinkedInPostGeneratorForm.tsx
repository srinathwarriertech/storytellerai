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
    topic: '',
    referencePost: '',
    brandGuide: '',
    file: null as File | null,
    fileContent: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [story, setStory] = useState('');
  const router = useRouter();


  const handleChange = (field: string, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      setFormData(prev => ({
        ...prev,
        file,
        fileContent: content
      }));
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Failed to read the file. Please try another file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
      const payload = {
        ...formData,
        file: undefined, // Don't send the File object directly
        fileName: formData.file?.name || ''
      };

      const response = await fetch('/api/linkedinpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to generate story');
      const data = await response.text();
      setStory(data);
      // router.push(`/dashboard/stories/${data.story.id}`);
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
        

        {/* File Upload */}
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            Upload Reference File (Optional)
          </Typography>
          <Box 
            className={`
              border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
              hover:border-primary-300 transition-colors duration-200
              ${formData.file ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}
            `}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".txt,.md,.pdf,.doc,.docx"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Box className="flex flex-col items-center">
                <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <Typography variant="body1" className="text-gray-600 mb-1">
                  {formData.file ? formData.file.name : 'Click to upload a file'}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  {formData.file ? 'Click to change file' : 'Supports .txt, .md, .pdf, .doc, .docx'}
                </Typography>
              </Box>
            </label>
          </Box>
        </Box>

        {/* Topic Input */}
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            Topic
          </Typography>
          <TextField
            fullWidth
            value={formData.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            placeholder="Enter your topic or prompt..."
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


        {/* Reference Post */}
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            Reference Post <span className="text-gray-400 font-normal">(Optional)</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.referencePost}
            onChange={(e) => handleChange('referencePost', e.target.value)}
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

        
        {story && (
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            Story
          </Typography>
          <TextField
            fullWidth
            value={story}
            multiline
            rows={10}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          />
        </Box>
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