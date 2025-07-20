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
  
  // Add name search if provided
  if (query.trim()) {
    conditions.push(`name:"${query.trim()}"`);
  }
  
  // Add set filter
  if (filters.set?.trim()) {
    conditions.push(`set.name:"${filters.set.trim()}"`);
  }
  
  // Add rarity filter
  if (filters.rarity?.trim()) {
    conditions.push(`rarity:"${filters.rarity.trim()}"`);
  }
  
  // Add type filter
  if (filters.type?.trim()) {
    conditions.push(`types:"${filters.type.trim()}"`);
  }
  
  // Add supertype filter (Pokémon, Trainer, Energy)
  if (filters.supertype?.trim()) {
    conditions.push(`supertype:"${filters.supertype.trim()}"`);
  }
  
  // Add number filter (supports operators like >, <, >=, <=)
  if (filters.number?.trim()) {
    const numberValue = filters.number.trim();
    if (numberValue.match(/^[><=]+/)) {
      // If it starts with an operator, use as-is
      conditions.push(`number:${numberValue}`);
    } else {
      // Otherwise, search for exact number value
      conditions.push(`number:${numberValue}`);
    }
  }
  
  // Add artist filter
  if (filters.artist?.trim()) {
    conditions.push(`artist:"${filters.artist.trim()}"`);
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