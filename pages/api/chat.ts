import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { SYSTEM_PROMPT, GENERATE_QUESTIONS_PROMPT } from '@/public/lib/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messages, generatePrompts } = req.body;

    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: { sender: string; text: string }) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    if (generatePrompts) {
      const promptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          ...formattedMessages,
          { role: 'system', content: GENERATE_QUESTIONS_PROMPT }
        ],
      });

      if (promptResponse.choices[0]?.message?.content) {
        const promptSuggestions = promptResponse.choices[0].message.content
          .split('||')
          .map(question => question.trim())
          .filter(question => question !== '')
          .slice(0, 3);

        return res.status(200).json({ suggestedPrompts: promptSuggestions });
      } else {
        return res.status(500).json({ message: 'Failed to generate prompts' });
      }
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
    });

    const advisorResponse = response.choices[0].message.content;

    res.status(200).json({ message: advisorResponse });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
}
