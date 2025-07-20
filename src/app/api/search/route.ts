import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

interface SearchFilters {
  name?: string;
  set?: string;
  rarity?: string;
  type?: string;
  supertype?: string;
  number?: string;
  artist?: string;
}

function buildSearchQuery(query: string, filters: SearchFilters): string {
  const conditions: string[] = [];
  
  // Parse the query for name + number pattern
  const nameNumberPattern = /^(.+?)\s+(\d+)$/;
  const match = query.trim().match(nameNumberPattern);
  
  let searchQuery = query.trim();
  let searchFilters = { ...filters };
  
  if (match) {
    // Extract name and number from the pattern
    const [, name, number] = match;
    searchQuery = name.trim();
    searchFilters.number = number;
  }
  
  // Add name search if provided
  if (searchQuery.trim()) {
    conditions.push(`name:"${searchQuery.trim()}"`);
  }
  
  // Add set filter
  if (searchFilters.set?.trim()) {
    conditions.push(`set.name:"${searchFilters.set.trim()}"`);
  }
  
  // Add rarity filter
  if (searchFilters.rarity?.trim()) {
    conditions.push(`rarity:"${searchFilters.rarity.trim()}"`);
  }
  
  // Add type filter
  if (searchFilters.type?.trim()) {
    conditions.push(`types:"${searchFilters.type.trim()}"`);
  }
  
  // Add supertype filter (Pokémon, Trainer, Energy)
  if (searchFilters.supertype?.trim()) {
    conditions.push(`supertype:"${searchFilters.supertype.trim()}"`);
  }
  
  // Add number filter (supports operators like >, <, >=, <=)
  if (searchFilters.number?.trim()) {
    const numberValue = searchFilters.number.trim();
    if (numberValue.match(/^[><=]+/)) {
      // If it starts with an operator, use as-is
      conditions.push(`number:${numberValue}`);
    } else {
      // Otherwise, search for exact number value
      conditions.push(`number:${numberValue}`);
    }
  }
  
  // Add artist filter
  if (searchFilters.artist?.trim()) {
    conditions.push(`artist:"${searchFilters.artist.trim()}"`);
  }
  
  // If no conditions, return empty string (will search all cards)
  if (conditions.length === 0) {
    return '';
  }
  
  // Join all conditions with AND operator
  return conditions.join(' AND ');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '20';
    const orderBy = searchParams.get('orderBy') || 'name';
    
    // Parse filters from search params
    const filters: SearchFilters = {
      set: searchParams.get('set') || undefined,
      rarity: searchParams.get('rarity') || undefined,
      type: searchParams.get('type') || undefined,
      supertype: searchParams.get('supertype') || undefined,
      number: searchParams.get('number') || undefined,
      artist: searchParams.get('artist') || undefined,
    };

    // Build the search query
    const searchQuery = buildSearchQuery(query, filters);
    
    // Construct API URL
    let apiUrl = `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`;
    if (searchQuery) {
      apiUrl += `&q=${encodeURIComponent(searchQuery)}`;
    }
    
    const response = await fetch(apiUrl, {
      headers: {
        'X-Api-Key': process.env.POKEMON_TCG_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Pokémon TCG API error: ${response.status}`);
    }

    const data = await response.json();

    // Save search to history with enhanced query info
    const db = await getDatabase();
    const searchDescription = searchQuery || 'All cards';
    
    return new Promise((resolve) => {
      db.run(
        'INSERT INTO search_history (query, results_count) VALUES (?, ?)',
        [searchDescription, data.data?.length || 0],
        (err) => {
          if (err) {
            console.error('Error saving search history:', err);
          }
          resolve(NextResponse.json(data));
        }
      );
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search cards' },
      { status: 500 }
    );
  }
} 