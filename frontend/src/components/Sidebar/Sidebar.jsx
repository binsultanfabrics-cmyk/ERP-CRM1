import React from 'react';
import { Layout } from 'antd';
import { useSidebar } from './SidebarProvider';
import './Sidebar.css';

const { Sider } = Layout;

export const Sidebar = ({ children, className = '', ...props }) => {
  const { isCollapsed, isMobileOpen, isMobile } = useSidebar();

  const sidebarWidth = isCollapsed ? 80 : 280;
  const mobileWidth = 280;

  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-primary)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)',
  };

  const mobileStyle = {
    ...sidebarStyle,
    transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
    width: mobileWidth,
  };

  const desktopStyle = {
    ...sidebarStyle,
    width: sidebarWidth,
    transform: 'translateX(0)',
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => {
            const { closeMobileSidebar } = useSidebar();
            closeMobileSidebar();
          }}
        />
      )}

      {/* Sidebar */}
      <Sider
        className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} ${isMobile ? 'sidebar-mobile' : 'sidebar-desktop'} ${className}`}
        style={isMobile ? mobileStyle : desktopStyle}
        {...props}
      >
        <div className="sidebar-content">
          {children}
        </div>
      </Sider>
    </>
  );
};
