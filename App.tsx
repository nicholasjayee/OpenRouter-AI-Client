import React, { useState, useEffect } from 'react';
import { UserSettings } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatInterface } from './components/ChatInterface';

const STORAGE_KEY = 'openai_app_settings';

const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check local storage for existing session on mount
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsInitialized(true);
  }, []);

  const handleLogin = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  const handleLogout = () => {
    setSettings(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <div className="antialiased text-slate-50">
      {!settings ? (
        <WelcomeScreen onComplete={handleLogin} />
      ) : (
        <ChatInterface settings={settings} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
