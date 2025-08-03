#!/bin/bash

echo "🚀 DataVine.ai Deployment Script"
echo "================================"

# Check if git is configured
if ! git config --global user.name > /dev/null 2>&1; then
    echo "❌ Git not configured. Please run:"
    echo "git config --global user.name 'Your Name'"
    echo "git config --global user.email 'your.email@example.com'"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Add all changes
echo "📦 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Ready for production deployment - $(date)"

# Try to push to GitHub
echo "🚀 Pushing to GitHub..."
if git push -u origin main; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next Steps:"
    echo "1. Go to https://railway.app/dashboard"
    echo "2. Create new project → Deploy from GitHub repo"
    echo "3. Select your Datavine repository"
    echo "4. Set Root Directory to: backend"
    echo "5. Add environment variables:"
    echo "   - PORT=5001"
    echo "   - JWT_SECRET=your-secret-key"
    echo "   - NODE_ENV=production"
    echo "6. Click Deploy"
    echo ""
    echo "7. Go to https://vercel.com"
    echo "8. Import your GitHub repository"
    echo "9. Deploy frontend"
    echo ""
    echo "Your DataVine.ai will be live in minutes! 🚀"
else
    echo "❌ Failed to push to GitHub"
    echo "Please check your GitHub authentication and repository permissions"
    echo "You may need to:"
    echo "1. Create the repository at https://github.com/basanta-khanal/Datavine"
    echo "2. Authenticate with: gh auth login --web"
    echo "3. Try again"
fi 