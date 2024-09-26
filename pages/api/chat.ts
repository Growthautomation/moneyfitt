import { NextApiRequest, NextApiResponse } from 'next';
import { SYSTEM_PROMPT, GENERATE_QUESTIONS_PROMPT, GENERATE_INITIAL_QUESTIONS_PROMPT } from '../../public/lib/prompts';
import OpenAI from 'openai';

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to call GPT-4
async function callGPT4(prompt: string, systemPrompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Make sure you have access to GPT-4
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7, // Adjust as needed
      max_tokens: 500, // Adjust as needed
    });

    // Extract the generated text from the response
    const generatedText = response.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      throw new Error("No response generated");
    }

    return generatedText;
  } catch (error) {
    console.error("Error calling GPT-4:", error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { route, userData, conversationHistory } = req.body;

    try {
      let result;

      switch (route) {
        case 'mimic-advisor':
          // Route for mimicking the advisor
          result = await mimicAdvisor(userData, conversationHistory);
          break;

        case 'generate-chat-bubbles':
          // Route for generating chat bubbles
          result = await generateChatBubbles(userData, conversationHistory);
          break;

        default:
          res.status(400).json({ error: 'Invalid route' });
          return;
      }

      res.status(200).json({ result });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function mimicAdvisor(userData: any, conversationHistory: string) {
  // Implement logic to mimic the advisor using SYSTEM_PROMPT
  const prompt = `${SYSTEM_PROMPT}\n\nUser: ${conversationHistory}\nAdvisor:`;
  return await callGPT4(prompt, SYSTEM_PROMPT);
}

async function generateChatBubbles(userData: any, conversationHistory: string | null) {
  if (conversationHistory) {
    // Generate follow-up questions using GENERATE_QUESTIONS_PROMPT
    const prompt = GENERATE_QUESTIONS_PROMPT
      .replace('{{CONVERSATION}}', conversationHistory)
      .replace('{{USER}}', JSON.stringify(userData));
    return await callGPT4(prompt, '');
  } else {
    // Generate initial questions using GENERATE_INITIAL_QUESTIONS_PROMPT
    const prompt = GENERATE_INITIAL_QUESTIONS_PROMPT
      .replace('{{USER}}', JSON.stringify(userData));
    return await callGPT4(prompt, '');
  }
}
