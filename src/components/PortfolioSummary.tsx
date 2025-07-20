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
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio Summary</h3>
        <button
          onClick={handleUpdatePrices}
          disabled={isUpdating}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
          <span>{isUpdating ? 'Updating...' : 'Update Values'}</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-xl font-bold text-green-600">
              ${totalValue.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
          <Package className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Total Cards</p>
            <p className="text-xl font-bold text-blue-600">
              {totalCards}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
          <Package className="w-6 h-6 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">Unique Cards</p>
            <p className="text-xl font-bold text-purple-600">
              {uniqueCards}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 