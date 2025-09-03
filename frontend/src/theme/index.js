// Bin Sultan ERP + POS Theme Configuration
export const themeConfig = {
  token: {
    // Brand Colors
    colorPrimary: '#1E40AF', // Deep Blue
    colorSuccess: '#16A34A', // Green
    colorWarning: '#F59E0B', // Amber
    colorError: '#DC2626', // Red
    colorInfo: '#059669', // Emerald Green
    
    // Neutral Colors
    colorTextBase: '#374151', // Dark Gray
    colorBgBase: '#FFFFFF', // White
    colorBgContainer: '#F9FAFB', // Light Gray
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F3F4F6', // Very Light Gray
    
    // Border and Surface
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F3F4F6',
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusXL: 16,
    
    // Typography
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 18,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontWeightStrong: 600,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingXL: 32,
    margin: 16,
    marginLG: 24,
    marginXL: 32,
    
    // Shadows
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowTertiary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  components: {
    // Button Components
    Button: {
      borderRadius: 8,
      fontWeight: 500,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    
    // Card Components
    Card: {
      borderRadius: 12,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      colorBgContainer: '#FFFFFF',
    },
    
    // Input Components
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      colorBorder: '#D1D5DB',
      colorPrimaryHover: '#1E40AF',
    },
    
    // Select Components
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    
    // Table Components
    Table: {
      borderRadius: 8,
      headerBg: '#F9FAFB',
      headerColor: '#374151',
      rowHoverBg: '#F3F4F6',
    },
    
    // Modal Components
    Modal: {
      borderRadius: 12,
      headerBg: '#1E40AF',
      titleColor: '#FFFFFF',
    },
    
    // Menu Components
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#059669',
      itemSelectedColor: '#FFFFFF',
      itemHoverBg: '#F3F4F6',
      itemHoverColor: '#1E40AF',
    },
    
    // Layout Components
    Layout: {
      headerBg: '#1E3A8A',
      siderBg: '#1E3A8A',
      bodyBg: '#F3F4F6',
    },
    
    // Typography Components
    Typography: {
      titleMarginBottom: 16,
      titleMarginTop: 0,
    },
    
    // Tag Components
    Tag: {
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 500,
    },
    
    // Badge Components
    Badge: {
      statusSize: 8,
      textFontSize: 12,
    },
    
    // Progress Components
    Progress: {
      defaultColor: '#1E40AF',
      successColor: '#16A34A',
      warningColor: '#F59E0B',
      errorColor: '#DC2626',
    },
    
    // Statistic Components
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 24,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
};

// Brand Color Palette - Modern Professional Scheme
export const brandColors = {
  primary: '#2563EB', // Modern Blue
  secondary: '#10B981', // Emerald Green
  accent: '#F59E0B', // Amber
  success: '#059669', // Forest Green
  warning: '#F97316', // Orange
  error: '#EF4444', // Red
  info: '#3B82F6', // Blue
  
  // Neutral Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#E2E8F0',
    dark: '#1E293B',
    sidebar: '#1E293B',
  },
  
  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#374151',
    tertiary: '#6B7280',
    inverse: '#FFFFFF',
  },
};

// Status Colors for different states
export const statusColors = {
  available: '#16A34A',
  reserved: '#1E40AF',
  damaged: '#DC2626',
  lowStock: '#F59E0B',
  outOfStock: '#6B7280',
  paid: '#16A34A',
  pending: '#F59E0B',
  overdue: '#DC2626',
  active: '#16A34A',
  inactive: '#6B7280',
};

// Role Colors for employees
export const roleColors = {
  cashier: '#1E40AF',
  tailor: '#7C3AED',
  manager: '#16A34A',
  delivery: '#F59E0B',
  admin: '#DC2626',
  owner: '#111827',
};

// Gradient Presets
export const gradients = {
  primary: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
  secondary: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
  accent: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
  success: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
  warning: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
  error: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
  dark: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
};

// Shadow Presets
export const shadows = {
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  colored: {
    primary: '0 4px 14px 0 rgba(30, 64, 175, 0.25)',
    success: '0 4px 14px 0 rgba(22, 163, 74, 0.25)',
    warning: '0 4px 14px 0 rgba(245, 158, 11, 0.25)',
    error: '0 4px 14px 0 rgba(220, 38, 38, 0.25)',
  },
};

export default themeConfig;
