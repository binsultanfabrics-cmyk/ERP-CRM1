import React from 'react';
import { Typography, Space } from 'antd';
import { useSidebar } from './SidebarProvider';

const { Title, Text } = Typography;

export const SidebarHeader = ({ 
  title = 'Bin Sultan ERP', 
  subtitle = 'Business Management',
  logo = '🏪',
  className = '',
  ...props 
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`sidebar-header ${isCollapsed ? 'collapsed' : ''} ${className}`} {...props}>
      <Space align="center" size={12}>
        <div className="sidebar-logo">
          <span className="logo-icon">{logo}</span>
        </div>
        {!isCollapsed && (
          <div className="sidebar-title">
            <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
              {title}
            </Title>
            <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              {subtitle}
            </Text>
          </div>
        )}
      </Space>
    </div>
  );
};
