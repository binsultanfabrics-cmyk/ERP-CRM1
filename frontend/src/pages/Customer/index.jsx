import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Row, Col, Statistic, Modal, Form, Input, Select, App, Popconfirm, Drawer, Descriptions, Divider, Avatar } from 'antd';
import { PlusOutlined, UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectEntityList } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function Customer() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message } = App.useApp(); // Use App context for message API
  const { result: customers, pagination, isLoading } = useSelector(selectEntityList('client'));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(crud.list({ entity: 'client' }));
  }, []);

  // Ensure data exists and has the correct structure
  const customersList = customers?.items || [];

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: customer.country,
      customerType: customer.customerType || 'Regular',
      notes: customer.notes
    });
    setIsModalVisible(true);
  };

  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer);
    setIsViewDrawerVisible(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      setLoading(true);
      await dispatch(crud.delete({ entity: 'client', id: customerId }));
      message.success('Customer deleted successfully');
      dispatch(crud.list({ entity: 'client' }));
    } catch (error) {
      message.error('Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const customerData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        country: values.country,
        customerType: values.customerType,
        notes: values.notes,
        registrationDate: editingCustomer ? editingCustomer.registrationDate : new Date().toISOString()
      };

      if (editingCustomer) {
        await dispatch(crud.update({ entity: 'client', id: editingCustomer._id, jsonData: customerData }));
        message.success('Customer updated successfully');
      } else {
        await dispatch(crud.create({ entity: 'client', jsonData: customerData }));
        message.success('Customer created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      dispatch(crud.list({ entity: 'client' }));
    } catch (error) {
      message.error('Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    dispatch(crud.list({ entity: 'client' }));
    message.success('Data refreshed');
  };

  const getCustomerStats = () => {
    if (!customersList || !Array.isArray(customersList)) return { total: 0, regular: 0, vip: 0, new: 0 };
    
    const regular = customersList.filter(c => c.customerType === 'Regular').length;
    const vip = customersList.filter(c => c.customerType === 'VIP').length;
    const newCustomers = customersList.filter(c => {
      const regDate = new Date(c.registrationDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return regDate >= thirtyDaysAgo;
    }).length;

    return {
      total: customersList.length,
      regular,
      vip,
      new: newCustomers
    };
  };

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary">{record.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div><PhoneOutlined /> {record.phone || 'N/A'}</div>
          <div><MailOutlined /> {record.email || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => (
        <div>
          <div><EnvironmentOutlined /> {record.city || 'N/A'}</div>
          <div>{record.country || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'customerType',
      key: 'customerType',
      render: (type) => {
        const color = type === 'VIP' ? 'gold' : type === 'Regular' ? 'blue' : 'default';
        return <Tag color={color}>{type || 'Regular'}</Tag>;
      }
    },
    {
      title: 'Registration',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewCustomer(record)}
          >
            View
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditCustomer(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            onConfirm={() => handleDeleteCustomer(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="link" 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const stats = getCustomerStats();

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
                 <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
           👥 Bin Sultan Customer Management
         </Title>
         <Text type="secondary">Manage your customer database and relationships - Pakistan's Trusted Cloth Shop</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Regular Customers"
              value={stats.regular}
              valueStyle={{ color: '#52c41a' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="VIP Customers"
              value={stats.vip}
              valueStyle={{ color: '#faad14' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="New (30 days)"
              value={stats.new}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Customers Table */}
      <Card
        title="Customers"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={customersList}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: pagination?.current || 1,
            pageSize: pagination?.pageSize || 10,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
          }}
        />
      </Card>

      {/* Add/Edit Customer Modal */}
      <Modal
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            customerType: 'Regular'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter customer name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerType"
                label="Customer Type"
                rules={[{ required: true, message: 'Please select customer type' }]}
              >
                                 <Select>
                   <Option value="Regular">Regular (Aam)</Option>
                   <Option value="VIP">VIP (Khaas)</Option>
                   <Option value="Wholesale">Wholesale (Bulk)</Option>
                   <Option value="Retailer">Retailer (Dukan)</Option>
                   <Option value="Tailor">Tailor (Darzi)</Option>
                   <Option value="Designer">Designer (Designer)</Option>
                 </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email', message: 'Please enter a valid email' },
                  { required: true, message: 'Please enter email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
          >
            <TextArea rows={2} placeholder="Enter street address" />
          </Form.Item>

          <Row gutter={16}>
                         <Col span={12}>
               <Form.Item
                 name="city"
                 label="City"
               >
                 <Select placeholder="Select city" showSearch>
                   <Option value="Karachi">Karachi</Option>
                   <Option value="Lahore">Lahore</Option>
                   <Option value="Islamabad">Islamabad</Option>
                   <Option value="Rawalpindi">Rawalpindi</Option>
                   <Option value="Faisalabad">Faisalabad</Option>
                   <Option value="Multan">Multan</Option>
                   <Option value="Peshawar">Peshawar</Option>
                   <Option value="Quetta">Quetta</Option>
                   <Option value="Sialkot">Sialkot</Option>
                   <Option value="Gujranwala">Gujranwala</Option>
                   <Option value="Other">Other</Option>
                 </Select>
               </Form.Item>
             </Col>
             <Col span={12}>
               <Form.Item
                 name="country"
                 label="Country"
               >
                 <Select placeholder="Select country">
                   <Option value="Pakistan">Pakistan</Option>
                   <Option value="India">India</Option>
                   <Option value="Afghanistan">Afghanistan</Option>
                   <Option value="UAE">UAE</Option>
                   <Option value="Saudi Arabia">Saudi Arabia</Option>
                   <Option value="UK">UK</Option>
                   <Option value="USA">USA</Option>
                   <Option value="Other">Other</Option>
                 </Select>
               </Form.Item>
             </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={3} placeholder="Any additional notes about this customer" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCustomer ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Customer Drawer */}
      <Drawer
        title="Customer Details"
        placement="right"
        onClose={() => setIsViewDrawerVisible(false)}
        open={isViewDrawerVisible}
        width={500}
      >
        {viewingCustomer && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: '10px' }}>{viewingCustomer.name}</Title>
              <Tag color={viewingCustomer.customerType === 'VIP' ? 'gold' : 'blue'}>
                {viewingCustomer.customerType || 'Regular'}
              </Tag>
            </div>

            <Descriptions column={1} bordered>
              <Descriptions.Item label="Email">
                {viewingCustomer.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {viewingCustomer.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={3}>
                {viewingCustomer.address || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {viewingCustomer.city || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {viewingCustomer.country || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Registration Date">
                {viewingCustomer.registrationDate ? 
                  new Date(viewingCustomer.registrationDate).toLocaleDateString() : 'N/A'
                }
              </Descriptions.Item>
              <Descriptions.Item label="Notes" span={3}>
                {viewingCustomer.notes || 'No notes available'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Quick Actions</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => {
                  setIsViewDrawerVisible(false);
                  handleEditCustomer(viewingCustomer);
                }}
                style={{ width: '100%' }}
              >
                Edit Customer
              </Button>
              <Button 
                icon={<PhoneOutlined />}
                onClick={() => window.open(`tel:${viewingCustomer.phone}`, '_self')}
                disabled={!viewingCustomer.phone}
                style={{ width: '100%' }}
              >
                Call Customer
              </Button>
              <Button 
                icon={<MailOutlined />}
                onClick={() => window.open(`mailto:${viewingCustomer.email}`, '_self')}
                disabled={!viewingCustomer.email}
                style={{ width: '100%' }}
              >
                Send Email
              </Button>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
}
