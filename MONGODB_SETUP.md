# 🗄️ MongoDB Setup Guide for DataVine.ai

## 🎯 **Recommended: MongoDB Atlas (Cloud Database)**

### **Step 1: Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project called "DataVine"

### **Step 2: Create Database Cluster**
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to your users
5. Click "Create"

### **Step 3: Set Up Database Access**
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Select "Read and write to any database"
5. Click "Add User"

### **Step 4: Set Up Network Access**
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's IP address
5. Click "Confirm"

### **Step 5: Get Connection String**
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

### **Step 6: Configure Environment Variables**
Create a `.env` file in your backend directory:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/datavine?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Server Configuration
PORT=5001
NODE_ENV=development

# Optional: Other services
OPENAI_API_KEY=your_openai_key_here
STRIPE_SECRET_KEY=your_stripe_key_here
CLOUDINARY_URL=your_cloudinary_url_here
```

## 🔧 **Local MongoDB Setup (Alternative)**

### **Install MongoDB Locally**

#### **macOS (using Homebrew):**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify installation
mongosh
```

#### **Ubuntu/Debian:**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongosh
```

#### **Windows:**
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Install MongoDB Compass (GUI tool)
4. Start MongoDB service

### **Local Connection String**
For local MongoDB, use this connection string:
```
MONGODB_URI=mongodb://localhost:27017/datavine
```

## 🚀 **Quick Setup Commands**

### **1. Fix Port Issue First**
```bash
# Kill any existing processes on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use the updated port 5001
export PORT=5001
```

### **2. Set Up Environment Variables**
```bash
# Create .env file in backend directory
cd backend
cp env.example .env

# Edit .env file with your MongoDB connection string
nano .env
```

### **3. Test MongoDB Connection**
```bash
# Test connection
curl -s http://localhost:5001/api/health
```

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **1. Port Already in Use**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
export PORT=5001
```

#### **2. MongoDB Connection Failed**
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Check connection string format
# Should be: mongodb+srv://username:password@cluster.mongodb.net/database
```

#### **3. Authentication Failed**
- Verify username and password in connection string
- Check if IP address is whitelisted in Atlas
- Ensure database user has correct permissions

#### **4. Network Issues**
```bash
# Test network connectivity
ping cluster0.xxxxx.mongodb.net

# Check firewall settings
sudo ufw status
```

## 📊 **Database Schema**

Your application will automatically create these collections:

### **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  profilePicture: String,
  isSubscribed: Boolean,
  subscription: {
    type: String,
    status: String,
    startDate: Date,
    endDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Assessments Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  testType: String, // 'iq', 'adhd', 'asd', 'anxiety'
  score: Number,
  maxScore: Number,
  percentage: Number,
  answers: Array,
  detailedResults: Object,
  aiRecommendations: Object,
  completedAt: Date
}
```

## 🎯 **Next Steps**

1. **Choose your MongoDB setup** (Atlas recommended)
2. **Set up environment variables**
3. **Test the connection**
4. **Deploy your application**

## 📞 **Support**

- **MongoDB Atlas Documentation:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **MongoDB Community:** [community.mongodb.com](https://community.mongodb.com)
- **MongoDB University:** [university.mongodb.com](https://university.mongodb.com)

---

**Note:** For production deployment, always use MongoDB Atlas or a managed MongoDB service for reliability and security. 