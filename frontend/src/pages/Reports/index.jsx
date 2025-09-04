import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  App, 
  Alert, 
  Progress, 
  Badge,
  message,
  Tabs,
  Spin,
  Empty
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined, 
  DownloadOutlined, 
  ReloadOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  InboxOutlined,
  RiseOutlined,
  FallOutlined,
  FileTextOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Reports() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message: messageApi } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  const [reportData, setReportData] = useState({});
  const [filters, setFilters] = useState({
    startDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });

  const fetchReportData = async (reportType, params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        ...filters,
        ...params,
      };
      
      // This would be replaced with actual API calls
      const response = await fetch(`/api/core/reports/${reportType}?${new URLSearchParams(queryParams)}`);
      const data = await response.json();
      
      if (data.success) {
        setReportData(prev => ({
          ...prev,
          [reportType]: data.result
        }));
      } else {
        messageApi.error('Failed to fetch report data');
      }
    } catch (error) {
      console.error('Report fetch error:', error);
      messageApi.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      setFilters({
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
      });
    }
  };

  const handleExportReport = (reportType, format = 'csv') => {
    messageApi.info(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
    // Implement actual export functionality
  };

  // Daily Sales Summary
  const DailySalesReport = () => {
    const data = reportData.dailySales || [];
    
    const columns = [
      {
        title: 'Date',
        dataIndex: '_id',
        key: 'date',
        render: (id) => `${id.day}/${id.month}/${id.year}`,
      },
      {
        title: 'Total Sales',
        dataIndex: 'totalSales',
        key: 'totalSales',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
      {
        title: 'Transactions',
        dataIndex: 'totalTransactions',
        key: 'totalTransactions',
      },
      {
        title: 'Average Sale',
        dataIndex: 'averageSale',
        key: 'averageSale',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
      {
        title: 'Total Discount',
        dataIndex: 'totalDiscount',
        key: 'totalDiscount',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
      {
        title: 'Total Tax',
        dataIndex: 'totalTax',
        key: 'totalTax',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
    ];

    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Sales"
                value={data.reduce((sum, item) => sum + parseFloat(item.totalSales || 0), 0)}
                precision={2}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Transactions"
                value={data.reduce((sum, item) => sum + (item.totalTransactions || 0), 0)}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Average Sale"
                value={data.length > 0 ? data.reduce((sum, item) => sum + parseFloat(item.averageSale || 0), 0) / data.length : 0}
                precision={2}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Discount"
                value={data.reduce((sum, item) => sum + parseFloat(item.totalDiscount || 0), 0)}
                precision={2}
                prefix={<FallOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            dataSource={data}
            columns={columns}
            loading={loading}
            rowKey={(record) => `${record._id.year}-${record._id.month}-${record._id.day}`}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    );
  };

  // Top Selling Items
  const TopSellingItemsReport = () => {
    const data = reportData.topSellingItems || [];
    
    const columns = [
      {
        title: 'Product',
        key: 'product',
        render: (_, record) => (
          <div>
            <Text strong>{record.productName}</Text>
            <br />
            <Text type="secondary">{record.productCode}</Text>
          </div>
        ),
      },
      {
        title: 'Fabric Type',
        dataIndex: 'fabricType',
        key: 'fabricType',
        render: (type) => <Tag color="blue">{type}</Tag>,
      },
      {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
      },
      {
        title: 'Total Quantity',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        render: (value) => `${parseFloat(value || 0).toFixed(2)} units`,
      },
      {
        title: 'Total Revenue',
        dataIndex: 'totalRevenue',
        key: 'totalRevenue',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
      {
        title: 'Average Price',
        dataIndex: 'averagePrice',
        key: 'averagePrice',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
      {
        title: 'Sale Count',
        dataIndex: 'saleCount',
        key: 'saleCount',
      },
    ];

    return (
      <Card>
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    );
  };

  // Credit Aging Report
  const CreditAgingReport = () => {
    const data = reportData.creditAging || {};
    const summary = data.summary || {};
    const details = data.details || [];
    
    const agingColumns = [
      {
        title: 'Customer/Supplier',
        key: 'party',
        render: (_, record) => (
          <div>
            <Text strong>{record.partyName}</Text>
            <br />
            <Text type="secondary">{record.partyType}</Text>
          </div>
        ),
      },
      {
        title: 'Current Balance',
        dataIndex: 'currentBalance',
        key: 'currentBalance',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
      {
        title: 'Last Transaction',
        dataIndex: 'lastTransactionDate',
        key: 'lastTransactionDate',
        render: (date) => dayjs(date).format('DD/MM/YYYY'),
      },
      {
        title: 'Days Overdue',
        dataIndex: 'daysSinceLastTransaction',
        key: 'daysSinceLastTransaction',
        render: (days) => (
          <Tag color={days > 90 ? 'red' : days > 60 ? 'orange' : days > 30 ? 'yellow' : 'green'}>
            {Math.floor(days)} days
          </Tag>
        ),
      },
      {
        title: 'Aging Bucket',
        dataIndex: 'agingBucket',
        key: 'agingBucket',
        render: (bucket) => (
          <Tag color={
            bucket === '0-30' ? 'green' :
            bucket === '31-60' ? 'yellow' :
            bucket === '61-90' ? 'orange' : 'red'
          }>
            {bucket} days
          </Tag>
        ),
      },
    ];

    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          {Object.entries(summary).map(([bucket, data]) => (
            <Col span={6} key={bucket}>
              <Card>
                <Statistic
                  title={`${bucket} Days`}
                  value={data.totalAmount}
                  precision={2}
                  prefix="Rs"
                  valueStyle={{ 
                    color: bucket === '0-30' ? '#3f8600' :
                           bucket === '31-60' ? '#faad14' :
                           bucket === '61-90' ? '#fa8c16' : '#cf1322'
                  }}
                />
                <Text type="secondary">{data.count} accounts</Text>
              </Card>
            </Col>
          ))}
        </Row>

        <Card>
          <Table
            dataSource={details}
            columns={agingColumns}
            loading={loading}
            rowKey="partyId"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    );
  };

  // Employee Sales Report
  const EmployeeSalesReport = () => {
    const data = reportData.employeeSales || [];
    
    const columns = [
      {
        title: 'Employee',
        key: 'employee',
        render: (_, record) => (
          <div>
            <Text strong>{record.employeeName}</Text>
            <br />
            <Text type="secondary">{record.employeeRole}</Text>
          </div>
        ),
      },
      {
        title: 'Employee ID',
        dataIndex: 'employeeId',
        key: 'employeeId',
      },
      {
        title: 'Total Sales',
        dataIndex: 'totalSales',
        key: 'totalSales',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
      {
        title: 'Transactions',
        dataIndex: 'totalTransactions',
        key: 'totalTransactions',
      },
      {
        title: 'Average Sale',
        dataIndex: 'averageSale',
        key: 'averageSale',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
      {
        title: 'Total Items',
        dataIndex: 'totalItems',
        key: 'totalItems',
      },
      {
        title: 'Total Discount',
        dataIndex: 'totalDiscount',
        key: 'totalDiscount',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
    ];

    return (
      <Card>
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    );
  };

  // Inventory Valuation Report
  const InventoryValuationReport = () => {
    const data = reportData.inventoryValuation || {};
    const items = data.items || [];
    const summary = data.summary || {};
    
    const columns = [
      {
        title: 'Product',
        key: 'product',
        render: (_, record) => (
          <div>
            <Text strong>{record.productName}</Text>
            <br />
            <Text type="secondary">{record.productCode}</Text>
          </div>
        ),
      },
      {
        title: 'Fabric Type',
        dataIndex: 'fabricType',
        key: 'fabricType',
        render: (type) => <Tag color="blue">{type}</Tag>,
      },
      {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
      },
      {
        title: 'Total Quantity',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        render: (value) => `${parseFloat(value || 0).toFixed(2)} units`,
      },
      {
        title: 'Roll Count',
        dataIndex: 'rollCount',
        key: 'rollCount',
      },
      {
        title: 'Average Cost',
        dataIndex: 'averageCost',
        key: 'averageCost',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
      {
        title: 'Total Value',
        dataIndex: 'totalValue',
        key: 'totalValue',
        render: (value) => `Rs ${parseFloat(value || 0).toFixed(2)}`,
      },
    ];

    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Items"
                value={summary.totalItems || 0}
                prefix={<InboxOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Value"
                value={summary.totalValue || 0}
                precision={2}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Average Value"
                value={summary.averageValue || 0}
                precision={2}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            dataSource={items}
            columns={columns}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    );
  };

  const tabItems = [
    {
      key: 'sales',
      label: '📊 Daily Sales',
      children: <DailySalesReport />,
    },
    {
      key: 'topSelling',
      label: '🏆 Top Selling Items',
      children: <TopSellingItemsReport />,
    },
    {
      key: 'creditAging',
      label: '⏰ Credit Aging',
      children: <CreditAgingReport />,
    },
    {
      key: 'employeeSales',
      label: '👥 Employee Sales',
      children: <EmployeeSalesReport />,
    },
    {
      key: 'inventory',
      label: '📦 Inventory Valuation',
      children: <InventoryValuationReport />,
    },
  ];

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              📊 Reports & Analytics
            </Title>
            <Text type="secondary">Comprehensive business intelligence and reporting</Text>
          </Col>
          <Col>
            <Space>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
              />
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={() => fetchReportData(activeTab)}
                loading={loading}
              >
                Refresh
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => handleExportReport(activeTab)}
              >
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => {
            setActiveTab(key);
            fetchReportData(key);
          }}
          items={tabItems}
        />
      </Card>
    </div>
  );
}