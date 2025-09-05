import React from 'react';
import { Typography, Space, Button } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useSidebar } from './SidebarProvider';

const { Text } = Typography;

export const SidebarFooter = ({ 
  user = { name: 'Admin', email: 'admin@admin.com' },
  onLogout,
  onProfile,
  onSettings,
  className = '',
  ...props 
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`sidebar-footer ${isCollapsed ? 'collapsed' : ''} ${className}`} {...props}>
      {!isCollapsed ? (
        <div className="sidebar-user-info">
          <Space direction="vertical" size={4}>
            <Text strong style={{ color: 'var(--text-primary)' }}>
              {user.name}
            </Text>
            <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              {user.email}
            </Text>
          </Space>
          <Space size={8}>
            <Button
              type="text"
              icon={<UserOutlined />}
              onClick={onProfile}
              size="small"
              style={{ color: 'var(--text-secondary)' }}
            />
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={onSettings}
              size="small"
              style={{ color: 'var(--text-secondary)' }}
            />
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={onLogout}
              size="small"
              style={{ color: 'var(--text-secondary)' }}
            />
          </Space>
        </div>
      ) : (
        <div className="sidebar-footer-collapsed">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={onLogout}
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>
      )}
    </div>
  );
};
