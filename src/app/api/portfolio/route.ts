import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

// GET - Retrieve all portfolio cards
export async function GET() {
  try {
    const db = await getDatabase();
    
    return new Promise((resolve) => {
      db.all('SELECT * FROM portfolio_cards ORDER BY added_at DESC', (err, cards) => {
        if (err) {
          console.error('Error fetching portfolio:', err);
          resolve(NextResponse.json(
            { error: 'Failed to fetch portfolio' },
            { status: 500 }
          ));
        } else {
          resolve(NextResponse.json(cards));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// POST - Add a card to portfolio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { card_id, name, image_url, set_name, rarity, price, quantity = 1 } = body;

    if (!card_id || !name) {
      return NextResponse.json(
        { error: 'Card ID and name are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    return new Promise((resolve) => {
      // Check if card already exists
      db.get('SELECT * FROM portfolio_cards WHERE card_id = ?', [card_id], (err, existingCard) => {
        if (err) {
          console.error('Error checking existing card:', err);
          resolve(NextResponse.json(
            { error: 'Failed to add card to portfolio' },
            { status: 500 }
          ));
          return;
        }

        if (existingCard) {
          // Update quantity if card already exists
          db.run(
            'UPDATE portfolio_cards SET quantity = quantity + ? WHERE card_id = ?',
            [quantity, card_id],
            (err) => {
              if (err) {
                console.error('Error updating card quantity:', err);
                resolve(NextResponse.json(
                  { error: 'Failed to add card to portfolio' },
                  { status: 500 }
                ));
              } else {
                resolve(NextResponse.json({ success: true }));
              }
            }
          );
        } else {
          // Insert new card
          db.run(
            'INSERT INTO portfolio_cards (card_id, name, image_url, set_name, rarity, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [card_id, name, image_url, set_name, rarity, price, quantity],
            (err) => {
              if (err) {
                console.error('Error inserting card:', err);
                resolve(NextResponse.json(
                  { error: 'Failed to add card to portfolio' },
                  { status: 500 }
                ));
              } else {
                resolve(NextResponse.json({ success: true }));
              }
            }
          );
        }
      });
    });
  } catch (error) {
    console.error('Error adding card to portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to add card to portfolio' },
      { status: 500 }
    );
  }
}

// PUT - Update a card in portfolio
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { card_id, quantity, price } = body;

    if (!card_id || quantity === undefined || price === undefined) {
      return NextResponse.json(
        { error: 'Card ID, quantity, and price are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    return new Promise((resolve) => {
      db.run(
        'UPDATE portfolio_cards SET quantity = ?, price = ? WHERE card_id = ?',
        [quantity, price, card_id],
        function(err) {
          if (err) {
            console.error('Error updating card:', err);
            resolve(NextResponse.json(
              { error: 'Failed to update card' },
              { status: 500 }
            ));
          } else if (this.changes === 0) {
            resolve(NextResponse.json(
              { error: 'Card not found' },
              { status: 404 }
            ));
          } else {
            resolve(NextResponse.json({ success: true }));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a card from portfolio
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('card_id');

    if (!cardId) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    return new Promise((resolve) => {
      db.run('DELETE FROM portfolio_cards WHERE card_id = ?', [cardId], (err) => {
        if (err) {
          console.error('Error removing card from portfolio:', err);
          resolve(NextResponse.json(
            { error: 'Failed to remove card from portfolio' },
            { status: 500 }
          ));
        } else {
          resolve(NextResponse.json({ success: true }));
        }
      });
    });
  } catch (error) {
    console.error('Error removing card from portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to remove card from portfolio' },
      { status: 500 }
    );
  }
} 