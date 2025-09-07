import React from 'react';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter 
} from './ModernSidebarComponents';

// Import icons from Ant Design
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

const menuItems = [
  { title: "Dashboard", icon: DashboardOutlined, id: "dashboard", href: "/dashboard" },
  { title: "POS System", icon: ShoppingCartOutlined, id: "pos", href: "/pos" },
  { title: "Products", icon: ShopOutlined, id: "products", href: "/products" },
  { title: "Inventory", icon: InboxOutlined, id: "inventory", href: "/inventory" },
  { title: "Customers", icon: TeamOutlined, id: "customers", href: "/customers" },
  { title: "Suppliers", icon: TeamOutlined, id: "suppliers", href: "/suppliers" },
  { title: "Employees", icon: UserOutlined, id: "employees", href: "/employees" },
  { title: "Invoices", icon: FileTextOutlined, id: "invoices", href: "/invoice" },
  { title: "Purchase Orders", icon: FileDoneOutlined, id: "purchase-orders", href: "/purchase-orders" },
  { title: "Payments", icon: CreditCardOutlined, id: "payments", href: "/payments" },
  { title: "Reports", icon: BarChartOutlined, id: "reports", href: "/reports" },
  { title: "Settings", icon: SettingOutlined, id: "settings", href: "/settings" },
];

export const AppSidebar = ({ activeModule, setActiveModule, onNavigate }) => {
  const handleMenuClick = (item) => {
    setActiveModule(item.id);
    if (onNavigate) {
      onNavigate(item.href);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="sidebar-logo">
          🏪
        </div>
        <div className="sidebar-brand">
          <h3 className="sidebar-brand-name">Bin Sultan ERP</h3>
          <p className="sidebar-brand-subtitle">Business Management</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleMenuClick(item)}
                    isActive={activeModule === item.id}
                  >
                    <div className="menu-icon">
                      <item.icon />
                    </div>
                    <span className="menu-text">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          padding: '0.5rem',
          borderRadius: '6px',
          background: 'var(--bg-hover)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: 'var(--text-primary)',
              lineHeight: '1.2'
            }}>
              Admin User
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              lineHeight: '1.2'
            }}>
              admin@admin.com
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
