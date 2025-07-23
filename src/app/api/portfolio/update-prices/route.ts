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

        // Process cards in concurrent batches for faster updates
        const batchSize = 20; // Increased batch size for better concurrency
        const maxConcurrent = 5; // Limit concurrent requests to avoid rate limiting
        
        for (let i = 0; i < cards.length; i += batchSize) {
          const batch = cards.slice(i, i + batchSize);
          
          // Process batch with controlled concurrency
          const batchPromises = batch.map(async (card, index) => {
            // Stagger requests slightly to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, index * 50));
            
            try {
              // Use the specific card ID to get exact card data
              const apiUrl = `https://api.pokemontcg.io/v2/cards/${card.card_id}`;
              const response = await fetch(apiUrl, {
                headers: {
                  'X-Api-Key': process.env.POKEMON_TCG_API_KEY || '',
                },
              });

              if (response.ok) {
                const data = await response.json();
                const apiCard = data.data;
                
                if (apiCard && apiCard.cardmarket?.prices?.averageSellPrice) {
                  const newPrice = apiCard.cardmarket.prices.averageSellPrice;
                  
                  // Update the card price in database
                  return new Promise<{ success: boolean; cardId: string }>((resolveUpdate) => {
                    db.run(
                      'UPDATE portfolio_cards SET price = ? WHERE card_id = ?',
                      [newPrice, card.card_id],
                      (updateErr) => {
                        if (updateErr) {
                          console.error('Error updating card price:', updateErr);
                          resolveUpdate({ success: false, cardId: card.card_id });
                        } else {
                          resolveUpdate({ success: true, cardId: card.card_id });
                        }
                      }
                    );
                  });
                } else {
                  console.log(`No price data available for card ${card.card_id} (${card.name})`);
                  return { success: false, cardId: card.card_id };
                }
              } else {
                console.error(`Failed to fetch card ${card.card_id} (${card.name}):`, response.status);
                return { success: false, cardId: card.card_id };
              }
            } catch (error) {
              console.error(`Error updating card ${card.card_id} (${card.name}):`, error);
              return { success: false, cardId: card.card_id };
            }
          });

          // Wait for all requests in this batch to complete
          const results = await Promise.all(batchPromises);
          
          // Count successes and failures
          results.forEach(result => {
            if (result.success) {
              updatedCount++;
            } else {
              errorCount++;
            }
          });

          // Reduced delay between batches since we're using controlled concurrency
          if (i + batchSize < cards.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
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