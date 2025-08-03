# DataVine.ai - Cognitive Assessment Platform

> Scientifically validated cognitive assessments with AI-powered insights

![DataVine.ai](https://img.shields.io/badge/DataVine-AI%20Powered%20Assessments-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🚀 Features

### 📊 Cognitive Assessments
- **IQ Assessment**: 30 comprehensive questions testing logical reasoning, pattern recognition, and spatial intelligence
- **ADHD Assessment**: Evaluates attention, hyperactivity, and impulsivity symptoms
- **ASD Assessment**: Assesses social communication and behavioral patterns
- **Anxiety Assessment**: Evaluates anxiety levels and related symptoms

### 🤖 AI-Powered Insights
- Personalized performance analysis
- Actionable improvement recommendations
- Pattern recognition across assessments
- Progress tracking and trends

### 👤 User Management
- Secure authentication system
- Profile management with picture upload
- Assessment history and statistics
- Subscription management

### 💳 Payment Integration
- Stripe payment processing
- Multiple subscription tiers
- Apple Pay and credit card support
- Secure payment handling

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5.4.2** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Stripe** - Payment processing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with in-memory fallback)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **OpenAI API** - AI recommendations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Git

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd datavine-ai
```

2. **Install dependencies**
```bash
npm install
cd backend && npm install && cd ..
```

3. **Start development servers**
```bash
# Start both servers together
npm run full:dev

# Or start separately
npm run dev          # Frontend (port 3000)
npm run backend:dev  # Backend (port 5000)
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Production Deployment

1. **Quick Production Start**
```bash
./start-production.sh
```

2. **Stop Production Services**
```bash
./stop-production.sh
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📁 Project Structure

```
datavine-ai/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── ...                # Other pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── user-profile-dropdown.tsx
│   └── payment-form.tsx
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Utility functions
├── backend/              # Backend server
│   ├── server.js        # Main server file
│   ├── routes/          # API routes
│   ├── models/          # Database models
│   ├── middleware/      # Express middleware
│   └── config/          # Configuration files
├── public/              # Static assets
├── start-production.sh  # Production startup script
├── stop-production.sh   # Production stop script
└── DEPLOYMENT_GUIDE.md  # Deployment instructions
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/datavine
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=sk_test_your_key
CORS_ORIGIN=http://localhost:3000
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-profile-picture` - Upload profile picture

### Assessments
- `POST /api/assessments/save` - Save assessment result
- `GET /api/assessments/history` - Get assessment history
- `GET /api/assessments/stats` - Get assessment statistics

### AI Features
- `POST /api/ai/generate-recommendations` - Generate AI recommendations
- `GET /api/ai/recommendations/:id` - Get recommendations for assessment
- `POST /api/ai/analyze-patterns` - Analyze performance patterns

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-subscription` - Confirm subscription
- `GET /api/payments/subscription-status` - Get subscription status
- `POST /api/payments/cancel-subscription` - Cancel subscription

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Register a new user
   - Login with credentials
   - Test logout functionality

2. **Assessment Flow**
   - Start an IQ assessment
   - Answer questions
   - View results and recommendations

3. **Profile Management**
   - Update profile information
   - Upload profile picture
   - View assessment history

### API Testing
```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **CORS Protection** - Configured for specific origins
- **Rate Limiting** - API rate limiting to prevent abuse
- **Input Validation** - Comprehensive request validation
- **HTTPS Ready** - Configured for production HTTPS

## 📈 Performance

### Frontend Optimizations
- Next.js App Router for optimal routing
- Image optimization with Next.js
- Code splitting and lazy loading
- Responsive design for all devices

### Backend Optimizations
- Gzip compression enabled
- Efficient database queries
- Connection pooling (when using MongoDB)
- Memory-efficient in-memory storage for development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
1. Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review the troubleshooting section
3. Open an issue on GitHub

## 🎯 Roadmap

- [ ] Real-time assessment collaboration
- [ ] Advanced AI pattern analysis
- [ ] Mobile app development
- [ ] Enterprise features
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**DataVine.ai** - Empowering cognitive assessment with AI-driven insights

*Built with ❤️ using Next.js, React, and Node.js*
