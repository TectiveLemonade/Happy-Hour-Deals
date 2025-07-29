import {Middleware} from '@reduxjs/toolkit';
import {RootState} from '../index';
import {clearExpiredEntries} from '../slices/cacheSlice';

// Cache middleware for automatic cache management
const cacheMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Auto-cleanup expired cache entries every 5 minutes
  const state = store.getState();
  const lastCleanup = state.cache.lastCleanup;
  const fiveMinutes = 5 * 60 * 1000;
  
  if (Date.now() - lastCleanup > fiveMinutes) {
    store.dispatch(clearExpiredEntries());
  }
  
  // Cache API responses automatically
  if (action.type?.includes('venues/searchVenues/fulfilled')) {
    // This would be handled by the venue slice
    console.log('[Cache] Caching search results');
  }
  
  if (action.type?.includes('venues/getVenueDetails/fulfilled')) {
    // This would be handled by the venue slice
    console.log('[Cache] Caching venue details');
  }
  
  return result;
};

export default cacheMiddleware;