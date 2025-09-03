import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Badge, Button } from 'antd';

// import Notifications from '@/components/Notification';

import { LogoutOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { FILE_BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';

import UpgradeButton from './UpgradeButton';

export default React.memo(function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;

  const translate = useLanguage();

  const ProfileDropdown = React.memo(() => {
    const navigate = useNavigate();
    const handleClick = useCallback(() => {
      navigate('/profile');
    }, [navigate]);

    return (
      <div className="profileDropdown" onClick={handleClick}>
        <Avatar
          size="large"
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: '#2563EB',
            backgroundColor: currentAdmin?.photo ? 'rgba(255, 255, 255, 0.9)' : '#FFFFFF',
            boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 6px 1px',
            opacity: 1,
          }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    );
  });

  const DropdownMenu = React.memo(({ text }) => {
    return <span style={{}}>{text}</span>;
  });

  // Memoize the dropdown items to prevent unnecessary re-renders
  const items = useMemo(() => [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'}>
          <DropdownMenu text={translate('profile_settings')} />
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
    },

    {
      type: 'divider',
    },

    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to={'/logout'}>{translate('logout')}</Link>,
    },
  ], [translate, currentAdmin]);

  return (
    <Header
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        gap: '15px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        placement="bottomRight"
        stye={{ width: '280px', float: 'right' }}
      >
        {/* <Badge dot> */}
        <Avatar
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: '#2563EB',
            backgroundColor: currentAdmin?.photo ? 'rgba(255, 255, 255, 0.9)' : '#FFFFFF',
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.25)',
            float: 'right',
            cursor: 'pointer',
            border: '2px solid #FFFFFF',
            opacity: 1,
          }}
          size="large"
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        {/* </Badge> */}
      </Dropdown>

      {/* <AppsButton /> */}

      <UpgradeButton />
    </Header>
  );
});

//  console.log(
//    '🚀 Welcome to Bin Sultan! Did you know that we also offer commercial customization services? Contact us at hello@binsultan.com for more information.'
//  );
