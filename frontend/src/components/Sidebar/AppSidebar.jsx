import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarFooter,
  useSidebar 
} from './index';
import { navigationItems, getActiveKey } from './navigationConfig';

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const activeKey = getActiveKey(location.pathname);

  const handleMenuClick = (href) => {
    navigate(href);
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const menuItems = navigationItems.map(item => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => handleMenuClick(item.href),
    className: activeKey === item.key ? 'active' : '',
  }));

  return (
    <Sidebar>
      <SidebarHeader 
        title="Bin Sultan ERP"
        subtitle="Business Management"
        logo="🏪"
      />
      
      <SidebarMenu items={menuItems} />
      
      <SidebarFooter
        user={{ name: 'Admin', email: 'admin@admin.com' }}
        onLogout={handleLogout}
        onProfile={handleProfile}
        onSettings={handleSettings}
      />
    </Sidebar>
  );
};
