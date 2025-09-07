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
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/plots';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';

const { Title, Text } = Typography;

export default function ModernDashboard(){
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

  // Modern KPI Cards Configuration
  const kpiCards = [
    {
      title: 'Total Sales Revenue',
      value: dashboardData.totalSales,
      prefix: <DollarOutlined />,
      suffix: 'Rs',
      color: 'var(--accent)',
      bgGradient: 'var(--gradient-accent)',
      growth: dashboardData.salesGrowth,
      icon: '💰',
      trend: dashboardData.salesGrowth >= 0 ? 'up' : 'down'
    },
    {
      title: 'Total Customers',
      value: dashboardData.totalCustomers,
      prefix: <UserOutlined />,
      color: 'var(--primary)',
      bgGradient: 'var(--gradient-primary)',
      growth: undefined,
      icon: '👥',
      trend: 'up'
    },
    {
      title: 'Products Catalog',
      value: dashboardData.totalProducts,
      prefix: <ShoppingOutlined />,
      color: 'var(--secondary)',
      bgGradient: 'var(--gradient-secondary)',
      growth: undefined,
      icon: '📦',
      trend: 'up'
    },
    {
      title: 'Suppliers',
      value: dashboardData.totalSuppliers,
      prefix: <TeamOutlined />,
      color: 'var(--primary)',
      bgGradient: 'var(--gradient-primary)',
      growth: undefined,
      icon: '🏢',
      trend: 'up'
    },
    {
      title: 'Total Invoices',
      value: dashboardData.totalInvoices,
      prefix: <FileTextOutlined />,
      color: 'var(--accent)',
      bgGradient: 'var(--gradient-accent)',
      growth: undefined,
      icon: '📋',
      trend: 'up'
    },
    {
      title: 'Average Sale',
      value: dashboardData.averageSale,
      prefix: <RiseOutlined />,
      suffix: 'Rs',
      precision: 2,
      color: 'var(--secondary)',
      bgGradient: 'var(--gradient-secondary)',
      growth: undefined,
      icon: '📈',
      trend: 'up'
    }
  ];

  // Charts configurations
  const salesTrendConfig = {
    data: dashboardData?.salesTrend || [],
    xField: 'date',
    yField: 'sales',
    smooth: true,
    color: 'var(--primary)',
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#60A5FA 1:#3B82F6',
    },
  };

  const topProductsConfig = {
    data: dashboardData?.topProducts || [],
    xField: 'name',
    yField: 'quantity',
    color: 'var(--secondary)',
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
    color: ['var(--accent)', 'var(--warning)', 'var(--error)', 'var(--neutral-500)', 'var(--neutral-400)'],
  };

  const customerGrowthConfig = {
    data: dashboardData?.customerGrowth || [],
    xField: 'date',
    yField: 'newCustomers',
    smooth: true,
    color: 'var(--accent)',
  };

  // Recent Sales Table
  const recentSalesColumns = [
    {
      title: 'Receipt #',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      render: (text) => (
        <Text code style={{ color: 'var(--primary)', fontWeight: '600' }}>
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
              backgroundColor: 'var(--primary)',
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
        <Tag color="blue">{employee}</Tag>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <Text strong style={{ color: 'var(--accent)', fontSize: '14px' }}>
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
        <Text style={{ color: 'var(--text-tertiary)' }}>
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
      <div style={{ padding: 'var(--space-6)' }}>
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
      padding: 'var(--space-6)', 
      background: 'var(--bg-primary)', 
      minHeight: '100vh',
      color: 'var(--text-primary)',
      maxWidth: '100%',
      width: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Modern Welcome Header */}
      <div style={{ 
        marginBottom: 'var(--space-8)',
        background: 'var(--gradient-primary)',
        padding: 'var(--space-8) var(--space-6)',
        borderRadius: 'var(--radius-2xl)',
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
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Icon and Title */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 'var(--space-5)',
            gap: 'var(--space-5)'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-2xl)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <span style={{ 
                fontSize: '3.5rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                display: 'block',
                lineHeight: 1
              }}>
                🏪
              </span>
            </div>
            <div>
              <Title level={1} style={{ 
                color: 'white',
                marginBottom: 'var(--space-3)',
                fontSize: '3rem',
                fontWeight: '800',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                lineHeight: '1.1',
                letterSpacing: '1px',
                fontFamily: 'var(--font-secondary)'
              }}>
                Bin Sultan ERP
              </Title>
            </div>
          </div>
          
          {/* Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <Text style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.5rem',
              fontWeight: '600',
              display: 'block',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              lineHeight: '1.4',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-secondary)'
            }}>
              Welcome to your Business Intelligence Hub
            </Text>
            <Text style={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.125rem',
              fontWeight: '500',
              display: 'block',
              marginTop: 'var(--space-2)',
              textShadow: '0 1px 5px rgba(0,0,0,0.2)'
            }}>
              Real-time analytics, comprehensive reporting, and powerful insights
            </Text>
          </div>
        </div>
      </div>

      <Spin spinning={loading} size="large">
        <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
          {/* Modern KPI Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: 'var(--space-8)' }}>
            {kpiCards.map((card, index) => (
              <Col xs={24} sm={12} lg={8} xl={4} key={index}>
                <Card
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-2xl)',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'var(--transition-normal)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  styles={{ 
                    body: { 
                      padding: 'var(--space-6)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    } 
                  }}
                  hoverable
                  className="modern-kpi-card"
                >
                  {/* Background Pattern */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    fontSize: '4rem',
                    opacity: 0.1,
                    transform: 'rotate(15deg)',
                    color: card.color
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
                        fontSize: '0.875rem', 
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: 'var(--space-3)',
                        lineHeight: '1.2',
                        fontFamily: 'var(--font-primary)'
                      }}>
                        {card.title}
                      </Text>
                    </div>
                    
                    {/* Value */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-3)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <Statistic
                        value={card.value}
                        precision={card.precision}
                        valueStyle={{ 
                          color: card.color, 
                          fontSize: '2rem', 
                          fontWeight: '700',
                          lineHeight: '1',
                          fontFamily: 'var(--font-secondary)'
                        }}
                        suffix={card.suffix}
                      />
                    </div>
                    
                    {/* Growth indicator */}
                    <div>
                      {card.growth !== undefined ? (
                        <Space align="center">
                          {card.trend === 'up' ? (
                            <ArrowUpOutlined style={{ color: 'var(--accent)', fontSize: '14px' }} />
                          ) : (
                            <ArrowDownOutlined style={{ color: 'var(--error)', fontSize: '14px' }} />
                          )}
                          <Text style={{ 
                            color: 'var(--text-tertiary)', 
                            fontSize: '0.75rem', 
                            fontWeight: '500'
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

          {/* Modern Charts Section */}
          <Row gutter={[24, 24]} style={{ marginBottom: 'var(--space-8)' }}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ 
                      background: 'var(--primary-50)',
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-lg)'
                    }}>
                      <LineChartOutlined style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
                    </div>
                    <div>
                      <Text strong style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontFamily: 'var(--font-secondary)' }}>
                        Sales Trend (Last 30 Days)
                      </Text>
                      <div>
                        <Text style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                          Daily revenue performance
                        </Text>
                      </div>
                    </div>
                  </div>
                }
                style={{
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-primary)'
                }}
                styles={{ body: { padding: 'var(--space-6)' } }}
              >
                <Area {...salesTrendConfig} height={320} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ 
                      background: 'var(--warning-50)',
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-lg)'
                    }}>
                      <PieChartOutlined style={{ color: 'var(--warning)', fontSize: '1.25rem' }} />
                    </div>
                    <div>
                      <Text strong style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontFamily: 'var(--font-secondary)' }}>
                        Inventory Status
                      </Text>
                      <div>
                        <Text style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                          Stock distribution
                        </Text>
                      </div>
                    </div>
                  </div>
                }
                style={{
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-primary)'
                }}
                styles={{ body: { padding: 'var(--space-6)' } }}
              >
                <Pie {...inventoryConfig} height={320} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginBottom: 'var(--space-8)' }}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ 
                      background: 'var(--secondary-50)',
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-lg)'
                    }}>
                      <BarChartOutlined style={{ color: 'var(--secondary)', fontSize: '1.25rem' }} />
                    </div>
                    <div>
                      <Text strong style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontFamily: 'var(--font-secondary)' }}>
                        Top Selling Products
                      </Text>
                      <div>
                        <Text style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                          Best performers this month
                        </Text>
                      </div>
                    </div>
                  </div>
                }
                style={{
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-primary)'
                }}
                styles={{ body: { padding: 'var(--space-6)' } }}
              >
                <Column {...topProductsConfig} height={320} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ 
                      background: 'var(--accent-50)',
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-lg)'
                    }}>
                      <RiseOutlined style={{ color: 'var(--accent)', fontSize: '1.25rem' }} />
                    </div>
                    <div>
                      <Text strong style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontFamily: 'var(--font-secondary)' }}>
                        Customer Growth
                      </Text>
                      <div>
                        <Text style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                          New customer acquisitions
                        </Text>
                      </div>
                    </div>
                  </div>
                }
                style={{
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-primary)'
                }}
                styles={{ body: { padding: 'var(--space-6)' } }}
              >
                <Line {...customerGrowthConfig} height={320} />
              </Card>
            </Col>
          </Row>

          {/* Modern Recent Sales Table */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ 
                  background: 'var(--accent-50)',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <ShoppingCartOutlined style={{ color: 'var(--accent)', fontSize: '1.25rem' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontFamily: 'var(--font-secondary)' }}>
                    Recent Sales Transactions
                  </Text>
                  <div>
                    <Text style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
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
                  color: 'var(--primary)',
                  fontWeight: '600'
                }}
              >
                View All Sales
              </Button>
            }
            style={{
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-primary)',
              marginBottom: 'var(--space-8)'
            }}
            styles={{ body: { padding: 'var(--space-6)' } }}
          >
            <Table
              dataSource={dashboardData.recentSales}
              columns={recentSalesColumns}
              pagination={false}
              size="middle"
              scroll={{ x: 800 }}
              rowKey="id"
              className="modern-sales-table"
            />
          </Card>

          {/* Modern Quick Actions */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ 
                  background: 'var(--primary-50)',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <RiseOutlined style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontFamily: 'var(--font-secondary)' }}>
                    Quick Actions
                  </Text>
                  <div>
                    <Text style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                      Common business operations
                    </Text>
                  </div>
                </div>
              </div>
            }
            style={{
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-primary)'
            }}
            styles={{ body: { padding: 'var(--space-8)' } }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  icon={<ShoppingCartOutlined />}
                  style={{ 
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--gradient-primary)',
                    borderColor: 'var(--primary)',
                    height: '60px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    boxShadow: 'var(--shadow-md)'
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
                    borderRadius: 'var(--radius-xl)',
                    borderColor: 'var(--secondary)',
                    color: 'var(--secondary)',
                    height: '60px',
                    fontSize: '1rem',
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
                    borderRadius: 'var(--radius-xl)',
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)',
                    height: '60px',
                    fontSize: '1rem',
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
                    borderRadius: 'var(--radius-xl)',
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    height: '60px',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  View Reports
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </Spin>

      {/* Modern CSS for animations */}
      <style jsx="true">{`
        .modern-kpi-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: var(--shadow-xl) !important;
        }
        
        .ant-card {
          transition: var(--transition-normal);
        }
        
        .ant-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg) !important;
        }
        
        .ant-statistic-content {
          font-family: var(--font-secondary);
        }
        
        .modern-sales-table .ant-table-thead > tr > th {
          background-color: var(--bg-secondary) !important;
          font-weight: 600 !important;
          color: var(--text-primary) !important;
          border-bottom: 1px solid var(--border-primary) !important;
        }
        
        .modern-sales-table .ant-table-tbody > tr:hover > td {
          background-color: var(--bg-hover) !important;
        }
        
        .modern-sales-table .ant-table-tbody > tr:nth-child(even) > td {
          background-color: var(--bg-secondary) !important;
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
