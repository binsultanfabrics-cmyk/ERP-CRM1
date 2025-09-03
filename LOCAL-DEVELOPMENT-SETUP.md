# 🛠️ Local Development Setup Guide

## 🚨 Problem Solved: MissingSchemaError

The error you encountered was caused by middleware files trying to use Mongoose models before the database connection was established. This has been fixed.

## ✅ Fixes Applied

### 1. **Fixed All Settings Middleware Files** 🔧

Updated these files to check database connection before using models:
- `backend/src/middlewares/settings/listBySettingKey.js`
- `backend/src/middlewares/settings/updateBySettingKey.js`
- `backend/src/middlewares/settings/readBySettingKey.js`
- `backend/src/middlewares/settings/listAllSettings.js`
- `backend/src/middlewares/settings/increaseBySettingKey.js`
- `backend/src/middlewares/serverData.js`

### 2. **Added Database Connection Checks** 🗄️

Each middleware now includes:
```javascript
// Check if database is connected and model is available
if (!mongoose.connection.readyState || !mongoose.models.Setting) {
  return []; // or null, depending on the function
}
```

## 🚀 Local Development Setup

### 1. **Create Environment File** 📝

Create `backend/.env` file with:
```bash
# Database Configuration
DATABASE=mongodb://localhost:27017/bin-sultan-erp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=8888
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_FROM=noreply@binsultan.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=your-aws-region
```

### 2. **Install MongoDB** 🍃

#### Option A: Local MongoDB
1. Download and install MongoDB Community Server
2. Start MongoDB service
3. Create database: `bin-sultan-erp`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `DATABASE` in `.env` file

### 3. **Install Dependencies** 📦

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 4. **Start Development Servers** 🚀

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 🔍 Testing Your Setup

### 1. **Backend Health Check** 🩺
Visit: `http://localhost:8888/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "Bin Sultan ERP + POS API is running",
  "timestamp": "2024-01-XX..."
}
```

### 2. **Frontend Access** 🌐
Visit: `http://localhost:3000`

Should load the React application.

### 3. **Database Connection** 🗄️
Check backend console for:
```
✅ MongoDB connected successfully
✅ Models loaded successfully
```

## 🚨 Troubleshooting

### Issue 1: Still Getting MissingSchemaError
**Solution**: 
1. Ensure `.env` file exists in `backend/` directory
2. Check `DATABASE` variable is set correctly
3. Restart the backend server

### Issue 2: MongoDB Connection Failed
**Solution**:
1. Check if MongoDB is running
2. Verify connection string format
3. Check network connectivity (for Atlas)

### Issue 3: Frontend Can't Connect to Backend
**Solution**:
1. Check if backend is running on port 8888
2. Verify `frontend/vite.config.js` proxy settings
3. Check for CORS issues

### Issue 4: Environment Variables Not Loading
**Solution**:
1. Ensure `.env` file is in `backend/` directory
2. Check file permissions
3. Restart the server after changes

## 📋 Development Workflow

### 1. **Daily Development** 🔄
```bash
# Start backend
cd backend && npm run dev

# Start frontend (in new terminal)
cd frontend && npm run dev
```

### 2. **Database Seeding** 🌱
```bash
cd backend
npm run setup
```

### 3. **Testing** 🧪
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 🎯 Expected Results

After setup:
- ✅ **Backend runs**: No more MissingSchemaError
- ✅ **Database connects**: MongoDB connection successful
- ✅ **Frontend loads**: React app accessible
- ✅ **API works**: Health endpoint responds
- ✅ **Full functionality**: All features working locally

## 🔄 Next Steps

1. **Set up environment**: Create `.env` file
2. **Install MongoDB**: Local or Atlas
3. **Start servers**: Backend and frontend
4. **Test functionality**: Login, dashboard, etc.
5. **Begin development**: Make your changes!

Your local development environment should now work without the MissingSchemaError! 🎉
