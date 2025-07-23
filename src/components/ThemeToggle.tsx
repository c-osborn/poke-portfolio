'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-theme-card border border-theme-border rounded-lg p-1 shadow-theme">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
            theme === value
              ? 'bg-theme-primary text-white shadow-theme'
              : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-card'
          }`}
          title={`${label} theme`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
} 