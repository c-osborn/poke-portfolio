'use client';

import { PokemonCard, PortfolioCard } from '@/types';
import { Plus, Trash2, Edit } from 'lucide-react';

interface CardGridProps {
  cards: PokemonCard[] | PortfolioCard[];
  onAddToPortfolio?: (card: PokemonCard) => void;
  onRemoveFromPortfolio?: (cardId: string) => void;
  onEditCard?: (card: PortfolioCard) => void;
  isPortfolio?: boolean;
  isLoading?: boolean;
}

export default function CardGrid({ 
  cards, 
  onAddToPortfolio, 
  onRemoveFromPortfolio, 
  onEditCard,
  isPortfolio = false,
  isLoading = false 
}: CardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-theme-card border border-theme-border rounded-lg h-80 animate-pulse theme-transition"></div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-theme-secondary text-lg">
          {isPortfolio ? 'No cards in your portfolio yet.' : 'No cards found. Try a different search term.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const isPortfolioCard = 'card_id' in card;
        
        if (isPortfolioCard) {
          const portfolioCard = card as PortfolioCard;
          return (
            <div key={portfolioCard.card_id} className="bg-theme-card border border-theme-border rounded-lg shadow-theme overflow-hidden hover:shadow-theme-lg transition-all duration-200 theme-transition">
              <div className="relative bg-theme-card">
                <img
                  src={portfolioCard.image_url}
                  alt={portfolioCard.name}
                  className="w-full h-auto max-h-64 object-contain mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-card.png';
                  }}
                />
                <div className="absolute top-2 right-2 bg-theme-primary text-white px-2 py-1 rounded-full text-sm font-bold hover:bg-theme-primary-hover transition-colors theme-transition">
                  x{portfolioCard.quantity}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate text-theme-primary">{portfolioCard.name}</h3>
                <p className="text-theme-secondary text-sm mb-1">{portfolioCard.set_name}</p>
                {portfolioCard.rarity && (
                  <p className="text-theme-muted text-xs mb-2">{portfolioCard.rarity}</p>
                )}
                {portfolioCard.price && (
                  <p className="text-theme-success font-semibold mb-3">
                    ${portfolioCard.price.toFixed(2)}
                  </p>
                )}
                {/* Action buttons moved to bottom */}
                <div className="flex justify-end space-x-2">
                  {onEditCard && (
                    <button
                      onClick={() => onEditCard(portfolioCard)}
                      className="bg-theme-primary text-white p-2 rounded-full hover:bg-theme-primary-hover hover:scale-105 transition-all duration-200 theme-transition"
                      title="Edit card"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {onRemoveFromPortfolio && (
                    <button
                      onClick={() => onRemoveFromPortfolio(portfolioCard.card_id)}
                      className="bg-theme-error text-white p-2 rounded-full hover:opacity-80 hover:scale-105 transition-all duration-200 theme-transition"
                      title="Remove from portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        } else {
          const searchCard = card as PokemonCard;
          return (
            <div key={searchCard.id} className="bg-theme-card border border-theme-border rounded-lg shadow-theme overflow-hidden hover:shadow-theme-lg transition-all duration-200 theme-transition">
              <div className="relative bg-theme-card">
                <img
                  src={searchCard.images?.small || searchCard.images?.large || '/placeholder-card.png'}
                  alt={searchCard.name}
                  className="w-full h-auto max-h-64 object-contain mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-card.png';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate text-theme-primary">{searchCard.name}</h3>
                <p className="text-theme-secondary text-sm mb-1">{searchCard.set?.name || 'Unknown Set'}</p>
                {searchCard.rarity && (
                  <p className="text-theme-muted text-xs mb-2">{searchCard.rarity}</p>
                )}
                {searchCard.cardmarket?.prices?.averageSellPrice && (
                  <p className="text-theme-success font-semibold mb-3">
                    ${searchCard.cardmarket.prices.averageSellPrice.toFixed(2)}
                  </p>
                )}
                {/* Add to portfolio button moved to bottom */}
                {onAddToPortfolio && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => onAddToPortfolio(searchCard)}
                      className="bg-theme-success text-white p-2 rounded-full hover:opacity-80 hover:scale-105 transition-all duration-200 theme-transition"
                      title="Add to portfolio"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
} 