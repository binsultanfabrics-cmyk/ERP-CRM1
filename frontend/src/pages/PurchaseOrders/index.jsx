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
  message,
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
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  FileTextOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectEntityList } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function PurchaseOrders() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message: messageApi } = App.useApp();
  const { result: purchaseOrders, isLoading: poLoading } = useSelector(selectEntityList('purchaseorder'));
  const { result: suppliers, isLoading: suppliersLoading } = useSelector(selectEntityList('supplier'));
  const { result: products, isLoading: productsLoading } = useSelector(selectEntityList('product'));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReceiveModalVisible, setIsReceiveModalVisible] = useState(false);
  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [editingPO, setEditingPO] = useState(null);
  const [viewingPO, setViewingPO] = useState(null);
  const [receivingPO, setReceivingPO] = useState(null);
  const [form] = Form.useForm();
  const [receiveForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    dispatch(crud.list({ entity: 'purchaseorder' }));
    dispatch(crud.list({ entity: 'supplier' }));
    dispatch(crud.list({ entity: 'product' }));
  }, []);

  const purchaseOrdersList = purchaseOrders?.items || [];
  const suppliersList = suppliers?.items || [];
  const productsList = products?.items || [];

  // Calculate PO statistics
  const poStats = {
    total: purchaseOrdersList.length,
    created: purchaseOrdersList.filter(po => po.status === 'Created').length,
    ordered: purchaseOrdersList.filter(po => po.status === 'Ordered').length,
    received: purchaseOrdersList.filter(po => po.status === 'Received').length,
    totalValue: purchaseOrdersList.reduce((sum, po) => sum + parseFloat(po.totalAmount || 0), 0),
  };

  const handleCreatePO = () => {
    setEditingPO(null);
    form.resetFields();
    form.setFieldsValue({
      orderDate: dayjs(),
      items: [{ product: null, quantity: 0, unit: 'm', unitPrice: 0 }],
    });
    setIsModalVisible(true);
  };

  const handleEditPO = (po) => {
    setEditingPO(po);
    form.setFieldsValue({
      ...po,
      orderDate: po.orderDate ? dayjs(po.orderDate) : dayjs(),
      expectedDeliveryDate: po.expectedDeliveryDate ? dayjs(po.expectedDeliveryDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleViewPO = (po) => {
    setViewingPO(po);
    setIsViewDrawerVisible(true);
  };

  const handleReceivePO = (po) => {
    setReceivingPO(po);
    receiveForm.resetFields();
    // Pre-populate with remaining quantities
    const receiveItems = po.items.map(item => ({
      itemId: item._id,
      product: item.product,
      quantity: parseFloat(item.remainingQuantity),
      batchNumber: `BATCH-${Date.now()}`,
      location: 'Main Store',
    }));
    receiveForm.setFieldsValue({ receivedItems: receiveItems });
    setIsReceiveModalVisible(true);
  };

  const handleSubmitPO = async (values) => {
    try {
      setLoading(true);
      
      // Calculate totals
      const items = values.items.map(item => ({
        product: item.product,
        quantity: item.quantity.toString(),
        unit: item.unit,
        unitPrice: item.unitPrice.toString(),
        totalPrice: (item.quantity * item.unitPrice).toString(),
        remainingQuantity: item.quantity.toString(),
      }));

      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const taxAmount = (subtotal * (values.taxRate || 0)) / 100;
      const totalAmount = subtotal + taxAmount;

      const poData = {
        supplier: values.supplier,
        items,
        orderDate: values.orderDate.toISOString(),
        expectedDeliveryDate: values.expectedDeliveryDate?.toISOString(),
        subtotal: subtotal.toString(),
        taxRate: (values.taxRate || 0).toString(),
        taxAmount: taxAmount.toString(),
        totalAmount: totalAmount.toString(),
        notes: values.notes,
        terms: values.terms,
      };

      if (editingPO) {
        await dispatch(crud.update({ 
          entity: 'purchaseorder', 
          id: editingPO._id, 
          jsonData: poData 
        }));
        messageApi.success('Purchase order updated successfully');
      } else {
        await dispatch(crud.create({ 
          entity: 'purchaseorder', 
          jsonData: poData 
        }));
        messageApi.success('Purchase order created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      dispatch(crud.list({ entity: 'purchaseorder' }));
    } catch (error) {
      messageApi.error('Failed to save purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveSubmit = async (values) => {
    try {
      setLoading(true);
      
      await dispatch(crud.receive({ 
        entity: 'purchaseorder', 
        id: receivingPO._id, 
        jsonData: values 
      }));
      
      messageApi.success('Purchase order received successfully');
      setIsReceiveModalVisible(false);
      receiveForm.resetFields();
      setReceivingPO(null);
      dispatch(crud.list({ entity: 'purchaseorder' }));
    } catch (error) {
      messageApi.error('Failed to receive purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (poId, status) => {
    try {
      setLoading(true);
      await dispatch(crud.updateStatus({ 
        entity: 'purchaseorder', 
        id: poId, 
        jsonData: { status } 
      }));
      messageApi.success('Purchase order status updated successfully');
      dispatch(crud.list({ entity: 'purchaseorder' }));
    } catch (error) {
      messageApi.error('Failed to update purchase order status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePO = async (poId) => {
    try {
      setLoading(true);
      await dispatch(crud.delete({ entity: 'purchaseorder', id: poId }));
      messageApi.success('Purchase order deleted successfully');
      dispatch(crud.list({ entity: 'purchaseorder' }));
    } catch (error) {
      messageApi.error('Failed to delete purchase order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Created': 'blue',
      'Ordered': 'orange',
      'Partially Received': 'purple',
      'Received': 'green',
      'Closed': 'default',
      'Cancelled': 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Created': <FileTextOutlined />,
      'Ordered': <ClockCircleOutlined />,
      'Partially Received': <TruckOutlined />,
      'Received': <CheckCircleOutlined />,
      'Closed': <CheckCircleOutlined />,
      'Cancelled': <CloseCircleOutlined />,
    };
    return icons[status] || <FileTextOutlined />;
  };

  const columns = [
    {
      title: 'PO Number',
      dataIndex: 'poNumber',
      key: 'poNumber',
      render: (poNumber) => <Text strong>{poNumber}</Text>,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplier) => supplier?.name || 'N/A',
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, record) => (
        <div>
          <Text>{record.items?.length || 0} items</Text>
          <br />
          <Text style={{ color: 'var(--text-secondary)' }}>
            Total: Rs {parseFloat(record.totalAmount || 0).toFixed(2)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => {
        const completionPercentage = record.completionPercentage || 0;
        return (
          <Progress 
            percent={completionPercentage} 
            size="small" 
            status={completionPercentage === 100 ? 'success' : 'active'}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewPO(record)}
          >
            View
          </Button>
          {record.status === 'Created' && (
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEditPO(record)}
            >
              Edit
            </Button>
          )}
          {record.status === 'Created' && (
            <Button 
              type="text" 
              onClick={() => handleUpdateStatus(record._id, 'Ordered')}
            >
              Mark Ordered
            </Button>
          )}
          {(record.status === 'Ordered' || record.status === 'Partially Received') && (
            <Button 
              type="text" 
              onClick={() => handleReceivePO(record)}
            >
              Receive
            </Button>
          )}
          {record.status === 'Received' && (
            <Button 
              type="text" 
              onClick={() => handleUpdateStatus(record._id, 'Closed')}
            >
              Close
            </Button>
          )}
          <Popconfirm
            title="Are you sure you want to delete this purchase order?"
            onConfirm={() => handleDeletePO(record._id)}
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
    <div style={{ padding: '20px', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: 'var(--brand-primary)' }}>
              📋 Purchase Orders Management
            </Title>
            <Text style={{ color: 'var(--text-secondary)' }}>Manage supplier purchase orders and inventory receipts</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreatePO}
              >
                Create PO
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => dispatch(crud.list({ entity: 'purchaseorder' }))}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* PO Statistics */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total POs"
              value={poStats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Created"
              value={poStats.created}
              valueStyle={{ color: 'var(--brand-primary)' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Ordered"
              value={poStats.ordered}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Received"
              value={poStats.received}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Value"
              value={poStats.totalValue}
              precision={2}
              prefix="Rs"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Purchase Orders Table */}
      <Card>
        <Table
          dataSource={purchaseOrdersList}
          columns={columns}
          loading={poLoading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} purchase orders`
          }}
        />
      </Card>

      {/* Create/Edit PO Modal */}
      <Modal
        title={editingPO ? 'Edit Purchase Order' : 'Create Purchase Order'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitPO}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplier"
                label="Supplier"
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
            <Col span={12}>
              <Form.Item
                name="orderDate"
                label="Order Date"
                rules={[{ required: true, message: 'Please select order date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="expectedDeliveryDate"
            label="Expected Delivery Date"
          >
            <DatePicker style={{ width: '100%' }} />
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
                          name={[name, 'product']}
                          label="Product"
                          rules={[{ required: true, message: 'Please select product' }]}
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
                        <Form.Item
                          {...restField}
                          name={[name, 'unit']}
                          label="Unit"
                          rules={[{ required: true, message: 'Please select unit' }]}
                        >
                          <Select>
                            <Option value="m">Meters</Option>
                            <Option value="yd">Yards</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unitPrice']}
                          label="Unit Price"
                          rules={[{ required: true, message: 'Please enter unit price' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} prefix="Rs" />
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

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="taxRate"
                label="Tax Rate (%)"
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} placeholder="Additional notes..." />
          </Form.Item>

          <Form.Item name="terms" label="Terms & Conditions">
            <TextArea rows={2} placeholder="Payment terms, delivery conditions, etc." />
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
                {editingPO ? 'Update' : 'Create'} PO
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Receive PO Modal */}
      <Modal
        title={`Receive Purchase Order - ${receivingPO?.poNumber}`}
        open={isReceiveModalVisible}
        onCancel={() => setIsReceiveModalVisible(false)}
        footer={null}
        width={700}
      >
        {receivingPO && (
          <div>
            <Alert
              message="Receiving Items"
              description={`You are receiving items for PO ${receivingPO.poNumber} from ${receivingPO.supplier?.name}`}
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />
            
            <Form
              form={receiveForm}
              layout="vertical"
              onFinish={handleReceiveSubmit}
            >
              <Form.List name="receivedItems">
                {(fields) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => {
                      const item = receivingPO.items[name];
                      const product = productsList.find(p => p._id === item?.product);
                      
                      return (
                        <Card key={key} size="small" style={{ marginBottom: 16 }}>
                          <Row gutter={16}>
                            <Col span={8}>
                              <Form.Item label="Product">
                                <Text strong>{product?.name || 'Unknown'}</Text>
                                <br />
                                <Text style={{ color: 'var(--text-secondary)' }}>Remaining: {item?.remainingQuantity} {item?.unit}</Text>
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...restField}
                                name={[name, 'quantity']}
                                label="Received Qty"
                                rules={[{ required: true, message: 'Please enter quantity' }]}
                              >
                                <InputNumber 
                                  min={0} 
                                  max={parseFloat(item?.remainingQuantity || 0)}
                                  style={{ width: '100%' }} 
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...restField}
                                name={[name, 'batchNumber']}
                                label="Batch Number"
                                rules={[{ required: true, message: 'Please enter batch number' }]}
                              >
                                <Input placeholder="Batch number" />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...restField}
                                name={[name, 'location']}
                                label="Location"
                                rules={[{ required: true, message: 'Please enter location' }]}
                              >
                                <Input placeholder="Storage location" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      );
                    })}
                  </>
                )}
              </Form.List>

              <Form.Item name="notes" label="Receipt Notes">
                <TextArea rows={3} placeholder="Notes about this receipt..." />
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Space>
                  <Button onClick={() => setIsReceiveModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    icon={<CheckCircleOutlined />}
                  >
                    Receive Items
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      {/* View PO Drawer */}
      <Drawer
        title={`Purchase Order Details - ${viewingPO?.poNumber}`}
        placement="right"
        width={600}
        open={isViewDrawerVisible}
        onClose={() => setIsViewDrawerVisible(false)}
      >
        {viewingPO && (
          <div>
            <Descriptions title="Basic Information" bordered column={1}>
              <Descriptions.Item label="PO Number">
                <Text strong>{viewingPO.poNumber}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Supplier">
                {viewingPO.supplier?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(viewingPO.status)} icon={getStatusIcon(viewingPO.status)}>
                  {viewingPO.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {dayjs(viewingPO.orderDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Expected Delivery">
                {viewingPO.expectedDeliveryDate ? dayjs(viewingPO.expectedDeliveryDate).format('DD/MM/YYYY') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <Text strong>Rs {parseFloat(viewingPO.totalAmount || 0).toFixed(2)}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Items</Title>
            {viewingPO.items?.map((item, index) => {
              const product = productsList.find(p => p._id === item.product);
              return (
                <Card key={index} size="small" style={{ marginBottom: 8 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>{product?.name || 'Unknown Product'}</Text>
                      <br />
                      <Text style={{ color: 'var(--text-secondary)' }}>{product?.code}</Text>
                    </Col>
                    <Col span={6}>
                      <Text>Qty: {item.quantity} {item.unit}</Text>
                      <br />
                      <Text style={{ color: 'var(--text-secondary)' }}>Remaining: {item.remainingQuantity}</Text>
                    </Col>
                    <Col span={6}>
                      <Text>Price: Rs {parseFloat(item.unitPrice).toFixed(2)}</Text>
                      <br />
                      <Text strong>Total: Rs {parseFloat(item.totalPrice).toFixed(2)}</Text>
                    </Col>
                  </Row>
                </Card>
              );
            })}

            {viewingPO.notes && (
              <>
                <Divider />
                <div>
                  <Text strong>Notes:</Text>
                  <p>{viewingPO.notes}</p>
                </div>
              </>
            )}

            {viewingPO.terms && (
              <>
                <Divider />
                <div>
                  <Text strong>Terms & Conditions:</Text>
                  <p>{viewingPO.terms}</p>
                </div>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
