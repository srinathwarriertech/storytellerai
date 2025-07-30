import { ChatGroq } from '@langchain/groq';
// import { ChatAnthropic } from '@langchain/anthropic';

export const createGroqClient = () => {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "mistral-saba-24b",
    temperature: 0.7,
  });
};

// export const createAnthropicClient = () => {
//   return new ChatAnthropic({
//     apiKey: process.env.ANTHROPIC_API_KEY,
//     modelName: 'claude-3-opus-20240229',
//     temperature: 0.7,
//     maxTokens: 4000,
//   });
// };
