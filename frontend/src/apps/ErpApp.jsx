import React, { useLayoutEffect, useMemo } from 'react';
import { selectAppSettings } from '@/redux/settings/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { brandColors } from '@/theme';

import { Layout } from 'antd';

import { useAppContext } from '@/context/appContext';

import Navigation from '@/apps/Navigation/NavigationContainer';

import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';

import { settingsAction } from '@/redux/settings/actions';

import { selectSettings } from '@/redux/settings/selectors';

import AppRouter from '@/router/AppRouter';

import useResponsive from '@/hooks/useResponsive';

import storePersist from '@/redux/storePersist';

export default React.memo(function ErpCrmApp() {
  const { Content } = Layout;

  // const { state: stateApp, appContextAction } = useAppContext();
  // // const { app } = appContextAction;
  // const { isNavMenuClose, currentApp } = stateApp;

  const { isMobile } = useResponsive();

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, [dispatch]);

  // const appSettings = useSelector(selectAppSettings);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  // Memoize the content styles to prevent unnecessary re-renders
  const contentStyles = useMemo(() => ({
    margin: '40px auto 30px',
    overflow: 'initial',
    width: '100%',
    padding: isMobile ? '0 25px' : '0 20px',
    maxWidth: isMobile ? 'none' : '100vw', // Full viewport width
    minHeight: 'calc(100vh - 120px)', // Account for header and margins
    paddingLeft: isMobile ? '25px' : '296px', // Add left padding to account for sidebar + 20px spacing
  }), [isMobile]);

  // Memoize the main layout styles
  const mainLayoutStyles = useMemo(() => ({
    marginLeft: isMobile ? 0 : 0, // Remove margin to eliminate empty space
    background: '#E2E8F0',
  }), [isMobile]);

  // const useEffect(() => {
  //   const { loadDefaultLang } = storePersist.get('firstVisit');
  //   if (appSettings.idurar_app_language && !loadDefaultLang) {
  //     window.localStorage.setItem('firstVisit', JSON.stringify({ loadDefaultLang: true }));
  //   }
  // }, [appSettings]);

  if (settingIsloaded)
    return (
      <Layout hasSider style={{ minHeight: '100vh', background: '#E2E8F0' }}>
        {/* Static Sidebar - Never re-renders */}
        <Navigation />

        {/* Main Content Area */}
        <Layout style={mainLayoutStyles}>
          {/* Static Header - Never re-renders */}
          <HeaderContent />
          
          {/* Dynamic Content Area - Only this part updates */}
          <Content style={contentStyles}>
            <AppRouter />
          </Content>
        </Layout>
      </Layout>
    );
  else return <PageLoader />;
});
