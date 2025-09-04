import React, { useEffect, useMemo } from 'react';
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
  Tooltip,
  Skeleton
} from 'antd';
import { 
  DollarOutlined, 
  UserOutlined, 
  ShoppingOutlined,
  AlertOutlined,
  TeamOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  InboxOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/plots';
import { useDispatch, useSelector } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';
import { useMoney } from '@/settings';

const { Title, Text } = Typography;

export default function DashboardModule() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { moneyFormatter } = useMoney();
  
  // Redux state
  const { result: dashboardData, isLoading, isSuccess } = useSelector(state => state.erp.dashboardStats);

  useEffect(() => {
    dispatch(erp.dashboardStats());
  }, [dispatch]);

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
    cyan: '#06b6d4',
    gray: '#6b7280'
  };

  // KPI Cards Configuration
  const kpiCards = useMemo(() => [
    {
      title: translate('Total Sales'),
      value: dashboardData?.totalSales || 0,
      icon: <DollarOutlined />,
      color: colors.primary,
      bgColor: '#eff6ff',
      trend: dashboardData?.salesGrowth || 0,
      formatter: (value) => moneyFormatter({ amount: value, currency_code: 'USD' })
    },
    {
      title: translate('Total Customers'),
      value: dashboardData?.totalCustomers || 0,
      icon: <UserOutlined />,
      color: colors.success,
      bgColor: '#f0fdf4',
      trend: 0,
      formatter: (value) => value.toLocaleString()
    },
    {
      title: translate('Total Products'),
      value: dashboardData?.totalProducts || 0,
      icon: <ShoppingOutlined />,
      color: colors.secondary,
      bgColor: '#fff7ed',
      trend: 0,
      formatter: (value) => value.toLocaleString()
    },
    {
      title: translate('Total Suppliers'),
      value: dashboardData?.totalSuppliers || 0,
      icon: <TruckOutlined />,
      color: colors.purple,
      bgColor: '#faf5ff',
      trend: 0,
      formatter: (value) => value.toLocaleString()
    },
    {
      title: translate('Total Invoices'),
      value: dashboardData?.totalInvoices || 0,
      icon: <FileTextOutlined />,
      color: colors.teal,
      bgColor: '#f0fdfa',
      trend: 0,
      formatter: (value) => value.toLocaleString()
    },
    {
      title: translate('Total Transactions'),
      value: dashboardData?.totalTransactions || 0,
      icon: <ShoppingCartOutlined />,
      color: colors.indigo,
      bgColor: '#eef2ff',
      trend: 0,
      formatter: (value) => value.toLocaleString()
    }
  ], [dashboardData, translate, moneyFormatter]);

  // Chart configurations
  const salesTrendConfig = useMemo(() => ({
    data: dashboardData?.salesTrend || [],
    xField: 'date',
    yField: 'sales',
    smooth: true,
    color: colors.primary,
  }), [dashboardData?.salesTrend, colors.primary]);

  const topProductsConfig = useMemo(() => ({
    data: dashboardData?.topProducts || [],
    xField: 'name',
    yField: 'quantity',
    color: colors.secondary,
  }), [dashboardData?.topProducts, colors.secondary]);

  const inventoryConfig = useMemo(() => {
    const inventory = dashboardData?.inventory || {};
    return {
      data: [
        { type: 'Available', value: inventory.available || 0 },
        { type: 'Low Stock', value: inventory.lowStock || 0 },
        { type: 'Out of Stock', value: inventory.outOfStock || 0 },
        { type: 'Damaged', value: inventory.damaged || 0 },
        { type: 'Disposed', value: inventory.disposed || 0 }
      ].filter(item => item.value > 0),
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
    };
  }, [dashboardData?.inventory]);

  const customerGrowthConfig = useMemo(() => ({
    data: dashboardData?.customerGrowth || [],
    xField: 'date',
    yField: 'newCustomers',
    smooth: true,
    color: colors.success,
  }), [dashboardData?.customerGrowth, colors.success]);

  // Recent transactions columns
  const recentTransactionsColumns = useMemo(() => [
    {
      title: translate('Receipt #'),
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 120,
    },
    {
      title: translate('Customer'),
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      key: 'total',
      width: 120,
      align: 'right',
      render: (value) => moneyFormatter({ amount: value, currency_code: 'USD' })
    },
    {
      title: translate('Payment Method'),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 130,
      render: (method) => (
        <Tag color={method === 'Cash' ? colors.success : method === 'Credit Card' ? colors.primary : colors.secondary}>
          {method}
        </Tag>
      )
    },
    {
      title: translate('Date'),
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString()
    }
  ], [translate, moneyFormatter, colors]);

  const handleRefresh = () => {
    dispatch(erp.dashboardStats());
  };

  if (isLoading && !dashboardData) {
    return (
      <div style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          {[...Array(6)].map((_, index) => (
            <Col xs={24} sm={12} md={8} lg={4} key={index}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={12}>
            <Card>
              <Skeleton active />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card>
              <Skeleton active />
            </Card>
          </Col>
        </Row>
            </div>
    );
  }

  return (
    <div style={{ padding: '0', background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', padding: '24px 24px 0 24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: colors.primary }}>
              {translate('Dashboard')}
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              {translate('Real-time business analytics and insights')}
            </Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={isLoading}
              style={{ 
                background: colors.primary, 
                borderColor: colors.primary,
                borderRadius: '8px',
                height: '40px',
                paddingLeft: '20px',
                paddingRight: '20px'
              }}
            >
              {translate('Refresh')}
            </Button>
          </Col>
        </Row>
      </div>

      {/* KPI Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px', padding: '0 24px' }}>
        {kpiCards.map((card, index) => (
          <Col xs={24} sm={12} md={8} lg={4} key={index}>
            <Card
              hoverable
              style={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                background: 'white',
                transition: 'all 0.3s ease'
              }}
              styles={{ body: { padding: '20px' } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}
                >
                  <span style={{ fontSize: '24px', color: card.color }}>
                    {card.icon}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>
                    {card.title}
                  </Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                    <Text style={{ fontSize: '24px', fontWeight: 700, color: card.color, margin: 0 }}>
                      {card.formatter(card.value)}
                    </Text>
                    {card.trend !== 0 && (
                      <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
                        {card.trend > 0 ? (
                          <RiseOutlined style={{ color: colors.success, fontSize: '16px' }} />
                        ) : (
                          <FallOutlined style={{ color: colors.danger, fontSize: '16px' }} />
                        )}
                        <Text 
                          style={{ 
                            color: card.trend > 0 ? colors.success : colors.danger,
                            fontSize: '12px',
                            fontWeight: 600,
                            marginLeft: '4px'
                          }}
                        >
                          {Math.abs(card.trend)}%
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px', padding: '0 24px' }}>
        {/* Sales Trend */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LineChartOutlined style={{ color: colors.primary, marginRight: '8px' }} />
                <span style={{ color: colors.primary, fontWeight: 600 }}>
                  {translate('Sales Trend')}
                </span>
              </div>
            }
            style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              height: '400px'
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Area {...salesTrendConfig} height={300} />
          </Card>
        </Col>

        {/* Top Products */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BarChartOutlined style={{ color: colors.secondary, marginRight: '8px' }} />
                <span style={{ color: colors.secondary, fontWeight: 600 }}>
                  {translate('Top Products')}
                </span>
              </div>
            }
            style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              height: '400px'
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Column {...topProductsConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '32px', padding: '0 24px' }}>
        {/* Customer Growth */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ color: colors.success, marginRight: '8px' }} />
                <span style={{ color: colors.success, fontWeight: 600 }}>
                  {translate('Customer Growth')}
                </span>
              </div>
            }
            style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              height: '400px'
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Line {...customerGrowthConfig} height={300} />
          </Card>
        </Col>

        {/* Inventory Status */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PieChartOutlined style={{ color: colors.purple, marginRight: '8px' }} />
                <span style={{ color: colors.purple, fontWeight: 600 }}>
                  {translate('Inventory Status')}
                </span>
              </div>
            }
            style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              height: '400px'
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Pie {...inventoryConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <div style={{ padding: '0 24px 24px 24px' }}>
        <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InboxOutlined style={{ color: colors.indigo, marginRight: '8px' }} />
            <span style={{ color: colors.indigo, fontWeight: 600 }}>
              {translate('Recent Transactions')}
            </span>
          </div>
        }
        style={{
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        styles={{ body: { padding: '20px' } }}
      >
        <Table
          columns={recentTransactionsColumns}
          dataSource={dashboardData?.recentSales || []}
          rowKey="id"
          pagination={false}
          loading={isLoading}
          size="small"
          style={{ background: 'white' }}
        />
        </Card>
      </div>
    </div>
  );
}