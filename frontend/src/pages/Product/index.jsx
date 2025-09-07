import { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Row, Col, Statistic, Progress, Modal, Form, Input, Select, InputNumber, Popconfirm, Drawer, Descriptions, Divider, App } from 'antd';
import { PlusOutlined, ShoppingOutlined, AlertOutlined, DollarOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectEntityList } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function Product() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message } = App.useApp(); // Use App context for message API
  const { result: products, pagination, isLoading } = useSelector(selectEntityList('product'));
  const { result: suppliers } = useSelector(selectEntityList('supplier'));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(crud.list({ entity: 'product', options: { page: 1, items: 100 } }));
    dispatch(crud.list({ entity: 'supplier', options: { page: 1, items: 100 } }));
  }, []);

  // Ensure data exists and has the correct structure
  const productsList = products?.items || [];
  const suppliersList = suppliers?.items || [];

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      code: product.code,
      fabricType: product.fabricType,
      color: product.color,
      description: product.description,
      minSalePrice: product.pricing?.minSalePrice,
      maxSalePrice: product.pricing?.maxSalePrice,
      costPrice: product.pricing?.costPrice,
      defaultUnit: product.pricing?.defaultUnit,
      supplier: product.supplier?._id
    });
    setIsModalVisible(true);
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setIsViewDrawerVisible(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      await dispatch(crud.delete({ entity: 'product', id: productId }));
      message.success('Product deleted successfully');
      dispatch(crud.list({ entity: 'product', options: { page: 1, items: 100 } }));
    } catch (error) {
      message.error('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const productData = {
        name: values.name,
        code: values.code,
        fabricType: values.fabricType,
        color: values.color,
        description: values.description,
        pricing: {
          minSalePrice: values.minSalePrice,
          maxSalePrice: values.maxSalePrice,
          costPrice: values.costPrice,
          defaultUnit: values.defaultUnit
        },
        supplier: values.supplier
      };

      if (editingProduct) {
        await dispatch(crud.update({ entity: 'product', id: editingProduct._id, jsonData: productData }));
        message.success('Product updated successfully');
      } else {
        await dispatch(crud.create({ entity: 'product', jsonData: productData }));
        message.success('Product created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      dispatch(crud.list({ entity: 'product', options: { page: 1, items: 100 } }));
    } catch (error) {
      message.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    dispatch(crud.list({ entity: 'product', options: { page: 1, items: 100 } }));
    message.success('Data refreshed');
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text style={{ color: 'var(--text-secondary)' }}>Code: {record.code}</Text>
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'fabricType',
      key: 'fabricType',
      render: (type) => (
        <Tag color="blue">{type}</Tag>
      )
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: color?.toLowerCase() || '#ccc',
              borderRadius: '4px',
              border: '1px solid #d9d9d9'
            }} 
          />
          <Text>{color || 'N/A'}</Text>
        </div>
      )
    },
    {
      title: 'Pricing',
      key: 'pricing',
      render: (_, record) => (
        <div>
          <Text>Min: Rs {(parseFloat(record.pricing?.minSalePrice) || 0).toFixed(2)}</Text>
          <br />
          <Text style={{ color: 'var(--text-secondary)' }}>Max: Rs {(parseFloat(record.pricing?.maxSalePrice) || 0).toFixed(2)}</Text>
        </div>
      )
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (_, record) => {
        const stock = parseFloat(record.totalStock) || 0;
        const status = stock <= 2 ? 'exception' : stock <= 5 ? 'warning' : 'normal';
        return (
          <div>
            <Progress 
              percent={Math.min((stock / 10) * 100, 100)} 
              size="small" 
              status={status}
            />
            <Text style={{ color: 'var(--text-secondary)' }}>{stock} {record.pricing?.defaultUnit || 'unit'}</Text>
          </div>
        );
      }
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplier) => supplier?.name || '-'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const stock = parseFloat(record.totalStock) || 0;
        if (stock <= 0) {
          return <Tag color="red">Out of Stock</Tag>;
        } else if (stock <= 5) {
          return <Tag color="orange">Low Stock</Tag>;
        } else {
          return <Tag color="green">In Stock</Tag>;
        }
      }
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
            onClick={() => handleViewProduct(record)}
          >
            View
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record._id)}
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

  const getStats = () => {
    if (!productsList || !Array.isArray(productsList)) return { total: 0, lowStock: 0, outOfStock: 0, totalValue: 0 };
    
    const lowStock = productsList.filter(p => (parseFloat(p.totalStock) || 0) <= 5 && (parseFloat(p.totalStock) || 0) > 0).length;
    const outOfStock = productsList.filter(p => (parseFloat(p.totalStock) || 0) <= 0).length;
    const totalValue = productsList.reduce((sum, p) => {
      const stock = parseFloat(p.totalStock) || 0;
      const cost = parseFloat(p.pricing?.costPrice) || 0;
      return sum + (stock * cost);
    }, 0);

    return {
      total: productsList.length,
      lowStock,
      outOfStock,
      totalValue
    };
  };

  const stats = getStats();

  return (
    <div style={{ padding: '24px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
                 <Title level={2} style={{ margin: 0, color: 'var(--brand-primary)' }}>
           🧵 Bin Sultan Product Management
         </Title>
         <Text style={{ color: 'var(--text-secondary)' }}>Manage your fabric inventory and products - Pakistan&apos;s Premier Cloth Shop</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Low Stock"
              value={stats.lowStock}
              valueStyle={{ color: '#faad14' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Out of Stock"
              value={stats.outOfStock}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Value"
              value={stats.totalValue}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
      </Row>

      {/* Products Table */}
      <Card
        title="Products"
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
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={productsList}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: pagination?.current || 1,
            pageSize: pagination?.pageSize || 10,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
          }}
        />
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
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
            defaultUnit: 'm',
            minStockLevel: 5
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Product Code"
                rules={[{ required: true, message: 'Please enter product code' }]}
              >
                <Input placeholder="Enter product code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fabricType"
                label="Fabric Type"
                rules={[{ required: true, message: 'Please select fabric type' }]}
              >
                                 <Select placeholder="Select fabric type">
                   <Option value="Cotton">Cotton (Suti)</Option>
                   <Option value="Silk">Silk (Resham)</Option>
                   <Option value="Wool">Wool (Oon)</Option>
                   <Option value="Polyester">Polyester</Option>
                   <Option value="Linen">Linen (Saf)</Option>
                   <Option value="Denim">Denim</Option>
                   <Option value="Velvet">Velvet (Makhmal)</Option>
                   <Option value="Chiffon">Chiffon (Sheer)</Option>
                   <Option value="Georgette">Georgette</Option>
                   <Option value="Crepe">Crepe</Option>
                   <Option value="Other">Other</Option>
                 </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="color"
                label="Color"
                rules={[{ required: true, message: 'Please enter color' }]}
              >
                <Input placeholder="Enter color" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter product description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
                             <Form.Item
                 name="minSalePrice"
                 label="Min Sale Price"
                 rules={[{ required: true, message: 'Please enter min sale price' }]}
               >
                 <InputNumber
                   min={0}
                   step={0.01}
                   style={{ width: '100%' }}
                   placeholder="0.00"
                   prefix="Rs "
                 />
               </Form.Item>
            </Col>
            <Col span={8}>
                             <Form.Item
                 name="maxSalePrice"
                 label="Max Sale Price"
                 rules={[{ required: true, message: 'Please enter max sale price' }]}
               >
                 <InputNumber
                   min={0}
                   step={0.01}
                   style={{ width: '100%' }}
                   placeholder="0.00"
                   prefix="Rs "
                 />
               </Form.Item>
            </Col>
            <Col span={8}>
                             <Form.Item
                 name="costPrice"
                 label="Cost Price"
                 rules={[{ required: true, message: 'Please enter cost price' }]}
               >
                 <InputNumber
                   min={0}
                   step={0.01}
                   style={{ width: '100%' }}
                   placeholder="0.00"
                   prefix="Rs "
                 />
               </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="defaultUnit"
                label="Default Unit"
                rules={[{ required: true, message: 'Please select default unit' }]}
              >
                                 <Select>
                   <Option value="m">Meter (m) - گز</Option>
                   <Option value="yd">Yard (yd) - گز</Option>
                   <Option value="ft">Foot (ft) - پاؤں</Option>
                   <Option value="cm">Centimeter (cm) - سینٹی میٹر</Option>
                   <Option value="inch">Inch (inch) - انچ</Option>
                   <Option value="gaj">Gaj (gaj) - گج</Option>
                 </Select>
              </Form.Item>
            </Col>
          </Row>

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
         
         <Form.Item
           name="origin"
           label="Fabric Origin"
         >
           <Select placeholder="Select fabric origin" allowClear>
             <Option value="Pakistan">Pakistan (Local)</Option>
             <Option value="India">India</Option>
             <Option value="China">China</Option>
             <Option value="Turkey">Turkey</Option>
             <Option value="Italy">Italy</Option>
             <Option value="Other">Other</Option>
           </Select>
         </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Product Drawer */}
      <Drawer
        title="Product Details"
        placement="right"
        onClose={() => setIsViewDrawerVisible(false)}
        open={isViewDrawerVisible}
        width={500}
      >
        {viewingProduct && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Name" span={3}>
                <Text strong>{viewingProduct.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Code">
                {viewingProduct.code}
              </Descriptions.Item>
              <Descriptions.Item label="Fabric Type">
                <Tag color="blue">{viewingProduct.fabricType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Color">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      backgroundColor: viewingProduct.color?.toLowerCase() || '#ccc',
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9'
                    }} 
                  />
                  {viewingProduct.color}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={3}>
                {viewingProduct.description || 'No description'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Pricing Information</Title>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Min Sale Price">
                Rs {(parseFloat(viewingProduct.pricing?.minSalePrice) || 0).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Max Sale Price">
                Rs {(parseFloat(viewingProduct.pricing?.maxSalePrice) || 0).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Cost Price">
                Rs {(parseFloat(viewingProduct.pricing?.costPrice) || 0).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Default Unit">
                {viewingProduct.pricing?.defaultUnit || 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Stock Information</Title>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Total Stock">
                {parseFloat(viewingProduct.totalStock) || 0} {viewingProduct.pricing?.defaultUnit || 'units'}
              </Descriptions.Item>
              <Descriptions.Item label="Min Stock Level">
                {parseFloat(viewingProduct.minStockLevel) || 5}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {(() => {
                  const stock = parseFloat(viewingProduct.totalStock) || 0;
                  if (stock <= 0) return <Tag color="red">Out of Stock</Tag>;
                  if (stock <= 5) return <Tag color="orange">Low Stock</Tag>;
                  return <Tag color="green">In Stock</Tag>;
                })()}
              </Descriptions.Item>
            </Descriptions>

            {viewingProduct.supplier && (
              <>
                <Divider />
                <Title level={4}>Supplier Information</Title>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Supplier Name">
                    {viewingProduct.supplier.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Contact">
                    {viewingProduct.supplier.contact || 'N/A'}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
