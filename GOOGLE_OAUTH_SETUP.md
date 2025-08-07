# 🔐 Google OAuth Setup Guide

## 🚨 **Current Issue: 404 Error**

The Google OAuth is returning a 404 error because the callback URLs need to include `/api` in the path.

## 🔧 **Step-by-Step Fix**

### **Step 1: Google Cloud Console Setup**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (or create one)
3. **Go to "APIs & Services"** → **"Credentials"**

### **Step 2: Create/Update OAuth 2.0 Client ID**

1. **Click "Create Credentials"** → **"OAuth 2.0 Client IDs"**
2. **Application type**: Web application
3. **Name**: Datavibe OAuth Client

### **Step 3: Configure Authorized Origins**

**Authorized JavaScript origins**:
```
https://datavine.ai
https://datavine-production.up.railway.app
http://localhost:3000
http://localhost:3001
```

### **Step 4: Configure Authorized Redirect URIs**

**Authorized redirect URIs** (IMPORTANT: Note the `/api` in the paths):
```
https://datavine.ai/api/auth/google/callback
https://datavine-production.up.railway.app/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
http://localhost:3001/api/auth/google/callback
```

### **Step 5: Enable Required APIs**

1. **Go to "APIs & Services"** → **"Library"**
2. **Enable these APIs**:
   - Google+ API
   - Google Identity
   - Google OAuth2 API

### **Step 6: Update Environment Variables**

**Frontend (.env.local)**:
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_client_id_here
NEXT_PUBLIC_APP_URL=https://datavine.ai
```

**Railway Backend Environment Variables**:
```bash
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
NEXT_PUBLIC_APP_URL=https://datavine.ai
```

## 🔍 **Troubleshooting**

### **Issue 1: 404 Error**
- ✅ Check if OAuth 2.0 Client ID exists
- ✅ Verify redirect URIs include `/api` in the path
- ✅ Ensure APIs are enabled

### **Issue 2: Redirect URI Mismatch**
- ✅ Make sure redirect URI exactly matches: `/api/auth/google/callback`
- ✅ Check for trailing slashes
- ✅ Verify protocol (http vs https)

### **Issue 3: Client ID Not Found**
- ✅ Copy the correct Client ID
- ✅ Check if project is selected
- ✅ Verify OAuth consent screen is configured

## 📋 **Verification Checklist**

- [ ] OAuth 2.0 Client ID created
- [ ] Authorized origins configured
- [ ] Redirect URIs configured with `/api` path
- [ ] Required APIs enabled
- [ ] Environment variables set
- [ ] OAuth consent screen configured
- [ ] Project is active and billing enabled

## 🎯 **Quick Test**

After setup, test with this URL (replace with your client ID):
```
https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=https%3A%2F%2Fdatavine.ai%2Fapi%2Fauth%2Fgoogle%2Fcallback&response_type=code&scope=email%20profile&access_type=offline
```

This should redirect to Google's OAuth consent screen, not give a 404 error.