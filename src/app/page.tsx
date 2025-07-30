'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">AI StoryTeller</h1>
          <p className="mt-2 text-gray-600">Generate unique, engaging stories with AI</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {['fantasy', 'sci-fi', 'mystery', 'romance', 'adventure', 'horror'].map(genre => (
                    <option key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                <select
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="short">Short (500 words)</option>
                  <option value="medium">Medium (1000 words)</option>
                  <option value="long">Long (2000+ words)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter a theme or prompt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {['whimsical', 'descriptive', 'concise', 'poetic', 'humorous', 'dark'].map(style => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Context (optional)
                </label>
                <textarea
                  name="additionalContext"
                  rows={3}
                  value={formData.additionalContext}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Any specific details to include..."
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isGenerating ? 'Generating...' : 'Generate Story'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
