'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PortfolioCard } from '@/types';

interface EditCardModalProps {
  card: PortfolioCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardId: string, updates: { quantity: number; price: number }) => void;
}

export default function EditCardModal({ card, isOpen, onClose, onSave }: EditCardModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setQuantity(card.quantity);
      setPrice(card.price || 0);
    }
  }, [card]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;

    setIsLoading(true);
    try {
      await onSave(card.card_id, { quantity, price });
      onClose();
    } catch (error) {
      console.error('Error updating card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-theme-card border border-theme-border rounded-lg p-6 w-full max-w-md mx-4 shadow-theme-lg theme-transition">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-theme-primary">Edit Card</h2>
          <button
            onClick={onClose}
            className="text-theme-secondary hover:text-theme-primary transition-colors theme-transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={card.image_url}
              alt={card.name}
              className="w-16 h-16 object-cover rounded border border-theme-border"
            />
            <div>
              <h3 className="font-semibold text-theme-primary">{card.name}</h3>
              <p className="text-sm text-theme-secondary">{card.set_name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-theme-secondary mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-theme-input rounded-md focus:ring-2 focus:ring-theme-primary focus:border-transparent text-theme-primary bg-theme-input theme-transition"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-theme-secondary mb-1">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-theme-input rounded-md focus:ring-2 focus:ring-theme-primary focus:border-transparent text-theme-primary bg-theme-input theme-transition"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-theme-secondary hover:text-theme-primary hover:scale-105 transition-all duration-200 theme-transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-primary-hover hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 theme-transition"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 