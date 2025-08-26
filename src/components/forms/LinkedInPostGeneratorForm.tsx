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
  Alert,
  Button,
  CircularProgress
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
    youtubeChannelId: '',
    file: null as File | null,
    fileContent: ''
  });
  const [isFetchingTranscripts, setIsFetchingTranscripts] = useState(false);
  const [transcripts, setTranscripts] = useState<Array<{
    id: string;
    title: string;
    content: string;
  }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [story, setStory] = useState('');
  const [reasoning, setReasoning] = useState('');
  const router = useRouter();


  const handleChange = (field: string, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFetchTranscripts = async () => {
    if (!formData.youtubeChannelId) {
      setError('Please enter a YouTube channel ID');
      return;
    }
    
    setIsFetchingTranscripts(true);
    setError('');
    setSuccess('');
    setTranscripts([]);
    
    try {
      const response = await fetch('/api/fetch-youtube-transcripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: formData.youtubeChannelId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcripts');
      }
      console.log("inside fetch transcripts",data);
      setTranscripts(data.transcripts);
      
      // Auto-fill the topic field with the channel name if it's empty
      if (!formData.topic && data.channelName) {
        setFormData(prev => ({ ...prev, topic: data.channelName }));
      }
      
      setSuccess(`Successfully fetched ${data.transcripts.length} video transcripts`);
      
    } catch (err) {
      console.error('Error fetching transcripts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transcripts. Please check the channel ID and try again.');
    } finally {
      setIsFetchingTranscripts(false);
    }
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
        fileName: formData.file?.name || '',
        transcripts: transcripts,
      };

      const response = await fetch('/api/linkedinpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to generate story');
      let data = await response.text();
      let reasoning ='';

      if(data.split("</think>")[1]) {
        reasoning = data.split("</think>")[0].split("<think>")[1].trim();
        data = data.split("</think>")[1].trim();
      }
      setReasoning(reasoning);
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
          {/*<div className="p-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
            <MagicIcon />
          </div>
           <Typography variant="h5" className="font-bold text-xl mt-4">
            Generate LinkedIn Post from YouTube Channel
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-2">
            Enter a YouTube channel ID to fetch transcripts from the latest videos
          </Typography> */}
        </Box>
        <Typography variant="h3" className="text-gradient mb-2">
          Create Your Story
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let AI craft a unique, engaging story tailored to your preferences
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <TextField
            fullWidth
            label="YouTube Channel ID"
            value={formData.youtubeChannelId}
            onChange={(e) => handleChange('youtubeChannelId', e.target.value)}
            placeholder="e.g., UC1234567890abcdefghijklmnopqrstuvw"
            variant="outlined"
            className="flex-1"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchTranscripts}
            disabled={isFetchingTranscripts || !formData.youtubeChannelId}
            className="h-14 w-full md:w-48"
          >
            {isFetchingTranscripts ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Fetch Transcripts'
            )}
          </Button>
        </div>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-4">
            {success}
          </Alert>
        )}

        {transcripts.length > 0 && (
          <div className="mb-6">
            <Typography variant="h6" className="font-semibold mb-3">
              Fetched Transcripts ({transcripts.length})
            </Typography>
            <div className="space-y-4 max-h-96 overflow-y-auto p-2 border rounded">
              {transcripts.map((transcript, index) => (
                <div key={transcript.id} className="p-3 border-b last:border-b-0">
                  <Typography variant="subtitle2" className="font-medium">
                    {index + 1}. {transcript.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mt-1 line-clamp-3">
                    {transcript.content.substring(0, 200)}
                    {transcript.content.length > 200 ? '...' : ''}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic Input */}
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            What do you want to post about?
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

        {error && (
          <Alert severity="error" className="rounded-xl">
            {error}
          </Alert>
        )}

        {story && reasoning &&(
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            Reasoning
          </Typography>
          <TextField
            fullWidth
            value={reasoning}
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

        
      </form>
    </ModernCard>
  );
}