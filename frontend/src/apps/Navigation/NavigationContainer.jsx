import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  DashboardOutlined,
  ReconciliationOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  InboxOutlined,
  UserOutlined,
  BarChartOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { ShopOutlined } from '@ant-design/icons';

const { Sider } = Layout;

export default React.memo(function NavigationContainer() {
  const translate = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname === '/' ? 'dashboard' : location.pathname.slice(1));
  const [isNavMenuClose, setIsNavMenuClose] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [collapsible, setCollapsible] = useState(false);
  const [showLogoApp, setShowLogoApp] = useState(false);

  // Create navigation handlers that prevent default behavior
  const createNavigationHandler = useCallback((path) => {
    return (e) => {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
      }
      console.log(`Navigating to: ${path}`); // Debug log
      navigate(path);
    };
  }, [navigate]);

  // Memoize the items array to prevent unnecessary re-renders
  const items = useMemo(() => [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: translate('dashboard'),
      onClick: createNavigationHandler('/'),
    },
    {
      key: 'pos',
      icon: <ShoppingCartOutlined />,
      label: 'POS Sales',
      onClick: createNavigationHandler('/pos'),
    },
    {
      key: 'product',
      icon: <ShoppingOutlined />,
      label: 'Products',
      onClick: createNavigationHandler('/product'),
    },
    {
      key: 'inventory',
      icon: <InboxOutlined />,
      label: 'Inventory',
      onClick: createNavigationHandler('/inventory'),
    },
    {
      key: 'customer',
      icon: <CustomerServiceOutlined />,
      label: 'Customers',
      onClick: createNavigationHandler('/customer'),
    },
    {
      key: 'supplier',
      icon: <UserOutlined />,
      label: 'Suppliers',
      onClick: createNavigationHandler('/supplier'),
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
      onClick: createNavigationHandler('/reports'),
    },
    {
      key: 'purchase-orders',
      label: 'Purchase Orders',
      icon: <FileTextOutlined />,
      onClick: createNavigationHandler('/purchase-orders'),
    },
    {
      key: 'locations',
      label: 'Locations',
      icon: <EnvironmentOutlined />,
      onClick: createNavigationHandler('/locations'),
    },
    {
      key: 'access-control',
      label: 'Access Control',
      icon: <SafetyOutlined />,
      onClick: createNavigationHandler('/access-control'),
    },
    {
      key: 'invoice',
      icon: <ContainerOutlined />,
      label: translate('invoices'),
      onClick: createNavigationHandler('/invoice'),
    },
    {
      key: 'generalSettings',
      label: translate('settings'),
      icon: <SettingOutlined />,
      onClick: createNavigationHandler('/settings'),
    },

  ], [translate, createNavigationHandler]);

  // Optimize resize handler
  const handleResize = useCallback(() => {
    const isMobileView = window.innerWidth <= 768;
    setIsMobile(isMobileView);
    setCollapsible(isMobileView);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Update current path when location changes - only when pathname actually changes
  useEffect(() => {
    const newPath = location.pathname === '/' ? 'dashboard' : location.pathname.slice(1);
    setCurrentPath(newPath);
  }, [location.pathname]); // Remove currentPath from dependencies to prevent infinite loops

  // Optimize logo show/hide logic
  useEffect(() => {
    if (isNavMenuClose) {
      setShowLogoApp(true);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setShowLogoApp(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);
  
  const onCollapse = useCallback(() => {
    setIsNavMenuClose(!isNavMenuClose);
  }, [isNavMenuClose]);

  const handleLogoClick = useCallback((e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    console.log('Logo clicked, navigating to dashboard'); // Debug log
    navigate('/');
  }, [navigate]);

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={256}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: isMobile ? 'absolute' : 'fixed',
        bottom: '20px',
        ...(!isMobile && {
          ['left']: '20px',
          top: '20px',
          zIndex: 1000,
        }),
      }}
      theme={'light'}
    >
      <div
        className="logo"
        onClick={handleLogoClick}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '20px 20px',
          background: 'var(--gradient-primary)',
          margin: '16px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid var(--border-accent)',
          minHeight: '80px',
          maxHeight: '80px',
          width: 'calc(100% - 32px)',
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }}
      >
        <ShopOutlined style={{ 
          fontSize: '32px', 
          color: 'var(--bg-primary)', 
          opacity: 1,
          marginRight: '12px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          flexShrink: 0
        }} />
        {!showLogoApp && (
          <div style={{ 
            color: 'var(--bg-primary)', 
            fontWeight: '800', 
            fontSize: '16px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '0.2px',
            whiteSpace: 'nowrap',
            lineHeight: '1.2',
            flex: 1,
            minWidth: 0
          }}>
            Bin Sultan
          </div>
        )}
      </div>
      <Menu
        items={items}
        mode="inline"
        theme={'light'}
        selectedKeys={[currentPath]}
        style={{
          width: 256,
        }}
      />
    </Sider>
  );
});

