# 🏪 Bin Sultan ERP + POS System

A comprehensive ERP and Point of Sale system designed specifically for cloth shops and fabric stores. Built with modern technologies to handle fractional unit sales (meters/yards with decimals), inventory management, and complete business operations.

## ✨ Features

### 🛍️ POS System
- **Fractional Unit Sales**: Support for decimal quantities (0.25, 0.5, 0.75 meters/yards)
- **Real-time Inventory**: Automatic stock updates during sales
- **Multi-payment Methods**: Cash, Card, Bank Transfer, Mobile Money, Credit
- **Discount Management**: Item-level and transaction-level discounts
- **Bargaining Log**: Track discount approvals and bargaining history
- **Receipt Generation**: Print and WhatsApp invoice integration

### 📦 Inventory Management
- **Roll/Bale Tracking**: Individual roll tracking with remaining quantities
- **Stock Transactions**: Complete audit trail of all stock movements
- **Low Stock Alerts**: Automatic notifications for reordering
- **Damaged Stock**: Track and manage damaged inventory
- **Barcode Support**: QR codes for easy product identification

### 👥 Customer & Supplier Management
- **Customer Ledgers**: Track credit sales and payment history
- **Supplier Management**: Manage suppliers with payment terms
- **Aging Reports**: Customer and supplier payment aging
- **Credit Limits**: Set and monitor credit limits

### 👨‍💼 Employee Management
- **Role-based Access**: Manager, Cashier, Salesperson, Helper roles
- **Commission Tracking**: Automatic commission calculations
- **Payroll Management**: Salary, commission, and deduction tracking
- **Sales Performance**: Employee sales analytics

### 📊 Reports & Analytics
- **Sales Dashboard**: Real-time sales metrics and trends
- **Profit Analysis**: Cost tracking and profit calculations
- **Inventory Reports**: Stock levels, value, and movement reports
- **Customer Analytics**: Top customers and sales patterns
- **Export Capabilities**: PDF and Excel report generation

## 🚀 Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **MongoDB Sessions** for transaction integrity
- **JWT** for authentication
- **Decimal128** for precise financial calculations

### Frontend
- **React 18** with functional components
- **Ant Design** for UI components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Ant Design Charts** for data visualization

## 📋 Prerequisites

- Node.js 20.9.0 or higher
- MongoDB 6.0 or higher
- npm 10.2.4 or higher

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ERP-CRM
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
DATABASE=mongodb://localhost:27017/bin-sultan-erp
PORT=8888
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start the Application

#### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Production Mode
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## 🗄️ Database Setup

The system will automatically create the necessary collections and indexes. Key models include:

- **Products**: Fabric products with pricing and specifications
- **InventoryRolls**: Individual roll/bale tracking
- **StockTxn**: Stock transaction history
- **PosSale**: Sales transactions
- **Customers**: Customer information and ledgers
- **Suppliers**: Supplier management
- **Employees**: Staff management and payroll
- **LedgerEntry**: Financial transaction tracking

## 🎯 Usage Guide

### 1. Initial Setup
1. **Create Admin User**: First login creates the admin account
2. **Add Units**: Configure measurement units (meters, yards)
3. **Add Suppliers**: Set up fabric suppliers
4. **Add Products**: Create fabric products with pricing
5. **Add Inventory**: Create rolls/bales for each product
6. **Add Employees**: Set up staff accounts and roles

### 2. Daily Operations

#### Making a Sale
1. Navigate to **POS Sales**
2. Select customer (optional)
3. Select staff member
4. Search and add products to cart
5. Adjust quantities (supports decimals)
6. Apply discounts if needed
7. Select payment method
8. Complete sale

#### Inventory Management
1. **Add New Rolls**: Create new inventory rolls
2. **Stock Adjustments**: Adjust quantities for damages/losses
3. **Low Stock Monitoring**: Check dashboard for alerts
4. **Stock Reports**: Generate inventory reports

#### Customer Management
1. **Add Customers**: Create customer profiles
2. **Credit Sales**: Process sales on credit
3. **Payment Collection**: Record customer payments
4. **Ledger Review**: Check customer balances

### 3. Reports and Analytics

#### Dashboard
- Daily and monthly sales
- Low stock alerts
- Top-selling products
- Employee performance

#### Financial Reports
- Sales summary reports
- Profit analysis
- Customer aging reports
- Supplier payment reports

## 🔧 Configuration

### Discount Policies
Configure discount limits and approval requirements:
```javascript
// In bargainLog model
approvalLevel: 'Cashier' | 'Manager' | 'Owner'
maxDiscountPercent: 15 // Maximum discount percentage
```

### Tax Configuration
Default tax rate is 5%. Modify in POS controller:
```javascript
const tax = net * 0.05; // 5% tax rate
```

### Commission Rates
Set employee commission rates in Employee model:
```javascript
commissionRate: {
  type: mongoose.Schema.Types.Decimal128,
  default: 0, // Percentage
}
```

## 🔒 Security Features

- **Role-based Access Control**: Different permissions for different roles
- **Audit Trails**: Complete transaction history
- **Session Management**: Secure user sessions
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: MongoDB with parameterized queries

## 📱 Mobile Responsiveness

The system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Touch-screen POS terminals

## 🔄 API Endpoints

### POS Endpoints
- `POST /possale/create` - Create new sale
- `GET /possale/list` - List sales
- `GET /possale/summary` - Sales analytics

### Product Endpoints
- `POST /product/create` - Add new product
- `GET /product/list` - List products
- `GET /product/summary` - Product analytics

### Inventory Endpoints
- `POST /inventoryroll/create` - Add new roll
- `GET /inventoryroll/list` - List inventory
- `POST /stocktxn/create` - Record stock transaction

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check DATABASE URL in .env file
   - Verify network connectivity

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on the port

3. **Module Not Found Errors**
   - Run `npm install` in both backend and frontend
   - Clear node_modules and reinstall

4. **Decimal Precision Issues**
   - Ensure MongoDB Decimal128 is used for financial data
   - Check product pricing configuration

## 📞 Support

For technical support or feature requests:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the Fair-code License. See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🎉 Acknowledgments

- Built with modern web technologies
- Designed for cloth shop specific needs
- Optimized for fractional unit sales
- Professional UI/UX for retail environments

---

**Bin Sultan ERP + POS** - Professional Cloth Shop Management System 🏪
