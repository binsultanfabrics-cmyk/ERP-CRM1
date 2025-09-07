import './style/app.css';

import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';

const BinSultanOs = lazy(() => import('./apps/BinSultanOs'));

export default function RootApp() {
  // Initialize light theme by default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const root = document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('dark', 'light');
    
    // Apply the theme
    if (savedTheme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.add('dark');
    }
    
    // Ensure localStorage has the correct default
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
    }
  }, []);

  return (
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<PageLoader />}>
          <BinSultanOs />
        </Suspense>
      </Provider>
    </BrowserRouter>
  );
}
