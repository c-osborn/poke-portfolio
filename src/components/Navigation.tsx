'use client';

import { Search, Briefcase } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

interface NavigationProps {
  activeTab: 'search' | 'portfolio';
  onTabChange: (tab: 'search' | 'portfolio') => void;
  onReset?: () => void;
}

export default function Navigation({ activeTab, onTabChange, onReset }: NavigationProps) {
  const handleTitleClick = () => {
    onTabChange('search');
    if (onReset) {
      onReset();
    }
  };

  return (
    <nav className="bg-theme-nav shadow-theme border-b border-theme-nav theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo onClick={handleTitleClick} />
          </div>
          <div className="flex items-center space-x-6">
            {/* Show only the active tab button */}
            <button
              onClick={() => onTabChange(activeTab === 'search' ? 'portfolio' : 'search')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors theme-transition bg-theme-primary text-white shadow-theme"
            >
              {activeTab === 'search' ? (
                <>
                  <Briefcase className="w-4 h-4 mr-2" />
                  My Portfolio
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Cards
                </>
              )}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
} 