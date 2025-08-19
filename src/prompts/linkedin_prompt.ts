export const linkedin_prompt = `Act as an expert LinkedIn post writer. 
Write a linkedin post on the topic given below: 

Instructions: 
- Directly start with the response. no content before or after the response. 
- Always add Hashtags at the end , take from Brand guidelines

Topic: <topic>
Reference linkedin post : 
<referencepost>

Brand guidelines: 
<brandguide>`;

export function getLinkedInPost(topic: string, referencePost: string, brandGuide: string): string {
  return linkedin_prompt.replace('<topic>', topic).replace('<referencepost>', referencePost).replace('<brandguide>', brandGuide);
}   