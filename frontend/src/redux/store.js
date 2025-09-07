import { configureStore } from '@reduxjs/toolkit';

import lang from '@/locale/translation/en_us';

import rootReducer from './rootReducer';
import storePersist from './storePersist';

// localStorageHealthCheck();

const AUTH_INITIAL_STATE = {
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

// Check for persisted auth state
const persistedAuth = storePersist.get('auth');
const auth_state = persistedAuth && persistedAuth.isLoggedIn ? {
  ...persistedAuth,
  isLoading: false, // Don't start in loading state
} : AUTH_INITIAL_STATE;

const initialState = { auth: auth_state };

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  devTools: import.meta.env.PROD === false, // Enable Redux DevTools in development mode
});

console.log(
  '🚀 Welcome to Bin Sultan! Did you know that we also offer commercial customization services? Contact us at hello@binsultan.com for more information.'
);

export default store;
