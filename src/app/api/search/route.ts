import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '20';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Search Pokémon cards using the Pokémon TCG API
    const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(query)}"&page=${page}&pageSize=${pageSize}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'X-Api-Key': process.env.POKEMON_TCG_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Pokémon TCG API error: ${response.status}`);
    }

    const data = await response.json();

    // Save search to history
    const db = await getDatabase();
    
    return new Promise((resolve) => {
      db.run(
        'INSERT INTO search_history (query, results_count) VALUES (?, ?)',
        [query, data.data?.length || 0],
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