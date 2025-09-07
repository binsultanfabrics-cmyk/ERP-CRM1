import React from 'react';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  InboxOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  ShopOutlined,
  CreditCardOutlined,
  AuditOutlined,
  EnvironmentOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';

export const navigationItems = [
  {
    key: 'dashboard',
    icon: React.createElement(DashboardOutlined),
    label: 'Dashboard',
    href: '/',
  },
  {
    key: 'pos',
    icon: React.createElement(ShoppingCartOutlined),
    label: 'Point of Sale',
    href: '/pos',
  },
  {
    key: 'products',
    icon: React.createElement(ShoppingOutlined),
    label: 'Products',
    href: '/product',
  },
  {
    key: 'inventory',
    icon: React.createElement(InboxOutlined),
    label: 'Inventory',
    href: '/inventory',
  },
  {
    key: 'customers',
    icon: React.createElement(TeamOutlined),
    label: 'Customers',
    href: '/customer',
  },
  {
    key: 'suppliers',
    icon: React.createElement(ShopOutlined),
    label: 'Suppliers',
    href: '/supplier',
  },
  {
    key: 'invoices',
    icon: React.createElement(FileTextOutlined),
    label: 'Invoices',
    href: '/invoice',
  },
  {
    key: 'purchase-orders',
    icon: React.createElement(FileDoneOutlined),
    label: 'Purchase Orders',
    href: '/purchase-orders',
  },
  {
    key: 'reports',
    icon: React.createElement(BarChartOutlined),
    label: 'Reports',
    href: '/reports',
  },
  {
    key: 'locations',
    icon: React.createElement(EnvironmentOutlined),
    label: 'Locations',
    href: '/locations',
  },
  {
    key: 'access-control',
    icon: React.createElement(AuditOutlined),
    label: 'Access Control',
    href: '/access-control',
  },
  {
    key: 'settings',
    icon: React.createElement(SettingOutlined),
    label: 'Settings',
    href: '/settings',
  },
];

export const getActiveKey = (pathname) => {
  const item = navigationItems.find(item => item.href === pathname);
  return item ? item.key : 'dashboard';
};
