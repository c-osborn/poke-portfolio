import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { PortfolioCard } from '@/types';

export async function POST() {
  try {
    const db = await getDatabase();
    
    return new Promise((resolve) => {
      // Get all cards from portfolio
      db.all('SELECT * FROM portfolio_cards', async (err, cards: PortfolioCard[]) => {
        if (err) {
          console.error('Error fetching portfolio cards:', err);
          resolve(NextResponse.json(
            { error: 'Failed to fetch portfolio cards' },
            { status: 500 }
          ));
          return;
        }

        if (cards.length === 0) {
          resolve(NextResponse.json({
            success: true,
            updatedCount: 0,
            errorCount: 0,
            totalCards: 0,
            message: 'No cards in portfolio to update'
          }));
          return;
        }

        let updatedCount = 0;
        let errorCount = 0;

        // Group cards by name to batch requests
        const cardsByName = new Map<string, PortfolioCard[]>();
        cards.forEach(card => {
          if (!cardsByName.has(card.name)) {
            cardsByName.set(card.name, []);
          }
          cardsByName.get(card.name)!.push(card);
        });

        // Update prices in batches
        const batchSize = 10; // Process 10 cards at a time
        const cardNames = Array.from(cardsByName.keys());
        
        for (let i = 0; i < cardNames.length; i += batchSize) {
          const batch = cardNames.slice(i, i + batchSize);
          
          try {
            // Create a search query for this batch of cards
            const searchQuery = batch.map(name => `name:"${name}"`).join(' OR ');
            
            // Fetch latest prices from Pokémon TCG API for this batch
            const apiUrl = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(searchQuery)}&pageSize=250`;
            const response = await fetch(apiUrl, {
              headers: {
                'X-Api-Key': process.env.POKEMON_TCG_API_KEY || '',
              },
            });

            if (response.ok) {
              const data = await response.json();
              const apiCards = data.data || [];

              // Create a map of card names to their latest prices
              const priceMap = new Map<string, number>();
              apiCards.forEach((apiCard: any) => {
                const price = apiCard.cardmarket?.prices?.averageSellPrice;
                if (price && price > 0) {
                  priceMap.set(apiCard.name, price);
                }
              });

              // Update prices for cards in this batch
              for (const cardName of batch) {
                const newPrice = priceMap.get(cardName);
                if (newPrice !== undefined) {
                  const cardsToUpdate = cardsByName.get(cardName) || [];
                  
                  for (const card of cardsToUpdate) {
                    await new Promise<void>((resolveUpdate) => {
                      db.run(
                        'UPDATE portfolio_cards SET price = ? WHERE card_id = ?',
                        [newPrice, card.card_id],
                        (updateErr) => {
                          if (updateErr) {
                            console.error('Error updating card price:', updateErr);
                            errorCount++;
                          } else {
                            updatedCount++;
                          }
                          resolveUpdate();
                        }
                      );
                    });
                  }
                } else {
                  // If no price found, count as error
                  const cardsToUpdate = cardsByName.get(cardName) || [];
                  errorCount += cardsToUpdate.length;
                }
              }
            } else {
              console.error(`Failed to fetch prices for batch ${i / batchSize + 1}:`, response.status);
              errorCount += batch.length;
            }

            // Add a small delay between batches to avoid rate limiting
            if (i + batchSize < cardNames.length) {
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          } catch (error) {
            console.error(`Error updating batch ${i / batchSize + 1}:`, error);
            errorCount += batch.length;
          }
        }

        resolve(NextResponse.json({
          success: true,
          updatedCount,
          errorCount,
          totalCards: cards.length,
          message: `Updated ${updatedCount} cards successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`
        }));
      });
    });
  } catch (error) {
    console.error('Error updating portfolio prices:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio prices' },
      { status: 500 }
    );
  }
} 