import React, { useState } from 'react';
import { UserSettings } from '../types';
import { DEFAULT_BASE_URL } from '../constants';
import { Input } from './Input';
import { Button } from './Button';
import { Sparkles, Key, Link as LinkIcon, User } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (settings: UserSettings) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseURL, setBaseURL] = useState(DEFAULT_BASE_URL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && apiKey.trim()) {
      onComplete({
        name: name.trim(),
        apiKey: apiKey.trim(),
        baseURL: baseURL.trim() || DEFAULT_BASE_URL,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Welcome
          </h1>
          <p className="text-slate-400 mt-2">
            Configure your AI assistant credentials to begin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-10 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <Input
                label="Your Name"
                placeholder="e.g. Alice"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10"
              />
            </div>

            <div className="relative group">
              <Key className="absolute left-3 top-10 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <Input
                label="API Key"
                placeholder="sk-or-..."
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                className="pl-10"
              />
            </div>

            <div className="relative group">
              <LinkIcon className="absolute left-3 top-10 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <Input
                label="Base URL (Optional)"
                placeholder={DEFAULT_BASE_URL}
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-3 text-lg">
            Connect & Continue
          </Button>
          
          <p className="text-xs text-center text-slate-500">
            Your credentials are stored locally in your browser and used directly with the API.
          </p>
        </form>
      </div>
    </div>
  );
};
