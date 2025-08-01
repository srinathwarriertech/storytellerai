'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Story = {
  id: string;
  title: string;
  content: string;
  genre: string;
  theme: string;
  length: string;
  style: string;
  created_at: string;
  social_posts: string[];
  metadata: any;
};

export default function StoryDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('story');
  const [isSharing, setIsSharing] = useState(false);
  const [sharePlatform, setSharePlatform] = useState('twitter');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/stories/${id}`);
        if (response.ok) {
          const data = await response.json();
          setStory(data);
        } else {
          throw new Error('Failed to fetch story');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id, user]);

  const handleShare = async (platform: string) => {
    if (!story) return;
    
    setIsSharing(true);
    setSharePlatform(platform);
    
    try {
      // In a real app, you would integrate with the respective social media API here
      // For now, we'll just simulate a successful share
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert(`Story shared successfully on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error sharing story:', error);
      alert('Failed to share story. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Story not found</h3>
        <p className="mt-2 text-sm text-gray-500">The requested story could not be found.</p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {story.title || 'Untitled Story'}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="capitalize">{story.genre}</span>
              <span className="mx-1">•</span>
              <span className="capitalize">{story.length}</span>
              <span className="mx-1">•</span>
              <span>{new Date(story.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          {/* Share buttons or other actions can go here */}
        </div>
      </div>
    </div>
  );
}
