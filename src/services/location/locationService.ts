import {Platform, PermissionsAndroid, Alert} from 'react-native';

// Web-compatible geolocation interface
interface WebGeolocation {
  getCurrentPosition: (
    success: (position: GeolocationPosition) => void,
    error?: (error: GeolocationPositionError) => void,
    options?: PositionOptions
  ) => void;
  watchPosition: (
    success: (position: GeolocationPosition) => void,
    error?: (error: GeolocationPositionError) => void,
    options?: PositionOptions
  ) => number;
  clearWatch: (watchId: number) => void;
}

// Create platform-specific geolocation
let Geolocation: WebGeolocation;
let permissionsCheck: any = null;
let permissionsRequest: any = null;
let PERMISSIONS: any = null;
let RESULTS: any = null;

if (Platform.OS === 'web') {
  // Use browser's native geolocation API
  Geolocation = navigator.geolocation;
} else {
  // Use React Native geolocation for mobile
  try {
    const RNGeolocation = require('@react-native-community/geolocation');
    const permissions = require('react-native-permissions');
    Geolocation = RNGeolocation.default || RNGeolocation;
    permissionsCheck = permissions.check;
    permissionsRequest = permissions.request;
    PERMISSIONS = permissions.PERMISSIONS;
    RESULTS = permissions.RESULTS;
  } catch (error) {
    console.warn('React Native geolocation not available, using fallback');
  }
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationAddress {
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country?: string;
}

export interface LocationResult {
  coordinates: LocationCoordinates;
  address?: LocationAddress;
  source: 'gps' | 'manual' | 'cached';
  timestamp: number;
}

export enum LocationError {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  LOCATION_UNAVAILABLE = 'LOCATION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  GEOCODING_FAILED = 'GEOCODING_FAILED',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
}

class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationResult | null = null;
  private watchId: number | null = null;
  private locationCallbacks: ((location: LocationResult) => void)[] = [];
  private permissionStatus: 'granted' | 'denied' | 'not_requested' = 'not_requested';

  private constructor() {
    this.setupGeolocation();
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  private setupGeolocation() {
    // Configure Geolocation only for React Native
    if (Platform.OS !== 'web' && Geolocation && (Geolocation as any).setRNConfiguration) {
      (Geolocation as any).setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
        enableBackgroundLocationUpdates: false,
        locationProvider: 'auto',
      });
    }
  }

  /**
   * Request location permissions based on platform
   */
  private async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Web platform - permissions are handled by browser
        if (!navigator.geolocation) {
          console.error('[LocationService] Geolocation not supported by browser');
          this.permissionStatus = 'denied';
          return false;
        }
        
        // For web, we'll assume permission is granted if geolocation is available
        // The actual permission will be requested when getCurrentPosition is called
        this.permissionStatus = 'granted';
        return true;
      } else if (Platform.OS === 'ios' && PERMISSIONS && RESULTS && permissionsCheck && permissionsRequest) {
        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        const result = await permissionsCheck(permission);
        
        if (result === RESULTS.GRANTED) {
          this.permissionStatus = 'granted';
          return true;
        }
        
        if (result === RESULTS.DENIED) {
          const requestResult = await permissionsRequest(permission);
          const granted = requestResult === RESULTS.GRANTED;
          this.permissionStatus = granted ? 'granted' : 'denied';
          return granted;
        }
        
        this.permissionStatus = 'denied';
        return false;
      } else if (Platform.OS === 'android') {
        // Android
        const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
        const hasPermission = await PermissionsAndroid.check(permission);
        
        if (hasPermission) {
          this.permissionStatus = 'granted';
          return true;
        }
        
        const granted = await PermissionsAndroid.request(permission, {
          title: 'Location Permission',
          message: 'Happy Hour Deals needs access to your location to find nearby venues.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        this.permissionStatus = isGranted ? 'granted' : 'denied';
        return isGranted;
      }
      
      // Fallback - assume permission granted
      this.permissionStatus = 'granted';
      return true;
    } catch (error) {
      console.error('[LocationService] Permission request error:', error);
      this.permissionStatus = 'denied';
      return false;
    }
  }

  /**
   * Get current GPS location
   */
  public async getCurrentLocation(options?: {
    timeout?: number;
    maximumAge?: number;
    enableHighAccuracy?: boolean;
  }): Promise<LocationResult> {
    return new Promise(async (resolve, reject) => {
      // Check and request permissions
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        reject(new Error(LocationError.PERMISSION_DENIED));
        return;
      }

      const defaultOptions = {
        timeout: 15000,
        maximumAge: 60000, // 1 minute
        enableHighAccuracy: true,
        ...options,
      };

      Geolocation.getCurrentPosition(
        (position) => {
          const result: LocationResult = {
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            },
            source: 'gps',
            timestamp: position.timestamp,
          };
          
          this.currentLocation = result;
          this.notifyLocationCallbacks(result);
          resolve(result);
        },
        (error) => {
          console.error('[LocationService] GPS error:', error);
          
          let errorType: LocationError;
          switch (error.code) {
            case 1:
              errorType = LocationError.PERMISSION_DENIED;
              break;
            case 2:
              errorType = LocationError.LOCATION_UNAVAILABLE;
              break;
            case 3:
              errorType = LocationError.TIMEOUT;
              break;
            default:
              errorType = LocationError.LOCATION_UNAVAILABLE;
          }
          
          reject(new Error(errorType));
        },
        defaultOptions
      );
    });
  }

  /**
   * Start watching location changes
   */
  public startLocationWatch(callback: (location: LocationResult) => void): number {
    this.locationCallbacks.push(callback);
    
    if (this.watchId === null) {
      this.watchId = Geolocation.watchPosition(
        (position) => {
          const result: LocationResult = {
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            },
            source: 'gps',
            timestamp: position.timestamp,
          };
          
          this.currentLocation = result;
          this.notifyLocationCallbacks(result);
        },
        (error) => {
          console.error('[LocationService] Watch position error:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 100, // Update when moved 100 meters
          interval: 30000, // Check every 30 seconds
        }
      );
    }
    
    return this.locationCallbacks.length - 1;
  }

  /**
   * Stop watching location changes
   */
  public stopLocationWatch(callbackIndex?: number): void {
    if (callbackIndex !== undefined && callbackIndex >= 0) {
      this.locationCallbacks.splice(callbackIndex, 1);
    } else {
      this.locationCallbacks = [];
    }
    
    if (this.locationCallbacks.length === 0 && this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Geocode an address to coordinates
   */
  public async geocodeAddress(address: string): Promise<LocationResult> {
    try {
      // This is a basic implementation. In a production app, you might want to use
      // a proper geocoding service like Google Maps Geocoding API
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=YOUR_MAPBOX_TOKEN&limit=1`
      );
      
      if (!response.ok) {
        throw new Error(LocationError.NETWORK_ERROR);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error(LocationError.GEOCODING_FAILED);
      }
      
      const feature = data.features[0];
      const [longitude, latitude] = feature.center;
      
      // Parse address components
      const addressComponents = this.parseMapboxAddress(feature);
      
      const result: LocationResult = {
        coordinates: {
          latitude,
          longitude,
        },
        address: addressComponents,
        source: 'manual',
        timestamp: Date.now(),
      };
      
      this.currentLocation = result;
      return result;
    } catch (error) {
      console.error('[LocationService] Geocoding error:', error);
      throw new Error(LocationError.GEOCODING_FAILED);
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  public async reverseGeocode(coordinates: LocationCoordinates): Promise<LocationAddress> {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.longitude},${coordinates.latitude}.json?access_token=YOUR_MAPBOX_TOKEN&limit=1`
      );
      
      if (!response.ok) {
        throw new Error(LocationError.NETWORK_ERROR);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error(LocationError.GEOCODING_FAILED);
      }
      
      return this.parseMapboxAddress(data.features[0]);
    } catch (error) {
      console.error('[LocationService] Reverse geocoding error:', error);
      throw new Error(LocationError.GEOCODING_FAILED);
    }
  }

  /**
   * Parse Mapbox address response
   */
  private parseMapboxAddress(feature: any): LocationAddress {
    const context = feature.context || [];
    const place_name = feature.place_name || '';
    
    let city = '';
    let state = '';
    let zipCode = '';
    let country = '';
    
    context.forEach((item: any) => {
      if (item.id.includes('place')) {
        city = item.text;
      } else if (item.id.includes('region')) {
        state = item.short_code || item.text;
      } else if (item.id.includes('postcode')) {
        zipCode = item.text;
      } else if (item.id.includes('country')) {
        country = item.text;
      }
    });
    
    return {
      address: place_name,
      city,
      state,
      zipCode,
      country,
    };
  }

  /**
   * Get cached location
   */
  public getCachedLocation(): LocationResult | null {
    return this.currentLocation;
  }

  /**
   * Clear cached location
   */
  public clearCachedLocation(): void {
    this.currentLocation = null;
  }

  /**
   * Get permission status
   */
  public getPermissionStatus(): 'granted' | 'denied' | 'not_requested' {
    return this.permissionStatus;
  }

  /**
   * Check if location services are available
   */
  public async isLocationEnabled(): Promise<boolean> {
    try {
      // This is a simplified check. For production, you might want to use
      // react-native-device-info or similar to check if location services are enabled
      const hasPermission = await this.requestLocationPermission();
      return hasPermission;
    } catch (error) {
      return false;
    }
  }

  /**
   * Calculate distance between two coordinates (in meters)
   */
  public calculateDistance(
    coord1: LocationCoordinates,
    coord2: LocationCoordinates
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Show location permission denied alert
   */
  public showPermissionDeniedAlert(): void {
    Alert.alert(
      'Location Permission Required',
      'To find nearby happy hour deals, please enable location permissions in your device settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            // In a real app, you would open the settings
            console.log('Opening settings...');
          },
        },
      ]
    );
  }

  /**
   * Notify all location callbacks
   */
  private notifyLocationCallbacks(location: LocationResult): void {
    this.locationCallbacks.forEach(callback => {
      try {
        callback(location);
      } catch (error) {
        console.error('[LocationService] Callback error:', error);
      }
    });
  }

  /**
   * Validate coordinates
   */
  public isValidCoordinates(coordinates: LocationCoordinates): boolean {
    return (
      coordinates.latitude >= -90 &&
      coordinates.latitude <= 90 &&
      coordinates.longitude >= -180 &&
      coordinates.longitude <= 180
    );
  }

  /**
   * Format coordinates for display
   */
  public formatCoordinates(coordinates: LocationCoordinates): string {
    return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
  }

  /**
   * Convert meters to miles
   */
  public metersToMiles(meters: number): number {
    return meters * 0.000621371;
  }

  /**
   * Convert miles to meters
   */
  public milesToMeters(miles: number): number {
    return miles * 1609.34;
  }
}

export default LocationService.getInstance();