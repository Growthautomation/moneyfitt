import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import OpenAI from "openai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to call GPT-4
export async function callGPT4(prompt: string, systemPrompt: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
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
