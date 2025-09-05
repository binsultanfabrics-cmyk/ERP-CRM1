import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Typography, 
  Space, 
  Button, 
  Tag,
  Spin,
  Alert,
  Avatar,
  Progress,
  Tooltip
} from 'antd';
import { 
  DollarOutlined, 
  UserOutlined, 
  ShoppingOutlined,
  RiseOutlined,
  AlertOutlined,
  TeamOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  FallOutlined,
  EyeOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/plots';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';

const { Title, Text } = Typography;

export default function Dashboard(){
  const translate = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalSuppliers: 0,
    totalInvoices: 0,
    totalTransactions: 0,
    averageSale: 0,
    salesGrowth: 0,
    inventory: {
      available: 0,
      lowStock: 0,
      outOfStock: 0,
      damaged: 0,
      disposed: 0
    },
    salesTrend: [],
    topProducts: [],
    customerGrowth: [],
    recentSales: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard stats from backend
      const response = await request.get({ entity: 'dashboard/stats' });
      
      if (response.success) {
        setDashboardData(response.result);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Modern color scheme
  const colors = {
    primary: '#2563eb',
    secondary: '#f97316', 
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#eab308',
    purple: '#7c3aed',
    pink: '#ec4899',
    teal: '#0d9488',
    indigo: '#4f46e5',
    cyan: '#06b6d4'
  };

  // KPI Cards Configuration
  const kpiCards = [
    {
      title: 'Total Sales Revenue',
      value: dashboardData.totalSales,
      prefix: <DollarOutlined />,
      suffix: 'Rs',
      color: colors.success,
      precision: 2,
      bgGradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
      growth: dashboardData.salesGrowth,
      icon: '💰'
    },
    {
      title: 'Total Customers',
      value: dashboardData.totalCustomers,
      prefix: <UserOutlined />,
      color: colors.primary,
      bgGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      growth: undefined,
      icon: '👥'
    },
    {
      title: 'Products Catalog',
      value: dashboardData.totalProducts,
      prefix: <ShoppingOutlined />,
      color: colors.purple,
      bgGradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
      growth: undefined,
      icon: '📦'
    },
    {
      title: 'Suppliers',
      value: dashboardData.totalSuppliers,
      prefix: <TeamOutlined />,
      color: colors.secondary,
      bgGradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      growth: undefined,
      icon: '🏢'
    },
    {
      title: 'Total Invoices',
      value: dashboardData.totalInvoices,
      prefix: <FileTextOutlined />,
      color: colors.teal,
      bgGradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
      growth: undefined,
      icon: '📋'
    },
    {
      title: 'Average Sale',
      value: dashboardData.averageSale,
      prefix: <RiseOutlined />,
      suffix: 'Rs',
      precision: 2,
      color: colors.pink,
      bgGradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      growth: undefined,
      icon: '📈'
    }
  ];

  // Charts configurations
  const salesTrendConfig = {
    data: dashboardData?.salesTrend || [],
    xField: 'date',
    yField: 'sales',
    smooth: true,
    color: colors.primary,
  };

  const topProductsConfig = {
    data: dashboardData?.topProducts || [],
    xField: 'name',
    yField: 'quantity',
    color: colors.secondary,
  };

  const inventoryConfig = {
    data: [
      { type: 'Available', value: dashboardData?.inventory?.available || 0 },
      { type: 'Low Stock', value: dashboardData?.inventory?.lowStock || 0 },
      { type: 'Out of Stock', value: dashboardData?.inventory?.outOfStock || 0 },
      { type: 'Damaged', value: dashboardData?.inventory?.damaged || 0 },
      { type: 'Disposed', value: dashboardData?.inventory?.disposed || 0 },
    ].filter(item => item.value > 0),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
  };

  const customerGrowthConfig = {
    data: dashboardData?.customerGrowth || [],
    xField: 'date',
    yField: 'newCustomers',
    smooth: true,
    color: colors.teal,
  };

  // Recent Sales Table
  const recentSalesColumns = [
    {
      title: 'Receipt #',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      render: (text) => (
        <Text code style={{ color: colors.primary, fontWeight: 'bold' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => (
        <Space>
          <Avatar 
            size="small" 
            style={{ 
              backgroundColor: colors.primary,
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {customer?.charAt(0)?.toUpperCase() || 'W'}
          </Avatar>
          <Text strong>{customer || 'Walk-in'}</Text>
        </Space>
      )
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      render: (employee) => (
        <Tag color="geekblue">{employee}</Tag>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <Text strong style={{ color: colors.success, fontSize: '14px' }}>
          Rs {parseFloat(total || 0).toLocaleString()}
        </Text>
      )
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => {
        const colorMap = {
          'Cash': 'green',
          'Credit Card': 'blue',
          'Bank Transfer': 'purple',
          'Mobile Payment': 'orange',
          'Credit': 'red'
        };
        return (
          <Tag color={colorMap[method] || 'default'}>
            {method}
          </Tag>
        );
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      )
    }
  ];

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error Loading Dashboard"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={loadDashboardData}>
              <ReloadOutlined /> Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px', 
      background: 'var(--bg-primary)', 
      minHeight: '100vh',
      color: 'var(--text-primary)'
    }}>
      {/* Professional Welcome Header */}
      <div style={{ 
        marginBottom: '40px',
        background: 'var(--gradient-primary)',
        padding: '50px 40px',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-accent)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Icon and Title */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '20px',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '24px',
              borderRadius: '24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <span style={{ 
                fontSize: '56px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                display: 'block',
                lineHeight: 1
              }}>
                🏪
              </span>
            </div>
            <div>
              <Title level={1} style={{ 
                color: 'var(--bg-primary)',
                marginBottom: '12px',
                fontSize: '4rem',
                fontWeight: '800',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                lineHeight: '1.1',
                letterSpacing: '1px'
              }}>
                Bin Sultan ERP
              </Title>
            </div>
          </div>
          
          {/* Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Text style={{ 
              color: 'rgba(0, 0, 0, 0.9)',
              fontSize: '24px',
              fontWeight: '600',
              display: 'block',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              lineHeight: '1.4',
              marginBottom: '8px'
            }}>
              Welcome to your Business Intelligence Hub
            </Text>
            <Text style={{ 
              color: 'rgba(0, 0, 0, 0.7)',
              fontSize: '18px',
              fontWeight: '500',
              display: 'block',
              marginTop: '8px',
              textShadow: '0 1px 5px rgba(0,0,0,0.2)'
            }}>
              Real-time analytics, comprehensive reporting, and powerful insights
            </Text>
          </div>
          
        </div>
      </div>

      <Spin spinning={loading} size="large">
        {/* KPI Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          {kpiCards.map((card, index) => (
            <Col xs={24} sm={12} lg={8} xl={4} key={index}>
              <Card
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                styles={{ 
                  body: { 
                    padding: '28px 24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  } 
                }}
                hoverable
                className="kpi-card"
              >
                {/* Background Pattern */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  fontSize: '60px',
                  opacity: 0.2,
                  transform: 'rotate(15deg)'
                }}>
                  {card.icon}
                </div>
                
                <div style={{ 
                  position: 'relative', 
                  zIndex: 1, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  {/* Title */}
                  <div>
                    <Text style={{ 
                      color: 'var(--text-primary)', 
                      fontSize: '16px', 
                      fontWeight: '700',
                      display: 'block',
                      marginBottom: '12px',
                      lineHeight: '1.2'
                    }}>
                      {card.title}
                    </Text>
                  </div>
                  
                  {/* Value */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <Statistic
                      value={card.value}
                      precision={card.precision}
                      valueStyle={{ 
                        color: 'var(--brand-primary)', 
                        fontSize: '32px', 
                        fontWeight: '800',
                        lineHeight: '1'
                      }}
                      suffix={card.suffix}
                    />
                  </div>
                  
                  {/* Growth indicator */}
                  <div>
                    {card.growth !== undefined ? (
                      <Space align="center">
                        {card.growth >= 0 ? (
                          <RiseOutlined style={{ color: '#22c55e', fontSize: '14px' }} />
                        ) : (
                          <FallOutlined style={{ color: '#ef4444', fontSize: '14px' }} />
                        )}
                        <Text style={{ 
                          color: 'var(--text-secondary)', 
                          fontSize: '14px', 
                          fontWeight: '600'
                        }}>
                          {Math.abs(card.growth)}% vs last week
                        </Text>
                      </Space>
                    ) : (
                      <div style={{ height: '20px' }}></div>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    background: `${colors.primary}15`,
                    padding: '8px',
                    borderRadius: '8px'
                  }}>
                    <LineChartOutlined style={{ color: colors.primary, fontSize: '20px' }} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>
                      Sales Trend (Last 30 Days)
                    </Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Daily revenue performance
                      </Text>
                    </div>
                  </div>
                </div>
              }
              style={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0'
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <Area {...salesTrendConfig} height={320} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    background: `${colors.warning}15`,
                    padding: '8px',
                    borderRadius: '8px'
                  }}>
                    <PieChartOutlined style={{ color: colors.warning, fontSize: '20px' }} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>
                      Inventory Status
                    </Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Stock distribution
                      </Text>
                    </div>
                  </div>
                </div>
              }
              style={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0'
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <Pie {...inventoryConfig} height={320} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    background: `${colors.secondary}15`,
                    padding: '8px',
                    borderRadius: '8px'
                  }}>
                    <BarChartOutlined style={{ color: colors.secondary, fontSize: '20px' }} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>
                      Top Selling Products
                    </Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Best performers this month
                      </Text>
                    </div>
                  </div>
                </div>
              }
              style={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0'
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <Column {...topProductsConfig} height={320} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    background: `${colors.teal}15`,
                    padding: '8px',
                    borderRadius: '8px'
                  }}>
                    <RiseOutlined style={{ color: colors.teal, fontSize: '20px' }} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>
                      Customer Growth
                    </Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        New customer acquisitions
                      </Text>
                    </div>
                  </div>
                </div>
              }
              style={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0'
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <Line {...customerGrowthConfig} height={320} />
            </Card>
          </Col>
        </Row>

        {/* Recent Sales Table */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                background: `${colors.success}15`,
                padding: '8px',
                borderRadius: '8px'
              }}>
                <ShoppingCartOutlined style={{ color: colors.success, fontSize: '20px' }} />
              </div>
              <div>
                <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>
                  Recent Sales Transactions
                </Text>
                <div>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Latest customer purchases
                  </Text>
                </div>
              </div>
            </div>
          }
          extra={
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              style={{ 
                color: colors.primary,
                fontWeight: '600'
              }}
            >
              View All Sales
            </Button>
          }
          style={{
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            marginBottom: '32px'
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <Table
            dataSource={dashboardData.recentSales}
            columns={recentSalesColumns}
            pagination={false}
            size="middle"
            scroll={{ x: 800 }}
            rowKey="id"
            className="recent-sales-table"
          />
        </Card>

        {/* Quick Actions */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                background: `${colors.primary}15`,
                padding: '8px',
                borderRadius: '8px'
              }}>
                <RiseOutlined style={{ color: colors.primary, fontSize: '20px' }} />
              </div>
              <div>
                <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>
                  Quick Actions
                </Text>
                <div>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Common business operations
                  </Text>
                </div>
              </div>
            </div>
          }
          style={{
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0'
          }}
          styles={{ body: { padding: '32px' } }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Button 
                type="primary" 
                size="large" 
                block
                icon={<ShoppingCartOutlined />}
                style={{ 
                  borderRadius: '16px',
                  background: colors.primary,
                  borderColor: colors.primary,
                  height: '60px',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: `0 6px 16px ${colors.primary}30`
                }}
              >
                New Sale
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                size="large" 
                block
                icon={<UserOutlined />}
                style={{ 
                  borderRadius: '16px',
                  borderColor: colors.secondary,
                  color: colors.secondary,
                  height: '60px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Add Customer
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                size="large" 
                block
                icon={<ShoppingOutlined />}
                style={{ 
                  borderRadius: '16px',
                  borderColor: colors.purple,
                  color: colors.purple,
                  height: '60px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Add Product
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                size="large" 
                block
                icon={<BarChartOutlined />}
                style={{ 
                  borderRadius: '16px',
                  borderColor: colors.teal,
                  color: colors.teal,
                  height: '60px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                View Reports
              </Button>
            </Col>
          </Row>
        </Card>
      </Spin>

      {/* Custom CSS for animations */}
      <style jsx="true">{`
        .kpi-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
        }
        
        .ant-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ant-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important;
        }
        
        .ant-statistic-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        
        .recent-sales-table .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          font-weight: 600 !important;
          color: #374151 !important;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .loading-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}