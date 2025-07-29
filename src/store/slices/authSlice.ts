import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

// Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  subscriptionStatus: 'free' | 'premium';
  subscriptionExpiresAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isFirstLaunch: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isFirstLaunch: true,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: {email: string; password: string}, {rejectWithValue}) => {
    try {
      // API call would go here
      // const response = await authAPI.login(credentials);
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        user: {
          id: 1,
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          subscriptionStatus: 'free' as const,
        },
        token: 'mock-jwt-token',
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }, {rejectWithValue}) => {
    try {
      // API call would go here
      // const response = await authAPI.register(userData);
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        user: {
          id: 1,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          subscriptionStatus: 'free' as const,
        },
        token: 'mock-jwt-token',
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, {rejectWithValue}) => {
    try {
      // API call would go here to invalidate token
      // await authAPI.logout();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, {getState, rejectWithValue}) => {
    try {
      const state = getState() as any;
      const currentToken = state.auth.token;
      
      if (!currentToken) {
        throw new Error('No token available');
      }
      
      // API call would go here
      // const response = await authAPI.refreshToken(currentToken);
      // return response.data;
      
      // Mock implementation
      return {token: 'new-mock-jwt-token'};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    completeOnboarding: (state) => {
      state.isFirstLaunch = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {...state.user, ...action.payload};
      }
    },
    upgradeSubscription: (state, action: PayloadAction<{
      subscriptionStatus: 'premium';
      subscriptionExpiresAt: string;
    }>) => {
      if (state.user) {
        state.user.subscriptionStatus = action.payload.subscriptionStatus;
        state.user.subscriptionExpiresAt = action.payload.subscriptionExpiresAt;
      }
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.isFirstLaunch = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout user
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
      });

    // Refresh token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state) => {
        // Token refresh failed, logout user
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const {
  clearError,
  completeOnboarding,
  updateUser,
  upgradeSubscription,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;