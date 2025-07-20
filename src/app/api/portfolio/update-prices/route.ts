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

        let updatedCount = 0;
        let errorCount = 0;

        // Update each card's price
        for (const card of cards) {
          try {
            // Fetch latest price from Pokémon TCG API
            const apiUrl = `https://api.pokemontcg.io/v2/cards/${card.card_id}`;
            const response = await fetch(apiUrl, {
              headers: {
                'X-Api-Key': process.env.POKEMON_TCG_API_KEY || '',
              },
            });

            if (response.ok) {
              const data = await response.json();
              const newPrice = data.data?.cardmarket?.prices?.averageSellPrice || card.price;

              // Update the price in database
              await new Promise<void>((resolveUpdate, rejectUpdate) => {
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
            } else {
              console.error(`Failed to fetch price for card ${card.card_id}:`, response.status);
              errorCount++;
            }

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`Error updating price for card ${card.card_id}:`, error);
            errorCount++;
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