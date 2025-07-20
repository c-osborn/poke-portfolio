'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import CardGrid from '@/components/CardGrid';
import EditCardModal from '@/components/EditCardModal';
import PortfolioSummary from '@/components/PortfolioSummary';
import Toast from '@/components/Toast';
import Pagination from '@/components/Pagination';
import SearchResultsHeader from '@/components/SearchResultsHeader';
import SearchSuggestions from '@/components/SearchSuggestions';
import { PokemonCard, PortfolioCard } from '@/types';

interface SearchFilters {
  name?: string;
  set?: string;
  rarity?: string;
  type?: string;
  supertype?: string;
  number?: string;
  artist?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'portfolio'>('search');
  const [searchResults, setSearchResults] = useState<PokemonCard[]>([]);
  const [portfolioCards, setPortfolioCards] = useState<PortfolioCard[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [editingCard, setEditingCard] = useState<PortfolioCard | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [currentSearch, setCurrentSearch] = useState<{ query: string; filters: SearchFilters }>({ query: '', filters: {} });
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

  const handleUpdatePrices = async () => {
    try {
      const response = await fetch('/api/portfolio/update-prices', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        showToast(result.message, 'success');
        // Reload portfolio to show updated prices
        await loadPortfolio();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update prices', 'error');
      }
    } catch (error) {
      console.error('Error updating prices:', error);
      showToast('Failed to update prices', 'error');
    }
  };

  const handleSearch = async (query: string, filters: SearchFilters = {}, page: number = 1, sort: string = sortBy) => {
    setIsSearching(true);
    setCurrentPage(page);
    setCurrentSearch({ query, filters });
    setSortBy(sort);
    
    try {
      // Build URL with query parameters
      const params = new URLSearchParams();
      if (query.trim()) {
        params.append('q', query.trim());
      }
      
      // Add filters to URL params
      Object.entries(filters).forEach(([key, value]) => {
        if (value?.trim()) {
          params.append(key, value.trim());
        }
      });
      
      // Add pagination and sorting
      params.append('page', page.toString());
      params.append('pageSize', '20');
      params.append('orderBy', sort);
      
      const response = await fetch(`/api/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data || []);
        
        // Calculate total pages and count
        const total = data.totalCount || data.data?.length || 0;
        setTotalCount(total);
        setTotalPages(Math.ceil(total / 20));
      } else {
        console.error('Search failed');
        setSearchResults([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error searching cards:', error);
      setSearchResults([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (page: number) => {
    handleSearch(currentSearch.query, currentSearch.filters, page, sortBy);
  };

  const handleSortChange = (newSortBy: string) => {
    handleSearch(currentSearch.query, currentSearch.filters, 1, newSortBy);
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

  const handleReset = () => {
    setSearchResults([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalCount(0);
    setSortBy('name');
    setCurrentSearch({ query: '', filters: {} });
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Parse the suggestion to determine if it's a filter or name search
    if (suggestion.includes(':')) {
      // It's a filter, parse it
      const [filterType, filterValue] = suggestion.split(':');
      const filters: SearchFilters = {};
      
      switch (filterType) {
        case 'set':
          filters.set = filterValue;
          break;
        case 'supertype':
          filters.supertype = filterValue;
          break;
        case 'rarity':
          filters.rarity = filterValue;
          break;
        case 'number':
          filters.number = filterValue;
          break;
        default:
          break;
      }
      
      handleSearch('', filters);
    } else {
      // It's a name search
      handleSearch(suggestion);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} onReset={handleReset} />
      
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
            
            {searchResults.length === 0 && !isSearching && (
              <div className="mt-12">
                <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div>
                <SearchResultsHeader
                  resultCount={searchResults.length}
                  totalCount={totalCount}
                  currentPage={currentPage}
                  pageSize={20}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  isLoading={isSearching}
                />
                <CardGrid
                  cards={searchResults}
                  onAddToPortfolio={handleAddToPortfolio}
                  isLoading={isSearching}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
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
              <PortfolioSummary 
                cards={portfolioCards} 
                onUpdatePrices={handleUpdatePrices}
              />
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
