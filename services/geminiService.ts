import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure this is set in your environment
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const createChatSession = (): Chat | null => {
  if (!ai) {
    console.warn("Gemini API Key not found. AI features will be disabled.");
    return null;
  }

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are Savora, a friendly and knowledgeable financial assistant for a savings app. 
      Your goal is to help users manage their money better, understand "Susu" (savings groups), and reach their financial goals.
      Keep your advice practical, encouraging, and concise (under 100 words unless asked for more details).
      Use emojis occasionally to be friendly.
      The currency is primarily Cedis (GHS) or Dollars ($).`,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  try {
    return await chat.sendMessageStream({ message });
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};
