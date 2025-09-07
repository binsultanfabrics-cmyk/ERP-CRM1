import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import useLanguage from '@/locale/useLanguage';

const { Title, Text, Link } = Typography;

export default function ModernLogin() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);

  useEffect(() => {
    if (isSuccess) {
      navigate('/dashboard');
    }
  }, [isSuccess, navigate]);

  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
        `,
        zIndex: 1
      }} />

      {/* Main Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-8)',
        alignItems: 'center'
      }}>
        {/* Left Side - Branding */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          padding: 'var(--space-8)'
        }}>
          {/* Logo */}
          <div style={{
            width: '120px',
            height: '120px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-2xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
              🏪
            </span>
          </div>

          {/* Brand Text */}
          <Title level={1} style={{
            color: 'white',
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: 'var(--space-4)',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontFamily: 'var(--font-secondary)'
          }}>
            Bin Sultan ERP
          </Title>

          <Text style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.25rem',
            fontWeight: '500',
            marginBottom: 'var(--space-6)',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            lineHeight: '1.6'
          }}>
            Modern Business Management System
          </Text>

          <Text style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem',
            lineHeight: '1.6',
            maxWidth: '400px'
          }}>
            Streamline your business operations with our comprehensive ERP solution. 
            Manage inventory, sales, customers, and more with ease.
          </Text>

          {/* Features */}
          <div style={{
            marginTop: 'var(--space-8)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-4)',
            width: '100%',
            maxWidth: '400px'
          }}>
            {[
              { icon: '📊', text: 'Analytics & Reports' },
              { icon: '🛒', text: 'POS System' },
              { icon: '👥', text: 'Customer Management' },
              { icon: '📦', text: 'Inventory Control' }
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3)',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{feature.icon}</span>
                <Text style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                  {feature.text}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)'
        }}>
          <Card style={{
            width: '100%',
            maxWidth: '400px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-2xl)',
            padding: 'var(--space-8)'
          }}>
            {/* Form Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <Title level={2} style={{
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-secondary)',
                fontWeight: '700'
              }}>
                Welcome Back
              </Title>
              <Text style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Sign in to your account to continue
              </Text>
            </div>

            {/* Login Form */}
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              style={{ width: '100%' }}
              initialValues={{
                remember: true,
                email: 'admin@binsultan.com',
                password: 'admin123',
              }}
            >
              <Form.Item
                name="email"
                label={<Text style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Email Address</Text>}
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
                style={{ marginBottom: 'var(--space-6)' }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: 'var(--text-muted)' }} />}
                  placeholder="Enter your email"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid var(--border-primary)',
                    padding: 'var(--space-3) var(--space-4)',
                    fontSize: '1rem',
                    transition: 'var(--transition-fast)'
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<Text style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Password</Text>}
                rules={[{ required: true, message: 'Please input your password!' }]}
                style={{ marginBottom: 'var(--space-6)' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
                  placeholder="Enter your password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid var(--border-primary)',
                    padding: 'var(--space-3) var(--space-4)',
                    fontSize: '1rem',
                    transition: 'var(--transition-fast)'
                  }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Link style={{ color: 'var(--primary)', fontWeight: '500' }}>
                    Forgot Password?
                  </Link>
                </div>
              </Form.Item>

              <Form.Item style={{ marginBottom: 'var(--space-6)' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                style={{
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'var(--transition-fast)'
                }}
              >
                {translate('Log in')}
              </Button>
              </Form.Item>

              <Divider style={{ margin: 'var(--space-6) 0' }}>
                <Text style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Don&apos;t have an account?
                </Text>
              </Divider>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  block
                  style={{
                    height: '48px',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    background: 'transparent',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx="true">{`
        .ant-input:focus,
        .ant-input-focused {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
        }

        .ant-input-password:focus,
        .ant-input-password-focused {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
        }

        .ant-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-lg) !important;
        }

        .ant-card {
          transition: var(--transition-normal);
        }

        .ant-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-2xl) !important;
        }

        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr !important;
            gap: var(--space-4) !important;
          }
          
          .branding-section {
            padding: var(--space-4) !important;
          }
          
          .brand-title {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
