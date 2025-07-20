'use client';

interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export default function SearchSuggestions({ onSuggestionClick }: SearchSuggestionsProps) {
  const popularPokemon = [
    'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 
    'Mew', 'Lugia', 'Ho-Oh', 'Rayquaza', 'Arceus'
  ];

  const popularSets = [
    'Base Set', 'Jungle', 'Fossil', 'Team Rocket', 'Gym Heroes',
    'Sword & Shield', 'Scarlet & Violet', 'Paldea Evolved'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Pokémon</h4>
        <div className="flex flex-wrap gap-2">
          {popularPokemon.map((pokemon) => (
            <button
              key={pokemon}
              onClick={() => onSuggestionClick(pokemon)}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
            >
              {pokemon}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Sets</h4>
        <div className="flex flex-wrap gap-2">
          {popularSets.map((set) => (
            <button
              key={set}
              onClick={() => onSuggestionClick(`set:${set}`)}
              className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
            >
              {set}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSuggestionClick('supertype:Pokémon')}
            className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
          >
            Pokémon Cards
          </button>
          <button
            onClick={() => onSuggestionClick('supertype:Trainer')}
            className="px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition-colors"
          >
            Trainer Cards
          </button>
          <button
            onClick={() => onSuggestionClick('rarity:Rare Holo')}
            className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded-full hover:bg-yellow-100 transition-colors"
          >
            Rare Holo
          </button>
          <button
            onClick={() => onSuggestionClick('Pikachu 25')}
            className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors"
          >
            Pikachu #25
          </button>
          <button
            onClick={() => onSuggestionClick('Charizard 4')}
            className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors"
          >
            Charizard #4
          </button>
        </div>
      </div>
    </div>
  );
} 