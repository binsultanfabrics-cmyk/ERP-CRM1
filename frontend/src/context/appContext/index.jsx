import { useMemo, useReducer, createContext, useContext, useCallback } from 'react';
import { initialState, contextReducer } from './reducer';
import contextActions from './actions';

const AppContext = createContext();

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  
  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => [state, dispatch], [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  const [state, dispatch] = context;
  
  // Memoize the app context actions to prevent recreation on every render
  const appContextAction = useMemo(() => contextActions(dispatch), [dispatch]);
  
  return { state, appContextAction };
}

export { AppContextProvider, useAppContext };
