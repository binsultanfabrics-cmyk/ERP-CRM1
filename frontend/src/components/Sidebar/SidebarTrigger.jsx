import React from 'react';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useSidebar } from './SidebarProvider';

export const SidebarTrigger = ({ className = '', style = {}, ...props }) => {
  const { isCollapsed, isMobileOpen, isMobile, toggleSidebar } = useSidebar();

  const getIcon = () => {
    if (isMobile) {
      return isMobileOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />;
    }
    return isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;
  };

  const triggerStyle = {
    position: 'fixed',
    top: '20px',
    left: isMobile ? '20px' : (isCollapsed ? '20px' : '300px'),
    zIndex: 1001,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-primary)',
    color: 'var(--text-primary)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'var(--shadow-md)',
    ...style,
  };

  return (
    <Button
      type="text"
      icon={getIcon()}
      onClick={toggleSidebar}
      className={`sidebar-trigger ${className}`}
      style={triggerStyle}
      {...props}
    />
  );
};
