import React from 'react';
import { Card, Typography, Space, Button } from 'antd';
import { useSidebar } from './SidebarProvider';

const { Title, Text } = Typography;

export const SidebarDemo = () => {
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();

  return (
    <Card 
      style={{ 
        margin: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <Space direction="vertical" size={16}>
        <Title level={4} style={{ color: 'var(--text-primary)', margin: 0 }}>
          🎯 Sidebar Status
        </Title>
        
        <Space direction="vertical" size={8}>
          <Text style={{ color: 'var(--text-secondary)' }}>
            <strong>Current State:</strong> {isCollapsed ? 'Collapsed (80px)' : 'Expanded (280px)'}
          </Text>
          <Text style={{ color: 'var(--text-secondary)' }}>
            <strong>Device:</strong> {isMobile ? 'Mobile' : 'Desktop'}
          </Text>
          <Text style={{ color: 'var(--text-secondary)' }}>
            <strong>Behavior:</strong> {isMobile ? 'Slide-in/out' : 'Collapsible'}
          </Text>
        </Space>

        <Button 
          type="primary" 
          onClick={toggleSidebar}
          style={{
            background: 'var(--gradient-primary)',
            border: 'none',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          {isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        </Button>

        <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
          💡 Click the hamburger menu button in the top-left to toggle the sidebar!
        </Text>
      </Space>
    </Card>
  );
};
