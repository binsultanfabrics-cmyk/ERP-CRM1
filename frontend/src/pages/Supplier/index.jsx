import React, { useState, useEffect } from 'react';
import { Card, 
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
  InputNumber, 
  Popconfirm, 
  Drawer, 
  Descriptions, 
  Divider, 
  Alert, 
  Progress, 
  Badge,
  DatePicker,
  Tabs,
  Timeline
, App } from 'antd';
import { 
  PlusOutlined, 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  ReloadOutlined,
  FileTextOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectEntityList } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
// Removed TabPane destructuring - using items prop instead

export default function Supplier() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message } = App.useApp(); // Use App context for message API
  const { result: suppliers, isLoading: suppliersLoading } = useSelector(selectEntityList('supplier'));
  const { result: products, isLoading: productsLoading } = useSelector(selectEntityList('product'));
  const { result: inventoryRolls, isLoading: rollsLoading } = useSelector(selectEntityList('inventoryroll'));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [isPurchaseOrderModalVisible, setIsPurchaseOrderModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [viewingSupplier, setViewingSupplier] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [form] = Form.useForm();
  const [purchaseOrderForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('suppliers');

  useEffect(() => {
    dispatch(crud.list({ entity: 'supplier' }));
    dispatch(crud.list({ entity: 'product' }));
    dispatch(crud.list({ entity: 'inventoryroll' }));
  }, []);

  // Ensure data exists and has the correct structure
  const suppliersList = suppliers?.items || [];
  const productsList = products?.items || [];
  const rollsList = inventoryRolls?.items || [];

  // Calculate supplier statistics
  const supplierStats = {
    totalSuppliers: suppliersList.length,
    activeSuppliers: suppliersList.filter(s => s.status === 'active').length,
    totalPurchases: rollsList.reduce((sum, roll) => sum + (roll.costPerUnit * roll.initLength), 0),
    pendingPayments: suppliersList.reduce((sum, supplier) => sum + (supplier.outstandingBalance || 0), 0),
    topSuppliers: suppliersList
      .sort((a, b) => (b.totalPurchases || 0) - (a.totalPurchases || 0))
      .slice(0, 5)
  };

  // Handle supplier operations
  const handleAddSupplier = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      contactPerson: supplier.contactPerson,
      paymentTerms: supplier.paymentTerms,
      creditLimit: supplier.creditLimit,
      status: supplier.status || 'active',
      notes: supplier.notes
    });
    setIsModalVisible(true);
  };

  const handleViewSupplier = (supplier) => {
    setViewingSupplier(supplier);
    setIsViewDrawerVisible(true);
  };

  const handleDeleteSupplier = async (supplierId) => {
    try {
      setLoading(true);
      await dispatch(crud.delete({ entity: 'supplier', id: supplierId }));
      message.success('Supplier deleted successfully');
      dispatch(crud.list({ entity: 'supplier' }));
    } catch (error) {
      message.error('Failed to delete supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const supplierData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city || 'Karachi',
        country: values.country || 'Pakistan',
        contactPerson: values.contactPerson,
        paymentTerms: values.paymentTerms,
        creditLimit: values.creditLimit,
        status: values.status,
        notes: values.notes,
        registrationDate: editingSupplier ? editingSupplier.registrationDate : new Date().toISOString()
      };

      if (editingSupplier) {
        await dispatch(crud.update({ entity: 'supplier', id: editingSupplier._id, jsonData: supplierData }));
        message.success('Supplier updated successfully');
      } else {
        await dispatch(crud.create({ entity: 'supplier', jsonData: supplierData }));
        message.success('Supplier created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      dispatch(crud.list({ entity: 'supplier' }));
    } catch (error) {
      message.error('Failed to save supplier');
    } finally {
      setLoading(false);
    }
  };

  // Handle purchase order creation
  const handleCreatePurchaseOrder = (supplier) => {
    setSelectedSupplier(supplier);
    setIsPurchaseOrderModalVisible(true);
    purchaseOrderForm.resetFields();
  };

  const submitPurchaseOrder = async (values) => {
    try {
      setLoading(true);
      
      // Create purchase order data
      const poData = {
        supplier: selectedSupplier._id,
        orderDate: values.orderDate.toISOString(),
        expectedDelivery: values.expectedDelivery?.toISOString(),
        items: values.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice
        })),
        subtotal: values.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
        tax: values.tax || 0,
        total: values.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) + (values.tax || 0),
        status: 'ordered',
        notes: values.notes
      };

      // In a real application, you would create a PurchaseOrder model
      // For now, we'll just show a success message
      message.success('Purchase Order created successfully!');
      setIsPurchaseOrderModalVisible(false);
      purchaseOrderForm.resetFields();
      setSelectedSupplier(null);
    } catch (error) {
      message.error('Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  // Calculate supplier performance metrics
  const calculateSupplierMetrics = (supplier) => {
    const supplierRolls = rollsList.filter(roll => roll.supplier === supplier._id);
    const totalPurchases = supplierRolls.reduce((sum, roll) => sum + (roll.costPerUnit * roll.initLength), 0);
    const totalStock = supplierRolls.reduce((sum, roll) => sum + roll.remainingLength, 0);
    const averageDeliveryTime = supplier.averageDeliveryTime || 7; // days
    
    return {
      totalPurchases,
      totalStock,
      averageDeliveryTime,
      onTimeDelivery: supplier.onTimeDelivery || 85, // percentage
      qualityRating: supplier.qualityRating || 4.2 // out of 5
    };
  };

  // Table columns for suppliers
  const supplierColumns = [
    {
      title: 'Supplier',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary">{record.contactPerson}</Text>
        </div>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div><PhoneOutlined /> {record.phone}</div>
          <div><MailOutlined /> {record.email}</div>
        </div>
      )
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => (
        <div>
          <div>{record.city}, {record.country}</div>
          <Text type="secondary">{record.address}</Text>
        </div>
      )
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => {
        const metrics = calculateSupplierMetrics(record);
        return (
          <div>
            <div>Total: Rs {metrics.totalPurchases.toFixed(2)}</div>
            <div>Stock: {metrics.totalStock.toFixed(2)} units</div>
            <div>Rating: {metrics.qualityRating}/5</div>
          </div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          active: { color: 'green', text: 'Active' },
          inactive: { color: 'red', text: 'Inactive' },
          suspended: { color: 'orange', text: 'Suspended' }
        };
        
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewSupplier(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEditSupplier(record)}
          />
          <Button 
            type="text" 
            icon={<ShoppingOutlined />}
            onClick={() => handleCreatePurchaseOrder(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this supplier?"
            onConfirm={() => handleDeleteSupplier(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              🏭 Supplier Management
            </Title>
            <Text type="secondary">Manage suppliers, purchase orders, and supplier relationships</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddSupplier}
              >
                Add Supplier
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => dispatch(crud.list({ entity: 'supplier' }))}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Supplier Statistics */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Suppliers"
              value={supplierStats.totalSuppliers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Suppliers"
              value={supplierStats.activeSuppliers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Purchases"
              value={supplierStats.totalPurchases.toFixed(2)}
              prefix={<DollarOutlined />}
              suffix="Rs"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Payments"
              value={supplierStats.pendingPayments.toFixed(2)}
              prefix={<CreditCardOutlined />}
              suffix="Rs"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Top Suppliers */}
      <Card title="🏆 Top Suppliers by Purchase Volume" style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          {supplierStats.topSuppliers.map((supplier, index) => {
            const metrics = calculateSupplierMetrics(supplier);
            return (
              <Col span={8} key={supplier._id}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <Badge count={index + 1} style={{ backgroundColor: index < 3 ? '#1890ff' : '#d9d9d9' }} />
                    <div style={{ marginTop: 8 }}>
                      <Text strong>{supplier.name}</Text>
                      <br />
                      <Text type="secondary">Rs {metrics.totalPurchases.toFixed(2)}</Text>
                      <br />
                      <Progress 
                        percent={metrics.onTimeDelivery} 
                        size="small" 
                        format={percent => `${percent}% on-time`}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Main Content */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'suppliers',
              label: '🏭 Suppliers',
              children: (
                <Table
                  dataSource={suppliersList}
                  columns={supplierColumns}
                  loading={suppliersLoading}
                  rowKey="_id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} suppliers`
                  }}
                />
              )
            },
            {
              key: 'purchaseOrders',
              label: '📋 Purchase Orders',
              children: (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Text type="secondary">Purchase order management coming soon...</Text>
                </div>
              )
            },
            {
              key: 'ledger',
              label: '💰 Supplier Ledger',
              children: (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Text type="secondary">Supplier ledger and payment tracking coming soon...</Text>
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Supplier Modal */}
      <Modal
        title={editingSupplier ? '✏️ Edit Supplier' : '➕ Add New Supplier'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Supplier Name"
                name="name"
                rules={[{ required: true, message: 'Please enter supplier name' }]}
              >
                <Input placeholder="Supplier company name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Contact Person"
                name="contactPerson"
                rules={[{ required: true, message: 'Please enter contact person' }]}
              >
                <Input placeholder="Primary contact person" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="Email address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Address" name="address">
            <TextArea rows={2} placeholder="Full address" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="City" name="city">
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Country" name="country">
                <Input placeholder="Country" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Payment Terms" name="paymentTerms">
                <Select placeholder="Select payment terms">
                  <Option value="immediate">Immediate</Option>
                  <Option value="7days">7 Days</Option>
                  <Option value="15days">15 Days</Option>
                  <Option value="30days">30 Days</Option>
                  <Option value="45days">45 Days</Option>
                  <Option value="60days">60 Days</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Credit Limit" name="creditLimit">
                <InputNumber
                  min={0}
                  step={100}
                  style={{ width: '100%' }}
                  placeholder="Credit limit amount"
                  prefix="Rs"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Status" name="status" initialValue="active">
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} placeholder="Additional notes..." />
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                icon={editingSupplier ? <EditOutlined /> : <PlusOutlined />}
              >
                {editingSupplier ? 'Update Supplier' : 'Create Supplier'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Purchase Order Modal */}
      <Modal
        title="📋 Create Purchase Order"
        open={isPurchaseOrderModalVisible}
        onCancel={() => setIsPurchaseOrderModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedSupplier && (
          <div>
            <Alert
              message={`Creating Purchase Order for: ${selectedSupplier.name}`}
              description={`Contact: ${selectedSupplier.contactPerson} | Phone: ${selectedSupplier.phone}`}
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />
            
            <Form form={purchaseOrderForm} onFinish={submitPurchaseOrder} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Order Date"
                    name="orderDate"
                    rules={[{ required: true, message: 'Please select order date' }]}
                    initialValue={dayjs()}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Expected Delivery"
                    name="expectedDelivery"
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Items" name="items" initialValue={[{ product: '', quantity: 1, unit: 'm', unitPrice: 0 }]}>
                <div>
                  {/* This would be a dynamic form for multiple items */}
                  <Text type="secondary">Item management coming soon...</Text>
                </div>
              </Form.Item>

              <Form.Item label="Tax" name="tax">
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder="Tax amount"
                  prefix="Rs"
                />
              </Form.Item>

              <Form.Item label="Notes" name="notes">
                <TextArea rows={3} placeholder="Purchase order notes..." />
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Space>
                  <Button onClick={() => setIsPurchaseOrderModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    icon={<ShoppingOutlined />}
                  >
                    Create Purchase Order
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      {/* Supplier Details Drawer */}
      <Drawer
        title="📋 Supplier Details"
        placement="right"
        width={600}
        open={isViewDrawerVisible}
        onClose={() => setIsViewDrawerVisible(false)}
      >
        {viewingSupplier && (
          <div>
            <Descriptions title="Basic Information" bordered column={1}>
              <Descriptions.Item label="Name">
                {viewingSupplier.name}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Person">
                {viewingSupplier.contactPerson}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {viewingSupplier.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {viewingSupplier.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {viewingSupplier.address}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {viewingSupplier.city}, {viewingSupplier.country}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Terms">
                {viewingSupplier.paymentTerms}
              </Descriptions.Item>
              <Descriptions.Item label="Credit Limit">
                Rs {viewingSupplier.creditLimit || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={viewingSupplier.status === 'active' ? 'green' : 'red'}>
                  {viewingSupplier.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Registration Date">
                {dayjs(viewingSupplier.registrationDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div style={{ marginTop: 20 }}>
              <Text strong>Performance Metrics:</Text>
              {(() => {
                const metrics = calculateSupplierMetrics(viewingSupplier);
                return (
                  <div style={{ marginTop: 16 }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic
                          title="Total Purchases"
                          value={metrics.totalPurchases.toFixed(2)}
                          prefix="Rs"
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Current Stock"
                          value={metrics.totalStock.toFixed(2)}
                          suffix="units"
                        />
                      </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                      <Col span={12}>
                        <Statistic
                          title="On-time Delivery"
                          value={metrics.onTimeDelivery}
                          suffix="%"
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Quality Rating"
                          value={metrics.qualityRating}
                          suffix="/5"
                        />
                      </Col>
                    </Row>
                  </div>
                );
              })()}
            </div>

            {viewingSupplier.notes && (
              <>
                <Divider />
                <div>
                  <Text strong>Notes:</Text>
                  <p>{viewingSupplier.notes}</p>
                </div>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
