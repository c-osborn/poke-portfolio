'use client';

import { useState } from 'react';
import { PortfolioCard } from '@/types';
import { DollarSign, Package, RefreshCw } from 'lucide-react';

interface PortfolioSummaryProps {
  cards: PortfolioCard[];
  onUpdatePrices: () => Promise<void>;
}

export default function PortfolioSummary({ cards, onUpdatePrices }: PortfolioSummaryProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const totalValue = cards.reduce((sum, card) => {
    return sum + (card.price * card.quantity);
  }, 0);

  const totalCards = cards.reduce((sum, card) => {
    return sum + card.quantity;
  }, 0);

  const uniqueCards = cards.length;

  const handleUpdatePrices = async () => {
    setIsUpdating(true);
    try {
      await onUpdatePrices();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-theme-card border border-theme-border rounded-lg shadow-theme p-6 mb-8 theme-transition">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-theme-primary">Portfolio Summary</h3>
        <button
          onClick={handleUpdatePrices}
          disabled={isUpdating}
          className="flex items-center space-x-2 px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-primary-hover hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 theme-transition"
        >
          <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
          <span>{isUpdating ? 'Updating...' : 'Update Values'}</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-theme-card border border-theme-border rounded-lg theme-transition">
          <DollarSign className="w-6 h-6 text-theme-success" />
          <div>
            <p className="text-sm text-theme-secondary">Total Value</p>
            <p className="text-xl font-bold text-theme-success">
              ${totalValue.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-theme-card border border-theme-border rounded-lg theme-transition">
          <Package className="w-6 h-6 text-theme-primary" />
          <div>
            <p className="text-sm text-theme-secondary">Total Cards</p>
            <p className="text-xl font-bold text-theme-primary">
              {totalCards}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-theme-card border border-theme-border rounded-lg theme-transition">
          <Package className="w-6 h-6 text-theme-secondary" />
          <div>
            <p className="text-sm text-theme-secondary">Unique Cards</p>
            <p className="text-xl font-bold text-theme-secondary">
              {uniqueCards}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 