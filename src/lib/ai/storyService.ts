import { createGroqClient } from './config';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

type StoryParams = {
  genre: string;
  theme: string;
  length: 'short' | 'medium' | 'long';
  style?: string;
  additionalContext?: string;
};

export async function generateStory(params: StoryParams): Promise<string> {
  const { genre, theme, length, style = 'engaging', additionalContext = '' } = params;
  
  const lengthMap = {
    short: 'about 500 words',
    medium: 'about 1000 words',
    long: 'about 2000 words',
  };

  const systemPrompt = `You are a master storyteller. Create a ${genre} story with the theme "${theme}". 
  The story should be ${lengthMap[length]} long and written in a ${style} style. 
  ${additionalContext ? `Additional context: ${additionalContext}` : ''}
  
  Guidelines:
  - Start with a hook that grabs attention
  - Develop interesting characters
  - Include a clear beginning, middle, and end
  - Use vivid descriptions
  - Maintain consistent tone and style throughout`;

  const groqClient = createGroqClient();
  
  try {
    const response = await groqClient.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage("Please generate the story now.")
    ]);
    
    return response.content.toString();
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story. Please try again.');
  }
}

export async function generateSocialPosts(story: string, platform: 'twitter' | 'linkedin' | 'instagram'): Promise<string[]> {
  const systemPrompt = `You are a social media expert. Create 3 engaging posts for ${platform} based on the following story. 
  Each post should be attention-grabbing and encourage engagement. 
  For Twitter, keep it under 280 characters. For Instagram, include relevant hashtags.`;

  const groqClient = createGroqClient();
  
  try {
    const response = await groqClient.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Story: ${story}\n\nGenerate 3 social media posts. Format as a JSON array of strings.`)
    ]);
    
    // Parse the response as JSON
    return JSON.parse(response.content.toString().trim());
  } catch (error) {
    console.error('Error generating social posts:', error);
    throw new Error('Failed to generate social media posts. Please try again.');
  }
}
