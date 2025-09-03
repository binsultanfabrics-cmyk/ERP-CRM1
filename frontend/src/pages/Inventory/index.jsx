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
  InputNumber, 
  App, 
  Popconfirm, 
  Drawer, 
  Descriptions, 
  Divider, 
  Alert, 
  Progress, 
  Badge,
  DatePicker,
  Upload,
  Image,
  Tabs
} from 'antd';
import { 
  PlusOutlined, 
  InboxOutlined, 
  AlertOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  BarcodeOutlined,
  QrcodeOutlined,
  FileTextOutlined,
  DownloadOutlined,
  UploadOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectEntityList } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function Inventory() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message } = App.useApp(); // Use App context for message API
  const { result: products, isLoading: productsLoading } = useSelector(selectEntityList('product'));
  const { result: inventoryRolls, isLoading: rollsLoading } = useSelector(selectEntityList('inventoryroll'));
  const { result: stockTxns, isLoading: txnsLoading } = useSelector(selectEntityList('stocktxn'));
  const { result: suppliers, isLoading: suppliersLoading } = useSelector(selectEntityList('supplier'));

  const [isGRNModalVisible, setIsGRNModalVisible] = useState(false);
  const [isRollModalVisible, setIsRollModalVisible] = useState(false);
  const [isAdjustmentModalVisible, setIsAdjustmentModalVisible] = useState(false);
  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [editingRoll, setEditingRoll] = useState(null);
  const [viewingRoll, setViewingRoll] = useState(null);
  const [grnForm] = Form.useForm();
  const [rollForm] = Form.useForm();
  const [adjustmentForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(crud.list({ entity: 'product' }));
    dispatch(crud.list({ entity: 'inventoryroll' }));
    dispatch(crud.list({ entity: 'stocktxn' }));
    dispatch(crud.list({ entity: 'supplier' }));
  }, []);

  // Ensure data exists and has the correct structure
  const productsList = products?.items || [];
  const rollsList = inventoryRolls?.items || [];
  const txnsList = stockTxns?.items || [];
  const suppliersList = suppliers?.items || [];

  // Calculate inventory statistics
  const inventoryStats = {
    totalProducts: productsList.length,
    totalRolls: rollsList.length,
    totalStock: rollsList.reduce((sum, roll) => {
      const remainingLength = parseFloat(roll.remainingLength) || 0;
      return sum + remainingLength;
    }, 0),
    lowStockItems: rollsList.filter(roll => {
      const remainingLength = parseFloat(roll.remainingLength) || 0;
      const minStockLevel = parseFloat(roll.minStockLevel) || 5;
      return remainingLength <= minStockLevel;
    }).length,
    agingStock: rollsList.filter(roll => {
      if (!roll.receivedDate) return false;
      const daysSinceReceived = dayjs().diff(dayjs(roll.receivedDate), 'day');
      return daysSinceReceived > 90; // 90 days
    }).length,
    reservedStock: rollsList.filter(roll => roll.status === 'reserved').length,
    damagedStock: rollsList.filter(roll => roll.status === 'damaged').length
  };

  // Table columns for inventory rolls
  const inventoryColumns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (productId) => {
        const product = productsList.find(p => p._id === productId);
        return (
          <div>
            <Text strong>{product?.name || 'Unknown'}</Text>
            <br />
            <Text type="secondary">{product?.code || 'N/A'}</Text>
          </div>
        );
      }
    },
    {
      title: 'Batch/Code',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      render: (batchNumber, record) => (
        <div>
          <Text strong>{batchNumber}</Text>
          <br />
          <Text type="secondary">{record.barcode}</Text>
        </div>
      )
    },
    {
      title: 'Stock Levels',
      key: 'stock',
      render: (_, record) => {
        const remainingLength = parseFloat(record.remainingLength) || 0;
        const initLength = parseFloat(record.initLength) || 0;
        const stockPercentage = initLength > 0 ? (remainingLength / initLength) * 100 : 0;
        const isLowStock = remainingLength <= (parseFloat(record.minStockLevel) || 5);
        
        return (
          <div>
            <div style={{ marginBottom: 8 }}>
              <Text>{remainingLength.toFixed(2)} / {initLength.toFixed(2)} {record.unit || 'units'}</Text>
            </div>
            <Progress 
              percent={stockPercentage} 
              size="small" 
              status={isLowStock ? 'exception' : 'normal'}
            />
            {isLowStock && (
              <Tag color="red" icon={<AlertOutlined />}>
                Low Stock
              </Tag>
            )}
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
          reserved: { color: 'orange', text: 'Reserved' },
          damaged: { color: 'red', text: 'Damaged' },
          disposed: { color: 'default', text: 'Disposed' }
        };
        
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Received Date',
      dataIndex: 'receivedDate',
      key: 'receivedDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewRoll(record)}
          >
            View
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEditRoll(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this roll?"
            onConfirm={() => handleDeleteRoll(record._id)}
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
      )
    }
  ];

  // Table columns for stock transactions
  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'N/A'
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (productId) => {
        const product = productsList.find(p => p._id === productId);
        return product?.name || 'Unknown';
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeConfig = {
          IN: { color: 'green', text: 'Received', icon: '📥' },
          OUT: { color: 'red', text: 'Sold', icon: '📤' },
          ADJUST: { color: 'orange', text: 'Adjusted', icon: '🔄' }
        };
        
        const config = typeConfig[type] || { color: 'default', text: type, icon: '❓' };
        return <Tag color={config.color}>{config.icon} {config.text}</Tag>;
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => `${quantity || 0} ${record.unit || 'units'}`
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true
    }
  ];

  // Tab items configuration
  const tabItems = [
    {
      key: 'inventory',
      label: '📦 Inventory Rolls',
      children: (
        <Table
          dataSource={rollsList}
          columns={inventoryColumns}
          loading={rollsLoading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rolls`
          }}
        />
      ),
    },
    {
      key: 'transactions',
      label: '📊 Stock Transactions',
      children: (
        <Table
          dataSource={txnsList}
          columns={transactionColumns}
          loading={txnsLoading}
          rowKey="_id"
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`
          }}
        />
      ),
    },
    {
      key: 'analytics',
      label: '📈 Stock Analytics',
      children: (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">Stock analytics and charts coming soon...</Text>
        </div>
      ),
    },
  ];

  // Handle GRN (Goods Received Note)
  const handleGRN = () => {
    setIsGRNModalVisible(true);
    grnForm.resetFields();
  };

  const submitGRN = async (values) => {
    try {
      setLoading(true);
      
      // Create inventory roll
      const rollData = {
        product: values.product,
        supplier: values.supplier,
        batchNumber: values.batchNumber,
        barcode: values.barcode,
        initLength: values.quantity,
        remainingLength: values.quantity,
        unit: values.unit,
        costPerUnit: values.costPerUnit,
        receivedDate: values.receivedDate.toISOString(),
        status: 'active',
        location: values.location || 'Main Store',
        notes: values.notes
      };

      const rollResult = await dispatch(crud.create({ 
        entity: 'inventoryroll', 
        jsonData: rollData 
      }));

      if (rollResult.payload?.success) {
        // Create stock transaction
        await dispatch(crud.create({
          entity: 'stocktxn',
          jsonData: {
            product: values.product,
            roll: rollResult.payload.result._id,
            type: 'IN',
            quantity: values.quantity,
            unit: values.unit,
            reason: 'GRN',
            reference: rollResult.payload.result._id,
            date: new Date().toISOString(),
            notes: `Goods received from ${suppliersList.find(s => s._id === values.supplier)?.name}`
          }
        }));

        message.success('GRN created successfully!');
        setIsGRNModalVisible(false);
        grnForm.resetFields();
        dispatch(crud.list({ entity: 'inventoryroll' }));
        dispatch(crud.list({ entity: 'stocktxn' }));
      }
    } catch (error) {
      message.error('Failed to create GRN');
    } finally {
      setLoading(false);
    }
  };

  // Handle stock adjustment
  const handleAdjustment = (roll) => {
    setSelectedProduct(roll);
    setIsAdjustmentModalVisible(true);
    adjustmentForm.resetFields();
  };

  const submitAdjustment = async (values) => {
    try {
      setLoading(true);
      
      const adjustmentQuantity = values.adjustmentType === 'decrease' ? -values.quantity : values.quantity;
      const currentRemainingLength = parseFloat(selectedProduct.remainingLength) || 0;
      const newRemainingLength = currentRemainingLength + adjustmentQuantity;

      if (newRemainingLength < 0) {
        message.error('Adjustment would result in negative stock');
        return;
      }

      // Update roll
      await dispatch(crud.update({
        entity: 'inventoryroll',
        id: selectedProduct._id,
        jsonData: { 
          remainingLength: newRemainingLength,
          status: values.newStatus || selectedProduct.status
        }
      }));

      // Create stock transaction
      await dispatch(crud.create({
        entity: 'stocktxn',
        jsonData: {
          product: selectedProduct.product,
          roll: selectedProduct._id,
          type: 'ADJUST',
          quantity: Math.abs(adjustmentQuantity),
          unit: selectedProduct.unit,
          reason: values.reason,
          reference: selectedProduct._id,
          date: new Date().toISOString(),
          notes: values.notes
        }
      }));

      message.success('Stock adjustment completed!');
      setIsAdjustmentModalVisible(false);
      adjustmentForm.resetFields();
      setSelectedProduct(null);
      dispatch(crud.list({ entity: 'inventoryroll' }));
      dispatch(crud.list({ entity: 'stocktxn' }));
    } catch (error) {
      message.error('Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  // Handle roll editing
  const handleEditRoll = (roll) => {
    setEditingRoll(roll);
    rollForm.setFieldsValue({
      batchNumber: roll.batchNumber,
      barcode: roll.barcode,
      location: roll.location,
      status: roll.status,
      notes: roll.notes
    });
    setIsRollModalVisible(true);
  };

  const submitRollEdit = async (values) => {
    try {
      setLoading(true);
      await dispatch(crud.update({
        entity: 'inventoryroll',
        id: editingRoll._id,
        jsonData: values
      }));
      message.success('Roll updated successfully!');
      setIsRollModalVisible(false);
      rollForm.resetFields();
      setEditingRoll(null);
      dispatch(crud.list({ entity: 'inventoryroll' }));
    } catch (error) {
      message.error('Failed to update roll');
    } finally {
      setLoading(false);
    }
  };

  // Handle roll deletion
  const handleDeleteRoll = async (rollId) => {
    try {
      setLoading(true);
      await dispatch(crud.delete({ entity: 'inventoryroll', id: rollId }));
      message.success('Roll deleted successfully');
      dispatch(crud.list({ entity: 'inventoryroll' }));
    } catch (error) {
      message.error('Failed to delete roll');
    } finally {
      setLoading(false);
    }
  };

  // View roll details
  const handleViewRoll = (roll) => {
    setViewingRoll(roll);
    setIsViewDrawerVisible(true);
  };

  // Generate barcode/QR
  const generateBarcode = (roll) => {
    // In production, use a proper barcode generation library
    return `ROLL-${roll._id.slice(-8)}`;
  };

  // Export inventory data
  const exportInventory = () => {
    const csvContent = [
      ['Product', 'Batch', 'Barcode', 'Initial Length', 'Remaining', 'Unit', 'Status', 'Location', 'Received Date'],
      ...rollsList.map(roll => [
        productsList.find(p => p._id === roll.product)?.name || 'Unknown',
        roll.batchNumber,
        roll.barcode,
        roll.initLength,
        roll.remainingLength,
        roll.unit,
        roll.status,
        roll.location,
        new Date(roll.receivedDate).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };



  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              📦 Inventory & Stock Management
            </Title>
            <Text type="secondary">Complete inventory tracking with roll management and stock transactions</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleGRN}
              >
                Create GRN
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                onClick={exportInventory}
              >
                Export Inventory
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => {
                  dispatch(crud.list({ entity: 'inventoryroll' }));
                  dispatch(crud.list({ entity: 'stocktxn' }));
                }}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Inventory Statistics */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Products"
              value={inventoryStats.totalProducts}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Rolls"
              value={inventoryStats.totalRolls}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Stock"
              value={inventoryStats.totalStock.toFixed(2)}
              suffix="units"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Low Stock Items"
              value={inventoryStats.lowStockItems}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Aging Stock"
              value={inventoryStats.agingStock}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Reserved Stock"
              value={inventoryStats.reservedStock}
              prefix={<RollbackOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alerts */}
      {inventoryStats.lowStockItems > 0 && (
        <Alert
          message="Low Stock Alert"
          description={`${inventoryStats.lowStockItems} items are running low on stock. Please review and reorder.`}
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
          action={
            <Button size="small" type="link">
              View Details
            </Button>
          }
        />
      )}

      {/* Main Content Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* GRN Modal */}
      <Modal
        title="📥 Create GRN (Goods Received Note)"
        open={isGRNModalVisible}
        onCancel={() => setIsGRNModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={grnForm} onFinish={submitGRN} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Product"
                name="product"
                rules={[{ required: true, message: 'Please select a product' }]}
              >
                <Select placeholder="Select product">
                  {productsList.map(product => (
                    <Option key={product._id} value={product._id}>
                      {product.name} - {product.code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Supplier"
                name="supplier"
                rules={[{ required: true, message: 'Please select a supplier' }]}
              >
                <Select placeholder="Select supplier">
                  {suppliersList.map(supplier => (
                    <Option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Batch Number"
                name="batchNumber"
                rules={[{ required: true, message: 'Please enter batch number' }]}
              >
                <Input placeholder="Batch number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Barcode"
                name="barcode"
              >
                <Input placeholder="Barcode (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder="Quantity"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Unit"
                name="unit"
                rules={[{ required: true, message: 'Please select unit' }]}
              >
                <Select placeholder="Select unit">
                  <Option value="m">Meters</Option>
                  <Option value="yd">Yards</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Cost Per Unit"
                name="costPerUnit"
                rules={[{ required: true, message: 'Please enter cost per unit' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder="Cost per unit"
                  prefix="Rs"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Received Date"
                name="receivedDate"
                rules={[{ required: true, message: 'Please select received date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Location" name="location">
            <Input placeholder="Storage location" />
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} placeholder="Additional notes..." />
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Space>
              <Button onClick={() => setIsGRNModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                icon={<PlusOutlined />}
              >
                Create GRN
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Roll Edit Modal */}
      <Modal
        title="✏️ Edit Roll"
        open={isRollModalVisible}
        onCancel={() => setIsRollModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={rollForm} onFinish={submitRollEdit} layout="vertical">
          <Form.Item label="Batch Number" name="batchNumber">
            <Input placeholder="Batch number" />
          </Form.Item>
          
          <Form.Item label="Barcode" name="barcode">
            <Input placeholder="Barcode" />
          </Form.Item>
          
          <Form.Item label="Location" name="location">
            <Input placeholder="Storage location" />
          </Form.Item>
          
          <Form.Item label="Status" name="status">
            <Select>
              <Option value="active">Active</Option>
              <Option value="reserved">Reserved</Option>
              <Option value="damaged">Damaged</Option>
              <Option value="disposed">Disposed</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} placeholder="Notes..." />
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Space>
              <Button onClick={() => setIsRollModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                icon={<EditOutlined />}
              >
                Update Roll
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        title="🔄 Stock Adjustment"
        open={isAdjustmentModalVisible}
        onCancel={() => setIsAdjustmentModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedProduct && (
          <div>
            <Alert
              message={`Adjusting stock for: ${productsList.find(p => p._id === selectedProduct.product)?.name}`}
              description={`Current stock: ${(parseFloat(selectedProduct.remainingLength) || 0).toFixed(2)} ${selectedProduct.unit}`}
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />
            
            <Form form={adjustmentForm} onFinish={submitAdjustment} layout="vertical">
              <Form.Item
                label="Adjustment Type"
                name="adjustmentType"
                rules={[{ required: true, message: 'Please select adjustment type' }]}
              >
                <Select>
                  <Option value="increase">Increase Stock</Option>
                  <Option value="decrease">Decrease Stock</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder="Adjustment quantity"
                />
              </Form.Item>
              
              <Form.Item
                label="Reason"
                name="reason"
                rules={[{ required: true, message: 'Please enter reason' }]}
              >
                <Select>
                  <Option value="damage">Damage/Loss</Option>
                  <Option value="theft">Theft</Option>
                  <Option value="correction">Stock Correction</Option>
                  <Option value="quality">Quality Issue</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="New Status"
                name="newStatus"
              >
                <Select placeholder="Keep current status">
                  <Option value="active">Active</Option>
                  <Option value="reserved">Reserved</Option>
                  <Option value="damaged">Damaged</Option>
                  <Option value="disposed">Disposed</Option>
                </Select>
              </Form.Item>
              
              <Form.Item label="Notes" name="notes">
                <TextArea rows={3} placeholder="Additional notes..." />
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Space>
                  <Button onClick={() => setIsAdjustmentModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    icon={<RollbackOutlined />}
                  >
                    Apply Adjustment
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      {/* Roll Details Drawer */}
      <Drawer
        title="📋 Roll Details"
        placement="right"
        width={600}
        open={isViewDrawerVisible}
        onClose={() => setIsViewDrawerVisible(false)}
      >
        {viewingRoll && (
          <div>
            <Descriptions title="Basic Information" bordered column={1}>
              <Descriptions.Item label="Product">
                {productsList.find(p => p._id === viewingRoll.product)?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Batch Number">
                {viewingRoll.batchNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Barcode">
                {viewingRoll.barcode}
              </Descriptions.Item>
              <Descriptions.Item label="Initial Length">
                {(parseFloat(viewingRoll.initLength) || 0).toFixed(2)} {viewingRoll.unit}
              </Descriptions.Item>
              <Descriptions.Item label="Remaining Length">
                {(parseFloat(viewingRoll.remainingLength) || 0).toFixed(2)} {viewingRoll.unit}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={viewingRoll.status === 'active' ? 'green' : 'red'}>
                  {viewingRoll.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {viewingRoll.location}
              </Descriptions.Item>
              <Descriptions.Item label="Received Date">
                {dayjs(viewingRoll.receivedDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Cost Per Unit">
                Rs {viewingRoll.costPerUnit}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div style={{ marginTop: 20 }}>
              <Text strong>Stock Level:</Text>
              <Progress 
                percent={(() => {
                  const remainingLength = parseFloat(viewingRoll.remainingLength) || 0;
                  const initLength = parseFloat(viewingRoll.initLength) || 0;
                  return initLength > 0 ? (remainingLength / initLength) * 100 : 0;
                })()}
                status={(() => {
                  const remainingLength = parseFloat(viewingRoll.remainingLength) || 0;
                  const minStockLevel = parseFloat(viewingRoll.minStockLevel) || 5;
                  return remainingLength <= minStockLevel ? 'exception' : 'normal';
                })()}
                style={{ marginTop: 8 }}
              />
            </div>

            {viewingRoll.notes && (
              <>
                <Divider />
                <div>
                  <Text strong>Notes:</Text>
                  <p>{viewingRoll.notes}</p>
                </div>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
