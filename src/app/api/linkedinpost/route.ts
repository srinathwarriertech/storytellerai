import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateStory, generateLinkedInPost } from '@/lib/ai/storyService';
import { PromptTemplate } from "@langchain/core/prompts";
import { acmeBrandGuidelinesLinkedin } from '@/testdata/acme/acme-brand-guidelines-linkedin';

// // Rate limiting configuration
// const RATE_LIMIT = 5; // 5 requests per hour
// const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
// const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const TEMPLATE = `You are a helpful assistant that can generate stories based on the user's input.`;

export async function POST(req: Request) {
  try {
    // const body = await req.json();
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { topic, referencePost ,fileContent,fileName} = requestBody;

    
    let linkedinPostParams = {
      topic,
      referencePost,
      brandGuide: acmeBrandGuidelinesLinkedin,
      fileContent,
      fileName
    };

    let linkedinPost = await generateLinkedInPost(linkedinPostParams);

    
    
    
    return linkedinPost;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}


