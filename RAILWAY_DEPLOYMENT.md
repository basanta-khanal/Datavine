# Railway Deployment Guide for DataVine.ai Backend

## Quick Deploy to Railway

### Step 1: Prepare Your Repository
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### Step 2: Deploy to Railway

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `Datavine` repository

3. **Configure Backend Directory**
   - Set **Root Directory** to: `backend`
   - Railway will automatically detect it's a Node.js app

4. **Set Environment Variables**
   Add these in Railway dashboard → Variables tab:
   ```
   PORT=5001
   JWT_SECRET=your-super-secret-jwt-key-here
   MONGODB_URI=your-mongodb-atlas-connection-string
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy Now"
   - Railway will build and deploy your backend

### Step 3: Get Your Backend URL
- Go to your project in Railway
- Click on the deployed service
- Copy the **Domain** (e.g., `https://your-app-name.railway.app`)

### Step 4: Update Frontend API URL
Update `lib/api.ts` in your frontend:
```typescript
const API_BASE_URL = 'https://your-app-name.railway.app/api';
```

### Step 5: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set **Root Directory** to: `./` (root)
4. Deploy

## Environment Variables Setup

### Required Variables:
```
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/datavine
NODE_ENV=production
```

### Optional Variables (for full functionality):
```
OPENAI_API_KEY=sk-your-openai-api-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## MongoDB Atlas Setup (if needed)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Choose "Shared" → "M0 Free"
   - Select region close to your users

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Add to Railway**
   - Paste the connection string as `MONGODB_URI` variable

## Railway Configuration

### Build Command (auto-detected):
```bash
npm install
```

### Start Command (auto-detected):
```bash
npm start
```

### Health Check:
Railway will automatically check: `https://your-app-name.railway.app/api/health`

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Railway logs for errors
   - Ensure all dependencies are in `package.json`

2. **Port Issues**
   - Railway automatically sets `PORT` environment variable
   - Your app uses `process.env.PORT || 5001`

3. **Database Connection**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Railway)

4. **Environment Variables**
   - All variables must be set in Railway dashboard
   - No `.env` files in production

## Monitoring & Logs

- **View Logs**: Railway dashboard → Deployments → View logs
- **Monitor**: Railway provides basic monitoring
- **Scaling**: Upgrade plan for more resources

## Cost
- **Free Tier**: $5/month credit
- **Hobby Plan**: $5/month for 512MB RAM, 0.5 CPU
- **Pro Plan**: $20/month for 1GB RAM, 1 CPU

## Next Steps After Deployment

1. **Test Your API**
   ```bash
   curl https://your-app-name.railway.app/api/health
   ```

2. **Update Frontend**
   - Deploy frontend to Vercel
   - Update API URL in `lib/api.ts`

3. **Set Up Custom Domain** (optional)
   - Railway dashboard → Settings → Domains
   - Add your custom domain

4. **Monitor Performance**
   - Check Railway metrics
   - Set up alerts if needed

## Quick Commands

```bash
# Check if backend is running
curl https://your-app-name.railway.app/api/health

# Test registration
curl -X POST https://your-app-name.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST https://your-app-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Your DataVine.ai backend will be live in minutes! 🚀 