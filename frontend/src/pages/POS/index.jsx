import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Table, 
  Typography, 
  Space, 
  Divider, 
  Badge, 
  Alert, 
  Modal, 
  Form, 
  InputNumber, 
  App, 
  notification, 
  Spin, 
  Empty, 
  Tabs, 
  Tag, 
  Drawer, 
  Statistic, 
  QRCode,
  Row as AntRow,
  Col as AntCol,
  DatePicker,
  Checkbox,
  Switch
} from 'antd';
import { 
  ShoppingCartOutlined, 
  CalculatorOutlined, 
  PrinterOutlined, 
  WhatsAppOutlined, 
  PlusOutlined, 
  UserOutlined, 
  TeamOutlined, 
  CheckOutlined, 
  CloseOutlined,
  ScanOutlined,
  BarcodeOutlined,
  DollarOutlined,
  CreditCardOutlined,
  BankOutlined,
  MobileOutlined,
  UserAddOutlined,
  SettingOutlined,
  HistoryOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  QrcodeOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectEntityList } from '@/redux/crud/selectors';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Configuration
const CASHIER_DISCOUNT_LIMIT = 10; // 10% max discount for cashiers
const FRACTIONAL_PRECISION = 0.25; // 0.25m precision
const FRACTION_BUTTONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3];

export default function POS() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message } = App.useApp(); // Use App context for message API
  const { result: products, isLoading: productsLoading } = useSelector(selectEntityList('product'));
  const { result: customers, isLoading: customersLoading } = useSelector(selectEntityList('client'));
  const { result: employees, isLoading: employeesLoading } = useSelector(selectEntityList('employee'));
  const { result: inventoryRolls, isLoading: rollsLoading } = useSelector(selectEntityList('inventoryroll'));

  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchProduct, setSearchProduct] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState(0);
  const [bargainDiscount, setBargainDiscount] = useState(0);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [isDiscountApprovalModalVisible, setIsDiscountApprovalModalVisible] = useState(false);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [checkoutForm] = Form.useForm();
  // Removed unused customerForm to fix useForm warning
  const [processing, setProcessing] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [managerPin, setManagerPin] = useState('');
  const [activeTab, setActiveTab] = useState('pos');
  const [receiptData, setReceiptData] = useState(null);
  const [selectedRoll, setSelectedRoll] = useState(null);
  const [quantityInput, setQuantityInput] = useState('');
  const [salesHistory, setSalesHistory] = useState([]);
  const [salesHistoryLoading, setSalesHistoryLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [isSaleDetailsModalVisible, setIsSaleDetailsModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [posAnalytics, setPosAnalytics] = useState({
    todaySales: 0,
    todayTransactions: 0,
    averageSaleValue: 0,
    topSellingProduct: 'N/A'
  });
  const [settingsForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [printerForm] = Form.useForm();
  const [receivedAmount, setReceivedAmount] = useState(0);

  useEffect(() => {
    dispatch(crud.list({ entity: 'product' }));
    dispatch(crud.list({ entity: 'client' }));
    dispatch(crud.list({ entity: 'employee' }));
    dispatch(crud.list({ entity: 'inventoryroll' }));
    fetchSalesHistory();
    loadPOSAnalytics();
    loadPOSSettings();
  }, [dispatch]);

  // Ensure data exists and has the correct structure
  const productsList = products?.items || [];
  const customersList = customers?.items || [];
  const employeesList = employees?.items || [];
  const rollsList = inventoryRolls?.items || [];

  // Calculate totals
  const totals = {
    subtotal: cart.reduce((sum, item) => sum + (item.qty * item.price), 0),
    discount: discount + bargainDiscount,
    tax: 0, // Tax calculation can be added later
    grandTotal: 0
  };
  totals.grandTotal = totals.subtotal - totals.discount + totals.tax;

  // Search products by barcode, code, or name
  const searchProducts = (query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return productsList.filter(product => 
      product.barcode?.toLowerCase().includes(lowerQuery) ||
      product.code?.toLowerCase().includes(lowerQuery) ||
      product.name?.toLowerCase().includes(lowerQuery)
    );
  };

  // Find available rolls for a product
  const findAvailableRolls = (productId) => {
    return rollsList.filter(roll => 
      roll.product === productId && 
      roll.status === 'active' && 
      roll.remainingLength > 0
    );
  };

  // Add item to cart
  const addToCart = (product, roll, qty) => {
    if (!roll || qty <= 0) return;
    
    if (qty > roll.remainingLength) {
      message.error(`Only ${roll.remainingLength} units available in this roll`);
      return;
    }

    const existingItem = cart.find(item => 
      item.product._id === product._id && item.roll._id === roll._id
    );

    if (existingItem) {
      const newQty = existingItem.qty + qty;
      if (newQty > roll.remainingLength) {
        message.error(`Total quantity would exceed available stock`);
        return;
      }
      
      setCart(cart.map(item => 
        item.product._id === product._id && item.roll._id === roll._id
          ? { ...item, qty: newQty, total: newQty * item.price }
          : item
      ));
    } else {
      const newItem = {
        product,
        roll,
        qty,
        price: product.pricing?.defaultPrice || 0,
        unit: product.pricing?.defaultUnit || 'm',
        total: qty * (product.pricing?.defaultPrice || 0)
      };
      setCart([...cart, newItem]);
    }

    setSelectedRoll(null);
    setQuantityInput('');
    message.success(`${product.name} added to cart`);
  };

  // Remove item from cart
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Edit cart item
  const editCartItem = (index) => {
    const item = cart[index];
    setSelectedRoll(item.roll);
    setQuantityInput(item.qty.toString());
    // You can implement a modal for editing
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setBargainDiscount(0);
  };

  // Handle barcode scan
  const handleBarcodeScan = (barcode) => {
    const product = productsList.find(p => p.barcode === barcode);
    if (product) {
      const availableRolls = findAvailableRolls(product._id);
      if (availableRolls.length > 0) {
        setSelectedRoll(availableRolls[0]);
        setQuantityInput('1');
        message.success(`Product found: ${product.name}`);
      } else {
        message.error('No available stock for this product');
      }
    } else {
      message.error('Product not found');
    }
    setBarcodeInput('');
  };

  // Handle discount approval
  const handleDiscountApproval = () => {
    if (managerPin === '1234') { // In production, validate against actual manager PIN
      setIsDiscountApprovalModalVisible(false);
      setManagerPin('');
      message.success('Discount approved by manager');
    } else {
      message.error('Invalid manager PIN');
    }
  };

  // Process sale
  const processSale = async (values) => {
    try {
      setProcessing(true);
      
      // Create POS sale record
      const saleData = {
        customer: selectedCustomer?._id,
        employee: selectedEmployee?._id,
        items: cart.map(item => ({
          product: item.product._id,
          roll: item.roll._id,
          quantity: item.qty,
          unitPrice: item.price,
          total: item.total
        })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        grandTotal: totals.grandTotal,
        paymentMethod: values.paymentMethod,
        receivedAmount: values.receivedAmount,
        change: values.receivedAmount - totals.grandTotal,
        date: new Date().toISOString(),
        status: 'completed'
      };

      const saleResult = await dispatch(crud.create({
        entity: 'posSale',
        jsonData: saleData,
        endpoint: '/api/pos/sales'
      }));

      if (saleResult.payload?.success) {
        // Update inventory rolls
        for (const item of cart) {
          const newRemainingLength = item.roll.remainingLength - item.qty;
          
          await dispatch(crud.update({
            entity: 'inventoryroll',
            id: item.roll._id,
            jsonData: { remainingLength: newRemainingLength }
          }));

          // Create stock transaction
          await dispatch(crud.create({
            entity: 'stocktxn',
            jsonData: {
              product: item.product._id,
              roll: item.roll._id,
              type: 'OUT',
              quantity: item.qty,
              unit: item.unit,
              reason: 'POS Sale',
              reference: saleResult.payload.result._id,
              date: new Date().toISOString(),
              notes: `POS Sale - ${item.product.name}`
            }
          }));
        }

        // Create ledger entry if customer exists
        if (selectedCustomer) {
          await dispatch(crud.create({
            entity: 'ledgerentry',
            jsonData: {
              client: selectedCustomer._id,
              type: 'sale',
              amount: totals.grandTotal,
              reference: saleResult.payload.result._id,
              date: new Date().toISOString(),
              notes: `POS Sale - ${saleResult.payload.result._id}`
            }
          }));
        }

        setLastSale(saleResult.payload.result);
        setReceiptData({
          ...saleResult.payload.result,
          customer: selectedCustomer,
          employee: selectedEmployee,
          items: cart
        });
        
        clearCart();
        setIsCheckoutModalVisible(false);
        setIsReceiptModalVisible(true);
        
        message.success('Sale completed successfully!');
        
        // Refresh data
        dispatch(crud.list({ entity: 'inventoryroll' }));
      }
    } catch (error) {
      message.error('Failed to process sale');
      console.error('Sale error:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Print receipt
  const printReceipt = () => {
    // In production, implement actual printing logic
    window.print();
    message.success('Receipt sent to printer');
  };

  // Send WhatsApp invoice
  const sendWhatsAppInvoice = (saleData) => {
    const data = saleData || receiptData;
    if (data?.customer?.phone) {
      const message = `Invoice for ${data.customer.name}\nTotal: Rs ${data.grandTotal}`;
      const whatsappUrl = `https://wa.me/${data.customer.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      message.error('Customer phone number not available');
    }
  };

  // Fetch sales history
  const fetchSalesHistory = async (startDate, endDate) => {
    try {
      setSalesHistoryLoading(true);
      const params = {};
      if (startDate && endDate) {
        params.startDate = startDate.toISOString();
        params.endDate = endDate.toISOString();
      }
      if (statusFilter) {
        params.status = statusFilter;
      }
      
      // Use direct request instead of crud.list for custom endpoint
      const result = await request.get({ 
        entity: 'pos/sales' + (Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '')
      });
      
      if (result?.success && result?.result?.items) {
        setSalesHistory(result.result.items || []);
      }
    } catch (error) {
      message.error('Failed to fetch sales history');
    } finally {
      setSalesHistoryLoading(false);
    }
  };

  // View sale details
  const viewSaleDetails = (sale) => {
    setSelectedSale(sale);
    setIsSaleDetailsModalVisible(true);
  };

  // Reprint receipt
  const reprintReceipt = (sale) => {
    setReceiptData({
      ...sale,
      customer: customersList.find(c => c._id === sale.customer),
      employee: employeesList.find(e => e._id === sale.employee),
      items: sale.items
    });
    setIsReceiptModalVisible(true);
  };

  // Cancel sale
  const cancelSale = async (saleId) => {
    try {
      await dispatch(crud.update({
        entity: 'posSale',
        id: saleId,
        jsonData: { status: 'cancelled' },
        endpoint: '/api/pos/sales'
      }));
      message.success('Sale cancelled successfully');
      fetchSalesHistory();
    } catch (error) {
      message.error('Failed to cancel sale');
    }
  };

  // Save general settings
  const saveGeneralSettings = async () => {
    try {
      const values = await settingsForm.validateFields();
      await dispatch(crud.create({
        entity: 'posSettings',
        jsonData: { ...values, type: 'general' },
        endpoint: '/api/pos/settings'
      }));
      message.success('General settings saved successfully');
    } catch (error) {
      message.error('Failed to save general settings');
    }
  };

  // Save security settings
  const saveSecuritySettings = async () => {
    try {
      const values = await securityForm.validateFields();
      await dispatch(crud.create({
        entity: 'posSettings',
        jsonData: { ...values, type: 'security' },
        endpoint: '/api/pos/settings'
      }));
      message.success('Security settings saved successfully');
    } catch (error) {
      message.error('Failed to save security settings');
    }
  };

  // Save printer settings
  const savePrinterSettings = async () => {
    try {
      const values = await printerForm.validateFields();
      await dispatch(crud.create({
        entity: 'posSettings',
        jsonData: { ...values, type: 'printer' },
        endpoint: '/api/pos/settings'
      }));
      message.success('Printer settings saved successfully');
    } catch (error) {
      message.error('Failed to save printer settings');
    }
  };

  // Export POS report
  const exportPOSReport = async () => {
    try {
      const csvContent = [
        ['Date', 'Sale ID', 'Customer', 'Items', 'Total', 'Payment Method', 'Status'],
        ...salesHistory.map(sale => [
          dayjs(sale.date).format('DD/MM/YYYY HH:mm'),
          sale._id.slice(-8).toUpperCase(),
          customersList.find(c => c._id === sale.customer)?.name || 'Walk-in',
          sale.items?.length || 0,
          sale.grandTotal?.toFixed(2) || '0.00',
          sale.paymentMethod,
          sale.status
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pos-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      message.success('POS report exported successfully');
    } catch (error) {
      message.error('Failed to export POS report');
    }
  };

  // Load POS analytics
  const loadPOSAnalytics = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const result = await request.get({ 
        entity: 'pos/sales?startDate=' + today.toISOString() + '&endDate=' + new Date().toISOString()
      });
      
      if (result?.success && result?.result?.items) {
        const todaySales = result.result.items || [];
        const totalSales = todaySales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);
        const avgSale = todaySales.length > 0 ? totalSales / todaySales.length : 0;
        
        setPosAnalytics({
          todaySales: totalSales,
          todayTransactions: todaySales.length,
          averageSaleValue: avgSale,
          topSellingProduct: 'N/A' // This could be enhanced with product analytics
        });
      }
    } catch (error) {
      console.error('Failed to load POS analytics:', error);
    }
  };

  // Load POS settings
  const loadPOSSettings = async () => {
    try {
      const result = await request.get({ 
        entity: 'pos/settings'
      });
      if (result?.success && result?.result?.items) {
        const settings = result.result.items || [];
        
        // Group settings by type
        const groupedSettings = {};
        settings.forEach(setting => {
          if (!groupedSettings[setting.type] || setting.version > groupedSettings[setting.type].version) {
            groupedSettings[setting.type] = setting;
          }
        });

        // Set form values based on loaded settings
        if (groupedSettings.general) {
          settingsForm.setFieldsValue(groupedSettings.general);
        }
        if (groupedSettings.security) {
          securityForm.setFieldsValue(groupedSettings.security);
        }
        if (groupedSettings.printer) {
          printerForm.setFieldsValue(groupedSettings.printer);
        }
      }
    } catch (error) {
      console.error('Failed to load POS settings:', error);
    }
  };

  // Tab items configuration
  const tabItems = [
    {
      key: 'pos',
      label: '🛒 POS Sales',
      children: (
        <div>
          {/* Product Search */}
          <Card title="🔍 Product Search" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Input
                  placeholder="Scan barcode or search by code/name..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onPressEnter={() => handleBarcodeScan(barcodeInput)}
                  prefix={<BarcodeOutlined />}
                  size="large"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Search products..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  prefix={<SearchOutlined />}
                  size="large"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </Col>
            </Row>

            {/* Search Results */}
            {searchProduct && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Search Results:</Title>
                <Row gutter={[16, 16]}>
                  {searchProducts(searchProduct).map(product => (
                    <Col span={8} key={product._id}>
                      <Card 
                        size="small" 
                        hoverable
                        onClick={() => {
                          const rolls = findAvailableRolls(product._id);
                          if (rolls.length > 0) {
                            setSelectedRoll(rolls[0]);
                            setQuantityInput('1');
                          } else {
                            message.error('No available stock');
                          }
                        }}
                      >
                        <Text strong>{product.name}</Text>
                        <br />
                        <Text style={{ color: 'var(--text-secondary)' }}>{product.code}</Text>
                        <br />
                        <Text style={{ color: 'var(--text-secondary)' }}>Rs {product.pricing?.defaultPrice || 0}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Selected Roll & Quantity */}
            {selectedRoll && (
              <Card title="📦 Selected Product" style={{ marginTop: 16 }}>
                <Row gutter={16} align="middle">
                  <Col span={8}>
                    <Text strong>{selectedRoll.product?.name || 'Unknown Product'}</Text>
                    <br />
                    <Text style={{ color: 'var(--text-secondary)' }}>Available: {selectedRoll.remainingLength} {selectedRoll.unit}</Text>
                  </Col>
                  <Col span={8}>
                    <InputNumber
                      placeholder="Quantity"
                      value={quantityInput}
                      onChange={setQuantityInput}
                      min={0.25}
                      max={selectedRoll.remainingLength}
                      step={FRACTIONAL_PRECISION}
                      size="large"
                      style={{ 
                        width: '100%',
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <Space>
                      <Button 
                        type="primary" 
                        onClick={() => addToCart(
                          productsList.find(p => p._id === selectedRoll.product),
                          selectedRoll,
                          parseFloat(quantityInput)
                        )}
                        disabled={!quantityInput || parseFloat(quantityInput) <= 0}
                      >
                        Add to Cart
                      </Button>
                      <Button onClick={() => setSelectedRoll(null)}>
                        Cancel
                      </Button>
                    </Space>
                  </Col>
                </Row>

                {/* Fraction Buttons */}
                <div style={{ marginTop: 16 }}>
                  <Text style={{ color: 'var(--text-secondary)' }}>Quick quantities: </Text>
                  <Space>
                    {FRACTION_BUTTONS.map(fraction => (
                      <Button
                        key={fraction}
                        size="small"
                        onClick={() => setQuantityInput(fraction.toString())}
                      >
                        {fraction}
                      </Button>
                    ))}
                  </Space>
                </div>
              </Card>
            )}
          </Card>

          {/* Cart */}
          <Card title="🛒 Shopping Cart" style={{ marginBottom: 20 }}>
            {cart.length === 0 ? (
              <Empty description="Cart is empty" />
            ) : (
              <>
                <Table
                  dataSource={cart}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'Product',
                      dataIndex: 'product',
                      key: 'product',
                      render: (product) => (
                        <div>
                          <Text strong>{product.name}</Text>
                          <br />
                          <Text style={{ color: 'var(--text-secondary)' }}>{product.code}</Text>
                        </div>
                      )
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'qty',
                      key: 'qty',
                      render: (qty, record) => `${qty} ${record.unit}`,
                      width: 100
                    },
                    {
                      title: 'Price',
                      dataIndex: 'price',
                      key: 'price',
                      render: (price) => `Rs ${price.toFixed(2)}`,
                      width: 100
                    },
                    {
                      title: 'Total',
                      key: 'total',
                      render: (_, record) => `Rs ${(record.qty * record.price).toFixed(2)}`,
                      width: 100
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_, record, index) => (
                        <Space>
                          <Button 
                            size="small" 
                            icon={<EditOutlined />}
                            onClick={() => editCartItem(index)}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            danger 
                            icon={<DeleteOutlined />}
                            onClick={() => removeFromCart(index)}
                          >
                            Remove
                          </Button>
                        </Space>
                      ),
                      width: 150
                    }
                  ]}
                />
                
                {/* Cart Summary */}
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <Space size="large">
                    <Statistic
                      title="Subtotal"
                      value={totals.subtotal}
                      precision={2}
                      prefix="Rs"
                    />
                    <Statistic
                      title="Discount"
                      value={totals.discount}
                      precision={2}
                      prefix="Rs"
                      valueStyle={{ color: '#fa8c16' }}
                    />
                    <Statistic
                      title="Tax (15%)"
                      value={totals.tax}
                      precision={2}
                      prefix="Rs"
                      valueStyle={{ color: '#52c41a' }}
                    />
                    <Statistic
                      title="Grand Total"
                      value={totals.grandTotal}
                      precision={2}
                      prefix="Rs"
                      valueStyle={{ color: 'var(--brand-primary)', fontSize: '18px' }}
                    />
                  </Space>
                  
                  <div style={{ marginTop: 16 }}>
                    <Space>
                      <Button 
                        size="large" 
                        onClick={clearCart}
                        icon={<DeleteOutlined />}
                      >
                        Clear Cart
                      </Button>
                      <Button 
                        type="primary" 
                        size="large"
                        onClick={() => setIsCheckoutModalVisible(true)}
                        disabled={cart.length === 0}
                        icon={<CheckOutlined />}
                      >
                        Checkout
                      </Button>
                    </Space>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      ),
    },
    {
      key: 'history',
      label: '📊 Sales History',
      children: (
        <div>
          <Card title="📈 Sales History" style={{ marginBottom: 20 }}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <DatePicker.RangePicker
                  placeholder={['Start Date', 'End Date']}
                  onChange={(dates) => {
                    if (dates) {
                      setDateRange(dates);
                      fetchSalesHistory(dates[0], dates[1]);
                    }
                  }}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={8}>
                <Select
                  placeholder="Filter by Status"
                  allowClear
                  onChange={(value) => setStatusFilter(value)}
                  style={{ width: '100%' }}
                >
                  <Option value="completed">Completed</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Col>
              <Col span={8}>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={() => fetchSalesHistory()}
                  loading={salesHistoryLoading}
                >
                  Refresh
                </Button>
              </Col>
            </Row>

            <Table
              dataSource={salesHistory}
              loading={salesHistoryLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} sales`
              }}
              columns={[
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date',
                  render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
                  sorter: (a, b) => new Date(a.date) - new Date(b.date)
                },
                {
                  title: 'Sale ID',
                  dataIndex: '_id',
                  key: 'saleId',
                  render: (id) => id.slice(-8).toUpperCase(),
                  width: 100
                },
                {
                  title: 'Customer',
                  dataIndex: 'customer',
                  key: 'customer',
                  render: (customerId) => {
                    const customer = customersList.find(c => c._id === customerId);
                    return customer ? customer.name : 'Walk-in';
                  }
                },
                {
                  title: 'Items',
                  key: 'itemCount',
                  render: (_, record) => record.items?.length || 0,
                  width: 80
                },
                {
                  title: 'Total',
                  dataIndex: 'grandTotal',
                  key: 'grandTotal',
                  render: (total) => `Rs ${total?.toFixed(2) || '0.00'}`,
                  sorter: (a, b) => (a.grandTotal || 0) - (b.grandTotal || 0)
                },
                {
                  title: 'Payment Method',
                  dataIndex: 'paymentMethod',
                  key: 'paymentMethod',
                  render: (method) => (
                    <Tag color={method === 'Cash' ? 'green' : 'blue'}>
                      {method}
                    </Tag>
                  )
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => {
                    const statusConfig = {
                      completed: { color: 'green', text: 'Completed' },
                      pending: { color: 'orange', text: 'Pending' },
                      cancelled: { color: 'red', text: 'Cancelled' }
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
                        size="small" 
                        icon={<EyeOutlined />}
                        onClick={() => viewSaleDetails(record)}
                      >
                        View
                      </Button>
                      <Button 
                        size="small" 
                        icon={<PrinterOutlined />}
                        onClick={() => reprintReceipt(record)}
                      >
                        Reprint
                      </Button>
                      {record.status === 'pending' && (
                        <Button 
                          size="small" 
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => cancelSale(record._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </Space>
                  ),
                  width: 200
                }
              ]}
            />
          </Card>

          {/* Sale Details Modal */}
          <Modal
            title="📋 Sale Details"
            open={isSaleDetailsModalVisible}
            onCancel={() => setIsSaleDetailsModalVisible(false)}
            footer={null}
            width={800}
          >
            {selectedSale && (
              <div>
                <Row gutter={16} style={{ marginBottom: 20 }}>
                  <Col span={12}>
                    <Text strong>Sale ID:</Text> {selectedSale._id.slice(-8).toUpperCase()}
                    <br />
                    <Text strong>Date:</Text> {dayjs(selectedSale.date).format('DD/MM/YYYY HH:mm')}
                    <br />
                    <Text strong>Status:</Text> 
                    <Tag color={selectedSale.status === 'completed' ? 'green' : 'orange'} style={{ marginLeft: 8 }}>
                      {selectedSale.status}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Text strong>Customer:</Text> {
                      customersList.find(c => c._id === selectedSale.customer)?.name || 'Walk-in Customer'
                    }
                    <br />
                    <Text strong>Employee:</Text> {
                      employeesList.find(e => e._id === selectedSale.employee)?.name || 'N/A'
                    }
                    <br />
                    <Text strong>Payment Method:</Text> {selectedSale.paymentMethod}
                  </Col>
                </Row>

                <Divider />

                <Table
                  dataSource={selectedSale.items}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'Product',
                      dataIndex: 'product',
                      key: 'product',
                      render: (productId) => {
                        const product = productsList.find(p => p._id === productId);
                        return product?.name || 'Unknown Product';
                      }
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      render: (quantity, record) => `${quantity} ${record.unit || 'm'}`
                    },
                    {
                      title: 'Unit Price',
                      dataIndex: 'unitPrice',
                      key: 'unitPrice',
                      render: (price) => `Rs ${price?.toFixed(2) || '0.00'}`
                    },
                    {
                      title: 'Total',
                      key: 'total',
                      render: (_, record) => `Rs ${record.total?.toFixed(2) || '0.00'}`
                    }
                  ]}
                />

                <Divider />

                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Col>Subtotal:</Col>
                  <Col>Rs {selectedSale.subtotal?.toFixed(2) || '0.00'}</Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Col>Discount:</Col>
                  <Col>Rs {selectedSale.discount?.toFixed(2) || '0.00'}</Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Col>Tax:</Col>
                  <Col>Rs {selectedSale.tax?.toFixed(2) || '0.00'}</Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 16 }}>
                  <Col><Text strong>Grand Total:</Text></Col>
                  <Col><Text strong>Rs {selectedSale.grandTotal?.toFixed(2) || '0.00'}</Text></Col>
                </Row>

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <Space>
                    <Button 
                      icon={<PrinterOutlined />}
                      onClick={() => reprintReceipt(selectedSale)}
                    >
                      Reprint Receipt
                    </Button>
                    <Button 
                      icon={<WhatsAppOutlined />}
                      onClick={() => sendWhatsAppInvoice(selectedSale)}
                      disabled={!selectedSale.customer}
                    >
                      Send WhatsApp
                    </Button>
                  </Space>
                </div>
              </div>
            )}
          </Modal>
        </div>
      ),
    },
    {
      key: 'settings',
      label: '⚙️ POS Settings',
      children: (
        <div>
          <Row gutter={20}>
            <Col span={12}>
              <Card title="🔧 General Settings" style={{ marginBottom: 20 }}>
                <Form layout="vertical" form={settingsForm}>
                  <Form.Item label="Shop Name" name="shopName">
                    <Input placeholder="Enter shop name" />
                  </Form.Item>
                  
                  <Form.Item label="Tax Rate (%)" name="taxRate">
                    <InputNumber
                      min={0}
                      max={100}
                      step={0.01}
                      style={{ width: '100%' }}
                      placeholder="15.00"
                    />
                  </Form.Item>
                  
                  <Form.Item label="Currency" name="currency">
                    <Select placeholder="Select currency">
                      <Option value="Rs">Pakistani Rupee (Rs)</Option>
                      <Option value="$">US Dollar ($)</Option>
                      <Option value="€">Euro (€)</Option>
                      <Option value="£">British Pound (£)</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item label="Receipt Header" name="receiptHeader">
                    <TextArea rows={3} placeholder="Enter receipt header text" />
                  </Form.Item>
                  
                  <Form.Item label="Receipt Footer" name="receiptFooter">
                    <TextArea rows={3} placeholder="Enter receipt footer text" />
                  </Form.Item>
                  
                  <Button type="primary" onClick={saveGeneralSettings}>
                    Save General Settings
                  </Button>
                </Form>
              </Card>
            </Col>
            
            <Col span={12}>
              <Card title="🔐 Security Settings" style={{ marginBottom: 20 }}>
                <Form layout="vertical" form={securityForm}>
                  <Form.Item label="Cashier Discount Limit (%)" name="cashierDiscountLimit">
                    <InputNumber
                      min={0}
                      max={100}
                      step={0.01}
                      style={{ width: '100%' }}
                      placeholder="10.00"
                    />
                  </Form.Item>
                  
                  <Form.Item label="Manager PIN" name="managerPin">
                    <Input.Password placeholder="Enter manager PIN" />
                  </Form.Item>
                  
                  <Form.Item label="Require Manager Approval for">
                    <Checkbox.Group options={[
                      { label: 'High Discounts', value: 'highDiscounts' },
                      { label: 'Credit Sales', value: 'creditSales' },
                      { label: 'Returns', value: 'returns' },
                      { label: 'Void Sales', value: 'voidSales' }
                    ]} />
                  </Form.Item>
                  
                  <Button type="primary" onClick={saveSecuritySettings}>
                    Save Security Settings
                  </Button>
                </Form>
              </Card>
              
              <Card title="🖨️ Printer Settings">
                <Form layout="vertical" form={printerForm}>
                  <Form.Item label="Receipt Width (mm)" name="receiptWidth">
                    <Select placeholder="Select receipt width">
                      <Option value="58">58mm (Mini)</Option>
                      <Option value="80">80mm (Standard)</Option>
                      <Option value="112">112mm (Wide)</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item label="Auto Print Receipt" name="autoPrint" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item label="Print Logo" name="printLogo" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item label="Logo URL" name="logoUrl">
                    <Input placeholder="Enter logo URL" />
                  </Form.Item>
                  
                  <Button type="primary" onClick={savePrinterSettings}>
                    Save Printer Settings
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
          
          <Card title="📊 POS Analytics" style={{ marginTop: 20 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Today's Sales"
                  value={posAnalytics.todaySales}
                  precision={2}
                  prefix="Rs"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Today's Transactions"
                  value={posAnalytics.todayTransactions}
                  valueStyle={{ color: 'var(--brand-primary)' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Average Sale Value"
                  value={posAnalytics.averageSaleValue}
                  precision={2}
                  prefix="Rs"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Top Selling Product"
                  value={posAnalytics.topSellingProduct}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
            </Row>
            
            <div style={{ marginTop: 20 }}>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={exportPOSReport}
              >
                Export POS Report
              </Button>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: 'var(--brand-primary)' }}>
              🛒 Point of Sale (POS)
            </Title>
            <Text style={{ color: 'var(--text-secondary)' }}>Fast, touch-friendly sales interface with inventory management</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<UserOutlined />}
                onClick={() => setIsCustomerModalVisible(true)}
              >
                {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
              </Button>
              <Button 
                icon={<TeamOutlined />}
                onClick={() => setSelectedEmployee(employeesList[0])}
              >
                {selectedEmployee ? selectedEmployee.name : 'Select Employee'}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* Checkout Modal */}
      <Modal
        title="💳 Checkout"
        open={isCheckoutModalVisible}
        onCancel={() => {
          setIsCheckoutModalVisible(false);
          setReceivedAmount(0);
        }}
        footer={null}
        width={600}
      >
        <Form form={checkoutForm} onFinish={processSale} layout="vertical">
          <Form.Item label="Payment Method" name="paymentMethod" initialValue="Cash">
            <Select>
              <Option value="Cash">Cash</Option>
              <Option value="Credit Card">Credit Card</Option>
              <Option value="Bank Transfer">Bank Transfer</Option>
              <Option value="Mobile Payment">Mobile Payment</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Received Amount" name="receivedAmount" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={totals.grandTotal}
              step={0.01}
              placeholder="Enter amount received"
              onChange={(value) => setReceivedAmount(value || 0)}
            />
          </Form.Item>

          <Form.Item label="Change">
            <Text strong>Rs {receivedAmount - totals.grandTotal}</Text>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Space>
              <Button onClick={() => {
                setIsCheckoutModalVisible(false);
                setReceivedAmount(0);
              }}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={processing}
                icon={<CheckOutlined />}
              >
                Complete Sale
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        title="🧾 Sale Receipt"
        open={isReceiptModalVisible}
        onCancel={() => setIsReceiptModalVisible(false)}
        footer={null}
        width={400}
      >
        {receiptData && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Title level={3}>Receipt</Title>
              <Text style={{ color: 'var(--text-secondary)' }}>{dayjs(receiptData.date).format('DD/MM/YYYY HH:mm')}</Text>
            </div>

            <Divider />

            {receiptData.items?.map((item, index) => (
              <div key={index} style={{ marginBottom: 8 }}>
                <Row justify="space-between">
                  <Col>
                    <Text strong>{item.product.name}</Text>
                    <br />
                    <Text style={{ color: 'var(--text-secondary)' }}>{item.qty} {item.unit} × Rs {item.price}</Text>
                  </Col>
                  <Col>
                    <Text strong>Rs {item.total}</Text>
                  </Col>
                </Row>
              </div>
            ))}

            <Divider />

            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Col>Subtotal:</Col>
              <Col>Rs {receiptData.subtotal}</Col>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Col>Discount:</Col>
              <Col>Rs {receiptData.discount}</Col>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Col>Tax:</Col>
              <Col>Rs {receiptData.tax}</Col>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Col><Text strong>Total:</Text></Col>
              <Col><Text strong>Rs {receiptData.grandTotal}</Text></Col>
            </Row>

            <Divider />

            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button 
                  icon={<PrinterOutlined />}
                  onClick={printReceipt}
                >
                  Print Receipt
                </Button>
                <Button 
                  icon={<WhatsAppOutlined />}
                  onClick={sendWhatsAppInvoice}
                  disabled={!receiptData.customer?.phone}
                >
                  Send WhatsApp
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* Discount Approval Modal */}
      <Modal
        title="🔐 Manager Approval Required"
        open={isDiscountApprovalModalVisible}
        onCancel={() => setIsDiscountApprovalModalVisible(false)}
        footer={null}
        width={400}
      >
        <div>
          <Alert
            message="High Discount Alert"
            description="The requested discount exceeds the cashier limit. Manager approval is required."
            type="warning"
            showIcon
            style={{ marginBottom: 20 }}
          />
          
          <Form layout="vertical">
            <Form.Item label="Manager PIN" required>
              <Input.Password
                value={managerPin}
                onChange={(e) => setManagerPin(e.target.value)}
                placeholder="Enter manager PIN"
              />
            </Form.Item>
            
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button onClick={() => setIsDiscountApprovalModalVisible(false)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleDiscountApproval}
                >
                  Approve Discount
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Customer Modal */}
      <Modal
        title="👤 Select Customer"
        open={isCustomerModalVisible}
        onCancel={() => setIsCustomerModalVisible(false)}
        footer={null}
        width={600}
      >
        <div>
          <Input
            placeholder="Search customers..."
            prefix={<SearchOutlined />}
            style={{ marginBottom: 16 }}
          />
          
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {customersList.map(customer => (
              <Card
                key={customer._id}
                size="small"
                style={{ marginBottom: 8, cursor: 'pointer' }}
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsCustomerModalVisible(false);
                }}
              >
                <Text strong>{customer.name}</Text>
                <br />
                <Text style={{ color: 'var(--text-secondary)' }}>{customer.email} • {customer.phone}</Text>
              </Card>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button icon={<UserAddOutlined />}>
              Add New Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
