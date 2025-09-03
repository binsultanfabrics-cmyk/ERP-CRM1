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
  App, 
  Popconfirm, 
  Drawer, 
  Descriptions, 
  Divider, 
  Alert, 
  Progress, 
  Badge,
  message,
  Tabs,
  InputNumber,
  Transfer
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  EyeOutlined,
  SwapOutlined,
  InboxOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  SettingOutlined,
  HistoryOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectEntityList } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function Locations() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message: messageApi } = App.useApp();
  
  const { result: locations, isLoading: locationsLoading } = useSelector(selectEntityList('location'));
  const { result: inventoryRolls, isLoading: inventoryLoading } = useSelector(selectEntityList('inventoryroll'));
  const { result: stockTxns, isLoading: stockTxnsLoading } = useSelector(selectEntityList('stocktxn'));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isInventoryDrawerVisible, setIsInventoryDrawerVisible] = useState(false);
  const [isTransferHistoryDrawerVisible, setIsTransferHistoryDrawerVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [viewingLocation, setViewingLocation] = useState(null);
  const [transferringLocation, setTransferringLocation] = useState(null);
  const [locationInventory, setLocationInventory] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  const [form] = Form.useForm();
  const [transferForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const locationsList = locations?.items || [];
  const inventoryRollsList = inventoryRolls?.items || [];
  const stockTxnsList = stockTxns?.items || [];

  useEffect(() => {
    dispatch(crud.list({ entity: 'location' }));
    dispatch(crud.list({ entity: 'inventoryroll' }));
    dispatch(crud.list({ entity: 'stocktxn' }));
  }, []);

  // Calculate location statistics
  const locationStats = {
    total: locationsList.length,
    warehouses: locationsList.filter(loc => loc.type === 'Warehouse').length,
    stores: locationsList.filter(loc => loc.type === 'Store').length,
    showrooms: locationsList.filter(loc => loc.type === 'Showroom').length,
    totalCapacity: locationsList.reduce((sum, loc) => sum + (loc.capacity?.maxRolls || 0), 0),
  };

  const handleCreateLocation = () => {
    setEditingLocation(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'Warehouse',
      capacity: { maxRolls: 1000, maxValue: 0 },
      settings: {
        allowNegativeStock: false,
        requireApprovalForTransfer: true,
        autoReorder: false,
        reorderLevel: 10,
      },
    });
    setIsModalVisible(true);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    form.setFieldsValue({
      ...location,
      capacity: location.capacity || { maxRolls: 1000, maxValue: 0 },
      settings: location.settings || {
        allowNegativeStock: false,
        requireApprovalForTransfer: true,
        autoReorder: false,
        reorderLevel: 10,
      },
    });
    setIsModalVisible(true);
  };

  const handleViewLocation = (location) => {
    setViewingLocation(location);
    setIsInventoryDrawerVisible(true);
    // Fetch location inventory
    fetchLocationInventory(location._id);
  };

  const handleTransferStock = (location) => {
    setTransferringLocation(location);
    transferForm.resetFields();
    setIsTransferModalVisible(true);
  };

  const handleViewTransferHistory = (location) => {
    setViewingLocation(location);
    setIsTransferHistoryDrawerVisible(true);
    // Fetch transfer history
    fetchTransferHistory(location._id);
  };

  const fetchLocationInventory = async (locationId) => {
    try {
      setLoading(true);
      // This would be replaced with actual API call
      const locationInventoryData = inventoryRollsList.filter(roll => roll.location === locationId);
      setLocationInventory(locationInventoryData);
    } catch (error) {
      messageApi.error('Failed to fetch location inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransferHistory = async (locationId) => {
    try {
      setLoading(true);
      // This would be replaced with actual API call
      const transferData = stockTxnsList.filter(txn => 
        txn.fromLocation === locationId || txn.toLocation === locationId
      );
      setTransferHistory(transferData);
    } catch (error) {
      messageApi.error('Failed to fetch transfer history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLocation = async (values) => {
    try {
      setLoading(true);
      
      const locationData = {
        code: values.code,
        name: values.name,
        type: values.type,
        address: values.address,
        contact: values.contact,
        capacity: values.capacity,
        settings: values.settings,
        notes: values.notes,
      };

      if (editingLocation) {
        await dispatch(crud.update({ 
          entity: 'location', 
          id: editingLocation._id, 
          jsonData: locationData 
        }));
        messageApi.success('Location updated successfully');
      } else {
        await dispatch(crud.create({ 
          entity: 'location', 
          jsonData: locationData 
        }));
        messageApi.success('Location created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      dispatch(crud.list({ entity: 'location' }));
    } catch (error) {
      messageApi.error('Failed to save location');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTransfer = async (values) => {
    try {
      setLoading(true);
      
      await dispatch(crud.transferStock({ 
        entity: 'location', 
        jsonData: {
          fromLocationId: transferringLocation._id,
          toLocationId: values.toLocation,
          items: values.items,
          notes: values.notes,
        }
      }));
      
      messageApi.success('Stock transfer completed successfully');
      setIsTransferModalVisible(false);
      transferForm.resetFields();
      setTransferringLocation(null);
      dispatch(crud.list({ entity: 'inventoryroll' }));
    } catch (error) {
      messageApi.error('Failed to transfer stock');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      setLoading(true);
      await dispatch(crud.delete({ entity: 'location', id: locationId }));
      messageApi.success('Location deleted successfully');
      dispatch(crud.list({ entity: 'location' }));
    } catch (error) {
      messageApi.error('Failed to delete location');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Warehouse': 'blue',
      'Store': 'green',
      'Showroom': 'purple',
      'Office': 'orange',
      'Other': 'default',
    };
    return colors[type] || 'default';
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Text strong>{code}</Text>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          {record.isDefault && (
            <Tag color="gold" style={{ marginLeft: 8 }}>Default</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={getTypeColor(type)}>{type}</Tag>
      ),
    },
    {
      title: 'Address',
      key: 'address',
      render: (_, record) => (
        <div>
          <Text>{record.address?.street || 'N/A'}</Text>
          <br />
          <Text type="secondary">
            {record.address?.city}, {record.address?.state}
          </Text>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          {record.contact?.phone && (
            <div>
              <PhoneOutlined /> {record.contact.phone}
            </div>
          )}
          {record.contact?.email && (
            <div>
              <MailOutlined /> {record.contact.email}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Capacity',
      key: 'capacity',
      render: (_, record) => (
        <div>
          <Text>Max Rolls: {record.capacity?.maxRolls || 0}</Text>
          <br />
          <Text type="secondary">
            Max Value: Rs {parseFloat(record.capacity?.maxValue || 0).toFixed(2)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewLocation(record)}
          >
            Inventory
          </Button>
          <Button 
            type="text" 
            icon={<SwapOutlined />}
            onClick={() => handleTransferStock(record)}
          >
            Transfer
          </Button>
          <Button 
            type="text" 
            icon={<HistoryOutlined />}
            onClick={() => handleViewTransferHistory(record)}
          >
            History
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEditLocation(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this location?"
            onConfirm={() => handleDeleteLocation(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              🏢 Locations & Warehouses
            </Title>
            <Text type="secondary">Manage multiple locations and stock transfers</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateLocation}
              >
                Add Location
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => dispatch(crud.list({ entity: 'location' }))}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Location Statistics */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Locations"
              value={locationStats.total}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Warehouses"
              value={locationStats.warehouses}
              valueStyle={{ color: '#1890ff' }}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Stores"
              value={locationStats.stores}
              valueStyle={{ color: '#52c41a' }}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Showrooms"
              value={locationStats.showrooms}
              valueStyle={{ color: '#722ed1' }}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Capacity"
              value={locationStats.totalCapacity}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Locations Table */}
      <Card>
        <Table
          dataSource={locationsList}
          columns={columns}
          loading={locationsLoading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} locations`
          }}
        />
      </Card>

      {/* Create/Edit Location Modal */}
      <Modal
        title={editingLocation ? 'Edit Location' : 'Create Location'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitLocation}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Location Code"
                rules={[{ required: true, message: 'Please enter location code' }]}
              >
                <Input placeholder="e.g., WH001, ST001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Location Name"
                rules={[{ required: true, message: 'Please enter location name' }]}
              >
                <Input placeholder="e.g., Main Warehouse, Downtown Store" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="type"
            label="Location Type"
            rules={[{ required: true, message: 'Please select location type' }]}
          >
            <Select>
              <Option value="Warehouse">Warehouse</Option>
              <Option value="Store">Store</Option>
              <Option value="Showroom">Showroom</Option>
              <Option value="Office">Office</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Title level={5}>Address</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['address', 'street']} label="Street">
                <Input placeholder="Street address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['address', 'city']} label="City">
                <Input placeholder="City" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['address', 'state']} label="State">
                <Input placeholder="State" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['address', 'postalCode']} label="Postal Code">
                <Input placeholder="Postal code" />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5}>Contact Information</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['contact', 'phone']} label="Phone">
                <Input placeholder="Phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['contact', 'email']} label="Email">
                <Input placeholder="Email address" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name={['contact', 'manager']} label="Manager">
            <Input placeholder="Manager name" />
          </Form.Item>

          <Title level={5}>Capacity Settings</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['capacity', 'maxRolls']} label="Max Rolls">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['capacity', 'maxValue']} label="Max Value (Rs)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5}>Location Settings</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['settings', 'allowNegativeStock']} label="Allow Negative Stock" valuePropName="checked">
                <input type="checkbox" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['settings', 'requireApprovalForTransfer']} label="Require Approval for Transfer" valuePropName="checked">
                <input type="checkbox" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['settings', 'autoReorder']} label="Auto Reorder" valuePropName="checked">
                <input type="checkbox" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['settings', 'reorderLevel']} label="Reorder Level">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Notes">
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
                icon={<PlusOutlined />}
              >
                {editingLocation ? 'Update' : 'Create'} Location
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Stock Transfer Modal */}
      <Modal
        title={`Transfer Stock from ${transferringLocation?.name}`}
        open={isTransferModalVisible}
        onCancel={() => setIsTransferModalVisible(false)}
        footer={null}
        width={800}
      >
        {transferringLocation && (
          <div>
            <Alert
              message="Stock Transfer"
              description={`Transfer stock from ${transferringLocation.name} to another location`}
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />
            
            <Form
              form={transferForm}
              layout="vertical"
              onFinish={handleSubmitTransfer}
            >
              <Form.Item
                name="toLocation"
                label="Transfer To"
                rules={[{ required: true, message: 'Please select destination location' }]}
              >
                <Select placeholder="Select destination location">
                  {locationsList
                    .filter(loc => loc._id !== transferringLocation._id)
                    .map(location => (
                      <Option key={location._id} value={location._id}>
                        {location.name} ({location.code})
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card key={key} size="small" style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'rollId']}
                              label="Select Roll"
                              rules={[{ required: true, message: 'Please select roll' }]}
                            >
                              <Select placeholder="Select inventory roll">
                                {inventoryRollsList
                                  .filter(roll => roll.location === transferringLocation._id)
                                  .map(roll => (
                                    <Option key={roll._id} value={roll._id}>
                                      {roll.rollNumber} - {roll.product?.name} ({roll.remainingLength} {roll.unit})
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              {...restField}
                              name={[name, 'quantity']}
                              label="Quantity"
                              rules={[{ required: true, message: 'Please enter quantity' }]}
                            >
                              <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={3}>
                            <Form.Item label=" ">
                              <Button 
                                type="text" 
                                danger 
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              >
                                Remove
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Form.Item>
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block 
                        icon={<PlusOutlined />}
                      >
                        Add Item
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item name="notes" label="Transfer Notes">
                <TextArea rows={3} placeholder="Notes about this transfer..." />
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Space>
                  <Button onClick={() => setIsTransferModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    icon={<SwapOutlined />}
                  >
                    Transfer Stock
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      {/* Location Inventory Drawer */}
      <Drawer
        title={`Inventory - ${viewingLocation?.name}`}
        placement="right"
        width={800}
        open={isInventoryDrawerVisible}
        onClose={() => setIsInventoryDrawerVisible(false)}
      >
        {viewingLocation && (
          <div>
            <Descriptions title="Location Information" bordered column={1}>
              <Descriptions.Item label="Name">
                <Text strong>{viewingLocation.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Code">
                {viewingLocation.code}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={getTypeColor(viewingLocation.type)}>
                  {viewingLocation.type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {viewingLocation.address?.street}, {viewingLocation.address?.city}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Inventory Items</Title>
            {locationInventory.length > 0 ? (
              <Table
                dataSource={locationInventory}
                columns={[
                  {
                    title: 'Roll Number',
                    dataIndex: 'rollNumber',
                    key: 'rollNumber',
                  },
                  {
                    title: 'Product',
                    key: 'product',
                    render: (_, record) => record.product?.name || 'Unknown',
                  },
                  {
                    title: 'Remaining',
                    dataIndex: 'remainingLength',
                    key: 'remainingLength',
                    render: (value, record) => `${value} ${record.unit}`,
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status) => <Tag color="blue">{status}</Tag>,
                  },
                ]}
                loading={loading}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                size="small"
              />
            ) : (
              <Alert message="No inventory found" type="info" />
            )}
          </div>
        )}
      </Drawer>

      {/* Transfer History Drawer */}
      <Drawer
        title={`Transfer History - ${viewingLocation?.name}`}
        placement="right"
        width={800}
        open={isTransferHistoryDrawerVisible}
        onClose={() => setIsTransferHistoryDrawerVisible(false)}
      >
        {viewingLocation && (
          <div>
            <Title level={4}>Recent Transfers</Title>
            {transferHistory.length > 0 ? (
              <Table
                dataSource={transferHistory}
                columns={[
                  {
                    title: 'Type',
                    dataIndex: 'type',
                    key: 'type',
                    render: (type) => (
                      <Tag color={type === 'IN' ? 'green' : 'red'}>
                        {type}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Product',
                    key: 'product',
                    render: (_, record) => record.product?.name || 'Unknown',
                  },
                  {
                    title: 'Quantity',
                    dataIndex: 'qty',
                    key: 'qty',
                    render: (value, record) => `${value} ${record.unit}`,
                  },
                  {
                    title: 'From/To',
                    key: 'location',
                    render: (_, record) => {
                      const fromLoc = locationsList.find(loc => loc._id === record.fromLocation);
                      const toLoc = locationsList.find(loc => loc._id === record.toLocation);
                      return (
                        <div>
                          <Text type="secondary">From: {fromLoc?.name || 'N/A'}</Text>
                          <br />
                          <Text>To: {toLoc?.name || 'N/A'}</Text>
                        </div>
                      );
                    },
                  },
                  {
                    title: 'Date',
                    dataIndex: 'created',
                    key: 'created',
                    render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
                  },
                ]}
                loading={loading}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                size="small"
              />
            ) : (
              <Alert message="No transfer history found" type="info" />
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
