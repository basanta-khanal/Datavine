#!/bin/bash

echo "🚀 Datavibe Local Development Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ Node.js and pnpm are available"

# Check if MongoDB is running (optional)
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. You can:"
    echo "   1. Install MongoDB locally and start it"
    echo "   2. Use MongoDB Atlas (cloud)"
    echo "   3. Continue without MongoDB (backend will show connection errors)"
    echo ""
    read -p "Do you want to continue without MongoDB? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please start MongoDB and run this script again."
        exit 1
    fi
else
    echo "✅ MongoDB is running"
fi

echo ""
echo "🔧 Setting up environment variables..."

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from template..."
    cp backend/env.example backend/.env
    echo "✅ Backend environment file created"
    echo "⚠️  Please edit backend/.env with your API keys:"
    echo "   - OPENAI_API_KEY (optional for development)"
    echo "   - STRIPE_SECRET_KEY (optional for development)"
    echo "   - CLOUDINARY_* (optional for development)"
else
    echo "✅ Backend environment file exists"
fi

# Create frontend .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local for frontend..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Configuration (optional for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
EOF
    echo "✅ Frontend environment file created"
else
    echo "✅ Frontend environment file exists"
fi

echo ""
echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
pnpm install

echo ""
echo "🚀 Starting servers..."

# Start backend in background
echo "Starting backend server on port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server on port 3000..."
pnpm dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers are starting..."
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "   Health Check: http://localhost:5000/api/health"
echo ""
echo "📚 Next steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Test the application features"
echo "   3. To enable AI features, add OPENAI_API_KEY to backend/.env"
echo "   4. To enable payments, add Stripe keys to environment files"
echo ""
echo "🛑 To stop servers, press Ctrl+C"

# Wait for user to stop
wait 