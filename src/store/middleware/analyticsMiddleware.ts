import {Middleware} from '@reduxjs/toolkit';
import {RootState} from '../index';

// Analytics middleware for tracking user interactions
const analyticsMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Track search events
  if (action.type === 'venues/searchVenues/fulfilled') {
    console.log('[Analytics] Search performed', {
      timestamp: new Date().toISOString(),
      resultsCount: action.payload.venues.length,
    });
  }
  
  // Track venue detail views
  if (action.type === 'venues/getVenueDetails/fulfilled') {
    console.log('[Analytics] Venue details viewed', {
      venueId: action.payload.venueDetails.id,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Track favorite actions
  if (action.type === 'venues/toggleFavorite/fulfilled') {
    console.log('[Analytics] Favorite toggled', {
      venueId: action.payload.venueId,
      isFavorite: action.payload.isFavorite,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Track user check-ins
  if (action.type === 'user/checkIn/fulfilled') {
    console.log('[Analytics] User checked in', {
      venueId: action.payload.venueId,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Track authentication events
  if (action.type === 'auth/loginUser/fulfilled') {
    console.log('[Analytics] User logged in', {
      userId: action.payload.user.id,
      timestamp: new Date().toISOString(),
    });
  }
  
  if (action.type === 'auth/logoutUser/fulfilled') {
    console.log('[Analytics] User logged out', {
      timestamp: new Date().toISOString(),
    });
  }
  
  return result;
};

export default analyticsMiddleware;