#!/bin/bash

# DataVine.ai Production Stop Script
# This script gracefully stops the DataVine.ai application

set -e

echo "🛑 Stopping DataVine.ai Production Services..."

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

# Stop frontend
stop_frontend() {
    if [ -f frontend.pid ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            print_status "Stopping frontend server (PID: $FRONTEND_PID)..."
            kill $FRONTEND_PID
            sleep 2
            
            # Force kill if still running
            if kill -0 $FRONTEND_PID 2>/dev/null; then
                print_warning "Frontend not responding, force killing..."
                kill -9 $FRONTEND_PID
            fi
            
            print_success "Frontend stopped"
        else
            print_warning "Frontend process not running"
        fi
        rm -f frontend.pid
    else
        print_warning "Frontend PID file not found"
    fi
}

# Stop backend
stop_backend() {
    if [ -f backend.pid ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_status "Stopping backend server (PID: $BACKEND_PID)..."
            kill $BACKEND_PID
            sleep 2
            
            # Force kill if still running
            if kill -0 $BACKEND_PID 2>/dev/null; then
                print_warning "Backend not responding, force killing..."
                kill -9 $BACKEND_PID
            fi
            
            print_success "Backend stopped"
        else
            print_warning "Backend process not running"
        fi
        rm -f backend.pid
    else
        print_warning "Backend PID file not found"
    fi
}

# Kill any remaining processes
kill_remaining() {
    print_status "Checking for remaining DataVine processes..."
    
    # Kill any remaining Node.js processes on our ports
    PIDS=$(lsof -ti:3000,5000 2>/dev/null || true)
    if [ ! -z "$PIDS" ]; then
        print_warning "Found remaining processes on ports 3000/5000, killing them..."
        echo $PIDS | xargs kill -9 2>/dev/null || true
        print_success "Remaining processes killed"
    fi
}

# Clean up log files
cleanup_logs() {
    print_status "Cleaning up log files..."
    
    if [ -f frontend.log ]; then
        mv frontend.log frontend.log.$(date +%Y%m%d_%H%M%S)
        print_success "Frontend log archived"
    fi
    
    if [ -f backend.log ]; then
        mv backend.log backend.log.$(date +%Y%m%d_%H%M%S)
        print_success "Backend log archived"
    fi
}

# Main execution
main() {
    echo "=========================================="
    echo "   DataVine.ai Production Stop"
    echo "=========================================="
    echo ""
    
    stop_frontend
    stop_backend
    kill_remaining
    cleanup_logs
    
    print_success "All DataVine.ai services stopped"
    echo ""
    echo "📝 Archived logs:"
    echo "   Frontend: frontend.log.$(date +%Y%m%d_%H%M%S)"
    echo "   Backend:  backend.log.$(date +%Y%m%d_%H%M%S)"
    echo ""
    echo "🚀 To restart: ./start-production.sh"
    echo "=========================================="
}

# Run main function
main "$@" 