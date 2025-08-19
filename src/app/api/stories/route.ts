import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateStory } from '@/lib/ai/storyService';
import { PromptTemplate } from "@langchain/core/prompts";

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

    const { genre, theme, length, style, additionalContext } = requestBody;

    // Generate the story
    let story = await generateStory({
      genre,
      theme,
      length,
      style,
      additionalContext
    });

    // if(story.split("</think>")[1]) {
    //   story = story.split("</think>")[1];
    // }
    
    return story;
    

    // const model = new ChatGroq({
    //   model: "mistral-saba-24b",
    //   temperature: 0,
    //   apiKey: process.env.GROQ_API_KEY 
    //   // other params...
    // });

    // const outputParser = new HttpResponseOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "@langchain/core/runnables";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    // const chain = prompt.pipe(model).pipe(outputParser);

    // const stream = await chain.stream({
    //   input: requestBody,
    // });

    // return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}


/*
export async function POST(request: Request) {
  
  
  
  
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = (forwardedFor || '127.0.0.1').split(',')[0].trim();
    
    // Apply rate limiting
    const now = Date.now();
    const rateLimitInfo = rateLimitMap.get(ip);
    
    if (rateLimitInfo && rateLimitInfo.resetAt > now) {
      if (rateLimitInfo.count >= RATE_LIMIT) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.'
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
      rateLimitMap.set(ip, { 
        ...rateLimitInfo, 
        count: rateLimitInfo.count + 1 
      });
    } else {
      rateLimitMap.set(ip, { 
        count: 1, 
        resetAt: now + RATE_LIMIT_WINDOW 
      });
    }

    const supabase = createServerClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unauthorized - Please sign in',
          details: process.env.NODE_ENV === 'development' ? userError?.message : undefined
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { genre, theme, length, style, additionalContext } = requestBody;
    
    // Validate required fields
    const missingFields = [];
    if (!genre) missingFields.push('genre');
    if (!theme) missingFields.push('theme');
    if (!length) missingFields.push('length');
    if (!style) missingFields.push('style');
    
    if (missingFields.length > 0) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Missing required fields',
          missingFields,
          message: `Please provide: ${missingFields.join(', ')}`
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
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
    const { data: savedStory, error: insertError } = await supabase
      .from('stories')
      .insert({
        user_id: user.id,
        content: story,
        genre,
        theme,
        length,
        style,
        social_posts: socialPosts,
        metadata: { additionalContext }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to save story',
          details: process.env.NODE_ENV === 'development' ? insertError.message : undefined
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        story: savedStory,
        socialPosts
      }
    });

  } catch (error) {
    console.error('Error in /api/stories:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = process.env.NODE_ENV === 'development' && error instanceof Error 
      ? error.stack 
      : undefined;
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage,
        stack: errorStack
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'X-Error': 'true'
        } 
      }
    );
  }
}
*/