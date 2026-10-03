import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Moon, Sun, Bell, Volume2, Globe } from 'lucide-react';

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('spotify-notifications') === 'true';
  });

  const [quality, setQuality] = useState(() => {
    return localStorage.getItem('spotify-quality') || 'auto';
  });

  const toggleNotifications = () => {
    const newVal = !notifications;
    setNotifications(newVal);
    localStorage.setItem('spotify-notifications', String(newVal));
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setQuality(val);
    localStorage.setItem('spotify-quality', val);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <div className="flex flex-col gap-6">
        
        {/* Appearance */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[var(--text-primary)]">Theme</span>
                <span className="text-sm text-[var(--text-secondary)]">Toggle dark or light mode</span>
              </div>
            </div>
            
            <button 
              onClick={toggleTheme}
              className={`relative h-6 w-11 rounded-full transition-colors ${isDark ? 'bg-[var(--brand-color)]' : 'bg-[var(--border-color)]'}`}
            >
              <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </section>

        {/* Audio Quality */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Audio Quality</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                <Volume2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[var(--text-primary)]">Streaming quality</span>
                <span className="text-sm text-[var(--text-secondary)]">Higher quality uses more data</span>
              </div>
            </div>
            
            <select 
              value={quality}
              onChange={handleQualityChange}
              className="bg-[var(--bg-hover)] text-[var(--text-primary)] border-0 rounded p-2 outline-none cursor-pointer"
            >
              <option value="auto">Auto</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="very_high">Very High</option>
            </select>
          </div>
        </section>

        {/* Language */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Language</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                <Globe className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[var(--text-primary)]">App Language</span>
                <span className="text-sm text-[var(--text-secondary)]">Choose your preferred language</span>
              </div>
            </div>
            
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[var(--bg-hover)] text-[var(--text-primary)] border-0 rounded p-2 outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </section>

        {/* Notifications */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Notifications</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[var(--text-primary)]">Push Notifications</span>
                <span className="text-sm text-[var(--text-secondary)]">Receive updates about new music</span>
              </div>
            </div>
            
            <button 
              onClick={toggleNotifications}
              className={`relative h-6 w-11 rounded-full transition-colors ${notifications ? 'bg-[var(--brand-color)]' : 'bg-[var(--border-color)]'}`}
            >
              <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
