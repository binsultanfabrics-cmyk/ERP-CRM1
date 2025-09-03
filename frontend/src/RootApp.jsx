import './style/app.css';
import './style/global.css';

import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';
import { themeConfig } from '@/theme';

const IdurarOs = lazy(() => import('./apps/IdurarOs'));

export default function RoutApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider theme={themeConfig}>
          <Suspense fallback={<PageLoader />}>
            <IdurarOs />
          </Suspense>
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  );
}
