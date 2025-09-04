# Vercel Deployment Guide for Bin Sultan

This guide will help you deploy your Bin Sultan application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **MongoDB Database**: Set up a MongoDB database (MongoDB Atlas recommended)
4. **Environment Variables**: Prepare your production environment variables

## Quick Start

### 1. Install Dependencies

From the root directory, run:

```bash
npm run install:all
```

### 2. Development

To run both backend and frontend simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on port 8888
- Frontend development server on port 3000

### 3. Build for Production

```bash
npm run build
```

## Vercel Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### 2. Configure Build Settings

Vercel will automatically detect the configuration from `vercel.json`, but you can verify:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm run install:all`

### 3. Environment Variables

Add these environment variables in your Vercel project settings:

#### Required Variables:
- `DATABASE`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `NODE_ENV`: Set to `production`

#### Optional Variables (based on your features):
- `RESEND_API_KEY`: For email functionality
- `OPENAI_API_KEY`: For AI features
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`: For S3 file storage

### 4. Deploy

Click "Deploy" and Vercel will:
1. Install dependencies
2. Build the frontend
3. Deploy the backend as serverless functions
4. Serve the frontend from the root path
5. Route API calls to the backend

## Project Structure for Vercel

```
/
├── package.json          # Root package.json with scripts
├── vercel.json          # Vercel configuration
├── .vercelignore        # Files to exclude from deployment
├── backend/             # Backend Node.js application
│   ├── src/
│   │   └── server.js    # Main server file
│   └── package.json
└── frontend/            # Frontend React application
    ├── src/
    ├── dist/            # Built frontend files
    └── package.json
```

## API Routes

- **Frontend**: Served from root `/`
- **Backend API**: Available at `/api/*`
- **File Downloads**: Available at `/download/*`
- **Public Files**: Available at `/public/*`

## Custom Domains

1. In your Vercel project, go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

## Environment Variables in Vercel

### Development
Create a `.env.local` file in the root directory:

```bash
# Backend
DATABASE=mongodb://localhost:27017/your_database
JWT_SECRET=your_dev_secret

# Frontend
VITE_API_URL=http://localhost:8888
```

### Production
Set these in Vercel dashboard:

```bash
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_production_secret
NODE_ENV=production
```

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are properly installed
2. **API Errors**: Verify environment variables are set correctly
3. **Database Connection**: Ensure MongoDB connection string is correct
4. **File Upload Issues**: Check file upload paths and permissions

### Debug Commands:

```bash
# Check if all dependencies are installed
npm run install:all

# Test backend only
npm run dev:backend

# Test frontend only
npm run dev:frontend

# Build frontend
npm run build:frontend
```

## Performance Optimization

The Vercel configuration includes:
- **Code Splitting**: Vendor, Ant Design, and chart libraries are split into separate chunks
- **Compression**: Backend uses compression middleware
- **Caching**: Proper cache headers for static assets
- **CDN**: Vercel's global CDN for fast delivery

## Monitoring

Vercel provides:
- **Analytics**: Page views, performance metrics
- **Functions**: Backend function execution logs
- **Deployments**: Deployment history and rollbacks
- **Performance**: Core Web Vitals and performance insights

## Support

For issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with `npm run dev`
4. Check MongoDB connection
5. Review browser console for frontend errors

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets for production
- Enable HTTPS (automatic with Vercel)
- Regularly update dependencies
- Monitor for security vulnerabilities
