import React, { useState, useRef, useEffect } from 'react';
import { Message, UserSettings } from '../types';
import { sendMessageToAI } from '../services/openaiService';
import { Button } from './Button';
import { Send, User, Bot, LogOut, Trash2, AlertCircle, Database, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PROFILE_JSON, DATABASE_JSON } from '../data/mockData';

interface ChatInterfaceProps {
  settings: UserSettings;
  onLogout: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ settings, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${settings.name}! I am ${PROFILE_JSON.identity}. I have access to the company database. Ask me about project statistics, budgets, or deadlines.`,
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, error]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    setError(null);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // 1. Construct the System Prompt from JSON files
      const systemContext = `
        You are acting as: ${PROFILE_JSON.identity}.
        Tone: ${PROFILE_JSON.tone}
        Instructions: ${PROFILE_JSON.instructions}
        
        DATA SOURCE (Database JSON):
        ${JSON.stringify(DATABASE_JSON)}
        
        IMPORTANT: Only answer questions based on the data above. If asked about something not in the database, say you don't have that information.
      `;

      // 2. Prepare conversation history
      const conversationHistory = messages.slice(-10).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
      
      // 3. Add User message
      conversationHistory.push({ role: 'user', content: userText });

      // 4. Prepend System Context (Hidden from UI, sent to API)
      const fullPayload = [
        { role: 'system' as const, content: systemContext },
        ...conversationHistory
      ];

      const response = await sendMessageToAI(settings, fullPayload);

      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        usage: response.usage, // Store usage stats
      };

      setMessages((prev) => [...prev, newAiMessage]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center relative">
            <Bot className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-slate-900" title="Database Connected">
              <Database className="w-3 h-3 text-slate-900" />
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-white">Project Analyst AI</h1>
            <p className="text-xs text-slate-400">Connected to {DATABASE_JSON.company_name} DB</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleClear} title="Clear Chat" className="p-2">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="danger" onClick={onLogout} title="Sign Out" className="p-2">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {messages.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
             <Bot className="w-16 h-16 mb-4" />
             <p>Analyzing database...</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                  msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                       <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>

              {/* Token Usage Footer */}
              {msg.usage && (
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-mono opacity-70 px-12">
                  <Cpu className="w-3 h-3" />
                  <span>{msg.usage.total_tokens} tokens</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="flex gap-3 max-w-[70%]">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center mt-1">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center my-4">
             <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
             </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about project statuses, budget vs spent, etc..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pr-12"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-0 disabled:pointer-events-none transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center mt-2 flex justify-center items-center gap-2">
           <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
              Context: {DATABASE_JSON.projects.length} Projects Loaded
           </p>
           <span className="text-slate-700">•</span>
           <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
              Powered by OpenRouter
           </p>
        </div>
      </div>
    </div>
  );
};
