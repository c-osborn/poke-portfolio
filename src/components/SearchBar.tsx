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
            className="w-full px-4 py-3 pl-12 pr-24 text-lg border border-theme-input rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent text-theme-primary placeholder-theme-muted bg-theme-input theme-transition"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-muted w-5 h-5" />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md transition-colors theme-transition ${
                showFilters 
                  ? 'bg-theme-primary text-white' 
                  : 'bg-theme-card text-theme-secondary hover:text-theme-primary hover:bg-theme-card'
              }`}
              title="Advanced filters"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={isLoading || !hasActiveFilters}
              className="bg-theme-primary text-white px-4 py-1 rounded-md hover:bg-theme-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors theme-transition"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {showFilters && (
        <div className="bg-theme-card border border-theme-border rounded-lg p-6 shadow-theme theme-transition">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-theme-primary">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-theme-secondary hover:text-theme-primary transition-colors theme-transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">Set</label>
              <input
                type="text"
                value={filters.set || ''}
                onChange={(e) => updateFilter('set', e.target.value)}
                placeholder="e.g., Base Set, Jungle"
                className="w-full px-3 py-2 border border-theme-input rounded-md focus:ring-2 focus:ring-theme-primary focus:border-transparent text-theme-primary placeholder-theme-muted bg-theme-input theme-transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">Rarity</label>
              <input
                type="text"
                value={filters.rarity || ''}
                onChange={(e) => updateFilter('rarity', e.target.value)}
                placeholder="e.g., Common, Rare, Holo"
                className="w-full px-3 py-2 border border-theme-input rounded-md focus:ring-2 focus:ring-theme-primary focus:border-transparent text-theme-primary placeholder-theme-muted bg-theme-input theme-transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">Type</label>
              <input
                type="text"
                value={filters.type || ''}
                onChange={(e) => updateFilter('type', e.target.value)}
                placeholder="e.g., Fire, Water, Grass"
                className="w-full px-3 py-2 border border-theme-input rounded-md focus:ring-2 focus:ring-theme-primary focus:border-transparent text-theme-primary placeholder-theme-muted bg-theme-input theme-transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">Supertype</label>
              <input
                type="text"
                value={filters.supertype || ''}
                onChange={(e) => updateFilter('supertype', e.target.value)}
                placeholder="e.g., Pokémon, Trainer, Energy"
                className="w-full px-3 py-2 border border-theme-input rounded-md focus:ring-2 focus:ring-theme-primary focus:border-transparent text-theme-primary placeholder-theme-muted bg-theme-input theme-transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">Card Number</label>
              <input
                type="text"
                value={filters.number || ''}
                onChange={(e) => updateFilter('number', e.target.value)}
                placeholder="e.g., 1, 25, 100"
                className="w-full px-3 py-2 border border-theme-input rounded-md focus:ring-2 focus:ring-theme-primary focus:border-transparent text-theme-primary placeholder-theme-muted bg-theme-input theme-transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">Artist</label>
              <input
                type="text"
                value={filters.artist || ''}
                onChange={(e) => updateFilter('artist', e.target.value)}
                placeholder="e.g., Ken Sugimori"
                className="w-full px-3 py-2 border border-theme-input rounded-md focus:ring-2 focus:ring-theme-primary focus:border-transparent text-theme-primary placeholder-theme-muted bg-theme-input theme-transition"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors theme-transition"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => onSearch(query, filters)}
              disabled={isLoading}
              className="bg-theme-primary text-white px-4 py-2 rounded-md hover:bg-theme-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors theme-transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 