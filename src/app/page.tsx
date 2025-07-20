'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import CardGrid from '@/components/CardGrid';
import EditCardModal from '@/components/EditCardModal';
import PortfolioSummary from '@/components/PortfolioSummary';
import Toast from '@/components/Toast';
import { PokemonCard, PortfolioCard } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'portfolio'>('search');
  const [searchResults, setSearchResults] = useState<PokemonCard[]>([]);
  const [portfolioCards, setPortfolioCards] = useState<PortfolioCard[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [editingCard, setEditingCard] = useState<PortfolioCard | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
  }>({
    message: '',
    isVisible: false,
    type: 'success'
  });

  // Load portfolio cards on component mount
  useEffect(() => {
    loadPortfolio();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      message,
      isVisible: true,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const loadPortfolio = async () => {
    setIsLoadingPortfolio(true);
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const cards = await response.json();
        setPortfolioCards(cards);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data || []);
      } else {
        console.error('Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching cards:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToPortfolio = async (card: PokemonCard) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: card.id,
          name: card.name,
          image_url: card.images.small,
          set_name: card.set.name,
          rarity: card.rarity || '',
          price: card.cardmarket?.prices?.averageSellPrice || 0,
        }),
      });

      if (response.ok) {
        // Show success toast
        showToast(`Added ${card.name} to your portfolio! 🎉`, 'success');
        // Reload portfolio to show updated data
        await loadPortfolio();
      } else {
        showToast('Failed to add card to portfolio', 'error');
      }
    } catch (error) {
      console.error('Error adding card to portfolio:', error);
      showToast('Failed to add card to portfolio', 'error');
    }
  };

  const handleRemoveFromPortfolio = async (cardId: string) => {
    try {
      // Find the card name before deleting for the toast message
      const cardToDelete = portfolioCards.find(card => card.card_id === cardId);
      const cardName = cardToDelete?.name || 'Card';

      const response = await fetch(`/api/portfolio?card_id=${cardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Show success toast
        showToast(`Removed ${cardName} from your portfolio! 🗑️`, 'success');
        // Reload portfolio to show updated data
        await loadPortfolio();
      } else {
        showToast('Failed to remove card from portfolio', 'error');
      }
    } catch (error) {
      console.error('Error removing card from portfolio:', error);
      showToast('Failed to remove card from portfolio', 'error');
    }
  };

  const handleEditCard = (card: PortfolioCard) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  const handleSaveCard = async (cardId: string, updates: { quantity: number; price: number }) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: cardId,
          quantity: updates.quantity,
          price: updates.price,
        }),
      });

      if (response.ok) {
        showToast('Card updated successfully! ✨', 'success');
        // Reload portfolio to show updated data
        await loadPortfolio();
      } else {
        showToast('Failed to update card', 'error');
      }
    } catch (error) {
      console.error('Error updating card:', error);
      showToast('Failed to update card', 'error');
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Search Pokémon Cards
              </h2>
              <p className="text-gray-600 mb-8">
                Find and add your favorite Pokémon cards to your portfolio
              </p>
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </div>
            
            {searchResults.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Search Results ({searchResults.length})
                </h3>
                <CardGrid
                  cards={searchResults}
                  onAddToPortfolio={handleAddToPortfolio}
                  isLoading={isSearching}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                My Portfolio
              </h2>
              <p className="text-gray-600 mb-8">
                Your collection of Pokémon cards
              </p>
            </div>
            
            {portfolioCards.length > 0 && (
              <PortfolioSummary cards={portfolioCards} />
            )}
            
            <CardGrid
              cards={portfolioCards}
              onRemoveFromPortfolio={handleRemoveFromPortfolio}
              onEditCard={handleEditCard}
              isPortfolio={true}
              isLoading={isLoadingPortfolio}
            />
          </div>
        )}
      </main>

      <EditCardModal
        card={editingCard}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleSaveCard}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
      />
    </div>
  );
}
