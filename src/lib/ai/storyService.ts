import { createGroqClient } from './config';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { PromptTemplate } from "@langchain/core/prompts";
import {ChatGroq} from "@langchain/groq";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { HttpResponseOutputParser } from 'node_modules/langchain/dist/output_parsers';


import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { getLinkedInPost } from '@/prompts/linkedin_prompt';
import {acmeBrandGuidelinesLinkedin} from '@/testdata/acme/acme-brand-guidelines-linkedin';

type StoryParams = {
  genre: string;
  theme: string;
  length: 'short' | 'medium' | 'long';
  style?: string;
  additionalContext?: string;
};

type LinkedInParams = {
  topic: string;
  referencePost: string;
  brandGuide: string;
  fileContent: string;
  fileName: string;
};

export async function generateStory(params: StoryParams): Promise<StreamingTextResponse> {
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

  // const groqClient = createGroqClient();
  const model = new ChatGroq({
        model: "gemma2-9b-it",
        temperature: 0,
        apiKey: process.env.GROQ_API_KEY 
        // other params...
      });
  
  try {
    // const response = await groqClient.invoke([
    //   new SystemMessage(systemPrompt),
    //   new HumanMessage("Please generate the story now.")
    // ]);

    const prompt = PromptTemplate.fromTemplate(systemPrompt);    
    const outputParser = new HttpResponseOutputParser();
    
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      input: '',
    });
    
    return new StreamingTextResponse(stream);

    // const { text } = await generateText({
    //   model: groq('qwen/qwen3-32b'),
    //   prompt: systemPrompt
    // });

    // return text;

  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story. Please try again.');
  }
}

export async function generateLinkedInPost(params:LinkedInParams):Promise<StreamingTextResponse> {
    const { topic, referencePost, brandGuide,fileContent,fileName } = params;
    
    const systemPrompt = getLinkedInPost(topic, referencePost, brandGuide,fileContent,fileName);
    console.log("systemPrompt:",systemPrompt);
  
    const model = new ChatGroq({
          model: "llama-3.1-8b-instant",
          temperature: 0,
          apiKey: process.env.GROQ_API_KEY 
          // other params...
        });
    
    try {
  
      const prompt = PromptTemplate.fromTemplate(systemPrompt);    
      const outputParser = new HttpResponseOutputParser();
      
      const chain = prompt.pipe(model).pipe(outputParser);
  
      const stream = await chain.stream({
        input: '',
      });
      
      return new StreamingTextResponse(stream);
  
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
