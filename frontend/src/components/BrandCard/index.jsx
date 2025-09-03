import React from 'react';
import { Card } from 'antd';
import { brandColors, shadows } from '@/theme';

const BrandCard = ({ 
  type = 'default', 
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: '16px',
      boxShadow: shadows.lg,
      border: `1px solid ${brandColors.gray[200]}`,
      background: brandColors.background.primary,
      transition: 'all 0.3s ease',
      ...style
    };

    switch (type) {
      case 'gradient-primary':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${brandColors.primary} 0%, #3B82F6 100%)`,
          color: brandColors.text.inverse,
          border: 'none',
        };
      case 'gradient-success':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${brandColors.success} 0%, #22C55E 100%)`,
          color: brandColors.text.inverse,
          border: 'none',
        };
      case 'gradient-warning':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${brandColors.warning} 0%, #FBBF24 100%)`,
          color: brandColors.text.inverse,
          border: 'none',
        };
      case 'gradient-error':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${brandColors.error} 0%, #EF4444 100%)`,
          color: brandColors.text.inverse,
          border: 'none',
        };
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow: shadows.xl,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Card
      className={`brand-card brand-card-${type} ${className}`}
      style={getCardStyles()}
      {...props}
    >
      {children}
    </Card>
  );
};

export default BrandCard;
