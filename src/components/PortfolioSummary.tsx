'use client';

import { PortfolioCard } from '@/types';
import { DollarSign, Package } from 'lucide-react';

interface PortfolioSummaryProps {
  cards: PortfolioCard[];
}

export default function PortfolioSummary({ cards }: PortfolioSummaryProps) {
  const totalValue = cards.reduce((sum, card) => {
    return sum + (card.price * card.quantity);
  }, 0);

  const totalCards = cards.reduce((sum, card) => {
    return sum + card.quantity;
  }, 0);

  const uniqueCards = cards.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Summary</h3>
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