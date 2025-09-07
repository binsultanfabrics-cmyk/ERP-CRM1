import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Button } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';

import { SidebarTrigger } from '@/components/Sidebar/ModernSidebarComponents';
import { ThemeToggle } from './ThemeToggle';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { FILE_BASE_URL } from '@/config/serverApiConfig';

export const TopBar = () => {
  const navigate = useNavigate();
  const currentAdmin = useSelector(selectCurrentAdmin);

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
      onClick: handleProfile,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'App Settings',
      onClick: handleSettings,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="top-bar">
      {/* Left Side */}
      <div className="top-bar-left">
        <SidebarTrigger />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-3)',
          marginLeft: 'var(--space-4)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            🏪
          </div>
          <div>
            <div style={{ 
              fontFamily: 'var(--font-secondary)',
              fontSize: '1.125rem', 
              fontWeight: '700', 
              color: 'var(--text-primary)',
              lineHeight: '1.2'
            }}>
              Bin Sultan ERP
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              lineHeight: '1.2'
            }}>
              Business Management System
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="top-bar-right">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              height: 'auto',
              background: 'transparent',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-primary)',
              transition: 'var(--transition-fast)'
            }}
          >
            <Avatar
              size="small"
              src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
              style={{
                backgroundColor: currentAdmin?.photo ? 'transparent' : 'var(--primary)',
                color: 'white'
              }}
            >
              {currentAdmin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500',
                lineHeight: '1.2'
              }}>
                {currentAdmin?.name || 'Admin User'}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-secondary)',
                lineHeight: '1.2'
              }}>
                {currentAdmin?.email || 'admin@admin.com'}
              </div>
            </div>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};
