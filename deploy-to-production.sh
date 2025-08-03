#!/bin/bash

# DataVine.ai Production Deployment Script
# This script will deploy your application to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
APP_NAME="datavine-ai"
FRONTEND_PORT=3000
BACKEND_PORT=5001
MONGODB_URI="mongodb+srv://datavine_user:datavine_password_2025@datavine-cluster.xxxxx.mongodb.net/datavine?retryWrites=true&w=majority"

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check MongoDB (local fallback)
    if ! command -v mongosh &> /dev/null; then
        log_warning "MongoDB is not installed locally. Will use Atlas only."
    fi
    
    log_success "Dependencies check passed"
}

# Kill existing processes
kill_existing_processes() {
    log_info "Killing existing processes..."
    
    # Kill processes on frontend port
    if lsof -i :$FRONTEND_PORT > /dev/null 2>&1; then
        lsof -i :$FRONTEND_PORT | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
        log_info "Killed processes on port $FRONTEND_PORT"
    fi
    
    # Kill processes on backend port
    if lsof -i :$BACKEND_PORT > /dev/null 2>&1; then
        lsof -i :$BACKEND_PORT | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
        log_info "Killed processes on port $BACKEND_PORT"
    fi
    
    # Kill any existing node processes
    pkill -f "node server.js" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "nodemon" 2>/dev/null || true
    
    sleep 2
    log_success "Process cleanup completed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Install frontend dependencies
    log_info "Installing frontend dependencies..."
    npm install
    
    # Install backend dependencies
    log_info "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    log_success "Dependencies installed successfully"
}

# Build frontend
build_frontend() {
    log_info "Building frontend for production..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Build the application
    npm run build
    
    log_success "Frontend built successfully"
}

# Start MongoDB (local fallback)
start_mongodb() {
    log_info "Starting MongoDB..."
    
    if command -v brew &> /dev/null; then
        # macOS with Homebrew
        brew services start mongodb/brew/mongodb-community 2>/dev/null || log_warning "MongoDB service already running or not available"
    elif command -v systemctl &> /dev/null; then
        # Linux with systemctl
        sudo systemctl start mongod 2>/dev/null || log_warning "MongoDB service already running or not available"
    else
        log_warning "Could not start MongoDB service automatically"
    fi
    
    # Wait for MongoDB to start
    sleep 3
    
    # Test MongoDB connection
    if mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
        log_success "MongoDB is running locally"
    else
        log_warning "Local MongoDB not available, will use Atlas"
    fi
}

# Start backend server
start_backend() {
    log_info "Starting backend server..."
    
    cd backend
    
    # Create production environment file
    cat > .env << EOF
# MongoDB Atlas Configuration
MONGODB_URI=$MONGODB_URI

# JWT Configuration
JWT_SECRET=datavine_production_jwt_secret_$(openssl rand -hex 16)
JWT_EXPIRE=30d

# Server Configuration
PORT=$BACKEND_PORT
NODE_ENV=production

# Frontend URL
FRONTEND_URL=http://localhost:$FRONTEND_PORT

# Security
HELMET_ENABLED=true
RATE_LIMIT_ENABLED=true
CORS_ENABLED=true
EOF
    
    # Start backend in background
    PORT=$BACKEND_PORT npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Test backend health
    if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null; then
        log_success "Backend server started successfully"
    else
        log_error "Backend server failed to start"
        exit 1
    fi
}

# Start frontend server
start_frontend() {
    log_info "Starting frontend server..."
    
    # Start frontend in background
    PORT=$FRONTEND_PORT npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    sleep 10
    
    # Test frontend health
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null; then
        log_success "Frontend server started successfully"
    else
        log_error "Frontend server failed to start"
        exit 1
    fi
}

# Run tests
run_tests() {
    log_info "Running production tests..."
    
    # Wait for both servers to be ready
    sleep 5
    
    # Run test suite
    if node quick-test.js; then
        log_success "All tests passed"
    else
        log_error "Some tests failed"
        exit 1
    fi
}

# Display status
show_status() {
    log_info "Application Status:"
    echo "=================="
    
    # Backend status
    if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null; then
        echo -e "${GREEN}✓ Backend:${NC} Running on http://localhost:$BACKEND_PORT"
    else
        echo -e "${RED}✗ Backend:${NC} Not responding"
    fi
    
    # Frontend status
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null; then
        echo -e "${GREEN}✓ Frontend:${NC} Running on http://localhost:$FRONTEND_PORT"
    else
        echo -e "${RED}✗ Frontend:${NC} Not responding"
    fi
    
    # MongoDB status
    if mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ MongoDB:${NC} Local instance running"
    else
        echo -e "${YELLOW}⚠ MongoDB:${NC} Using Atlas (remote)"
    fi
    
    echo ""
    log_success "DataVine.ai is now running in production mode!"
    echo ""
    echo "Access your application at: http://localhost:$FRONTEND_PORT"
    echo "Backend API at: http://localhost:$BACKEND_PORT"
    echo ""
    echo "Logs:"
    echo "  Frontend: tail -f frontend.log"
    echo "  Backend:  tail -f backend.log"
    echo ""
    echo "To stop the application: ./stop-production.sh"
}

# Main deployment function
deploy() {
    log_info "Starting DataVine.ai production deployment..."
    echo "================================================"
    
    check_dependencies
    kill_existing_processes
    install_dependencies
    build_frontend
    start_mongodb
    start_backend
    start_frontend
    run_tests
    show_status
    
    log_success "Deployment completed successfully!"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "stop")
        log_info "Stopping DataVine.ai..."
        pkill -f "node server.js" 2>/dev/null || true
        pkill -f "next dev" 2>/dev/null || true
        pkill -f "nodemon" 2>/dev/null || true
        log_success "Application stopped"
        ;;
    "restart")
        log_info "Restarting DataVine.ai..."
        $0 stop
        sleep 2
        $0 deploy
        ;;
    "status")
        show_status
        ;;
    "logs")
        log_info "Showing logs..."
        echo "Frontend logs:"
        tail -f frontend.log &
        echo "Backend logs:"
        tail -f backend.log &
        ;;
    *)
        echo "Usage: $0 {deploy|stop|restart|status|logs}"
        echo "  deploy  - Deploy the application (default)"
        echo "  stop    - Stop the application"
        echo "  restart - Restart the application"
        echo "  status  - Show application status"
        echo "  logs    - Show application logs"
        exit 1
        ;;
esac 