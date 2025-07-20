export interface PokemonCard {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  set: {
    name: string;
    series: string;
  };
  rarity?: string;
  cardmarket?: {
    prices: {
      averageSellPrice?: number;
      lowPrice?: number;
      highPrice?: number;
    };
  };
}

export interface PortfolioCard {
  id: number;
  card_id: string;
  name: string;
  image_url: string;
  set_name: string;
  rarity: string;
  price: number;
  quantity: number;
  added_at: string;
}

export interface SearchHistory {
  id: number;
  query: string;
  results_count: number;
  searched_at: string;
}

export interface SearchResponse {
  data: PokemonCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
} 