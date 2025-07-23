'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading = false 
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="flex items-center px-3 py-2 text-sm font-medium text-theme-secondary bg-theme-card border border-theme-border rounded-md hover:bg-theme-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors theme-transition"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...' || isLoading}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors theme-transition ${
            page === currentPage
              ? 'bg-theme-primary text-white'
              : page === '...'
              ? 'text-theme-muted cursor-default'
              : 'text-theme-primary bg-theme-card border border-theme-border hover:bg-theme-card'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="flex items-center px-3 py-2 text-sm font-medium text-theme-secondary bg-theme-card border border-theme-border rounded-md hover:bg-theme-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors theme-transition"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
} 