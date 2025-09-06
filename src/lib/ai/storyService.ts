import { createGroqClient } from './config';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { Groq } from "groq-sdk";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { HttpResponseOutputParser } from "node_modules/langchain/dist/output_parsers";
import { getLinkedInPost } from "@/prompts/linkedin_prompt";

// Initialize Groq client
const chatGroq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-70b-8192",
  temperature: 1,
  maxTokens: 1024,
});

const groq = new Groq();

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
  transcripts: Array<{ id: string; title: string; content: string }>;
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
    const { topic, referencePost, brandGuide,fileContent,fileName,transcripts } = params;

    const systemPrompt = getLinkedInPost(topic, referencePost, brandGuide,fileContent,fileName,transcripts);
    console.log("systemPrompt:",systemPrompt);

  const model = new ChatGroq({
    model: "qwen/qwen3-32b",
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


export async function generateInstagramPost(imageUrl:string, textInput: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: textInput,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              },
            },
          ],
        },
      ],
    });
    // console.log("chatCompletion:",chatCompletion.choices[0]?.message?.content);

    // Since stream is false, we can directly access the content from the first choice
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error analyzing image with Groq:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
}
