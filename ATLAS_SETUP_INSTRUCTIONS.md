# MongoDB Atlas Setup Instructions

## Quick Setup Steps:

### 1. Create Atlas Account
- Go to: https://www.mongodb.com/atlas
- Click "Try Free" and sign up
- Create project: "DataVine"

### 2. Create Cluster
- Click "Build a Database"
- Choose "FREE" tier (M0)
- Select AWS/Google Cloud/Azure
- Choose region close to you
- Click "Create"

### 3. Database Access
- Go to "Database Access"
- Click "Add New Database User"
- Username: datavine_1754255026630
- Password: 3b7c2c72f800aa8c31078f2831a1009a
- Select "Read and write to any database"
- Click "Add User"

### 4. Network Access
- Go to "Network Access"
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

### 5. Get Connection String
- Go to "Database"
- Click "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace <password> with: 3b7c2c72f800aa8c31078f2831a1009a

### 6. Update Environment File
Replace the MONGODB_URI in backend/.env with your actual connection string.

## Current Configuration:
- Username: datavine_1754255026630
- Password: 3b7c2c72f800aa8c31078f2831a1009a
- Database: datavine
- Cluster: datavine-cluster

## Test Connection:
```bash
# Test MongoDB connection
curl -s http://localhost:5001/api/health

# Run full test suite
node quick-test.js
```
