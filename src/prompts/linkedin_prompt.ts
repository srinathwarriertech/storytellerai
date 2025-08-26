export const linkedin_prompt = `Act as an expert LinkedIn post writer. 
Write a linkedin post on the topic given below: 

Instructions: 
- Directly start with the response. no content before or after the response. 
- Always add Hashtags at the end , take from Brand guidelines
- Atleast 300 words

Topic: <topic>
Reference linkedin post : 
<referencepost>

Brand guidelines: 
<brandguide>

Strong additional Guideline:
<filecontent>

Reference Video Transcripts:
<transcripts>

`;

export function getLinkedInPost(
  topic: string, 
  referencePost: string, 
  brandGuide: string,
  fileContent:string,
  fileName:string,
  transcripts: Array<{ id: string; title: string; content: string }>): string {
  return linkedin_prompt.replace('<topic>', topic)
  .replace('<referencepost>', referencePost)
  .replace('<brandguide>', brandGuide)
  .replace('<filecontent>', fileContent)
  .replace('<transcripts>', transcripts.map(t => `ID: ${t.id}, Title: ${t.title}, Content: ${t.content}`).join('\n\n'));
}   