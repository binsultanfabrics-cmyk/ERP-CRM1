import React from 'react';
import { useSidebar } from './ModernSidebar';
import './ModernSidebar.css';

// Main Sidebar Component
export const Sidebar = ({ children, side = "left", variant = "sidebar", collapsible = "offcanvas" }) => {
  const { isMobile, isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar();

  if (isMobile) {
    return (
      <div className={`sidebar-mobile ${isMobileOpen ? 'open' : ''}`}>
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="sidebar-overlay"
            onClick={closeMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className="sidebar-mobile-content">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`sidebar-desktop ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {children}
    </div>
  );
};

// Sidebar Header
export const SidebarHeader = ({ children, className = '' }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className={`sidebar-header ${isCollapsed ? 'collapsed' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Sidebar Content
export const SidebarContent = ({ children, className = '' }) => {
  return (
    <div className={`sidebar-content ${className}`}>
      {children}
    </div>
  );
};

// Sidebar Group
export const SidebarGroup = ({ children, className = '' }) => {
  return (
    <div className={`sidebar-group ${className}`}>
      {children}
    </div>
  );
};

// Sidebar Group Label
export const SidebarGroupLabel = ({ children, className = '' }) => {
  const { isCollapsed } = useSidebar();
  
  if (isCollapsed) return null;
  
  return (
    <div className={`sidebar-group-label ${className}`}>
      {children}
    </div>
  );
};

// Sidebar Group Content
export const SidebarGroupContent = ({ children, className = '' }) => {
  return (
    <div className={`sidebar-group-content ${className}`}>
      {children}
    </div>
  );
};

// Sidebar Menu
export const SidebarMenu = ({ children, className = '' }) => {
  return (
    <div className={`sidebar-menu ${className}`}>
      {children}
    </div>
  );
};

// Sidebar Menu Item
export const SidebarMenuItem = ({ children, className = '' }) => {
  return (
    <div className={`sidebar-menu-item ${className}`}>
      {children}
    </div>
  );
};

// Sidebar Menu Button
export const SidebarMenuButton = ({ 
  children, 
  isActive = false, 
  onClick, 
  className = '',
  ...props 
}) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <button
      className={`sidebar-menu-button ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Sidebar Footer
export const SidebarFooter = ({ children, className = '' }) => {
  return (
    <div className={`sidebar-footer ${className}`}>
      {children}
    </div>
  );
};

// Sidebar Trigger
export const SidebarTrigger = ({ className = '' }) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <button
      className={`sidebar-trigger ${className}`}
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
      >
        <path
          d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};
