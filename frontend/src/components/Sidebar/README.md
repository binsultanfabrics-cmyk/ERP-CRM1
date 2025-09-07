# 🎨 Modern Collapsible Sidebar System

A comprehensive, responsive sidebar system designed specifically for the Bin Sultan ERP application with dark theme integration.

## ✨ Features

### 🖥️ **Desktop Experience**
- **Fixed Position**: Always visible on the left side
- **Collapsible**: Toggle between full width (280px) and icon-only (80px)
- **Smooth Transitions**: CSS transitions for width changes
- **Hover Effects**: Interactive menu items with smooth animations

### 📱 **Mobile Experience**
- **Slide-in Sidebar**: Offcanvas behavior triggered by toggle button
- **Overlay**: Dark backdrop when sidebar is open
- **Touch-friendly**: Optimized for mobile interactions

### 🎯 **Core Components**

#### `SidebarProvider`
- Context provider for sidebar state management
- Handles collapsed/expanded states
- Manages mobile/desktop responsive behavior

#### `Sidebar`
- Main sidebar container with fixed positioning
- Responsive width management
- Smooth transition animations

#### `SidebarTrigger`
- Toggle button for expand/collapse functionality
- Responsive positioning (desktop vs mobile)
- Animated icon changes

#### `SidebarHeader`
- Brand logo and title display
- Collapsible text content
- Consistent theming

#### `SidebarMenu`
- Navigation menu container
- Smooth item animations
- Active state highlighting

#### `SidebarMenuItem`
- Individual menu items
- Tooltip support for collapsed state
- Icon and label display

#### `SidebarFooter`
- User information display
- Action buttons (Profile, Settings, Logout)
- Collapsible content

## 🎨 **Styling & Theming**

### **Dark Theme Integration**
- Uses CSS variables from `bin-sultan-theme.css`
- Consistent with app's color palette
- Proper contrast ratios for accessibility

### **Color Scheme**
- **Background**: `var(--bg-secondary)` - Dark secondary background
- **Text**: `var(--text-primary)` - High contrast white text
- **Accent**: `var(--brand-primary)` - Blue accent for active states
- **Borders**: `var(--border-primary)` - Subtle border colors

### **Animations**
- **Width Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)` for smooth width changes
- **Hover Effects**: `translateX(4px)` for menu item interactions
- **Icon Animations**: Smooth icon transitions
- **Mobile Slide**: Slide-in/out animations for mobile

## 📱 **Responsive Behavior**

### **Desktop (≥769px)**
- Fixed left sidebar
- Collapsible between 280px and 80px
- Toggle button positioned relative to sidebar

### **Mobile (≤768px)**
- Hidden by default
- Slide-in from left when triggered
- Overlay backdrop
- Toggle button fixed in top-left

## 🚀 **Usage**

### **Basic Implementation**
```jsx
import { SidebarProvider, AppSidebar, SidebarTrigger } from '@/components/Sidebar';

function App() {
  return (
    <SidebarProvider>
      <Layout>
        <AppSidebar />
        <Layout>
          <SidebarTrigger />
          <Content>
            {/* Your content */}
          </Content>
        </Layout>
      </Layout>
    </SidebarProvider>
  );
}
```

### **Custom Sidebar**
```jsx
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarFooter 
} from '@/components/Sidebar';

function CustomSidebar() {
  return (
    <Sidebar>
      <SidebarHeader title="My App" logo="🚀" />
      <SidebarMenu items={menuItems} />
      <SidebarFooter user={userData} onLogout={handleLogout} />
    </Sidebar>
  );
}
```

## ⚙️ **Configuration**

### **Navigation Items**
Configure menu items in `navigationConfig.js`:
```javascript
export const navigationItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    href: '/',
  },
  // ... more items
];
```

### **Styling Customization**
Override CSS variables or add custom classes:
```css
.sidebar {
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 80px;
  --sidebar-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🔧 **Integration**

### **Layout Integration**
- Seamlessly integrates with existing Ant Design Layout
- No breaking changes to current page structure
- Maintains all existing functionality

### **Theme Consistency**
- Uses existing CSS variables
- Matches current dark theme
- Consistent with app's design language

### **Performance**
- Optimized with React.memo
- Minimal re-renders
- Smooth 60fps animations

## 📋 **Navigation Items**

The sidebar includes all major ERP sections:
- 🏠 Dashboard
- 🛒 Point of Sale
- 📦 Products
- 📋 Inventory
- 👥 Customers
- 🏢 Suppliers
- 📄 Invoices
- 🛍️ Purchase Orders
- 📊 Reports
- 📍 Locations
- 🔐 Access Control
- ⚙️ Settings

## 🎯 **Accessibility**

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **High Contrast**: Meets accessibility standards
- **Focus Management**: Clear focus indicators

## 🚀 **Future Enhancements**

- [ ] Nested menu support
- [ ] Custom menu item components
- [ ] Theme switching
- [ ] Drag-to-resize
- [ ] Custom animations
- [ ] Search functionality

This sidebar system provides a modern, responsive, and accessible navigation experience that perfectly integrates with the Bin Sultan ERP application's design and functionality.
