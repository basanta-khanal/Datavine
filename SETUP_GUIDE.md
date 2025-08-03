# 🚀 DataVine.ai Full-Stack Setup Guide

Complete setup guide for the DataVine.ai cognitive assessment platform with backend API, AI integration, and payment processing.

## 📋 Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm
- MongoDB (local or cloud)
- OpenAI API key
- Stripe account and API keys
- Cloudinary account (for image uploads)

## 🏗️ Project Structure

```
Datavine-main 2/
├── app/                    # Next.js frontend
├── components/             # React components
├── lib/                    # Utilities and API client
├── backend/                # Express.js backend
│   ├── config/            # Database configuration
│   ├── middleware/        # Authentication middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Main server file
└── SETUP_GUIDE.md         # This file
```

## 🔧 Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/datavine
# For production: mongodb+srv://username:password@cluster.mongodb.net/datavine

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Stripe Price IDs (create these in your Stripe dashboard)
STRIPE_BASIC_PRICE_ID=price_basic_plan_id
STRIPE_PREMIUM_PRICE_ID=price_premium_plan_id
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_plan_id

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Install Frontend Dependencies

```bash
# From project root
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 3. Start Frontend Development Server

```bash
pnpm dev
```

The frontend will run on `http://localhost:3000`

## 🔑 API Key Setup

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your backend `.env` file

### Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or sign in
3. Navigate to Developers > API Keys
4. Copy your publishable key and secret key
5. Add them to your environment files

### Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create an account
3. Get your cloud name, API key, and API secret
4. Add them to your backend `.env` file

## 🗄️ Database Setup

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Create a database named `datavine`

### MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGODB_URI` in your backend `.env` file

## 💳 Payment Setup

### Stripe Products and Prices

1. In your Stripe Dashboard, create three products:
   - **Basic Plan** ($9.99/month)
   - **Premium Plan** ($19.99/month)
   - **Enterprise Plan** ($49.99/month)

2. For each product, create a recurring price

3. Copy the price IDs and add them to your backend `.env` file

### Webhook Setup

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `http://localhost:5000/api/payments/webhook`
3. Select events:
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy the webhook secret and add it to your backend `.env` file

## 🚀 Running the Application

### Development Mode

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   # In a new terminal
   pnpm dev
   ```

3. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

### Production Mode

1. **Build Frontend:**
   ```bash
   pnpm build
   pnpm start
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-profile-picture` - Upload profile picture
- `GET /api/users/dashboard` - Get dashboard data

### Assessments
- `POST /api/assessments/save-result` - Save assessment result
- `GET /api/assessments/history` - Get assessment history
- `GET /api/assessments/stats/overview` - Get statistics

### AI Features
- `POST /api/ai/generate-recommendations` - Generate AI recommendations
- `GET /api/ai/recommendations/:id` - Get recommendations
- `POST /api/ai/analyze-patterns` - Analyze performance patterns

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-subscription` - Confirm subscription
- `GET /api/payments/subscription-status` - Get subscription status

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware

## 🤖 AI Features

### OpenAI Integration
- Personalized improvement recommendations
- Performance pattern analysis
- Cognitive assessment insights
- Educational content suggestions

### AI Capabilities
- **Performance Analysis**: Detailed analysis of test results
- **Strengths Identification**: Identify strong cognitive areas
- **Improvement Areas**: Highlight areas for development
- **Actionable Recommendations**: Specific steps for improvement
- **Resource Suggestions**: Tools, apps, and exercises
- **Progress Tracking**: Monitor improvement over time

## 💳 Payment Features

### Supported Payment Methods
- Credit/Debit Cards
- Apple Pay
- Google Pay (via Stripe)

### Subscription Plans
- **Basic**: $9.99/month - Detailed results, AI recommendations
- **Premium**: $19.99/month - Pattern analysis, priority support
- **Enterprise**: $49.99/month - Team management, API access

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
pnpm test
```

## 📊 Monitoring

### Health Check
- Backend: `GET http://localhost:5000/api/health`
- Returns server status and version information

### Logs
- Backend logs are displayed in the terminal
- Frontend logs are in the browser console

## 🚨 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check if MongoDB is running
   - Verify environment variables are set correctly
   - Check if port 5000 is available

2. **Frontend can't connect to backend:**
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API URL in frontend environment

3. **Payment issues:**
   - Verify Stripe API keys are correct
   - Check webhook configuration
   - Ensure price IDs are valid

4. **AI features not working:**
   - Verify OpenAI API key is valid
   - Check API quota and billing
   - Ensure subscription level is sufficient

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=*
```

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review the API documentation
- Check server logs for error messages
- Verify all environment variables are set correctly

## 🔄 Updates

To update the application:

1. **Backend:**
   ```bash
   cd backend
   npm update
   ```

2. **Frontend:**
   ```bash
   pnpm update
   ```

3. **Database migrations** (if any):
   ```bash
   cd backend
   npm run migrate
   ```

## 🎉 Success!

Once everything is set up correctly, you should have:

✅ **Backend API** running on port 5000  
✅ **Frontend Application** running on port 3000  
✅ **Database** connected and working  
✅ **AI Integration** with OpenAI  
✅ **Payment Processing** with Stripe  
✅ **File Upload** with Cloudinary  
✅ **Authentication** system working  
✅ **Assessment Tracking** functional  

Your DataVine.ai cognitive assessment platform is now ready to use! 🚀 