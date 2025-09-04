# 🗄️ Database Collections Summary

## 📊 **Total Collections: 17**

This ERP-CRM application has **17 MongoDB collections** organized into two main categories:

---

## 🏢 **Application Models (13 Collections)**

### 1. **BargainLog** - Price Negotiation Tracking
**Purpose**: Tracks price negotiations and discounts given to customers

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `sale` (ObjectId) - Reference to PosSale
- `product` (ObjectId) - Reference to Product
- `staff` (ObjectId) - Reference to Employee
- `originalPrice` (Decimal128) - Original product price
- `finalPrice` (Decimal128) - Negotiated final price
- `discountPct` (Decimal128) - Discount percentage given
- `discountAmount` (Decimal128) - Discount amount in currency
- `approvedBy` (ObjectId) - Reference to Admin who approved
- `approvalLevel` (String) - ['Cashier', 'Manager', 'Owner']
- `reason` (String) - Reason for discount
- `customerName` (String) - Customer name
- `customerPhone` (String) - Customer phone
- `notes` (String) - Additional notes
- `createdBy` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 2. **Client** - Customer Management
**Purpose**: Stores customer information and contact details

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `name` (String) - Customer name (required)
- `phone` (String) - Phone number
- `country` (String) - Country
- `address` (String) - Address
- `email` (String) - Email address
- `createdBy` (ObjectId) - Reference to Admin
- `assigned` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 3. **Employee** - Staff Management
**Purpose**: Manages employee information, roles, and compensation

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `employeeId` (String) - Unique employee ID (required)
- `name` (String) - Employee name (required)
- `phone` (String) - Phone number (required)
- `email` (String) - Email address
- `address` (String) - Address
- `role` (String) - ['Manager', 'Cashier', 'Salesperson', 'Helper', 'Admin'] (required)
- `salaryType` (String) - ['Fixed', 'Commission', 'Hybrid'] (required)
- `baseSalary` (Decimal128) - Base salary amount
- `commissionRate` (Decimal128) - Commission percentage
- `joiningDate` (Date) - Date of joining (required)
- `active` (Boolean) - Employment status
- `emergencyContact` (Object) - Emergency contact details
  - `name` (String)
  - `phone` (String)
  - `relationship` (String)
- `documents` (Array) - Employee documents
  - `type` (String)
  - `url` (String)
  - `uploadedAt` (Date)
- `notes` (String) - Additional notes
- `createdBy` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 4. **InventoryRoll** - Fabric/Product Inventory
**Purpose**: Tracks individual rolls of fabric with detailed inventory information

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `rollNumber` (String) - Unique roll identifier (required)
- `barcode` (String) - Barcode for scanning
- `product` (ObjectId) - Reference to Product (required)
- `supplier` (ObjectId) - Reference to Supplier (required)
- `batchNumber` (String) - Batch number
- `initLength` (Decimal128) - Initial length of roll (required)
- `remainingLength` (Decimal128) - Current remaining length (required)
- `unit` (String) - ['m', 'yd'] (required)
- `status` (String) - ['Available', 'Low Stock', 'Out of Stock', 'Damaged', 'Disposed'] (required)
- `costPerUnit` (Decimal128) - Cost per unit (required)
- `receivedAt` (Date) - Date received (required)
- `location` (String) - Storage location
- `notes` (String) - Additional notes
- `createdBy` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 5. **Invoice** - Invoice Management
**Purpose**: Manages invoices and billing information

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `createdBy` (ObjectId) - Reference to Admin (required)
- `number` (Number) - Invoice number (required)
- `year` (Number) - Invoice year (required)
- `content` (String) - Invoice content
- `recurring` (String) - ['daily', 'weekly', 'monthly', 'annually', 'quarter']
- `date` (Date) - Invoice date (required)
- `expiredDate` (Date) - Expiration date (required)
- `client` (ObjectId) - Reference to Client (required)
- `items` (Array) - Invoice items
  - `itemName` (String) - Item name (required)
  - `description` (String) - Item description
  - `quantity` (Number) - Quantity (required)
  - `price` (Number) - Unit price (required)
  - `total` (Number) - Total amount (required)
- `taxRate` (Number) - Tax rate percentage
- `subTotal` (Number) - Subtotal amount
- `taxTotal` (Number) - Tax amount
- `total` (Number) - Total amount
- `currency` (String) - Currency code (required)
- `credit` (Number) - Credit amount
- `discount` (Number) - Discount amount
- `payment` (Array) - Payment references
- `paymentStatus` (String) - ['unpaid', 'paid', 'partially']
- `isOverdue` (Boolean) - Overdue status
- `approved` (Boolean) - Approval status
- `notes` (String) - Additional notes
- `status` (String) - ['draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold']
- `pdf` (String) - PDF file path
- `files` (Array) - Attached files
- `updated` (Date) - Last update timestamp
- `created` (Date) - Creation timestamp

### 6. **LedgerEntry** - Financial Ledger
**Purpose**: Tracks all financial transactions and account balances

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `partyType` (String) - ['Customer', 'Supplier', 'Employee'] (required)
- `partyId` (ObjectId) - Reference to party (required)
- `partyModel` (String) - ['Client', 'Supplier', 'Employee'] (required)
- `entryType` (String) - ['Sale', 'Payment', 'Purchase', 'Return', 'Advance', 'Salary', 'Commission', 'Adjustment'] (required)
- `debit` (Decimal128) - Debit amount
- `credit` (Decimal128) - Credit amount
- `balance` (Decimal128) - Current balance (required)
- `date` (Date) - Transaction date (required)
- `refId` (ObjectId) - Reference to related document
- `refModel` (String) - ['PosSale', 'Payment', 'Purchase', 'PosReturn', 'Payroll']
- `description` (String) - Transaction description
- `notes` (String) - Additional notes
- `createdBy` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 7. **Payroll** - Employee Payroll Management
**Purpose**: Manages employee salaries, commissions, and payroll processing

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `employee` (ObjectId) - Reference to Employee (required)
- `period` (Object) - Payroll period (required)
  - `month` (Number) - Month (1-12) (required)
  - `year` (Number) - Year (required)
- `earnings` (Array) - Earnings breakdown
  - `type` (String) - ['Base Salary', 'Commission', 'Bonus', 'Overtime', 'Allowance'] (required)
  - `amount` (Decimal128) - Amount (required)
  - `description` (String) - Description
- `deductions` (Array) - Deductions breakdown
  - `type` (String) - ['Tax', 'Insurance', 'Loan', 'Advance', 'Other'] (required)
  - `amount` (Decimal128) - Amount (required)
  - `description` (String) - Description
- `totalEarnings` (Decimal128) - Total earnings (required)
- `totalDeductions` (Decimal128) - Total deductions (required)
- `netPay` (Decimal128) - Net pay amount (required)
- `paid` (Boolean) - Payment status
- `paidAt` (Date) - Payment date
- `paymentMethod` (String) - ['Cash', 'Bank Transfer', 'Check']
- `paymentReference` (String) - Payment reference
- `salesTarget` (Decimal128) - Sales target
- `actualSales` (Decimal128) - Actual sales achieved
- `commissionEarned` (Decimal128) - Commission earned
- `notes` (String) - Additional notes
- `createdBy` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 8. **PosSale** - Point of Sale Transactions
**Purpose**: Records all POS transactions and sales

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `customer` (ObjectId) - Reference to Client (optional for walk-ins)
- `employee` (ObjectId) - Reference to Employee (required)
- `items` (Array) - Sale items (required)
  - `product` (ObjectId) - Reference to Product (required)
  - `roll` (ObjectId) - Reference to InventoryRoll (required)
  - `quantity` (Number) - Quantity sold (required)
  - `unit` (String) - Unit of measurement (required)
  - `unitPrice` (Number) - Unit price (required)
  - `total` (Number) - Total amount (required)
- `subtotal` (Number) - Subtotal amount (required)
- `discount` (Number) - Discount amount
- `bargainDiscount` (Number) - Bargain discount amount
- `tax` (Number) - Tax amount
- `grandTotal` (Number) - Grand total (required)
- `paymentMethod` (String) - ['Cash', 'Credit Card', 'Bank Transfer', 'Mobile Payment', 'Credit'] (required)
- `receivedAmount` (Number) - Amount received (required)
- `change` (Number) - Change given
- `status` (String) - ['pending', 'completed', 'cancelled', 'refunded']
- `notes` (String) - Additional notes
- `receiptNumber` (String) - Receipt number
- `date` (Date) - Sale date
- `createdBy` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 9. **PosSettings** - POS System Configuration
**Purpose**: Comprehensive POS system settings and configuration

**Fields**:
- `type` (String) - ['general', 'security', 'printer', 'analytics'] (required)
- `shopName` (String) - Shop name
- `taxRate` (Number) - Tax rate percentage
- `currency` (String) - ['Rs', '$', '€', '£']
- `receiptHeader` (String) - Receipt header text
- `receiptFooter` (String) - Receipt footer text
- `timezone` (String) - Timezone setting
- `language` (String) - ['en', 'ur', 'ar']
- `cashierDiscountLimit` (Number) - Cashier discount limit
- `managerPin` (String) - Manager PIN
- `requireManagerApproval` (Object) - Approval requirements
- `sessionTimeout` (Number) - Session timeout in minutes
- `maxLoginAttempts` (Number) - Maximum login attempts
- `receiptWidth` (Number) - Receipt width
- `autoPrintReceipt` (Boolean) - Auto print setting
- `printLogo` (Boolean) - Print logo setting
- `logoUrl` (String) - Logo URL
- `printBarcode` (Boolean) - Print barcode setting
- `printQRCode` (Boolean) - Print QR code setting
- `paperSize` (String) - Paper size
- `marginTop` (Number) - Top margin
- `marginBottom` (Number) - Bottom margin
- `enableAnalytics` (Boolean) - Analytics enabled
- `dataRetentionDays` (Number) - Data retention period
- `autoGenerateReports` (Boolean) - Auto report generation
- `reportSchedule` (String) - Report schedule
- `enableNotifications` (Boolean) - Notifications enabled
- `lowStockAlert` (Boolean) - Low stock alerts
- `lowStockThreshold` (Number) - Low stock threshold
- `salesTargetAlerts` (Boolean) - Sales target alerts
- `dailySalesTarget` (Number) - Daily sales target
- `enableWhatsApp` (Boolean) - WhatsApp integration
- `whatsappApiKey` (String) - WhatsApp API key
- `enableSMS` (Boolean) - SMS integration
- `smsApiKey` (String) - SMS API key
- `enableEmail` (Boolean) - Email integration
- `emailSettings` (Object) - Email configuration
- `autoBackup` (Boolean) - Auto backup setting
- `backupFrequency` (String) - Backup frequency
- `backupRetention` (Number) - Backup retention period
- `enableAuditLog` (Boolean) - Audit logging
- `enableMultiCurrency` (Boolean) - Multi-currency support
- `enableMultiLocation` (Boolean) - Multi-location support
- `enableCustomerLoyalty` (Boolean) - Customer loyalty program
- `loyaltyPointsRate` (Number) - Loyalty points rate
- `createdBy` (ObjectId) - Reference to Admin (required)
- `updatedBy` (ObjectId) - Reference to Admin
- `isActive` (Boolean) - Active status
- `version` (Number) - Settings version
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last update timestamp

### 10. **Product** - Product Catalog
**Purpose**: Manages product information and specifications

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `code` (String) - Product code (required, unique)
- `name` (String) - Product name (required)
- `fabricType` (String) - ['Cotton', 'Silk', 'Wool', 'Polyester', 'Linen', 'Denim', 'Velvet', 'Other'] (required)
- `color` (String) - Product color (required)
- `size` (String) - Product size
- `description` (String) - Product description
- `images` (Array) - Product images
- `pricing` (Object) - Pricing information (required)
  - `minSalePrice` (Decimal128) - Minimum sale price (required)
  - `maxSalePrice` (Decimal128) - Maximum sale price (required)
  - `defaultUnit` (String) - ['m', 'yd'] (required)
  - `costPrice` (Decimal128) - Cost price (required)
- `supplier` (ObjectId) - Reference to Supplier (required)
- `category` (String) - Product category
- `tags` (Array) - Product tags
- `barcode` (String) - Product barcode
- `sku` (String) - SKU code
- `createdBy` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 11. **StockTxn** - Stock Transaction Log
**Purpose**: Tracks all stock movements and inventory transactions

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `type` (String) - ['IN', 'OUT', 'ADJUST', 'DISPOSAL', 'RETURN', 'TRANSFER'] (required)
- `product` (ObjectId) - Reference to Product (required)
- `roll` (ObjectId) - Reference to InventoryRoll (required)
- `qty` (Decimal128) - Quantity (required)
- `unit` (String) - ['m', 'yd'] (required)
- `refType` (String) - ['Purchase', 'Sale', 'Return', 'Adjustment', 'Disposal', 'Transfer']
- `refId` (ObjectId) - Reference to related document
- `refModel` (String) - ['PosSale', 'PosReturn', 'Purchase', 'StockAdjustment', 'Disposal']
- `previousQty` (Decimal128) - Previous quantity
- `newQty` (Decimal128) - New quantity
- `unitCost` (Decimal128) - Unit cost
- `totalValue` (Decimal128) - Total value
- `notes` (String) - Additional notes
- `createdBy` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 12. **Supplier** - Supplier Management
**Purpose**: Manages supplier information and relationships

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `code` (String) - Supplier code (required, unique)
- `name` (String) - Supplier name (required)
- `companyName` (String) - Company name
- `contactPerson` (String) - Contact person name
- `phone` (String) - Phone number (required)
- `email` (String) - Email address
- `address` (String) - Address
- `city` (String) - City
- `country` (String) - Country
- `taxNumber` (String) - Tax number
- `creditLimit` (Decimal128) - Credit limit
- `currentBalance` (Decimal128) - Current balance
- `paymentTerms` (Number) - Payment terms in days
- `notes` (String) - Additional notes
- `createdBy` (ObjectId) - Reference to Admin
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

### 13. **Unit** - Measurement Units
**Purpose**: Manages different measurement units for products

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `code` (String) - Unit code (required, unique) ['m', 'yd', 'ft', 'cm']
- `name` (String) - Unit name (required)
- `precision` (Number) - Decimal precision
- `ratioToBase` (Decimal128) - Ratio to base unit (required)
- `isBaseUnit` (Boolean) - Base unit flag
- `created` (Date) - Creation timestamp
- `updated` (Date) - Last update timestamp

---

## 🔧 **Core Models (4 Collections)**

### 14. **Admin** - System Administrators
**Purpose**: Manages system administrators and users

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `email` (String) - Email address (required, lowercase)
- `name` (String) - Admin name (required)
- `surname` (String) - Admin surname
- `photo` (String) - Profile photo path
- `created` (Date) - Creation timestamp
- `role` (String) - ['owner'] - Admin role

### 15. **AdminPassword** - Admin Authentication
**Purpose**: Manages admin passwords and authentication

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `user` (ObjectId) - Reference to Admin (required, unique)
- `password` (String) - Hashed password (required)
- `salt` (String) - Password salt (required)
- `emailToken` (String) - Email verification token
- `resetToken` (String) - Password reset token
- `emailVerified` (Boolean) - Email verification status
- `authType` (String) - Authentication type
- `loggedSessions` (Array) - Active login sessions

### 16. **Setting** - System Settings
**Purpose**: Stores system-wide configuration settings

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `settingCategory` (String) - Setting category (required, lowercase)
- `settingKey` (String) - Setting key (required, lowercase)
- `settingValue` (Mixed) - Setting value
- `valueType` (String) - Value type
- `isPrivate` (Boolean) - Private setting flag
- `isCoreSetting` (Boolean) - Core setting flag

### 17. **Upload** - File Management
**Purpose**: Manages file uploads and storage

**Fields**:
- `removed` (Boolean) - Soft delete flag
- `enabled` (Boolean) - Active status
- `modelName` (String) - Related model name
- `fieldId` (String) - Field identifier (required)
- `fileName` (String) - File name (required)
- `fileType` (String) - File type (required) - Supports images, documents, videos, audio
- `isPublic` (Boolean) - Public access flag (required)
- `userID` (ObjectId) - User ID (required)
- `isSecure` (Boolean) - Security flag (required)
- `path` (String) - File path (required)
- `created` (Date) - Creation timestamp

---

## 📊 **Collection Summary**

| Category | Count | Collections |
|----------|-------|-------------|
| **Application Models** | 13 | BargainLog, Client, Employee, InventoryRoll, Invoice, LedgerEntry, Payroll, PosSale, PosSettings, Product, StockTxn, Supplier, Unit |
| **Core Models** | 4 | Admin, AdminPassword, Setting, Upload |
| **Total** | **17** | Complete ERP-CRM system |

## 🎯 **Key Features**

- **Fabric/Textile Focus**: Specialized for fabric retail with roll-based inventory
- **POS Integration**: Complete point-of-sale system with receipt management
- **Financial Tracking**: Comprehensive ledger and payroll management
- **Multi-User Support**: Role-based access with admin management
- **Audit Trail**: Complete tracking of all transactions and changes
- **Flexible Settings**: Extensive configuration options for POS system
- **File Management**: Built-in file upload and storage system

This is a comprehensive ERP-CRM system specifically designed for fabric/textile retail businesses with advanced POS capabilities, inventory management, and financial tracking.
