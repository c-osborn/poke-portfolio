'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilters {
  name?: string;
  set?: string;
  rarity?: string;
  type?: string;
  supertype?: string;
  number?: string;
  artist?: string;
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse the query for name + number pattern
    const nameNumberPattern = /^(.+?)\s+(\d+)$/;
    const match = query.trim().match(nameNumberPattern);
    
    let searchQuery = query.trim();
    let searchFilters = { ...filters };
    
    if (match) {
      // Extract name and number from the pattern
      const [, name, number] = match;
      searchQuery = name.trim();
      searchFilters.number = number;
    }
    
    if (searchQuery || Object.keys(searchFilters).some(key => searchFilters[key as keyof SearchFilters])) {
      onSearch(searchQuery, searchFilters);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof SearchFilters]) || query.trim();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Pokémon cards by name, set, rarity, type..."
            className="w-full px-4 py-3 pl-12 pr-24 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Advanced filters"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={isLoading || !hasActiveFilters}
              className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Set</label>
              <input
                type="text"
                value={filters.set || ''}
                onChange={(e) => updateFilter('set', e.target.value)}
                placeholder="e.g., Base Set, Sword & Shield"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
              <select
                value={filters.rarity || ''}
                onChange={(e) => updateFilter('rarity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Any rarity</option>
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Rare Holo">Rare Holo</option>
                <option value="Rare Ultra">Rare Ultra</option>
                <option value="Secret Rare">Secret Rare</option>
                <option value="Promo">Promo</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Any type</option>
                <option value="Colorless">Colorless</option>
                <option value="Darkness">Darkness</option>
                <option value="Dragon">Dragon</option>
                <option value="Fairy">Fairy</option>
                <option value="Fighting">Fighting</option>
                <option value="Fire">Fire</option>
                <option value="Grass">Grass</option>
                <option value="Lightning">Lightning</option>
                <option value="Metal">Metal</option>
                <option value="Psychic">Psychic</option>
                <option value="Water">Water</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
              <select
                value={filters.supertype || ''}
                onChange={(e) => updateFilter('supertype', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Any card type</option>
                <option value="Pokémon">Pokémon</option>
                <option value="Trainer">Trainer</option>
                <option value="Energy">Energy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
              <input
                type="text"
                value={filters.number || ''}
                onChange={(e) => updateFilter('number', e.target.value)}
                placeholder="e.g., 1, 25, 150"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
              <input
                type="text"
                value={filters.artist || ''}
                onChange={(e) => updateFilter('artist', e.target.value)}
                placeholder="Artist name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => value && (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {key}: {value}
                    <button
                      onClick={() => updateFilter(key as keyof SearchFilters, '')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {query.trim() && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    name: {query}
                    <button
                      onClick={() => setQuery('')}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 