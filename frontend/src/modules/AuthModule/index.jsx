import useLanguage from '@/locale/useLanguage';

import { Layout, Col, Divider, Typography, Card } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';

const { Content } = Layout;
const { Title, Text } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();
  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content
        style={{
          padding: '0',
          maxWidth: '500px',
          margin: '0 auto',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: 'var(--bg-primary)'
        }}
      >
        {/* Hero Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          zIndex: 1
        }} />
        
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(30, 64, 175, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 2
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 2
        }} />

        {/* Centered Login Form */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '400px',
          padding: '20px'
        }}>
          {/* Brand Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'var(--glass-bg)',
              padding: '20px',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)'
            }}>
              <ShopOutlined style={{ 
                fontSize: '48px', 
                color: 'var(--brand-primary)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }} />
            </div>
            <Title level={1} style={{ 
              color: 'var(--text-primary)', 
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: '800',
              letterSpacing: '1px'
            }}>
              Bin Sultan
            </Title>
            <Text style={{ 
              color: 'var(--text-secondary)',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Fashion & Lifestyle Store
            </Text>
          </div>

          {/* Glassmorphism Login Card */}
          <Card
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              boxShadow: 'var(--glass-shadow)',
              backdropFilter: 'blur(20px)',
            }}
            bodyStyle={{ padding: '40px 30px' }}
          >
            <Title level={2} style={{ 
              textAlign: 'center',
              color: 'var(--text-primary)',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '30px'
            }}>
              {translate(AUTH_TITLE)}
            </Title>
            
            <div className="site-layout-content">{authContent}</div>
          </Card>
        </div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
