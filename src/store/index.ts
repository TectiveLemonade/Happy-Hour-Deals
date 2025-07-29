import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import slices
import authSlice from './slices/authSlice';
import venueSlice from './slices/venueSlice';
import searchSlice from './slices/searchSlice';
import userSlice from './slices/userSlice';
import cacheSlice from './slices/cacheSlice';

// Import middleware
import apiMiddleware from './middleware/apiMiddleware';
import cacheMiddleware from './middleware/cacheMiddleware';
import analyticsMiddleware from './middleware/analyticsMiddleware';

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  venues: venueSlice,
  search: searchSlice,
  user: userSlice,
  cache: cacheSlice,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'], // Only persist auth and user data
  blacklist: ['venues', 'search', 'cache'], // Don't persist temporary data
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      apiMiddleware,
      cacheMiddleware,
      analyticsMiddleware,
    ]),
  devTools: __DEV__,
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks
export {useAppDispatch, useAppSelector} from './hooks';