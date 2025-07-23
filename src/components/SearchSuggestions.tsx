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
        <h4 className="text-sm font-medium text-theme-secondary mb-3">Popular Pokémon</h4>
        <div className="flex flex-wrap gap-2">
          {popularPokemon.map((pokemon) => (
            <button
              key={pokemon}
              onClick={() => onSuggestionClick(pokemon)}
              className="px-3 py-1 text-sm bg-theme-card border border-theme-border text-theme-primary rounded-full hover:bg-theme-card hover:scale-105 transition-all duration-200 theme-transition"
            >
              {pokemon}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-theme-secondary mb-3">Popular Sets</h4>
        <div className="flex flex-wrap gap-2">
          {popularSets.map((set) => (
            <button
              key={set}
              onClick={() => onSuggestionClick(`set:${set}`)}
              className="px-3 py-1 text-sm bg-theme-card border border-theme-border text-theme-primary rounded-full hover:bg-theme-card hover:scale-105 transition-all duration-200 theme-transition"
            >
              {set}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-theme-secondary mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSuggestionClick('supertype:Pokémon')}
            className="px-3 py-1 text-sm bg-theme-card border border-theme-border text-theme-primary rounded-full hover:bg-theme-card hover:scale-105 transition-all duration-200 theme-transition"
          >
            Pokémon Cards
          </button>
          <button
            onClick={() => onSuggestionClick('supertype:Trainer')}
            className="px-3 py-1 text-sm bg-theme-card border border-theme-border text-theme-primary rounded-full hover:bg-theme-card hover:scale-105 transition-all duration-200 theme-transition"
          >
            Trainer Cards
          </button>
          <button
            onClick={() => onSuggestionClick('rarity:Rare Holo')}
            className="px-3 py-1 text-sm bg-theme-card border border-theme-border text-theme-primary rounded-full hover:bg-theme-card hover:scale-105 transition-all duration-200 theme-transition"
          >
            Rare Holo
          </button>
          <button
            onClick={() => onSuggestionClick('Pikachu 25')}
            className="px-3 py-1 text-sm bg-theme-card border border-theme-border text-theme-primary rounded-full hover:bg-theme-card hover:scale-105 transition-all duration-200 theme-transition"
          >
            Pikachu #25
          </button>
          <button
            onClick={() => onSuggestionClick('Charizard 4')}
            className="px-3 py-1 text-sm bg-theme-card border border-theme-border text-theme-primary rounded-full hover:bg-theme-card hover:scale-105 transition-all duration-200 theme-transition"
          >
            Charizard #4
          </button>
        </div>
      </div>
    </div>
  );
} 