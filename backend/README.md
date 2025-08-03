# DataVine.ai Backend

A comprehensive backend API for the DataVine.ai cognitive assessment platform, featuring AI-powered recommendations, payment processing, and user management.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **AI Integration**: OpenAI-powered personalized improvement recommendations
- **Payment Processing**: Stripe integration with Apple Pay and credit card support
- **User Management**: Complete user profile and preference management
- **Assessment Tracking**: Comprehensive assessment history and analytics
- **File Upload**: Cloudinary integration for profile picture uploads
- **Security**: Rate limiting, CORS, helmet, and input validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key
- Stripe account and API keys
- Cloudinary account (for image uploads)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   - MongoDB connection string
   - JWT secret key
   - OpenAI API key
   - Stripe API keys
   - Cloudinary credentials

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "gender": "male"
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/logout`
Logout user (requires authentication).

#### GET `/api/auth/me`
Get current user profile (requires authentication).

### User Management Endpoints

#### GET `/api/users/profile`
Get user profile (requires authentication).

#### PUT `/api/users/profile`
Update user profile (requires authentication).

#### POST `/api/users/upload-profile-picture`
Upload profile picture (requires authentication).

#### GET `/api/users/dashboard`
Get user dashboard data (requires authentication).

### Assessment Endpoints

#### POST `/api/assessments/save-result`
Save assessment result (requires authentication).

**Request Body:**
```json
{
  "testType": "iq",
  "score": 85,
  "maxScore": 100,
  "answers": [
    {
      "questionId": 1,
      "selectedAnswer": "A",
      "isCorrect": true,
      "timeSpent": 30
    }
  ],
  "detailedResults": {}
}
```

#### GET `/api/assessments/history`
Get assessment history (requires authentication).

#### GET `/api/assessments/stats/overview`
Get assessment statistics (requires authentication).

### AI Endpoints

#### POST `/api/ai/generate-recommendations`
Generate AI-powered recommendations (requires basic subscription).

**Request Body:**
```json
{
  "assessmentId": "assessment_id",
  "testType": "iq",
  "score": 85,
  "answers": [],
  "detailedResults": {}
}
```

#### POST `/api/ai/analyze-patterns`
Analyze performance patterns (requires premium subscription).

### Payment Endpoints

#### POST `/api/payments/create-payment-intent`
Create payment intent for subscription (requires authentication).

**Request Body:**
```json
{
  "subscriptionType": "basic",
  "paymentMethod": "card"
}
```

#### POST `/api/payments/confirm-subscription`
Confirm subscription after payment (requires authentication).

#### GET `/api/payments/subscription-status`
Get subscription status (requires authentication).

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware
- **Role-based Access**: Different access levels for users

## 💳 Payment Integration

### Supported Payment Methods
- Credit/Debit Cards
- Apple Pay
- Google Pay (via Stripe)

### Subscription Plans
- **Basic**: $9.99/month - Detailed results, AI recommendations
- **Premium**: $19.99/month - Pattern analysis, priority support
- **Enterprise**: $49.99/month - Team management, API access

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

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  profilePicture: String,
  phone: String,
  dateOfBirth: Date,
  gender: String,
  subscription: {
    type: String,
    status: String,
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  assessmentHistory: [{
    testType: String,
    score: Number,
    maxScore: Number,
    percentage: Number,
    answers: Array,
    completedAt: Date,
    detailedResults: Object,
    aiRecommendations: Object
  }],
  preferences: Object,
  isEmailVerified: Boolean,
  lastLogin: Date,
  isActive: Boolean,
  role: String
}
```

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use production MongoDB URI
   - Configure production Stripe keys
   - Set secure JWT secret

2. **Database**
   - Use MongoDB Atlas or production MongoDB instance
   - Set up proper indexes for performance

3. **Security**
   - Enable HTTPS
   - Configure CORS for production domain
   - Set up proper rate limiting
   - Use environment-specific secrets

4. **Monitoring**
   - Set up logging (Winston/Morgan)
   - Configure error tracking (Sentry)
   - Set up health checks

## 🔧 Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Seeding
```bash
npm run seed
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: support@datavine.ai
- Documentation: https://docs.datavine.ai
- Issues: GitHub Issues 