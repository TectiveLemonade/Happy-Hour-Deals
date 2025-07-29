import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {API_CONFIG} from '@constants/api';

// Types
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheState {
  // Venue-related cache
  venueDetails: {[venueId: string]: CacheEntry};
  searchResultsCache: {[searchKey: string]: CacheEntry};
  menuDataCache: {[venueId: string]: CacheEntry};
  reviewsCache: {[venueId: string]: CacheEntry};
  photosCache: {[venueId: string]: CacheEntry};
  
  // User-related cache
  userPreferencesCache: CacheEntry | null;
  favoritesCache: CacheEntry | null;
  
  // API response cache
  yelpApiCache: {[endpoint: string]: CacheEntry};
  customApiCache: {[endpoint: string]: CacheEntry};
  
  // Image cache tracking
  imageCache: {[imageUrl: string]: {
    localPath: string;
    size: number;
    cachedAt: number;
  }};
  
  // Cache statistics
  totalCacheSize: number; // in bytes
  cacheHitRate: number;
  totalHits: number;
  totalMisses: number;
  lastCleanup: number;
}

// Initial state
const initialState: CacheState = {
  venueDetails: {},
  searchResultsCache: {},
  menuDataCache: {},
  reviewsCache: {},
  photosCache: {},
  userPreferencesCache: null,
  favoritesCache: null,
  yelpApiCache: {},
  customApiCache: {},
  imageCache: {},
  totalCacheSize: 0,
  cacheHitRate: 0,
  totalHits: 0,
  totalMisses: 0,
  lastCleanup: Date.now(),
};

// Helper functions
const createCacheEntry = <T>(data: T, ttl: number): CacheEntry<T> => ({
  data,
  timestamp: Date.now(),
  expiresAt: Date.now() + ttl,
  accessCount: 1,
  lastAccessed: Date.now(),
});

const isExpired = (entry: CacheEntry): boolean => {
  return Date.now() > entry.expiresAt;
};

const updateCacheStats = (state: CacheState, isHit: boolean) => {
  if (isHit) {
    state.totalHits += 1;
  } else {
    state.totalMisses += 1;
  }
  
  const total = state.totalHits + state.totalMisses;
  state.cacheHitRate = total > 0 ? state.totalHits / total : 0;
};

// Cache slice
const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    // Generic cache operations
    setCacheEntry: (state, action: PayloadAction<{
      category: keyof CacheState;
      key: string;
      data: any;
      ttl: number;
    }>) => {
      const {category, key, data, ttl} = action.payload;
      const cacheCategory = state[category] as any;
      
      if (cacheCategory && typeof cacheCategory === 'object') {
        cacheCategory[key] = createCacheEntry(data, ttl);
      }
    },
    
    getCacheEntry: (state, action: PayloadAction<{
      category: keyof CacheState;
      key: string;
    }>) => {
      const {category, key} = action.payload;
      const cacheCategory = state[category] as any;
      
      if (cacheCategory && cacheCategory[key]) {
        const entry = cacheCategory[key];
        
        if (isExpired(entry)) {
          delete cacheCategory[key];
          updateCacheStats(state, false);
        } else {
          entry.accessCount += 1;
          entry.lastAccessed = Date.now();
          updateCacheStats(state, true);
        }
      } else {
        updateCacheStats(state, false);
      }
    },
    
    // Venue details cache
    cacheVenueDetails: (state, action: PayloadAction<{
      venueId: string;
      data: any;
    }>) => {
      const {venueId, data} = action.payload;
      state.venueDetails[venueId] = createCacheEntry(
        data,
        API_CONFIG.CACHE_DURATION.VENUE_DETAILS
      );
    },
    
    getCachedVenueDetails: (state, action: PayloadAction<string>) => {
      const venueId = action.payload;
      const entry = state.venueDetails[venueId];
      
      if (entry) {
        if (isExpired(entry)) {
          delete state.venueDetails[venueId];
          updateCacheStats(state, false);
        } else {
          entry.accessCount += 1;
          entry.lastAccessed = Date.now();
          updateCacheStats(state, true);
        }
      } else {
        updateCacheStats(state, false);
      }
    },
    
    // Search results cache
    cacheSearchResults: (state, action: PayloadAction<{
      searchKey: string;
      data: any;
    }>) => {
      const {searchKey, data} = action.payload;
      state.searchResultsCache[searchKey] = createCacheEntry(
        data,
        API_CONFIG.CACHE_DURATION.SEARCH_RESULTS
      );
    },
    
    // Menu data cache
    cacheMenuData: (state, action: PayloadAction<{
      venueId: string;
      data: any;
    }>) => {
      const {venueId, data} = action.payload;
      state.menuDataCache[venueId] = createCacheEntry(
        data,
        API_CONFIG.CACHE_DURATION.MENU_DATA
      );
    },
    
    // Reviews cache
    cacheReviews: (state, action: PayloadAction<{
      venueId: string;
      data: any;
    }>) => {
      const {venueId, data} = action.payload;
      state.reviewsCache[venueId] = createCacheEntry(
        data,
        API_CONFIG.CACHE_DURATION.REVIEWS
      );
    },
    
    // Photos cache
    cachePhotos: (state, action: PayloadAction<{
      venueId: string;
      data: any;
    }>) => {
      const {venueId, data} = action.payload;
      state.photosCache[venueId] = createCacheEntry(
        data,
        API_CONFIG.CACHE_DURATION.PHOTOS
      );
    },
    
    // User preferences cache
    cacheUserPreferences: (state, action: PayloadAction<any>) => {
      state.userPreferencesCache = createCacheEntry(
        action.payload,
        API_CONFIG.CACHE_DURATION.USER_PREFERENCES
      );
    },
    
    // Favorites cache
    cacheFavorites: (state, action: PayloadAction<any>) => {
      state.favoritesCache = createCacheEntry(
        action.payload,
        API_CONFIG.CACHE_DURATION.USER_PREFERENCES
      );
    },
    
    // API response cache
    cacheApiResponse: (state, action: PayloadAction<{
      apiType: 'yelp' | 'custom';
      endpoint: string;
      data: any;
      ttl: number;
    }>) => {
      const {apiType, endpoint, data, ttl} = action.payload;
      const cacheCategory = apiType === 'yelp' ? state.yelpApiCache : state.customApiCache;
      
      cacheCategory[endpoint] = createCacheEntry(data, ttl);
    },
    
    // Image cache
    cacheImage: (state, action: PayloadAction<{
      imageUrl: string;
      localPath: string;
      size: number;
    }>) => {
      const {imageUrl, localPath, size} = action.payload;
      
      state.imageCache[imageUrl] = {
        localPath,
        size,
        cachedAt: Date.now(),
      };
      
      state.totalCacheSize += size;
    },
    
    removeImageFromCache: (state, action: PayloadAction<string>) => {
      const imageUrl = action.payload;
      const cachedImage = state.imageCache[imageUrl];
      
      if (cachedImage) {
        state.totalCacheSize -= cachedImage.size;
        delete state.imageCache[imageUrl];
      }
    },
    
    // Cache cleanup operations
    clearExpiredEntries: (state) => {
      const now = Date.now();
      
      // Clear expired venue details
      Object.keys(state.venueDetails).forEach(key => {
        if (isExpired(state.venueDetails[key])) {
          delete state.venueDetails[key];
        }
      });
      
      // Clear expired search results
      Object.keys(state.searchResultsCache).forEach(key => {
        if (isExpired(state.searchResultsCache[key])) {
          delete state.searchResultsCache[key];
        }
      });
      
      // Clear expired menu data
      Object.keys(state.menuDataCache).forEach(key => {
        if (isExpired(state.menuDataCache[key])) {
          delete state.menuDataCache[key];
        }
      });
      
      // Clear expired reviews
      Object.keys(state.reviewsCache).forEach(key => {
        if (isExpired(state.reviewsCache[key])) {
          delete state.reviewsCache[key];
        }
      });
      
      // Clear expired photos
      Object.keys(state.photosCache).forEach(key => {
        if (isExpired(state.photosCache[key])) {
          delete state.photosCache[key];
        }
      });
      
      // Clear expired API responses
      Object.keys(state.yelpApiCache).forEach(key => {
        if (isExpired(state.yelpApiCache[key])) {
          delete state.yelpApiCache[key];
        }
      });
      
      Object.keys(state.customApiCache).forEach(key => {
        if (isExpired(state.customApiCache[key])) {
          delete state.customApiCache[key];
        }
      });
      
      // Clear expired user caches
      if (state.userPreferencesCache && isExpired(state.userPreferencesCache)) {
        state.userPreferencesCache = null;
      }
      
      if (state.favoritesCache && isExpired(state.favoritesCache)) {
        state.favoritesCache = null;
      }
      
      state.lastCleanup = now;
    },
    
    clearCacheCategory: (state, action: PayloadAction<keyof CacheState>) => {
      const category = action.payload;
      
      if (typeof state[category] === 'object' && state[category] !== null) {
        if (Array.isArray(state[category])) {
          (state[category] as any) = [];
        } else {
          (state[category] as any) = {};
        }
      } else {
        (state[category] as any) = null;
      }
    },
    
    clearAllCache: (state) => {
      Object.assign(state, initialState);
    },
    
    // Cache size management
    limitCacheSize: (state, action: PayloadAction<number>) => {
      const maxSize = action.payload;
      
      if (state.totalCacheSize > maxSize) {
        // Remove oldest images first
        const sortedImages = Object.entries(state.imageCache)
          .sort(([, a], [, b]) => a.cachedAt - b.cachedAt);
        
        for (const [imageUrl, imageData] of sortedImages) {
          if (state.totalCacheSize <= maxSize) break;
          
          state.totalCacheSize -= imageData.size;
          delete state.imageCache[imageUrl];
        }
      }
    },
    
    // Cache statistics
    resetCacheStats: (state) => {
      state.cacheHitRate = 0;
      state.totalHits = 0;
      state.totalMisses = 0;
    },
    
    updateCacheSize: (state, action: PayloadAction<number>) => {
      state.totalCacheSize = action.payload;
    },
  },
});

// Export actions
export const {
  setCacheEntry,
  getCacheEntry,
  cacheVenueDetails,
  getCachedVenueDetails,
  cacheSearchResults,
  cacheMenuData,
  cacheReviews,
  cachePhotos,
  cacheUserPreferences,
  cacheFavorites,
  cacheApiResponse,
  cacheImage,
  removeImageFromCache,
  clearExpiredEntries,
  clearCacheCategory,
  clearAllCache,
  limitCacheSize,
  resetCacheStats,
  updateCacheSize,
} = cacheSlice.actions;

// Export reducer
export default cacheSlice.reducer;