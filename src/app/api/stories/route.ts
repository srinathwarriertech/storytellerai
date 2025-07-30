import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateStory, generateSocialPosts } from '@/lib/ai/storyService';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(identifier);
    
    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { genre, theme, length, style, additionalContext } = await request.json();
    
    // Generate the story
    const story = await generateStory({
      genre,
      theme,
      length,
      style,
      additionalContext
    });

    // Generate social media posts
    const socialPosts = await generateSocialPosts(story, 'twitter');

    // Save to database
    const { data: savedStory, error } = await supabase
      .from('stories')
      .insert([
        {
          user_id: user.id,
          content: story,
          genre,
          theme,
          length,
          style,
          social_posts: socialPosts,
          metadata: { additionalContext }
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving story:', error);
      throw new Error('Failed to save story');
    }

    return NextResponse.json({
      story: savedStory,
      socialPosts
    });

  } catch (error) {
    console.error('Error in story generation:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate story' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
