import React from 'react';
import { Button } from 'antd';
import { brandColors, shadows } from '@/theme';

const BrandButton = ({ 
  type = 'primary', 
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: '8px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      ...style
    };

    switch (type) {
      case 'primary':
        return {
          ...baseStyles,
          background: brandColors.primary,
          borderColor: brandColors.primary,
          color: brandColors.text.inverse,
          boxShadow: shadows.colored.primary,
        };
      case 'success':
        return {
          ...baseStyles,
          background: brandColors.success,
          borderColor: brandColors.success,
          color: brandColors.text.inverse,
          boxShadow: shadows.colored.success,
        };
      case 'warning':
        return {
          ...baseStyles,
          background: brandColors.warning,
          borderColor: brandColors.warning,
          color: brandColors.text.inverse,
          boxShadow: shadows.colored.warning,
        };
      case 'error':
        return {
          ...baseStyles,
          background: brandColors.error,
          borderColor: brandColors.error,
          color: brandColors.text.inverse,
          boxShadow: shadows.colored.error,
        };
      case 'secondary':
        return {
          ...baseStyles,
          background: brandColors.secondary,
          borderColor: brandColors.secondary,
          color: brandColors.text.inverse,
          boxShadow: shadows.colored.success,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Button
      className={`brand-button brand-button-${type} ${className}`}
      style={getButtonStyles()}
      {...props}
    >
      {children}
    </Button>
  );
};

export default BrandButton;
