import OpenAI from "openai";

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
  
  export function parseSummaryResponse(response: string) {
    const summary = {
      quickSummary: "",
      mainPoints: [],
      servicesOffered: [],
      analysis: [],
    };
    try{
      const summaryMatch = response.match(/<summary>([\s\S]*?)<\/summary>/);
      if (summaryMatch) summary.quickSummary = summaryMatch[1].trim();
    
      const mainPointsMatch = response.match(
        /<main_points>([\s\S]*?)<\/main_points>/
      );
      if (mainPointsMatch) {
        summary.mainPoints = mainPointsMatch[1]
          .split("\n")
          .map((point) => point.trim())
          .filter((point) => point.startsWith("-"))
          .map((point) => point.slice(1).trim()) as never;
      }
    
      const servicesMatch = response.match(
        /<services_offered>([\s\S]*?)<\/services_offered>/
      );
      if (servicesMatch) {
        summary.servicesOffered = servicesMatch[1]
          .split("\n")
          .map((service) => service.trim())
          .filter((service) => service.startsWith("-"))
          .map((service) => service.slice(1).trim()) as never;
      }
    
      const analysisMatch = response.match(/<analysis>([\s\S]*?)<\/analysis>/);
      if (analysisMatch) {
        summary.analysis = analysisMatch[1]
          .split("\n")
          .map((point) => point.trim())
          .filter((point) => point.startsWith("-"))
          .map((point) => point.slice(1).trim()) as never;
      }
    
      return summary;
    } catch (e) {
      console.error("client/chat-summary/helper: Error parsing summary response", e);
      throw e;
    }
  }