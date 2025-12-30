export interface UserSettings {
  name: string;
  apiKey: string;
  baseURL: string;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  usage?: TokenUsage; // Added field for token counting
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
