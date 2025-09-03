# Bin Sultan - Root Directory

This is the root directory for the Bin Sultan application. It contains both the backend and frontend applications, along with configuration for running them together and deploying to Vercel.

## Quick Start

### 1. Install All Dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project (concurrently for running both services)
- Backend (Node.js/Express server)
- Frontend (React application)

### 2. Development Mode

Run both backend and frontend simultaneously:

```bash
npm run dev
```

This starts:
- **Backend**: Express server on port 8888
- **Frontend**: React dev server on port 3000

### 3. Individual Services

If you want to run services separately:

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run dev:backend` | Start only the backend server |
| `npm run dev:frontend` | Start only the frontend development server |
| `npm run build` | Build the frontend for production |
| `npm run start` | Start the backend in production mode |
| `npm run install:all` | Install dependencies for all packages |
| `npm run setup` | Run backend setup script |
| `npm run upgrade` | Run backend upgrade script |
| `npm run reset` | Run backend reset script |

## Project Structure

```
/
├── package.json              # Root package.json with scripts
├── vercel.json              # Vercel deployment configuration
├── .vercelignore            # Files excluded from Vercel deployment
├── VERCEL-DEPLOYMENT.md     # Comprehensive deployment guide
├── backend/                 # Backend Node.js application
│   ├── src/
│   │   ├── server.js        # Main server file
│   │   ├── app.js           # Express app configuration
│   │   └── ...
│   └── package.json
└── frontend/                # Frontend React application
    ├── src/
    ├── vite.config.js       # Vite configuration
    ├── dist/                # Built frontend files (after build)
    └── package.json
```

## Development Workflow

1. **Start Development**: `npm run dev`
2. **Backend API**: Available at `http://localhost:8888/api/*`
3. **Frontend**: Available at `http://localhost:3000`
4. **API Proxy**: Frontend automatically proxies `/api` requests to backend

## Environment Variables

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
Set environment variables in Vercel dashboard (see `VERCEL-DEPLOYMENT.md`)

## Vercel Deployment

This project is configured for easy deployment to Vercel:

1. **Automatic Detection**: Vercel will detect the configuration from `vercel.json`
2. **Build Process**: Frontend builds to `frontend/dist`
3. **API Routes**: Backend serves as serverless functions
4. **Static Serving**: Frontend served from root path

For detailed deployment instructions, see `VERCEL-DEPLOYMENT.md`.

## Troubleshooting

### Common Issues:

1. **Port Conflicts**: Ensure ports 8888 and 3000 are available
2. **Dependencies**: Run `npm run install:all` if you encounter missing modules
3. **Database**: Check MongoDB connection in `.env.local`
4. **Build Errors**: Verify Node.js version (20.9.0+ required)

### Debug Commands:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify all dependencies
npm run install:all

# Test individual services
npm run dev:backend
npm run dev:frontend
```

## Contributing

1. Make changes in the appropriate directory (backend/ or frontend/)
2. Test with `npm run dev`
3. Build with `npm run build` before committing
4. Follow the existing code style and structure

## Support

- **Backend Issues**: Check `backend/README.md`
- **Frontend Issues**: Check `frontend/README.md`
- **Deployment Issues**: Check `VERCEL-DEPLOYMENT.md`
- **General Issues**: Check the main `README.md`
