'use client';

import { Search, Briefcase } from 'lucide-react';
import Logo from './Logo';

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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo onClick={handleTitleClick} />
          </div>
          <div className="flex space-x-8">
            <button
              onClick={() => onTabChange('search')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'search'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Cards
            </button>
            <button
              onClick={() => onTabChange('portfolio')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              My Portfolio
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 