import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

// Types
export interface Venue {
  id: string;
  name: string;
  alias?: string;
  imageUrl?: string;
  url?: string;
  rating: number;
  reviewCount: number;
  priceLevel?: number;
  latitude: number;
  longitude: number;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  displayPhone?: string;
  distance?: number;
  categories: Array<{
    alias: string;
    title: string;
  }>;
  hours?: Array<{
    day: number;
    start: string;
    end: string;
    is_overnight: boolean;
  }>;
  transactions?: string[];
  isClaimed?: boolean;
  isClosed?: boolean;
}

export interface HappyHourSpecial {
  id: number;
  venueId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  specialType: string;
  title: string;
  description?: string;
  happyHourPrice?: number;
  regularPrice?: number;
  discountPercentage?: number;
  specificItems?: string[];
  isActive: boolean;
}

export interface MenuItem {
  id: number;
  venueId: string;
  category: string;
  name: string;
  description?: string;
  imageUrl?: string;
  regularPrice?: number;
  happyHourPrice?: number;
  abv?: number;
  beerStyle?: string;
  brewery?: string;
  isAvailable: boolean;
  happyHourOnly: boolean;
}

export interface VenueState {
  searchResults: Venue[];
  selectedVenue: Venue | null;
  venueDetails: {[venueId: string]: Venue};
  happyHourSpecials: {[venueId: string]: HappyHourSpecial[]};
  menuItems: {[venueId: string]: MenuItem[]};
  favorites: string[];
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;
  lastSearchQuery: string | null;
  lastSearchLocation: {lat: number; lng: number} | null;
  lastUpdate: string | null;
}

// Initial state
const initialState: VenueState = {
  searchResults: [],
  selectedVenue: null,
  venueDetails: {},
  happyHourSpecials: {},
  menuItems: {},
  favorites: [],
  isLoading: false,
  isLoadingDetails: false,
  error: null,
  lastSearchQuery: null,
  lastSearchLocation: null,
  lastUpdate: null,
};

// Async thunks
export const searchVenues = createAsyncThunk(
  'venues/searchVenues',
  async (params: {
    latitude: number;
    longitude: number;
    radius: number;
    term?: string;
    categories?: string[];
    price?: number[];
    sortBy?: string;
    limit?: number;
  }, {rejectWithValue}) => {
    try {
      // API call would go here
      // const response = await yelpAPI.searchBusinesses(params);
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockVenues: Venue[] = [
        {
          id: 'venue-1',
          name: 'The Happy Hour Spot',
          rating: 4.5,
          reviewCount: 234,
          priceLevel: 2,
          latitude: params.latitude + 0.001,
          longitude: params.longitude + 0.001,
          address: {
            line1: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94102',
          },
          phone: '+14155551234',
          displayPhone: '(415) 555-1234',
          distance: 150,
          categories: [
            {alias: 'bars', title: 'Bars'},
            {alias: 'american', title: 'American'},
          ],
          imageUrl: 'https://example.com/venue1.jpg',
          isClaimed: true,
          isClosed: false,
        },
        {
          id: 'venue-2',
          name: 'Craft Beer Garden',
          rating: 4.2,
          reviewCount: 156,
          priceLevel: 3,
          latitude: params.latitude + 0.002,
          longitude: params.longitude - 0.001,
          address: {
            line1: '456 Second St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94102',
          },
          phone: '+14155555678',
          displayPhone: '(415) 555-5678',
          distance: 320,
          categories: [
            {alias: 'breweries', title: 'Breweries'},
            {alias: 'gastropubs', title: 'Gastropubs'},
          ],
          imageUrl: 'https://example.com/venue2.jpg',
          isClaimed: true,
          isClosed: false,
        },
      ];
      
      return {
        venues: mockVenues,
        searchParams: params,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const getVenueDetails = createAsyncThunk(
  'venues/getVenueDetails',
  async (venueId: string, {rejectWithValue}) => {
    try {
      // API calls would go here
      // const [venueDetails, happyHourSpecials, menuItems] = await Promise.all([
      //   yelpAPI.getBusinessDetails(venueId),
      //   customAPI.getHappyHourSpecials(venueId),
      //   customAPI.getMenuItems(venueId)
      // ]);

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVenueDetails: Venue = {
        id: venueId,
        name: 'The Happy Hour Spot',
        rating: 4.5,
        reviewCount: 234,
        priceLevel: 2,
        latitude: 37.7749,
        longitude: -122.4194,
        address: {
          line1: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
        },
        phone: '+14155551234',
        displayPhone: '(415) 555-1234',
        categories: [
          {alias: 'bars', title: 'Bars'},
          {alias: 'american', title: 'American'},
        ],
        hours: [
          {day: 1, start: '1600', end: '0200', is_overnight: true},
          {day: 2, start: '1600', end: '0200', is_overnight: true},
        ],
        imageUrl: 'https://example.com/venue1.jpg',
        isClaimed: true,
        isClosed: false,
      };

      const mockHappyHourSpecials: HappyHourSpecial[] = [
        {
          id: 1,
          venueId,
          dayOfWeek: 'monday',
          startTime: '16:00',
          endTime: '19:00',
          specialType: 'draft_beer',
          title: '$4 Draft Beers',
          description: 'All draft beers on tap',
          happyHourPrice: 4.00,
          regularPrice: 7.00,
          isActive: true,
        },
        {
          id: 2,
          venueId,
          dayOfWeek: 'monday',
          startTime: '16:00',
          endTime: '19:00',
          specialType: 'cocktails',
          title: 'Half Price Cocktails',
          description: 'All house cocktails',
          discountPercentage: 50,
          isActive: true,
        },
      ];

      const mockMenuItems: MenuItem[] = [
        {
          id: 1,
          venueId,
          category: 'draft_beer',
          name: 'Sierra Nevada IPA',
          description: 'Hoppy and citrusy',
          regularPrice: 7.00,
          happyHourPrice: 4.00,
          abv: 6.2,
          beerStyle: 'IPA',
          brewery: 'Sierra Nevada',
          isAvailable: true,
          happyHourOnly: false,
        },
        {
          id: 2,
          venueId,
          category: 'cocktails',
          name: 'Old Fashioned',
          description: 'Classic whiskey cocktail',
          regularPrice: 12.00,
          happyHourPrice: 6.00,
          isAvailable: true,
          happyHourOnly: false,
        },
      ];
      
      return {
        venueDetails: mockVenueDetails,
        happyHourSpecials: mockHappyHourSpecials,
        menuItems: mockMenuItems,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get venue details');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'venues/toggleFavorite',
  async (venueId: string, {getState, rejectWithValue}) => {
    try {
      const state = getState() as any;
      const isFavorite = state.venues.favorites.includes(venueId);
      
      // API call would go here
      // if (isFavorite) {
      //   await userAPI.removeFavorite(venueId);
      // } else {
      //   await userAPI.addFavorite(venueId);
      // }
      
      return {venueId, isFavorite: !isFavorite};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update favorite');
    }
  }
);

// Venue slice
const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedVenue: (state, action: PayloadAction<Venue | null>) => {
      state.selectedVenue = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.lastSearchQuery = null;
      state.lastSearchLocation = null;
    },
    updateVenueRating: (state, action: PayloadAction<{
      venueId: string;
      rating: number;
      reviewCount: number;
    }>) => {
      const {venueId, rating, reviewCount} = action.payload;
      
      // Update in search results
      const searchResultIndex = state.searchResults.findIndex(v => v.id === venueId);
      if (searchResultIndex !== -1) {
        state.searchResults[searchResultIndex].rating = rating;
        state.searchResults[searchResultIndex].reviewCount = reviewCount;
      }
      
      // Update in venue details
      if (state.venueDetails[venueId]) {
        state.venueDetails[venueId].rating = rating;
        state.venueDetails[venueId].reviewCount = reviewCount;
      }
      
      // Update selected venue
      if (state.selectedVenue?.id === venueId) {
        state.selectedVenue.rating = rating;
        state.selectedVenue.reviewCount = reviewCount;
      }
    },
  },
  extraReducers: (builder) => {
    // Search venues
    builder
      .addCase(searchVenues.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchVenues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.venues;
        state.lastSearchQuery = action.payload.searchParams.term || null;
        state.lastSearchLocation = {
          lat: action.payload.searchParams.latitude,
          lng: action.payload.searchParams.longitude,
        };
        state.lastUpdate = new Date().toISOString();
        state.error = null;
      })
      .addCase(searchVenues.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get venue details
    builder
      .addCase(getVenueDetails.pending, (state) => {
        state.isLoadingDetails = true;
        state.error = null;
      })
      .addCase(getVenueDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        const {venueDetails, happyHourSpecials, menuItems} = action.payload;
        
        state.venueDetails[venueDetails.id] = venueDetails;
        state.happyHourSpecials[venueDetails.id] = happyHourSpecials;
        state.menuItems[venueDetails.id] = menuItems;
        state.selectedVenue = venueDetails;
        state.error = null;
      })
      .addCase(getVenueDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.payload as string;
      });

    // Toggle favorite
    builder
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const {venueId, isFavorite} = action.payload;
        
        if (isFavorite) {
          state.favorites.push(venueId);
        } else {
          state.favorites = state.favorites.filter(id => id !== venueId);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  setSelectedVenue,
  clearSearchResults,
  updateVenueRating,
} = venueSlice.actions;

// Export reducer
export default venueSlice.reducer;