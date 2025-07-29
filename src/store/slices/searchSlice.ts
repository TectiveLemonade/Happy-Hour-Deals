import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Types
export interface SearchFilters {
  categories: string[];
  priceLevel: number[];
  rating: number | null;
  openNow: boolean;
  hasHappyHour: boolean;
  distance: number; // in miles
}

export interface SearchLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
}

export interface SearchState {
  // Current search parameters
  query: string;
  location: SearchLocation | null;
  radius: number; // in miles
  filters: SearchFilters;
  sortBy: 'distance' | 'rating' | 'review_count' | 'best_match';
  
  // Search history
  recentSearches: Array<{
    id: string;
    query: string;
    location: SearchLocation;
    timestamp: string;
  }>;
  
  // Popular searches
  popularSearches: Array<{
    query: string;
    count: number;
  }>;
  
  // UI state
  isSearchActive: boolean;
  showFilters: boolean;
  searchSuggestions: string[];
  
  // Location permissions
  locationPermission: 'granted' | 'denied' | 'not_requested';
  isLocationLoading: boolean;
}

// Initial state
const initialState: SearchState = {
  query: '',
  location: null,
  radius: 25, // Default 25 miles
  filters: {
    categories: [],
    priceLevel: [1, 2, 3, 4], // All price levels by default
    rating: null,
    openNow: true,
    hasHappyHour: false,
    distance: 50, // Max distance filter
  },
  sortBy: 'distance',
  recentSearches: [],
  popularSearches: [
    {query: 'happy hour', count: 1000},
    {query: 'craft beer', count: 850},
    {query: 'cocktails', count: 720},
    {query: 'wine bar', count: 650},
    {query: 'sports bar', count: 600},
  ],
  isSearchActive: false,
  showFilters: false,
  searchSuggestions: [],
  locationPermission: 'not_requested',
  isLocationLoading: false,
};

// Search slice
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Search query actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearchQuery: (state) => {
      state.query = '';
    },
    
    // Location actions
    setSearchLocation: (state, action: PayloadAction<SearchLocation>) => {
      state.location = action.payload;
    },
    clearSearchLocation: (state) => {
      state.location = null;
    },
    setLocationLoading: (state, action: PayloadAction<boolean>) => {
      state.isLocationLoading = action.payload;
    },
    setLocationPermission: (state, action: PayloadAction<'granted' | 'denied' | 'not_requested'>) => {
      state.locationPermission = action.payload;
    },
    
    // Radius actions
    setSearchRadius: (state, action: PayloadAction<number>) => {
      state.radius = action.payload;
    },
    
    // Filter actions
    updateFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = {...state.filters, ...action.payload};
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.filters.categories.indexOf(category);
      
      if (index > -1) {
        state.filters.categories.splice(index, 1);
      } else {
        state.filters.categories.push(category);
      }
    },
    togglePriceLevel: (state, action: PayloadAction<number>) => {
      const priceLevel = action.payload;
      const index = state.filters.priceLevel.indexOf(priceLevel);
      
      if (index > -1) {
        state.filters.priceLevel.splice(index, 1);
      } else {
        state.filters.priceLevel.push(priceLevel);
      }
    },
    
    // Sort actions
    setSortBy: (state, action: PayloadAction<SearchState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    
    // UI state actions
    setSearchActive: (state, action: PayloadAction<boolean>) => {
      state.isSearchActive = action.payload;
    },
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },
    
    // Search suggestions
    setSearchSuggestions: (state, action: PayloadAction<string[]>) => {
      state.searchSuggestions = action.payload;
    },
    clearSearchSuggestions: (state) => {
      state.searchSuggestions = [];
    },
    
    // Search history actions
    addRecentSearch: (state, action: PayloadAction<{
      query: string;
      location: SearchLocation;
    }>) => {
      const {query, location} = action.payload;
      
      // Remove existing search with same query and location
      state.recentSearches = state.recentSearches.filter(
        search => !(search.query === query && 
                    search.location.latitude === location.latitude &&
                    search.location.longitude === location.longitude)
      );
      
      // Add new search to beginning
      state.recentSearches.unshift({
        id: Date.now().toString(),
        query,
        location,
        timestamp: new Date().toISOString(),
      });
      
      // Keep only last 10 searches
      state.recentSearches = state.recentSearches.slice(0, 10);
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        search => search.id !== action.payload
      );
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    
    // Popular searches actions
    updatePopularSearches: (state, action: PayloadAction<Array<{
      query: string;
      count: number;
    }>>) => {
      state.popularSearches = action.payload;
    },
    
    // Quick actions for common searches
    setQuickSearch: (state, action: PayloadAction<{
      query: string;
      filters?: Partial<SearchFilters>;
    }>) => {
      const {query, filters} = action.payload;
      state.query = query;
      
      if (filters) {
        state.filters = {...state.filters, ...filters};
      }
    },
    
    // Preset searches
    searchNearbyHappyHour: (state) => {
      state.query = 'happy hour';
      state.filters = {
        ...initialState.filters,
        hasHappyHour: true,
        openNow: true,
      };
      state.sortBy = 'distance';
    },
    searchCraftBeer: (state) => {
      state.query = 'craft beer';
      state.filters = {
        ...initialState.filters,
        categories: ['breweries', 'beerbar'],
      };
    },
    searchCocktailBars: (state) => {
      state.query = 'cocktails';
      state.filters = {
        ...initialState.filters,
        categories: ['cocktailbars', 'wine_bars'],
        priceLevel: [2, 3, 4],
      };
    },
    searchSportsBars: (state) => {
      state.query = 'sports';
      state.filters = {
        ...initialState.filters,
        categories: ['sportsbars', 'pubs'],
      };
    },
    
    // Reset all search state
    resetSearch: (state) => {
      state.query = '';
      state.filters = initialState.filters;
      state.sortBy = 'distance';
      state.isSearchActive = false;
      state.showFilters = false;
      state.searchSuggestions = [];
    },
  },
});

// Export actions
export const {
  setSearchQuery,
  clearSearchQuery,
  setSearchLocation,
  clearSearchLocation,
  setLocationLoading,
  setLocationPermission,
  setSearchRadius,
  updateFilters,
  resetFilters,
  toggleCategory,
  togglePriceLevel,
  setSortBy,
  setSearchActive,
  toggleFilters,
  setShowFilters,
  setSearchSuggestions,
  clearSearchSuggestions,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  updatePopularSearches,
  setQuickSearch,
  searchNearbyHappyHour,
  searchCraftBeer,
  searchCocktailBars,
  searchSportsBars,
  resetSearch,
} = searchSlice.actions;

// Export reducer
export default searchSlice.reducer;