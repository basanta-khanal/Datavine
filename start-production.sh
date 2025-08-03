#!/bin/bash

# DataVine.ai Production Startup Script
# This script sets up and starts the DataVine.ai application in production mode

set -e

echo "🚀 Starting DataVine.ai Production Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm 8+ first."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing frontend dependencies..."
    npm ci --only=production
    
    print_status "Installing backend dependencies..."
    cd backend
    npm ci --only=production
    cd ..
    
    print_success "Dependencies installed successfully"
}

# Build frontend
build_frontend() {
    print_status "Building frontend application..."
    npm run build
    print_success "Frontend built successfully"
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    # Check frontend environment
    if [ -z "$NEXT_PUBLIC_API_URL" ]; then
        print_warning "NEXT_PUBLIC_API_URL is not set. Using default: http://localhost:5000/api"
        export NEXT_PUBLIC_API_URL="http://localhost:5000/api"
    fi
    
    # Check backend environment
    if [ -z "$JWT_SECRET" ]; then
        print_warning "JWT_SECRET is not set. Using default development secret."
        export JWT_SECRET="dev_secret_key_change_in_production"
    fi
    
    if [ -z "$NODE_ENV" ]; then
        export NODE_ENV="production"
    fi
    
    print_success "Environment variables configured"
}

# Start services
start_services() {
    print_status "Starting DataVine.ai services..."
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    nohup npm start > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    sleep 5
    
    # Check if backend is running
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "Backend is running on http://localhost:5000"
    else
        print_error "Backend failed to start. Check backend.log for details."
        exit 1
    fi
    
    # Start frontend
    print_status "Starting frontend server..."
    nohup npm start > frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    print_status "Waiting for frontend to start..."
    sleep 10
    
    # Check if frontend is running
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is running on http://localhost:3000"
    else
        print_error "Frontend failed to start. Check frontend.log for details."
        exit 1
    fi
    
    # Save PIDs for later cleanup
    echo $BACKEND_PID > backend.pid
    echo $FRONTEND_PID > frontend.pid
    
    print_success "DataVine.ai is now running!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000/api"
    echo "📊 Health Check: http://localhost:5000/api/health"
    echo ""
    echo "📝 Logs:"
    echo "   Frontend: tail -f frontend.log"
    echo "   Backend:  tail -f backend.log"
    echo ""
    echo "🛑 To stop services: ./stop-production.sh"
}

# Main execution
main() {
    echo "=========================================="
    echo "   DataVine.ai Production Startup"
    echo "=========================================="
    echo ""
    
    check_node
    check_npm
    check_env
    install_dependencies
    build_frontend
    start_services
    
    echo ""
    echo "🎉 DataVine.ai is ready for production!"
    echo "=========================================="
}

# Run main function
main "$@" 