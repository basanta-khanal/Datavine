# DataVine.ai Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Git
- MongoDB (for production) or use in-memory storage (for development)

### Local Development Setup

1. **Clone and Install Dependencies**
```bash
git clone <your-repo-url>
cd datavine-ai
npm install
cd backend && npm install
```

2. **Start Development Servers**
```bash
# Option 1: Start both servers separately
npm run dev          # Frontend (port 3000)
npm run backend:dev  # Backend (port 5000)

# Option 2: Start both servers together
npm run full:dev
```

3. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🌐 Production Deployment

### Option 1: Vercel + Railway/Render (Recommended)

#### Frontend Deployment (Vercel)

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel login
vercel
```

2. **Environment Variables (Vercel Dashboard)**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

3. **Deploy**
```bash
vercel --prod
```

#### Backend Deployment (Railway/Render)

1. **Railway Setup**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
```

2. **Environment Variables (Railway Dashboard)**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/datavine
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

3. **Deploy to Railway**
```bash
railway up
```

### Option 2: Docker Deployment

#### Create Dockerfile for Frontend
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

#### Create Dockerfile for Backend
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/datavine
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### Deploy with Docker
```bash
docker-compose up -d
```

### Option 3: AWS/Google Cloud/Azure

#### AWS Deployment (ECS + RDS)

1. **Create ECR Repositories**
```bash
aws ecr create-repository --repository-name datavine-frontend
aws ecr create-repository --repository-name datavine-backend
```

2. **Build and Push Images**
```bash
# Frontend
docker build -t datavine-frontend .
docker tag datavine-frontend:latest $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/datavine-frontend:latest
docker push $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/datavine-frontend:latest

# Backend
cd backend
docker build -t datavine-backend .
docker tag datavine-backend:latest $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/datavine-backend:latest
docker push $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/datavine-backend:latest
```

3. **Deploy to ECS**
- Create ECS clusters for frontend and backend
- Set up Application Load Balancer
- Configure environment variables
- Deploy services

## 🔧 Environment Configuration

### Frontend Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
NODE_ENV=production
```

### Backend Environment Variables
```env
# .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/datavine
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_api_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Cluster**
- Sign up at https://mongodb.com/atlas
- Create a new cluster
- Set up database access (username/password)
- Configure network access (IP whitelist)

2. **Get Connection String**
```
mongodb+srv://username:password@cluster.mongodb.net/datavine?retryWrites=true&w=majority
```

3. **Update Environment Variables**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/datavine
```

### Local MongoDB (Development)

```bash
# Install MongoDB
brew install mongodb-community  # macOS
sudo apt-get install mongodb   # Ubuntu

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Ubuntu
```

## 🔐 Security Configuration

### JWT Configuration
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### CORS Configuration
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # requests per window
```

## 📊 Monitoring and Logging

### Application Monitoring
- **Vercel Analytics**: Built-in for frontend
- **Railway Metrics**: Built-in for backend
- **Sentry**: Error tracking
- **LogRocket**: Session replay

### Health Checks
```bash
# Frontend health check
curl https://your-frontend-domain.com

# Backend health check
curl https://your-backend-domain.com/api/health
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - uses: railway/cli@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: datavine-backend
```

## 🚀 Performance Optimization

### Frontend Optimization
- Enable Next.js Image Optimization
- Implement proper caching headers
- Use CDN for static assets
- Enable compression

### Backend Optimization
- Enable gzip compression
- Implement proper caching
- Use connection pooling for database
- Monitor memory usage

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
```bash
# Check CORS configuration
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://your-backend-domain.com/api/auth/login
```

2. **Database Connection Issues**
```bash
# Test MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/datavine"
```

3. **JWT Token Issues**
```bash
# Verify JWT secret is set
echo $JWT_SECRET
```

### Logs and Debugging
```bash
# Frontend logs (Vercel)
vercel logs

# Backend logs (Railway)
railway logs

# Local development logs
npm run dev 2>&1 | tee frontend.log
cd backend && npm run dev 2>&1 | tee backend.log
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Implement session management
- Use Redis for caching
- Database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement proper indexing
- Use CDN for static assets

## 🔒 Security Best Practices

1. **Environment Variables**
- Never commit secrets to Git
- Use secure secret management
- Rotate keys regularly

2. **API Security**
- Implement rate limiting
- Use HTTPS everywhere
- Validate all inputs
- Implement proper authentication

3. **Database Security**
- Use connection strings with authentication
- Implement proper access controls
- Regular backups
- Monitor for suspicious activity

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review logs and error messages
3. Verify environment variables
4. Test endpoints individually
5. Contact support with specific error details

---

**DataVine.ai** - Scientifically validated cognitive assessments with AI-powered insights 