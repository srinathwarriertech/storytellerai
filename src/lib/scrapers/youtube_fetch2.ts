import { Innertube, YTNodes } from 'youtubei.js';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)+'/transcripts';

interface TranscriptSegment {
  start?: string | number;  // Start time in seconds or milliseconds
  start_ms?: string | number;  // Alternative start time in milliseconds
  end?: string | number;  // End time in seconds or milliseconds
  end_ms?: string | number;  // Alternative end time in milliseconds
  text?: string;  // The actual transcript text
  snippet?: {
    text: string;  // Alternative text location
  };
  start_time_text?: {
    text: string;  // Formatted time string (e.g., "0:00")
  };
  [key: string]: any;  // Allow for additional properties
}

interface ProcessedSegment {
  text: string;
  startTime: number;
  endTime: number;
  startTimeText: string;
}

interface VideoTranscript {
  id: string;
  title: string;
  content: string;
}

// Helper function to format time for display
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Channel ID for Sidwarrier's channel
const CHANNEL_ID = 'UCR_Tzu1r5M9uoNB3CF4Zg3g';
const VIDEOS_TO_FETCH = 10; // Number of recent videos to process

async function getChannelVideos(channelId: string, limit: number = 10): Promise<string[]> {
  const yt = await Innertube.create({ generate_session_locally: true });
  
  console.log(`Fetching channel info for ID: ${channelId}`);
  const channel = await yt.getChannel(channelId);
  
    // Get the videos from the channel
  const videos = await channel.getVideos();
  
    // Helper function to safely extract video ID from different video types
  const getVideoId = (video: any): string | null => {
    if (!video) return null;
    
    // Handle different video types from youtubei.js
    if (video instanceof YTNodes.Video) {
      return video.id;
    } else if (video instanceof YTNodes.CompactVideo || 
               video instanceof YTNodes.GridVideo ||
               video instanceof YTNodes.PlaylistVideo) {
      return video.id;
    } else if (typeof video.id === 'string') {
      return video.id;
    }
    return null;
  };

  // Extract video IDs safely
  const videoIds: string[] = [];
  for (const video of videos.videos) {
    const videoId = getVideoId(video);
    if (videoId) {
      videoIds.push(videoId);
      if (videoIds.length >= limit) break;
    }
  }
    
  console.log(`Found ${videoIds.length} videos from channel`);
  return videoIds;
}

export async function fetchTranscripts(channelId: string, limit: number = 10) : Promise<VideoTranscript[]> {
  const transcripts: VideoTranscript[] = [];
  
  try {
    // Create YouTube instance
    const yt = await Innertube.create({ 
      generate_session_locally: true
    });
    
    // Get recent videos from channel
    const videoIds = await getChannelVideos(channelId, limit);
    
    // Process each video
    for (const videoId of videoIds) {
      try {
        console.log(`\nProcessing video ID: ${videoId}`);
        const info = await yt.getInfo(videoId);
        
        // Get default transcript
        const transcriptInfo = await info.getTranscript();
        
        if (!transcriptInfo) {
          console.log('No transcript available for this video');
          continue;
        }

        // Log the transcript info to inspect its structure (first 200 chars)
        const transcriptStr = JSON.stringify(transcriptInfo);
        console.log('Transcript info preview:', transcriptStr.substring(0, 200) + (transcriptStr.length > 200 ? '...' : ''));
        
        // Helper function to safely parse time values
        const parseTime = (timeValue: string | number | undefined): number => {
          if (timeValue === undefined) return 0;
          const num = typeof timeValue === 'string' ? parseFloat(timeValue) : timeValue;
          return isNaN(num) ? 0 : num;
        };

        // Extract segments from the transcript content
        let segments: TranscriptSegment[] = [];
        
        // Try to access the segments from the transcript content
        if (transcriptInfo?.transcript?.content?.body?.initial_segments) {
          // This is the expected structure from the youtubei.js library
          segments = transcriptInfo.transcript.content.body.initial_segments as TranscriptSegment[];
        }
        // } else if (Array.isArray(transcriptInfo)) {
        //   // If it's directly an array, use it as segments
        //   segments = transcriptInfo as TranscriptSegment[];
        // } else if (transcriptInfo?.segments) {
        //   // Fallback to direct segments property
        //   segments = Array.isArray(transcriptInfo.segments) 
        //     ? transcriptInfo.segments as TranscriptSegment[]
        //     : [];
        // }
        
        if (!segments || segments.length === 0) {
          console.log('No transcript segments found in the expected format');
          continue;
        }
        
        console.log(`\n=== Video Information ===`);
        console.log(`Video ID: ${info.basic_info.id}`);
        console.log(`Title: ${info.basic_info.title}`);
        console.log(`Number of segments found: ${segments.length}`);
        
        // Process and display preview of first 5 segments
        if (segments.length > 0) {
          console.log('\nPreview of first 5 segments:');
          segments.slice(0, 5).forEach((segment) => {
            // Handle different possible time and text formats
            const startTime = parseTime(segment.start || segment.start_ms || 0);
            const text = segment.text || segment.snippet?.text || '';
            console.log(`[${formatTime(startTime / 1000)}] ${text}`);
          });
          
          // Calculate total duration if possible
          if (segments.length > 0) {
            const lastSegment = segments[segments.length - 1];
            const lastEndTime = parseTime(lastSegment.end || lastSegment.end_ms || 
              (parseTime(lastSegment.start || lastSegment.start_ms) + 5000));
            const totalDuration = lastEndTime / 1000; // Convert to seconds
            console.log(`\nEstimated duration: ${(totalDuration / 60).toFixed(1)} minutes`);
          }
          
          // Save to file without timestamps
          const outputFile = `transcript_${info.basic_info.id}.txt`;
          const transcriptText = segments
            .map(segment => {
              // Only include the text content without timestamps
              return segment.text || segment.snippet?.text || '';
            })
            .filter(text => text.trim().length > 0) // Remove empty lines
            .join('\n');
          
          await writeFile(join(__dirname, outputFile), transcriptText);
          console.log(`\nTranscript saved to: ${outputFile}`);
          
          
          // Add to transcripts array
          transcripts.push({
            id: info.basic_info.id || 'unknown-id',
            title: info.basic_info.title || 'Untitled Video',
            content: transcriptText
          });
        }
      } catch (error) {
        console.error(`Error processing video ${videoId}:`, error);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    // Re-throw the error after logging
    throw error;
  }
  
  return transcripts;
}

export async function saveTranscriptsToFiles(info: any, segments: any){
  
}
