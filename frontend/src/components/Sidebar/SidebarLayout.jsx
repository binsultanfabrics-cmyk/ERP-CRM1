import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { useSidebar } from './SidebarProvider';
import useResponsive from '@/hooks/useResponsive';

const { Content } = Layout;

export const SidebarLayout = ({ children, style = {}, ...props }) => {
  const { isCollapsed, isMobileOpen, isMobile } = useSidebar();
  const { isMobile: responsiveMobile } = useResponsive();

  const contentStyles = useMemo(() => {
    if (responsiveMobile) {
      // On mobile, content takes full width
      return {
        marginLeft: 0,
        width: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...style,
      };
    } else {
      // On desktop, content starts where sidebar ends
      const sidebarWidth = isCollapsed ? 80 : 280;
      return {
        marginLeft: `${sidebarWidth}px`,
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...style,
      };
    }
  }, [isCollapsed, responsiveMobile, style]);

  return (
    <Content style={contentStyles} {...props}>
      {children}
    </Content>
  );
};
