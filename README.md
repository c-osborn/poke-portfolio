# Pokémon Portfolio Tracker

A Next.js application that allows you to search for Pokémon cards using the Pokémon TCG API and manage your personal card portfolio with a SQLite database.

## Features

- 🔍 Search Pokémon cards using the official Pokémon TCG API
- 📦 Add cards to your personal portfolio
- 🗂️ View and manage your card collection
- 💾 Persistent storage using SQLite database
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast and modern UI with Next.js 15
- 💰 Track portfolio value with real-time price updates

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Pokémon TCG API key (free from [dev.pokemontcg.io](https://dev.pokemontcg.io/))

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/c-osborn/poke-portfolio.git
   cd poke-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get your API key**
   - Visit [dev.pokemontcg.io](https://dev.pokemontcg.io/)
   - Sign up for a free account
   - Generate an API key

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your API key:
   ```
   POKEMON_TCG_API_KEY=your_actual_api_key_here
   ```

5. **Database Setup**
   - The database will be automatically created when you first run the app
   - Database file: `pokemon_portfolio.db` (created in project root)
   - Schema is defined in `database-schema.sql`


6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Searching for Cards
1. Click on the "Search Cards" tab
2. Enter a Pokémon name in the search bar
3. Browse through the search results
4. Click the green "+" button to add cards to your portfolio

### Managing Your Portfolio
1. Click on the "My Portfolio" tab
2. View all cards in your collection
3. See card quantities, prices, and details
4. Click the red trash icon to remove cards
5. Click the blue edit icon to modify quantities and prices
6. Use "Update Values" to fetch latest market prices

## API Endpoints

- `GET /api/search?q=<query>` - Search for Pokémon cards
- `GET /api/portfolio` - Get all portfolio cards
- `POST /api/portfolio` - Add a card to portfolio
- `PUT /api/portfolio` - Update a card in portfolio
- `DELETE /api/portfolio?card_id=<id>` - Remove a card from portfolio
- `POST /api/portfolio/update-prices` - Update all card prices from API
- `GET /api/history` - Get search history

## Database Schema

### Portfolio Cards Table
- `id` - Primary key
- `card_id` - Unique card identifier from API
- `name` - Card name
- `image_url` - Card image URL
- `set_name` - Card set name
- `rarity` - Card rarity
- `price` - Card price
- `quantity` - Number of copies owned
- `added_at` - Timestamp when added

### Search History Table
- `id` - Primary key
- `query` - Search query
- `results_count` - Number of results found
- `searched_at` - Timestamp of search

## Technologies Used

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite3
- **Icons**: Lucide React
- **API**: Pokémon TCG API

## Development

### Project Structure
```
src/
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main page
├── components/        # React components
├── lib/              # Database utilities
└── types/            # TypeScript definitions
```

### Database Management
- **Local Development**: Database is automatically created on first run
- **Production**: Consider using a more robust database like PostgreSQL
- **Backup**: Regularly backup your `pokemon_portfolio.db` file
- **Migration**: Use `database-schema.sql` for reference when setting up new instances

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Pokémon TCG API](https://dev.pokemontcg.io/) for providing the card data
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling utilities
