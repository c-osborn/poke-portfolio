'use client';

import { ChevronDown } from 'lucide-react';

interface SearchResultsHeaderProps {
  resultCount: number;
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  isLoading?: boolean;
}

export default function SearchResultsHeader({
  resultCount,
  totalCount,
  currentPage,
  pageSize,
  sortBy,
  onSortChange,
  isLoading = false
}: SearchResultsHeaderProps) {
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount || resultCount);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h3 className="text-xl font-semibold text-theme-primary">
          Search Results
        </h3>
        {!isLoading && (
          <p className="text-sm text-theme-secondary mt-1">
            Showing {startIndex}-{endIndex} of {totalCount || resultCount} cards
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm font-medium text-theme-secondary">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              disabled={isLoading}
              className="appearance-none bg-theme-input border border-theme-input rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent disabled:opacity-50 text-theme-primary theme-transition"
            >
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="set.name">Set (A-Z)</option>
              <option value="-set.name">Set (Z-A)</option>
              <option value="cardmarket.prices.averageSellPrice">Price (Low to High)</option>
              <option value="-cardmarket.prices.averageSellPrice">Price (High to Low)</option>
              <option value="rarity">Rarity</option>
              <option value="-rarity">Rarity (Reverse)</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-muted pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
} 