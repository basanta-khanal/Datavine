# 🐘 PostgreSQL Setup Guide

## 📋 **Prerequisites**

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE datavine;
   
   # Create user (optional)
   CREATE USER datavine_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE datavine TO datavine_user;
   
   # Exit
   \q
   ```

## 🔧 **Configuration**

### **Local Development**

Create a `.env` file in the `backend` directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/datavine

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
PORT=5001
NODE_ENV=development
```

### **Railway Production**

1. **Add PostgreSQL to Railway**:
   - Go to your Railway dashboard
   - Click "New Service" → "Database" → "PostgreSQL"
   - Railway will provide the connection string

2. **Set Environment Variables in Railway**:
   ```bash
   DATABASE_URL=postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway
   JWT_SECRET=your_production_jwt_secret
   JWT_EXPIRE=30d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NODE_ENV=production
   ```

## 🚀 **Setup Commands**

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Create Database Tables**
```bash
# Run the setup script
node setup-postgres.js
```

### **3. Verify Setup**
```bash
# Check if tables were created
psql -U postgres -d datavine -c "\dt"
```

## 📊 **Database Schema**

### **Users Table**
```sql
CREATE TABLE "Users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255),
  "googleId" VARCHAR(255) UNIQUE,
  "profilePicture" VARCHAR(255),
  "phone" VARCHAR(255),
  "gender" ENUM('male', 'female', 'other', 'prefer_not_to_say'),
  "dateOfBirth" DATE,
  "isSubscribed" BOOLEAN DEFAULT false,
  "subscriptionType" ENUM('free', 'basic', 'premium', 'enterprise') DEFAULT 'free',
  "subscriptionStartDate" TIMESTAMP,
  "subscriptionEndDate" TIMESTAMP,
  "usedCoupon" BOOLEAN DEFAULT false,
  "hasPaid" BOOLEAN DEFAULT false,
  "lastLoginAt" TIMESTAMP,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Assessments Table**
```sql
CREATE TABLE "Assessments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES "Users"("id") ON DELETE CASCADE,
  "testType" ENUM('iq', 'adhd', 'asd', 'anxiety') NOT NULL,
  "score" INTEGER NOT NULL,
  "maxScore" INTEGER NOT NULL,
  "percentage" DECIMAL(5,2) NOT NULL,
  "answers" JSONB NOT NULL DEFAULT '[]',
  "detailedResults" JSONB,
  "aiRecommendations" JSONB,
  "timeSpent" INTEGER,
  "isCompleted" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Indexes**
```sql
CREATE INDEX idx_users_email ON "Users" (email);
CREATE INDEX idx_users_google_id ON "Users" ("googleId");
CREATE INDEX idx_assessments_user_id ON "Assessments" ("userId");
CREATE INDEX idx_assessments_test_type ON "Assessments" ("testType");
CREATE INDEX idx_assessments_created_at ON "Assessments" ("createdAt");
```

## 🔍 **Troubleshooting**

### **Connection Issues**
```bash
# Test PostgreSQL connection
psql -U postgres -d datavine -c "SELECT version();"

# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Ubuntu
sudo systemctl status postgresql
```

### **Permission Issues**
```bash
# Grant permissions
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE datavine TO your_username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
```

### **Reset Database**
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS datavine;"
psql -U postgres -c "CREATE DATABASE datavine;"

# Run setup again
node setup-postgres.js
```

## 🎯 **Next Steps**

1. **Set up your environment variables**
2. **Run the setup script**: `node setup-postgres.js`
3. **Test the connection**: Start your backend server
4. **Deploy to Railway**: Push your changes and Railway will use the PostgreSQL database

## 📝 **Environment Variables Summary**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `JWT_EXPIRE` | JWT token expiration | `30d` |
| `EMAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_USER` | Email username | `your_email@gmail.com` |
| `EMAIL_PASS` | Email password/app password | `your_app_password` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `your_client_id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your_client_secret` |
| `NODE_ENV` | Environment | `development` or `production` | 