import { NextResponse } from 'next/server';
// import { fetchTranscripts } from '@/lib/scrapers/youtube_fetch';
import { fetchTranscripts } from '@/lib/scrapers/youtube_fetch2';

export async function POST(request: Request) {
  try {
    const { channelId } = await request.json();
    
    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      );
    }

    // Fetch transcripts using our utility function
    const transcripts = await fetchTranscripts(channelId,2);
    
    if (!transcripts || transcripts?.length === 0) {
      return NextResponse.json(
        { error: 'No transcripts found for this channel' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully fetched transcripts for channel ID: ${channelId}`,
      transcripts,
      channelName: transcripts?.length > 0 ? transcripts[0]?.title : 'Unknown Channel'
    });

  } catch (error) {
    console.error('Error in fetch-youtube-transcripts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch transcripts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
