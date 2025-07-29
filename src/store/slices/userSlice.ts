import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

// Types
export interface UserPreferences {
  // Location preferences
  defaultRadius: number;
  homeLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  workLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  // Search preferences
  preferredCategories: string[];
  preferredPriceLevels: number[];
  minimumRating: number;
  
  // Happy hour preferences
  preferredDays: string[];
  preferredTimes: Array<{
    start: string;
    end: string;
  }>;
  drinkPreferences: string[];
  foodPreferences: string[];
  
  // Notification preferences
  pushNotificationsEnabled: boolean;
  locationBasedAlerts: boolean;
  timeBasedAlerts: boolean;
  favoriteVenueAlerts: boolean;
  newVenueAlerts: boolean;
  promotionalNotifications: boolean;
  
  // App preferences
  preferredView: 'list' | 'map';
  distanceUnit: 'miles' | 'kilometers';
  theme: 'light' | 'dark' | 'auto';
}

export interface UserCheckIn {
  id: string;
  venueId: string;
  venueName: string;
  timestamp: string;
  rating?: number;
  notes?: string;
  happyHourItems?: string[];
  photos?: string[];
}

export interface UserState {
  preferences: UserPreferences;
  checkIns: UserCheckIn[];
  visitHistory: Array<{
    venueId: string;
    venueName: string;
    lastVisited: string;
    visitCount: number;
  }>;
  
  // Analytics data
  totalCheckIns: number;
  totalVenuesVisited: number;
  favoriteCategories: string[];
  averageRating: number;
  
  // Achievement system
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    icon: string;
  }>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  preferences: {
    defaultRadius: 25,
    preferredCategories: [],
    preferredPriceLevels: [1, 2, 3, 4],
    minimumRating: 3.0,
    preferredDays: ['friday', 'saturday'],
    preferredTimes: [
      {start: '16:00', end: '19:00'},
    ],
    drinkPreferences: [],
    foodPreferences: [],
    pushNotificationsEnabled: true,
    locationBasedAlerts: true,
    timeBasedAlerts: true,
    favoriteVenueAlerts: true,
    newVenueAlerts: false,
    promotionalNotifications: false,
    preferredView: 'list',
    distanceUnit: 'miles',
    theme: 'auto',
  },
  checkIns: [],
  visitHistory: [],
  totalCheckIns: 0,
  totalVenuesVisited: 0,
  favoriteCategories: [],
  averageRating: 0,
  achievements: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserPreferences>, {rejectWithValue}) => {
    try {
      // API call would go here
      // const response = await userAPI.updatePreferences(preferences);
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      return preferences;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
    }
  }
);

export const checkInToVenue = createAsyncThunk(
  'user/checkIn',
  async (checkInData: {
    venueId: string;
    venueName: string;
    rating?: number;
    notes?: string;
    happyHourItems?: string[];
    photos?: string[];
  }, {rejectWithValue}) => {
    try {
      // API call would go here
      // const response = await userAPI.checkIn(checkInData);
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const checkIn: UserCheckIn = {
        id: Date.now().toString(),
        ...checkInData,
        timestamp: new Date().toISOString(),
      };
      
      return checkIn;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check in');
    }
  }
);

export const loadUserAnalytics = createAsyncThunk(
  'user/loadAnalytics',
  async (_, {rejectWithValue}) => {
    try {
      // API call would go here
      // const response = await userAPI.getAnalytics();
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        totalCheckIns: 42,
        totalVenuesVisited: 28,
        favoriteCategories: ['bars', 'cocktailbars', 'breweries'],
        averageRating: 4.2,
        achievements: [
          {
            id: 'first_checkin',
            title: 'First Check-in',
            description: 'Welcome to Happy Hour Deals!',
            unlockedAt: new Date().toISOString(),
            icon: 'celebration',
          },
        ],
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load analytics');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Preferences actions
    setPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = {...state.preferences, ...action.payload};
    },
    setDefaultRadius: (state, action: PayloadAction<number>) => {
      state.preferences.defaultRadius = action.payload;
    },
    setHomeLocation: (state, action: PayloadAction<UserPreferences['homeLocation']>) => {
      state.preferences.homeLocation = action.payload;
    },
    setWorkLocation: (state, action: PayloadAction<UserPreferences['workLocation']>) => {
      state.preferences.workLocation = action.payload;
    },
    togglePreferredCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.preferences.preferredCategories.indexOf(category);
      
      if (index > -1) {
        state.preferences.preferredCategories.splice(index, 1);
      } else {
        state.preferences.preferredCategories.push(category);
      }
    },
    toggleDrinkPreference: (state, action: PayloadAction<string>) => {
      const drink = action.payload;
      const index = state.preferences.drinkPreferences.indexOf(drink);
      
      if (index > -1) {
        state.preferences.drinkPreferences.splice(index, 1);
      } else {
        state.preferences.drinkPreferences.push(drink);
      }
    },
    
    // Notification preferences
    updateNotificationPreferences: (state, action: PayloadAction<{
      pushNotificationsEnabled?: boolean;
      locationBasedAlerts?: boolean;
      timeBasedAlerts?: boolean;
      favoriteVenueAlerts?: boolean;
      newVenueAlerts?: boolean;
      promotionalNotifications?: boolean;
    }>) => {
      state.preferences = {...state.preferences, ...action.payload};
    },
    
    // App preferences
    setPreferredView: (state, action: PayloadAction<'list' | 'map'>) => {
      state.preferences.preferredView = action.payload;
    },
    setDistanceUnit: (state, action: PayloadAction<'miles' | 'kilometers'>) => {
      state.preferences.distanceUnit = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.preferences.theme = action.payload;
    },
    
    // Check-in actions
    addCheckIn: (state, action: PayloadAction<UserCheckIn>) => {
      state.checkIns.unshift(action.payload);
      state.totalCheckIns += 1;
      
      // Update visit history
      const existingVisit = state.visitHistory.find(
        visit => visit.venueId === action.payload.venueId
      );
      
      if (existingVisit) {
        existingVisit.lastVisited = action.payload.timestamp;
        existingVisit.visitCount += 1;
      } else {
        state.visitHistory.push({
          venueId: action.payload.venueId,
          venueName: action.payload.venueName,
          lastVisited: action.payload.timestamp,
          visitCount: 1,
        });
        state.totalVenuesVisited += 1;
      }
    },
    updateCheckIn: (state, action: PayloadAction<{
      id: string;
      updates: Partial<UserCheckIn>;
    }>) => {
      const {id, updates} = action.payload;
      const checkInIndex = state.checkIns.findIndex(checkIn => checkIn.id === id);
      
      if (checkInIndex > -1) {
        state.checkIns[checkInIndex] = {...state.checkIns[checkInIndex], ...updates};
      }
    },
    removeCheckIn: (state, action: PayloadAction<string>) => {
      state.checkIns = state.checkIns.filter(checkIn => checkIn.id !== action.payload);
      state.totalCheckIns = Math.max(0, state.totalCheckIns - 1);
    },
    
    // Achievement actions
    unlockAchievement: (state, action: PayloadAction<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>) => {
      const achievement = {
        ...action.payload,
        unlockedAt: new Date().toISOString(),
      };
      
      // Only add if not already unlocked
      if (!state.achievements.find(a => a.id === achievement.id)) {
        state.achievements.push(achievement);
      }
    },
    
    // Analytics actions
    updateAnalytics: (state, action: PayloadAction<{
      totalCheckIns?: number;
      totalVenuesVisited?: number;
      favoriteCategories?: string[];
      averageRating?: number;
    }>) => {
      const {totalCheckIns, totalVenuesVisited, favoriteCategories, averageRating} = action.payload;
      
      if (totalCheckIns !== undefined) state.totalCheckIns = totalCheckIns;
      if (totalVenuesVisited !== undefined) state.totalVenuesVisited = totalVenuesVisited;
      if (favoriteCategories) state.favoriteCategories = favoriteCategories;
      if (averageRating !== undefined) state.averageRating = averageRating;
    },
    
    // Clear user data
    clearUserData: (state) => {
      state.checkIns = [];
      state.visitHistory = [];
      state.totalCheckIns = 0;
      state.totalVenuesVisited = 0;
      state.favoriteCategories = [];
      state.averageRating = 0;
      state.achievements = [];
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Update preferences
    builder
      .addCase(updateUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = {...state.preferences, ...action.payload};
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check in to venue
    builder
      .addCase(checkInToVenue.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkInToVenue.fulfilled, (state, action) => {
        state.isLoading = false;
        userSlice.caseReducers.addCheckIn(state, {
          type: 'user/addCheckIn',
          payload: action.payload,
        });
      })
      .addCase(checkInToVenue.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load analytics
    builder
      .addCase(loadUserAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        const {totalCheckIns, totalVenuesVisited, favoriteCategories, averageRating, achievements} = action.payload;
        
        state.totalCheckIns = totalCheckIns;
        state.totalVenuesVisited = totalVenuesVisited;
        state.favoriteCategories = favoriteCategories;
        state.averageRating = averageRating;
        state.achievements = achievements;
      })
      .addCase(loadUserAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setPreferences,
  setDefaultRadius,
  setHomeLocation,
  setWorkLocation,
  togglePreferredCategory,
  toggleDrinkPreference,
  updateNotificationPreferences,
  setPreferredView,
  setDistanceUnit,
  setTheme,
  addCheckIn,
  updateCheckIn,
  removeCheckIn,
  unlockAchievement,
  updateAnalytics,
  clearUserData,
  clearError,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;