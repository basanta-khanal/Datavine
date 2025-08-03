# 🚀 DEPLOY DATAVINE.AI NOW - QUICK GUIDE

## **Step 1: Create GitHub Repository**
1. Go to: https://github.com/new
2. Repository name: `Datavine`
3. Description: `DataVine.ai - Cognitive Assessment Platform`
4. Make it Public
5. **Don't** initialize with README
6. Click "Create repository"

## **Step 2: Push Code to GitHub**
After creating the repository, run these commands in your terminal:

```bash
# Make sure you're in the project directory
cd "/Users/basantakhanal/Downloads/Datavine-main 2"

# Push your code
git push -u origin main
```

**If you get authentication errors:**
- Use your GitHub username and password
- Or create a Personal Access Token and use it as password

## **Step 3: Deploy Backend to Railway**
1. Go to: https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository: `Datavine`
6. Set Root Directory: `backend`
7. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=mongodb+srv://datavine_user:datavine_password_2025@your-cluster.mongodb.net/datavine?retryWrites=true&w=majority
   JWT_SECRET=datavine_production_jwt_secret_2025_secure_key
   JWT_EXPIRE=30d
   ```
8. Click "Deploy"
9. Copy the Railway URL

## **Step 4: Deploy Frontend to Vercel**
1. Go to: https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository: `Datavine`
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
   NEXT_PUBLIC_APP_NAME=DataVine.ai
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```
7. Click "Deploy"

## **Step 5: Set Up MongoDB Atlas**
1. Go to: https://www.mongodb.com/atlas
2. Click "Try Free" and sign up
3. Create project: "DataVine"
4. Build Database:
   - Choose "FREE" tier (M0)
   - Select any cloud provider
   - Choose region close to you
   - Click "Create"
5. Database Access:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `datavine_user`
   - Password: `datavine_password_2025`
   - Select "Read and write to any database"
   - Click "Add User"
6. Network Access:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
7. Get Connection String:
   - Go to "Database"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with: `datavine_password_2025`
8. Update Railway environment variable with your actual connection string

## **Step 6: Test Your Live Application**
Your application will be available at:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.railway.app
- **API Health:** https://your-backend.railway.app/api/health

## **Total Time: ~10 minutes!**

**Your DataVine.ai cognitive assessment platform will be live and ready for users!** 🎉 