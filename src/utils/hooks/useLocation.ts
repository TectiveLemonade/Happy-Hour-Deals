import {useEffect, useState, useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import {
  setSearchLocation,
  setLocationLoading,
  setLocationPermission,
} from '@store/slices/searchSlice';
import {
  locationService,
  LocationResult,
  LocationError,
  LocationCoordinates,
} from '@services/location';

interface UseLocationOptions {
  enableWatch?: boolean;
  autoRequest?: boolean;
  timeout?: number;
  enableHighAccuracy?: boolean;
}

interface UseLocationReturn {
  location: LocationResult | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: 'granted' | 'denied' | 'not_requested';
  getCurrentLocation: () => Promise<void>;
  geocodeAddress: (address: string) => Promise<void>;
  clearError: () => void;
  requestPermission: () => Promise<boolean>;
}

export const useLocation = (options: UseLocationOptions = {}): UseLocationReturn => {
  const {
    enableWatch = false,
    autoRequest = false,
    timeout = 15000,
    enableHighAccuracy = true,
  } = options;

  const dispatch = useAppDispatch();
  const searchLocation = useAppSelector(state => state.search.location);
  const isLocationLoading = useAppSelector(state => state.search.isLocationLoading);
  const locationPermission = useAppSelector(state => state.search.locationPermission);

  const [location, setLocation] = useState<LocationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchCallbackIndex, setWatchCallbackIndex] = useState<number | null>(null);

  // Update local state when Redux state changes
  useEffect(() => {
    if (searchLocation) {
      setLocation({
        coordinates: searchLocation,
        source: 'manual',
        timestamp: Date.now(),
      });
    }
  }, [searchLocation]);

  // Auto-request location on mount if enabled
  useEffect(() => {
    if (autoRequest) {
      getCurrentLocation();
    }
  }, [autoRequest]);

  // Setup location watching
  useEffect(() => {
    if (enableWatch && !watchCallbackIndex) {
      const index = locationService.startLocationWatch(handleLocationUpdate);
      setWatchCallbackIndex(index);
    }

    return () => {
      if (watchCallbackIndex !== null) {
        locationService.stopLocationWatch(watchCallbackIndex);
      }
    };
  }, [enableWatch, watchCallbackIndex]);

  const handleLocationUpdate = useCallback((locationResult: LocationResult) => {
    setLocation(locationResult);
    setError(null);
    
    // Update Redux state
    dispatch(setSearchLocation({
      latitude: locationResult.coordinates.latitude,
      longitude: locationResult.coordinates.longitude,
      address: locationResult.address?.address,
      city: locationResult.address?.city,
      state: locationResult.address?.state,
    }));
  }, [dispatch]);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      dispatch(setLocationLoading(true));

      const locationResult = await locationService.getCurrentLocation({
        timeout,
        enableHighAccuracy,
      });

      handleLocationUpdate(locationResult);
      dispatch(setLocationPermission('granted'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // Update permission status based on error
      if (errorMessage === LocationError.PERMISSION_DENIED) {
        dispatch(setLocationPermission('denied'));
        locationService.showPermissionDeniedAlert();
      } else {
        console.error('[useLocation] Error getting location:', errorMessage);
      }
    } finally {
      dispatch(setLocationLoading(false));
    }
  }, [dispatch, timeout, enableHighAccuracy, handleLocationUpdate]);

  const geocodeAddress = useCallback(async (address: string): Promise<void> => {
    try {
      setError(null);
      dispatch(setLocationLoading(true));

      const locationResult = await locationService.geocodeAddress(address);
      handleLocationUpdate(locationResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to find location';
      setError(errorMessage);
    } finally {
      dispatch(setLocationLoading(false));
    }
  }, [dispatch, handleLocationUpdate]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const hasPermission = await locationService.isLocationEnabled();
      const status = locationService.getPermissionStatus();
      dispatch(setLocationPermission(status));
      return hasPermission;
    } catch (error) {
      dispatch(setLocationPermission('denied'));
      return false;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    location,
    isLoading: isLocationLoading,
    error,
    permissionStatus: locationPermission,
    getCurrentLocation,
    geocodeAddress,
    clearError,
    requestPermission,
  };
};

export default useLocation;