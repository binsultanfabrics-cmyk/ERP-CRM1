import React from 'react';
import { Tooltip } from 'antd';
import { useSidebar } from './SidebarProvider';

export const SidebarMenuItem = ({ 
  icon, 
  label, 
  href, 
  onClick,
  isActive = false,
  className = '',
  ...props 
}) => {
  const { isCollapsed } = useSidebar();

  const itemContent = (
    <div 
      className={`sidebar-menu-item ${isActive ? 'active' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="sidebar-menu-item-icon">
        {icon}
      </div>
      {!isCollapsed && (
        <span className="sidebar-menu-item-label">
          {label}
        </span>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip 
        title={label} 
        placement="right"
        overlayClassName="sidebar-tooltip"
      >
        {itemContent}
      </Tooltip>
    );
  }

  return itemContent;
};
