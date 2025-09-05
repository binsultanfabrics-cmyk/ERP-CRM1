import React from 'react';
import { Menu } from 'antd';
import { useSidebar } from './SidebarProvider';

export const SidebarMenu = ({ 
  items = [], 
  className = '', 
  style = {},
  ...props 
}) => {
  const { isCollapsed } = useSidebar();

  const menuStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    ...style,
  };

  return (
    <div className={`sidebar-menu ${isCollapsed ? 'collapsed' : ''} ${className}`}>
      <Menu
        mode="inline"
        items={items}
        style={menuStyle}
        className="sidebar-menu-items"
        {...props}
      />
    </div>
  );
};
