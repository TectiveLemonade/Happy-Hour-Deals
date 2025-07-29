import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {API_CONFIG, SEARCH_PARAMS, API_ERRORS, HTTP_STATUS} from '@constants/api';

// Types for Yelp API responses
export interface YelpBusinessSearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
  term?: string;
  categories?: string;
  price?: string;
  sort_by?: string;
  limit?: number;
  open_now?: boolean;
}

export interface YelpBusiness {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories: Array<{
    alias: string;
    title: string;
  }>;
  rating: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  transactions: string[];
  price?: string;
  location: {
    address1: string;
    address2?: string;
    address3?: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: string[];
  };
  phone: string;
  display_phone: string;
  distance: number;
}

export interface YelpSearchResponse {
  businesses: YelpBusiness[];
  total: number;
  region: {
    center: {
      longitude: number;
      latitude: number;
    };
  };
}

export interface YelpBusinessDetails extends YelpBusiness {
  is_claimed: boolean;
  photos: string[];
  hours?: Array<{
    open: Array<{
      is_overnight: boolean;
      start: string;
      end: string;
      day: number;
    }>;
    hours_type: string;
    is_open_now: boolean;
  }>;
  special_hours?: Array<{
    date: string;
    is_closed: boolean;
    start?: string;
    end?: string;
  }>;
  messaging?: {
    url: string;
    use_case_text: string;
  };
}

export interface YelpReview {
  id: string;
  url: string;
  text: string;
  rating: number;
  time_created: string;
  user: {
    id: string;
    profile_url: string;
    image_url?: string;
    name: string;
  };
}

export interface YelpReviewsResponse {
  reviews: YelpReview[];
  total: number;
  possible_languages: string[];
}

class YelpAPI {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: API_CONFIG.YELP.BASE_URL,
      timeout: API_CONFIG.TIMEOUTS.DEFAULT,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for logging and rate limiting
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[Yelp API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[Yelp API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`[Yelp API] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[Yelp API] Response error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.description || error.response.data?.message;

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          return new Error(API_ERRORS.UNAUTHORIZED);
        case HTTP_STATUS.TOO_MANY_REQUESTS:
          return new Error(API_ERRORS.RATE_LIMIT_ERROR);
        case HTTP_STATUS.NOT_FOUND:
          return new Error(API_ERRORS.NOT_FOUND);
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        case HTTP_STATUS.BAD_GATEWAY:
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
          return new Error(API_ERRORS.SERVER_ERROR);
        default:
          return new Error(message || API_ERRORS.GENERIC_ERROR);
      }
    } else if (error.request) {
      return new Error(API_ERRORS.NETWORK_ERROR);
    } else if (error.code === 'ECONNABORTED') {
      return new Error(API_ERRORS.TIMEOUT_ERROR);
    }

    return new Error(API_ERRORS.GENERIC_ERROR);
  }

  /**
   * Search for businesses based on location and criteria
   */
  async searchBusinesses(params: YelpBusinessSearchParams): Promise<YelpSearchResponse> {
    try {
      // Convert radius from miles to meters if provided
      const radiusInMeters = params.radius ? Math.min(params.radius * 1609.34, API_CONFIG.YELP.MAX_RADIUS) : undefined;
      
      // Format categories array to comma-separated string
      const categories = Array.isArray(params.categories) 
        ? params.categories.join(',')
        : params.categories || SEARCH_PARAMS.CATEGORIES.join(',');

      // Format price levels array to comma-separated string
      const price = Array.isArray(params.price)
        ? params.price.join(',')
        : params.price;

      const searchParams = {
        latitude: params.latitude,
        longitude: params.longitude,
        radius: radiusInMeters,
        term: params.term,
        categories,
        price,
        sort_by: params.sort_by || 'distance',
        limit: Math.min(params.limit || 20, API_CONFIG.YELP.MAX_RESULTS_PER_CALL),
        open_now: params.open_now,
      };

      // Remove undefined values
      const cleanParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const response = await this.client.get<YelpSearchResponse>(
        API_CONFIG.YELP.ENDPOINTS.BUSINESS_SEARCH,
        { params: cleanParams }
      );

      return response.data;
    } catch (error) {
      console.error('[Yelp API] Search businesses error:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific business
   */
  async getBusinessDetails(businessId: string): Promise<YelpBusinessDetails> {
    try {
      const response = await this.client.get<YelpBusinessDetails>(
        `${API_CONFIG.YELP.ENDPOINTS.BUSINESS_DETAILS}/${businessId}`
      );

      return response.data;
    } catch (error) {
      console.error('[Yelp API] Get business details error:', error);
      throw error;
    }
  }

  /**
   * Get reviews for a specific business
   */
  async getBusinessReviews(businessId: string): Promise<YelpReviewsResponse> {
    try {
      const response = await this.client.get<YelpReviewsResponse>(
        API_CONFIG.YELP.ENDPOINTS.BUSINESS_REVIEWS.replace('{id}', businessId)
      );

      return response.data;
    } catch (error) {
      console.error('[Yelp API] Get business reviews error:', error);
      throw error;
    }
  }

  /**
   * Get photos for a specific business (requires Professional/Premium plan)
   */
  async getBusinessPhotos(businessId: string): Promise<{photos: string[]}> {
    try {
      const response = await this.client.get<{photos: string[]}>(
        API_CONFIG.YELP.ENDPOINTS.BUSINESS_PHOTOS.replace('{id}', businessId)
      );

      return response.data;
    } catch (error) {
      console.error('[Yelp API] Get business photos error:', error);
      throw error;
    }
  }

  /**
   * Convert miles to meters
   */
  private milesToMeters(miles: number): number {
    return miles * 1609.34;
  }

  /**
   * Convert meters to miles
   */
  private metersToMiles(meters: number): number {
    return meters / 1609.34;
  }

  /**
   * Format price level number to string
   */
  private formatPriceLevel(levels: number[]): string {
    return levels.map(level => '$'.repeat(level)).join(',');
  }

  /**
   * Check if coordinates are valid
   */
  private isValidCoordinates(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }
}

export default YelpAPI;