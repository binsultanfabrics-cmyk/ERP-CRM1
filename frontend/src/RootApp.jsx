import './style/app.css';

import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';

const BinSultanOs = lazy(() => import('./apps/BinSultanOs'));

export default function RootApp() {
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
