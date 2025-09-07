import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { SidebarProvider } from '@/components/Sidebar/ModernSidebar';
import { AppSidebar } from '@/components/Sidebar/ModernAppSidebar';
import { TopBar } from '@/components/Layout/TopBar';

import PageLoader from '@/components/PageLoader';
import PagePreloader from '@/components/PagePreloader';

import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';

import AppRouter from '@/router/AppRouter';
import useResponsive from '@/hooks/useResponsive';

// Module rendering function
const renderModule = () => {
  // For now, we'll use the existing router
  // Later we can implement module-based rendering
  return <AppRouter />;
};

export default React.memo(function ErpCrmApp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("dashboard");

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, [dispatch]);

  // Handle preload completion
  const handlePreloadComplete = (completed, total) => {
    if (completed === total) {
      console.log(`🎉 All ${total} pages have been preloaded for instant navigation!`);
    }
  };

  const { isSuccess: settingIsloaded, isLoading: settingsLoading } = useSelector(selectSettings);

  // const useEffect(() => {
  //   const { loadDefaultLang } = storePersist.get('firstVisit');
  //   if (appSettings.bin_sultan_app_language && !loadDefaultLang) {
  //     window.localStorage.setItem('firstVisit', JSON.stringify({ loadDefaultLang: true }));
  //   }
  // }, [appSettings]);

  // Show loading while settings are loading
  if (settingsLoading || !settingIsloaded) {
    return <PageLoader />;
  }

  if (settingIsloaded) {
    return (
      <SidebarProvider>
        <div className="modern-layout">
          {/* Sidebar */}
          <AppSidebar 
            activeModule={activeModule} 
            setActiveModule={setActiveModule}
            onNavigate={navigate}
          />
          
          {/* Main Content Area */}
          <main className="main-content">
            {/* Top Bar */}
            <TopBar />
            
            {/* Page Content */}
            <div className="page-content">
              {renderModule()}
            </div>
          </main>

          {/* Background Page Preloader */}
          <PagePreloader 
            onPreloadComplete={handlePreloadComplete}
          />
        </div>
      </SidebarProvider>
    );
  } else {
    return <PageLoader />;
  }
});
