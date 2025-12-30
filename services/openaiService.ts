import OpenAI from 'openai';
import { UserSettings, TokenUsage } from '../types';
import { APP_NAME, APP_URL, DEFAULT_MODEL } from '../constants';

interface AIResponse {
  content: string;
  usage?: TokenUsage;
}

// We create a new client instance for each request to ensure we use the latest settings
export const sendMessageToAI = async (
  settings: UserSettings,
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
): Promise<AIResponse> => {
  try {
    const openai = new OpenAI({
      baseURL: settings.baseURL,
      apiKey: settings.apiKey,
      dangerouslyAllowBrowser: true, 
      defaultHeaders: {
        'HTTP-Referer': APP_URL,
        'X-Title': settings.name || APP_NAME,
      },
    });

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: messages,
      max_tokens: 1000, 
    });

    const choice = completion.choices[0];
    
    return {
      content: choice?.message?.content || "No response received.",
      usage: completion.usage ? {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens
      } : undefined
    };

  } catch (error: any) {
    console.error("AI Service Error:", error);
    
    if (error.status === 401) {
      throw new Error("Invalid API Key. Please check your credentials.");
    }
    
    if (error.status === 402) {
      throw new Error("Insufficient credits. Your account balance is too low for this request.");
    }

    const apiMessage = error.error?.message || error.message;
    throw new Error(apiMessage || "Failed to connect to the AI provider.");
  }
};
