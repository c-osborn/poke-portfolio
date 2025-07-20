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
          <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
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
            <div key={portfolioCard.card_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative bg-gray-100">
                <img
                  src={portfolioCard.image_url}
                  alt={portfolioCard.name}
                  className="w-full h-auto max-h-64 object-contain mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-card.png';
                  }}
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  x{portfolioCard.quantity}
                </div>
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  {onEditCard && (
                    <button
                      onClick={() => onEditCard(portfolioCard)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                      title="Edit card"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {onRemoveFromPortfolio && (
                    <button
                      onClick={() => onRemoveFromPortfolio(portfolioCard.card_id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Remove from portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate text-gray-900">{portfolioCard.name}</h3>
                <p className="text-gray-600 text-sm mb-1">{portfolioCard.set_name}</p>
                {portfolioCard.rarity && (
                  <p className="text-gray-500 text-xs mb-2">{portfolioCard.rarity}</p>
                )}
                {portfolioCard.price && (
                  <p className="text-green-600 font-semibold">
                    ${portfolioCard.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        } else {
          const pokemonCard = card as PokemonCard;
          return (
            <div key={pokemonCard.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative bg-gray-100">
                <img
                  src={pokemonCard.images.small}
                  alt={pokemonCard.name}
                  className="w-full h-auto max-h-64 object-contain mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-card.png';
                  }}
                />
                {onAddToPortfolio && (
                  <button
                    onClick={() => onAddToPortfolio(pokemonCard)}
                    className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                    title="Add to portfolio"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 truncate text-gray-900">{pokemonCard.name}</h3>
                <p className="text-gray-600 text-sm mb-1">{pokemonCard.set.name}</p>
                {pokemonCard.rarity && (
                  <p className="text-gray-500 text-xs mb-2">{pokemonCard.rarity}</p>
                )}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
} 