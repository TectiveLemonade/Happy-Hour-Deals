// API Configuration Constants
export const API_CONFIG = {
  // Yelp Fusion API
  YELP: {
    BASE_URL: 'https://api.yelp.com/v3',
    ENDPOINTS: {
      BUSINESS_SEARCH: '/businesses/search',
      BUSINESS_DETAILS: '/businesses',
      BUSINESS_REVIEWS: '/businesses/{id}/reviews',
      BUSINESS_PHOTOS: '/businesses/{id}/photos',
    },
    RATE_LIMITS: {
      FREE_TIER: 300,           // Calls per day
      TRIAL: 5000,             // Calls per day
      STARTER: 1000,           // Calls per plan ($7.99)
      PROFESSIONAL: 5000,      // Calls per plan ($25)
      PREMIUM: 25000,          // Calls per plan ($75)
    },
    MAX_RADIUS: 40000,         // 40km (25 miles) max radius
    MAX_RESULTS_PER_CALL: 50,  // Maximum results per search
  },
  
  // Foursquare Places API (Backup)
  FOURSQUARE: {
    BASE_URL: 'https://api.foursquare.com/v3',
    ENDPOINTS: {
      PLACES_SEARCH: '/places/search',
      PLACE_DETAILS: '/places',
      PLACE_PHOTOS: '/places/{id}/photos',
    },
    RATE_LIMITS: {
      FREE_TIER: 120000,       // Queries per day
    },
  },
  
  // Custom Backend API
  CUSTOM: {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    ENDPOINTS: {
      HAPPY_HOUR: '/happy-hour',
      MENU_ITEMS: '/menu-items',
      USER_PREFERENCES: '/user/preferences',
      FAVORITES: '/user/favorites',
      ANALYTICS: '/analytics',
    },
  },
  
  // Request timeouts (milliseconds)
  TIMEOUTS: {
    DEFAULT: 10000,            // 10 seconds
    SEARCH: 15000,             // 15 seconds for search requests
    UPLOAD: 30000,             // 30 seconds for uploads
  },
  
  // Cache durations (milliseconds)
  CACHE_DURATION: {
    SEARCH_RESULTS: 2 * 60 * 60 * 1000,    // 2 hours
    VENUE_DETAILS: 24 * 60 * 60 * 1000,    // 24 hours
    REVIEWS: 12 * 60 * 60 * 1000,          // 12 hours
    PHOTOS: 7 * 24 * 60 * 60 * 1000,       // 7 days
    MENU_DATA: 24 * 60 * 60 * 1000,        // 24 hours
    USER_PREFERENCES: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
};

// Search parameters
export const SEARCH_PARAMS = {
  // Default search radius options (in miles)
  RADIUS_OPTIONS: [10, 25, 50],
  DEFAULT_RADIUS: 25,
  
  // Business categories for happy hour venues
  CATEGORIES: [
    'restaurants',
    'bars',
    'cocktailbars',
    'pubs',
    'beerbar',
    'wine_bars',
    'sportsbars',
    'gastropubs',
    'breweries',
    'nightlife',
  ],
  
  // Price levels
  PRICE_LEVELS: [1, 2, 3, 4], // $, $$, $$$, $$$$
  
  // Sort options
  SORT_OPTIONS: [
    'distance',
    'rating',
    'review_count',
    'best_match',
  ],
  
  // Default search filters
  DEFAULT_FILTERS: {
    categories: ['restaurants', 'bars', 'nightlife'],
    price: [1, 2, 3, 4],
    open_now: true,
    sort_by: 'distance',
    limit: 20,
  },
};

// Happy Hour specific constants
export const HAPPY_HOUR = {
  // Days of the week
  DAYS: [
    'monday',
    'tuesday', 
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ],
  
  // Special types
  SPECIAL_TYPES: [
    'draft_beer',
    'bottled_beer', 
    'cocktails',
    'wine',
    'shots',
    'food',
    'appetizers',
    'desserts',
  ],
  
  // Time ranges (24-hour format)
  COMMON_TIMES: {
    EARLY_HAPPY_HOUR: {start: '15:00', end: '17:00'},
    STANDARD: {start: '16:00', end: '19:00'},
    LATE: {start: '17:00', end: '20:00'},
    ALL_DAY: {start: '11:00', end: '23:00'},
  },
};

// Error messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait before trying again.',
  UNAUTHORIZED: 'Invalid API credentials.',
  NOT_FOUND: 'Requested resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  LOCATION_ERROR: 'Unable to get your location. Please enable location services.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};