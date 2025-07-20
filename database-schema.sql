-- Pokémon Portfolio Database Schema
-- This file documents the database structure for the Pokémon Portfolio app

-- Portfolio Cards Table
-- Stores all cards in the user's portfolio
CREATE TABLE IF NOT EXISTS portfolio_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id TEXT UNIQUE NOT NULL,           -- Unique identifier from Pokémon TCG API
  name TEXT NOT NULL,                     -- Card name
  image_url TEXT,                         -- URL to card image
  set_name TEXT,                          -- Card set name
  rarity TEXT,                            -- Card rarity
  price REAL,                             -- Card price in USD
  quantity INTEGER DEFAULT 1,             -- Number of copies owned
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- When card was added to portfolio
);

-- Search History Table
-- Tracks search queries for analytics
CREATE TABLE IF NOT EXISTS search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,                    -- Search query
  results_count INTEGER,                  -- Number of results found
  searched_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- When search was performed
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_card_id ON portfolio_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_added_at ON portfolio_cards(added_at);
CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON search_history(searched_at); 