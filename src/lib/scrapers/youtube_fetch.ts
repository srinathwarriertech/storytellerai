import { Innertube, YTNodes } from 'youtubei.js';

interface TranscriptSegment {
  text: string;
  offset: number;
  duration?: number;
}
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Maximum number of videos to fetch
const DEFAULT_VIDEO_LIMIT = 10;

// Default channel ID (can be overridden)
const DEFAULT_CHANNEL_ID = 'UCR_Tzu1r5M9uoNB3CF4Zg3g';

// Interface for transcript data
interface VideoTranscript {
  id: string;
  title: string;
  content: string;
}

/**
 * Fetches video IDs from a YouTube channel
 * @param channelId YouTube channel ID
 * @param limit Maximum number of videos to fetch (default: 10)
 * @returns Array of video IDs
 */
export async function getChannelVideos(channelId: string = DEFAULT_CHANNEL_ID, limit: number = DEFAULT_VIDEO_LIMIT): Promise<string[]> {
  try {
    console.log(`Initializing YouTube client...`);
    const yt = await Innertube.create({ generate_session_locally: true });
    
    console.log(`Fetching channel info for ID: ${channelId}`);
    const channel = await yt.getChannel(channelId);
    
    if (!channel) {
      throw new Error(`Channel with ID ${channelId} not found`);
    }
    
    console.log(`Fetching videos from channel: ${channelId}`);
    const videos = await channel.getVideos();
    
    if (!videos || !videos.videos || !Array.isArray(videos.videos)) {
      console.error('Unexpected videos response format:', videos);
      throw new Error('Failed to fetch videos: Invalid response format');
    }
    
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
      try {
        const videoId = getVideoId(video);
        if (videoId) {
          videoIds.push(videoId);
          if (videoIds.length >= limit) break;
        }
      } catch (videoError) {
        console.error('Error processing video:', videoError);
        continue;
      }
    }
      
    console.log(`Found ${videoIds.length} videos from channel`);
    return videoIds;
  } catch (error) {
    console.error('Error in getChannelVideos:', error);
    throw new Error(`Failed to fetch channel videos: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetches and processes transcripts for videos from a channel
 * @param channelId YouTube channel ID
 * @param limit Maximum number of videos to process (default: 10)
 * @returns Array of processed transcripts
 */
export async function fetchTranscripts(
  channelId: string = DEFAULT_CHANNEL_ID, 
  limit: number = DEFAULT_VIDEO_LIMIT
): Promise<VideoTranscript[]> {
  try {
    console.log('Initializing YouTube client...');
    const yt = await Innertube.create({ generate_session_locally: true });
    
    console.log(`Fetching videos from channel: ${channelId}`);
    const videoIds = await getChannelVideos(channelId, limit);
    
    if (!videoIds.length) {
      console.log('No videos found for the channel');
      return [];
    }
    
    const results: VideoTranscript[] = [];
    
    for (const videoId of videoIds) {
      try {
        console.log(`\nProcessing video ID: ${videoId}`);
        const info = await yt.getInfo(videoId);
        
        if (!info) {
          console.log('No video info available');
          continue;
        }
        
        // Get transcript
        console.log('Fetching transcript...');
        const transcriptInfo = await info.getTranscript().catch(err => {
          console.log(`No transcript available for video ${videoId}:`, err.message);
          return null;
        });
        
        if (!transcriptInfo) {
          console.log('No transcript available for this video');
          continue;
        }
        
        // Get the first available transcript (usually the default one)
        const transcript = Array.isArray(transcriptInfo) ? transcriptInfo[0] : transcriptInfo;
        
        if (!transcript) {
          console.log('No transcript data found');
          continue;
        }
        
        // Get the segments from the transcript
        const segments = transcript.segments || [];
        console.log(`Found ${segments.length} segments in transcript`);
        
        if (segments.length === 0) {
          console.log('No transcript segments found');
          if ('text' in transcript) {
            console.log('Found plain text transcript, using that instead');
            segments.push({
              text: transcript.text,
              offset: 0
            });
          }
        }
        
        if (segments.length === 0) {
          console.log('No transcript segments found in the expected format');
          continue;
        }
        
        // Format the transcript text
        const transcriptText = segments
          .filter((segment: any): segment is TranscriptSegment => 
            segment && typeof segment.text === 'string' && typeof segment.offset === 'number'
          )
          .map((segment: TranscriptSegment) => 
            `${segment.text} (${Math.floor(segment.offset / 1000)}s)`
          )
          .join('\n');
        
        const videoData: VideoTranscript = {
          id: videoId,
          title: info.basic_info?.title || 'Untitled Video',
          content: transcriptText
        };
        
        results.push(videoData);
        console.log(`✅ Successfully processed video: ${videoData.title}`);
        
      } catch (error) {
        console.error(`❌ Error processing video ${videoId}:`, error instanceof Error ? error.message : error);
        continue;
      }
    }
    
    console.log(`\n✅ Successfully processed ${results.length} out of ${videoIds.length} videos`);
    return results;
    
  } catch (error) {
    console.error('❌ Error in fetchTranscripts:', error instanceof Error ? error.message : error);
    throw new Error(`Failed to fetch transcripts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Saves transcripts to files in the specified directory
 * @param transcripts Array of transcript objects
 * @param outputDir Directory to save the transcripts (default: './testdata')
 */
export async function saveTranscriptsToFiles(
  transcripts: VideoTranscript[], 
  outputDir: string = './testdata'
): Promise<{ success: boolean; count: number }> {
  console.log(`Saving transcripts to ${outputDir}`);
  await mkdir(outputDir, { recursive: true });
  
  for (const transcript of transcripts) {
    const filePath = join(outputDir, `transcript_${transcript.id}.txt`);
    await writeFile(filePath, transcript.content, 'utf-8');
    console.log(`Saved transcript to: ${filePath}`);
  }
  
  return { success: true, count: transcripts.length };
}

// Example usage
if (require.main === module) {
  (async () => {
    try {
      const transcripts = await fetchTranscripts();
      console.log(`Successfully processed ${transcripts.length} transcripts`);
    } catch (error) {
      console.error('Error in main execution:', error);
      process.exit(1);
    }
  })();
}
