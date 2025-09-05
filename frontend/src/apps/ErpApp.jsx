import React, { useLayoutEffect, useMemo, useState } from 'react';
import { selectAppSettings } from '@/redux/settings/selectors';
import { useDispatch, useSelector } from 'react-redux';

import { Layout, notification } from 'antd';

import { useAppContext } from '@/context/appContext';

import { SidebarProvider, SidebarTrigger } from '@/components/Sidebar';
import { AppSidebar } from '@/components/Sidebar/AppSidebar';

import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';
import PagePreloader from '@/components/PagePreloader';

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

  // Handle preload completion
  const handlePreloadComplete = (completed, total) => {
    // Only log to console when preloading is complete
    if (completed === total) {
      console.log(`🎉 All ${total} pages have been preloaded for instant navigation!`);
    }
  };

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
    paddingLeft: isMobile ? '25px' : '20px', // Reduced padding since sidebar is now fixed
  }), [isMobile]);

  // Memoize the main layout styles
  const mainLayoutStyles = useMemo(() => ({
    marginLeft: 0, // Sidebar is now fixed positioned
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }), []);

  // const useEffect(() => {
  //   const { loadDefaultLang } = storePersist.get('firstVisit');
  //   if (appSettings.bin_sultan_app_language && !loadDefaultLang) {
  //     window.localStorage.setItem('firstVisit', JSON.stringify({ loadDefaultLang: true }));
  //   }
  // }, [appSettings]);

  if (settingIsloaded)
    return (
      <SidebarProvider>
        <Layout style={{ 
          minHeight: '100vh', 
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}>
          {/* New Collapsible Sidebar */}
          <AppSidebar />

          {/* Main Content Area */}
          <Layout style={{
            ...mainLayoutStyles, 
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)'
          }}>
            {/* Sidebar Trigger */}
            <SidebarTrigger />
            
            {/* Static Header - Never re-renders */}
            <HeaderContent />
            
            {/* Dynamic Content Area - Only this part updates */}
            <Content style={{
              ...contentStyles, 
              background: 'var(--bg-primary)', 
              color: 'var(--text-primary)'
            }}>
              <AppRouter />
            </Content>
          </Layout>

          {/* Background Page Preloader - Loads all pages after dashboard loads */}
          <PagePreloader 
            onPreloadComplete={handlePreloadComplete}
          />
        </Layout>
      </SidebarProvider>
    );
  else return <PageLoader />;
});
