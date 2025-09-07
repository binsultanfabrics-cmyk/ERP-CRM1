import React, { createContext, useContext, useState, useEffect } from 'react';
import useResponsive from '@/hooks/useResponsive';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children, defaultOpen = true }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isMobile } = useResponsive();

  // Auto-collapse on mobile when screen size changes
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  // Keyboard shortcut (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const value = {
    isCollapsed,
    isMobileOpen,
    isMobile,
    toggleSidebar,
    closeMobileSidebar,
    setIsCollapsed,
    setIsMobileOpen,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
