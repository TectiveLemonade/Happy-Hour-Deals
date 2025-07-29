import {Middleware} from '@reduxjs/toolkit';
import {RootState} from '../index';

// API middleware for handling API requests and responses
const apiMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  // Handle API request actions
  if (action.type?.endsWith('/pending')) {
    console.log(`[API] Starting request: ${action.type}`);
    
    // You could add request logging, analytics, or other side effects here
    // For example, track API usage for rate limiting
    
    return next(action);
  }

  // Handle API success actions
  if (action.type?.endsWith('/fulfilled')) {
    console.log(`[API] Request successful: ${action.type}`);
    
    // You could add response caching, success analytics, etc.
    
    return next(action);
  }

  // Handle API error actions
  if (action.type?.endsWith('/rejected')) {
    console.error(`[API] Request failed: ${action.type}`, action.payload);
    
    // You could add error reporting, retry logic, etc.
    
    return next(action);
  }

  return next(action);
};

export default apiMiddleware;