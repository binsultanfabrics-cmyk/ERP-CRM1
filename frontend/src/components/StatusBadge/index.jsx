import React from 'react';
import { Tag } from 'antd';
import { statusColors, roleColors } from '@/theme';

const StatusBadge = ({ 
  type, 
  status, 
  role,
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const getBadgeStyles = () => {
    const baseStyles = {
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      border: 'none',
      ...style
    };

    // Status-based colors
    if (status) {
      switch (status.toLowerCase()) {
        case 'available':
          return {
            ...baseStyles,
            background: statusColors.available,
            color: '#FFFFFF',
          };
        case 'reserved':
          return {
            ...baseStyles,
            background: statusColors.reserved,
            color: '#FFFFFF',
          };
        case 'damaged':
          return {
            ...baseStyles,
            background: statusColors.damaged,
            color: '#FFFFFF',
          };
        case 'low stock':
        case 'lowstock':
          return {
            ...baseStyles,
            background: statusColors.lowStock,
            color: '#FFFFFF',
          };
        case 'out of stock':
        case 'outofstock':
          return {
            ...baseStyles,
            background: statusColors.outOfStock,
            color: '#FFFFFF',
          };
        case 'paid':
          return {
            ...baseStyles,
            background: statusColors.paid,
            color: '#FFFFFF',
          };
        case 'pending':
          return {
            ...baseStyles,
            background: statusColors.pending,
            color: '#FFFFFF',
          };
        case 'overdue':
          return {
            ...baseStyles,
            background: statusColors.overdue,
            color: '#FFFFFF',
          };
        case 'active':
          return {
            ...baseStyles,
            background: statusColors.active,
            color: '#FFFFFF',
          };
        case 'inactive':
          return {
            ...baseStyles,
            background: statusColors.inactive,
            color: '#FFFFFF',
          };
        default:
          return baseStyles;
      }
    }

    // Role-based colors
    if (role) {
      switch (role.toLowerCase()) {
        case 'cashier':
          return {
            ...baseStyles,
            background: roleColors.cashier,
            color: '#FFFFFF',
          };
        case 'tailor':
          return {
            ...baseStyles,
            background: roleColors.tailor,
            color: '#FFFFFF',
          };
        case 'manager':
          return {
            ...baseStyles,
            background: roleColors.manager,
            color: '#FFFFFF',
          };
        case 'delivery':
          return {
            ...baseStyles,
            background: roleColors.delivery,
            color: '#FFFFFF',
          };
        case 'admin':
          return {
            ...baseStyles,
            background: roleColors.admin,
            color: '#FFFFFF',
          };
        case 'owner':
          return {
            ...baseStyles,
            background: roleColors.owner,
            color: '#FFFFFF',
          };
        default:
          return baseStyles;
      }
    }

    // Type-based colors
    if (type) {
      switch (type.toLowerCase()) {
        case 'success':
          return {
            ...baseStyles,
            background: statusColors.available,
            color: '#FFFFFF',
          };
        case 'warning':
          return {
            ...baseStyles,
            background: statusColors.pending,
            color: '#FFFFFF',
          };
        case 'error':
          return {
            ...baseStyles,
            background: statusColors.damaged,
            color: '#FFFFFF',
          };
        case 'info':
          return {
            ...baseStyles,
            background: statusColors.reserved,
            color: '#FFFFFF',
          };
        default:
          return baseStyles;
      }
    }

    return baseStyles;
  };

  return (
    <Tag
      className={`status-badge ${className}`}
      style={getBadgeStyles()}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default StatusBadge;
