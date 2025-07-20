import sqlite3 from 'sqlite3';

let db: sqlite3.Database | null = null;

export async function getDatabase(): Promise<sqlite3.Database> {
  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    db = new sqlite3.Database('./pokemon_portfolio.db', (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create tables if they don't exist
      db!.exec(`
        CREATE TABLE IF NOT EXISTS portfolio_cards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          card_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          image_url TEXT,
          set_name TEXT,
          rarity TEXT,
          price REAL,
          quantity INTEGER DEFAULT 1,
          added_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }

        db!.exec(`
          CREATE TABLE IF NOT EXISTS search_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            results_count INTEGER,
            searched_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(db!);
        });
      });
    });
  });
}

export async function closeDatabase() {
  if (db) {
    return new Promise<void>((resolve, reject) => {
      db!.close((err) => {
        if (err) {
          reject(err);
        } else {
          db = null;
          resolve();
        }
      });
    });
  }
} 