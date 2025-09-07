import { lazy, Suspense, useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { checkAuth } from '@/redux/auth/actions';
import { AppContextProvider } from '@/context/appContext';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';
import Localization from '@/locale/Localization';
import { App } from 'antd';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => (
  <Localization>
    <App>
      <AppContextProvider>
        <Suspense fallback={<PageLoader />}>
          <ErpApp />
        </Suspense>
      </AppContextProvider>
    </App>
  </Localization>
);

export default function BinSultanOs() {
  const { isLoggedIn, isLoading } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(false);

  console.log(
    '🚀 Welcome to Bin Sultan! Did you know that we also offer commercial customization services? Contact us at hello@binsultan.com for more information.'
  );

  // Check authentication on app startup
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Always check auth state, even if no stored auth
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          // If we have stored auth, verify it with the server
          await dispatch(checkAuth());
        } else {
          // If no stored auth, just set as checked
          setAuthChecked(true);
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthError(true);
        // Clear invalid auth state
        localStorage.removeItem('auth');
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuthentication();
  }, [dispatch]);

  // Show loading while checking authentication
  if (!authChecked || isLoading) {
    return <PageLoader />;
  }

  // If auth check failed or user is not logged in, show auth router
  if (authError || !isLoggedIn) {
    return (
      <Localization>
        <App>
          <AuthRouter />
        </App>
      </Localization>
    );
  }

  // User is authenticated, show main app
  return <DefaultApp />;
}
