import React from 'react';
import { Progress, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const PreloadIndicator = ({ completed, total, isPreloading }) => {
  if (!isPreloading && completed === 0) return null;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'var(--bg-card)',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid var(--border-primary)',
      minWidth: '200px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <LoadingOutlined 
        style={{ 
          color: 'var(--brand-primary)',
          fontSize: '16px'
        }} 
        spin={isPreloading}
      />
      
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '4px'
        }}>
          {isPreloading ? 'Preloading pages...' : 'Pages ready!'}
        </div>
        
        <Tooltip title={`${completed} of ${total} pages loaded`}>
          <Progress
            percent={percentage}
            size="small"
            strokeColor="var(--brand-primary)"
            trailColor="var(--border-primary)"
            showInfo={false}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default PreloadIndicator;
