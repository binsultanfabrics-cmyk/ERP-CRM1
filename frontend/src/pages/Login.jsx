import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  Typography, 
  Row, 
  Col, 
  Card,
  Space,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  ShopOutlined,
  CrownOutlined
} from '@ant-design/icons';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import Loading from '@/components/Loading';
import useLanguage from '@/locale/useLanguage';

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)',
      fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <Row style={{ minHeight: '100vh' }}>
        {/* Left Side - Background Image Placeholder */}
        <Col 
          xs={{ span: 0 }} 
          sm={{ span: 0 }} 
          md={{ span: 12 }} 
          lg={{ span: 14 }}
          style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Fabric/Clothing Pattern Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
            `,
            opacity: 0.8
          }} />
          
          {/* Content Overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            zIndex: 2,
            padding: '40px'
          }}>
            <div style={{
              fontSize: '80px',
              marginBottom: '20px',
              opacity: 0.9
            }}>
              👔
            </div>
            <Title level={1} style={{ 
              color: 'white', 
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '16px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Bin Sultan
            </Title>
            <Title level={3} style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '24px',
              fontWeight: '400',
              marginBottom: '24px'
            }}>
              ERP + POS System
            </Title>
            <Text style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '18px',
              lineHeight: '1.6',
              display: 'block',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              Professional clothing and fabric management system for modern businesses
            </Text>
            
            {/* Decorative Elements */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '40px',
              opacity: 0.7
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🧵
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                👕
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🏪
              </div>
            </div>
          </div>
        </Col>

        {/* Right Side - Login Form */}
        <Col 
          xs={{ span: 24 }} 
          sm={{ span: 24 }} 
          md={{ span: 12 }} 
          lg={{ span: 10 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            background: 'rgba(248, 250, 252, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ width: '100%', maxWidth: '400px' }}>
            {/* Logo Section */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 32px rgba(30, 64, 175, 0.3)'
              }}>
                <ShopOutlined style={{ fontSize: '36px', color: 'white' }} />
              </div>
              <Title level={2} style={{ 
                color: '#1E293B',
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                Bin Sultan
              </Title>
              <Text style={{ 
                color: '#64748B',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                Welcome back! Please sign in to your account
              </Text>
            </div>

            {/* Login Form Card */}
            <Card
              style={{
                borderRadius: '20px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
              bodyStyle={{ padding: '40px' }}
            >
              <Loading isLoading={isLoading}>
                <Form
                  name="login"
                  layout="vertical"
                  initialValues={{
                    remember: true,
                    email: 'admin@admin.com',
                    password: 'admin123',
                  }}
                  onFinish={onFinish}
                  size="large"
                >
                  <Form.Item
                    name="email"
                    label={<Text style={{ fontWeight: '600', color: '#374151' }}>Email Address</Text>}
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#6B7280' }} />}
                      placeholder="admin@admin.com"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #E5E7EB',
                        padding: '12px 16px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label={<Text style={{ fontWeight: '600', color: '#374151' }}>Password</Text>}
                    rules={[{ required: true, message: 'Please input your password!' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#6B7280' }} />}
                      placeholder="admin123"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #E5E7EB',
                        padding: '12px 16px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox style={{ color: '#6B7280', fontWeight: '500' }}>
                          Remember me
                        </Checkbox>
                      </Form.Item>
                      <Link 
                        href="/forgetpassword" 
                        style={{ 
                          color: '#1E40AF',
                          fontWeight: '600',
                          textDecoration: 'none'
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </Form.Item>

                  <Form.Item style={{ marginBottom: '24px' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      style={{
                        width: '100%',
                        height: '56px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        boxShadow: '0 4px 14px 0 rgba(30, 64, 175, 0.25)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </Form.Item>


                </Form>
              </Loading>
            </Card>

            {/* Footer */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '32px',
              color: '#9CA3AF',
              fontSize: '14px'
            }}>
              <Text style={{ color: '#9CA3AF' }}>
                © 2024 Bin Sultan ERP + POS. All rights reserved.
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;