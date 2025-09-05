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
  ShoppingBagOutlined,
} from '@ant-design/icons';

export const navigationItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    href: '/',
  },
  {
    key: 'pos',
    icon: <ShoppingCartOutlined />,
    label: 'Point of Sale',
    href: '/pos',
  },
  {
    key: 'products',
    icon: <ShoppingOutlined />,
    label: 'Products',
    href: '/product',
  },
  {
    key: 'inventory',
    icon: <InboxOutlined />,
    label: 'Inventory',
    href: '/inventory',
  },
  {
    key: 'customers',
    icon: <TeamOutlined />,
    label: 'Customers',
    href: '/customer',
  },
  {
    key: 'suppliers',
    icon: <ShopOutlined />,
    label: 'Suppliers',
    href: '/supplier',
  },
  {
    key: 'invoices',
    icon: <FileTextOutlined />,
    label: 'Invoices',
    href: '/invoice',
  },
  {
    key: 'purchase-orders',
    icon: <ShoppingBagOutlined />,
    label: 'Purchase Orders',
    href: '/purchase-orders',
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
    href: '/reports',
  },
  {
    key: 'locations',
    icon: <EnvironmentOutlined />,
    label: 'Locations',
    href: '/locations',
  },
  {
    key: 'access-control',
    icon: <AuditOutlined />,
    label: 'Access Control',
    href: '/access-control',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    href: '/settings',
  },
];

export const getActiveKey = (pathname) => {
  const item = navigationItems.find(item => item.href === pathname);
  return item ? item.key : 'dashboard';
};
