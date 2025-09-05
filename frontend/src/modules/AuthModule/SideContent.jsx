import { Space, Layout, Divider, Typography, Card, Row, Col } from 'antd';
import { ShopOutlined, ShoppingOutlined, UserOutlined, BarChartOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  const features = [
    { icon: <ShoppingOutlined />, title: 'Inventory Management', desc: 'Track products, stock levels, and suppliers' },
    { icon: <UserOutlined />, title: 'Customer Management', desc: 'Manage customer profiles and relationships' },
    { icon: <BarChartOutlined />, title: 'Sales Analytics', desc: 'Real-time insights and reporting' },
    { icon: <TeamOutlined />, title: 'Staff Management', desc: 'Employee roles and permissions' },
    { icon: <FileTextOutlined />, title: 'Invoice & Orders', desc: 'Generate invoices and track orders' },
  ];

  return (
    <Content
      style={{
        padding: '80px 40px 40px',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        background: 'var(--bg-primary)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        {/* Brand Header */}
        <Card
          style={{
            background: 'var(--gradient-primary)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '28px',
            marginBottom: '40px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: '50px 40px' }}
        >
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
                            background: 'radial-gradient(circle, rgba(30, 64, 175, 0.1) 0%, transparent 70%)',
            animation: 'rotate 20s linear infinite'
          }} />
          
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '30px',
            borderRadius: '24px',
            display: 'inline-block',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            zIndex: 2
          }}>
            <ShopOutlined style={{ 
              fontSize: '72px', 
              color: 'var(--bg-primary)',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }} />
          </div>
          <Title level={1} style={{ 
            color: 'var(--bg-primary)', 
            margin: '0 0 16px 0',
            fontSize: '42px',
            fontWeight: '800',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            letterSpacing: '1px',
            position: 'relative',
            zIndex: 2
          }}>
            Bin Sultan
          </Title>
          <Text style={{ 
            color: 'rgba(0, 0, 0, 0.8)',
            fontSize: '20px',
            fontWeight: '600',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            display: 'block',
            marginBottom: '12px',
            position: 'relative',
            zIndex: 2
          }}>
            Fashion & Lifestyle Store
          </Text>
          <Text style={{ 
            color: 'rgba(0, 0, 0, 0.7)',
            fontSize: '16px',
            fontWeight: '500',
            textShadow: '0 1px 5px rgba(0,0,0,0.2)',
            position: 'relative',
            zIndex: 2
          }}>
            Professional ERP & POS System
          </Text>
        </Card>

        {/* Features Section */}
        <div>
          <Title level={2} style={{ 
            textAlign: 'center',
            marginBottom: '40px',
            color: 'var(--text-primary)',
            fontSize: '28px',
            fontWeight: '800',
            letterSpacing: '0.5px'
          }}>
            Why Choose Bin Sultan?
          </Title>
          
          <Row gutter={[20, 20]}>
            {features.map((feature, index) => (
              <Col span={24} key={index}>
                <Card
                  style={{
                    background: 'var(--gradient-card)',
                    borderRadius: '20px',
                    border: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '24px' }}
                  hoverable
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      background: 'var(--gradient-primary)',
                      padding: '16px',
                      borderRadius: '16px',
                      color: 'var(--bg-primary)',
                      fontSize: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '56px',
                      height: '56px',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      {feature.icon}
                    </div>
                    <div>
                      <Title level={4} style={{ 
                        margin: '0 0 8px 0',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: 'var(--text-primary)'
                      }}>
                        {feature.title}
                      </Title>
                      <Text style={{ 
                        color: 'var(--text-secondary)',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        fontWeight: '500'
                      }}>
                        {feature.desc}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
