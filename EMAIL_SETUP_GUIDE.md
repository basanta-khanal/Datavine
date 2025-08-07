# 📧 Email Configuration Setup Guide

## 🔐 **JWT Secret**

Use this secure JWT secret in your Railway environment variables:

```bash
JWT_SECRET=b5379a2af2077f23fda03a54d5b8da57f2665c2f3eb280c2ac545bc432edfa61fa8e6015d3d47d8ccddac0580ad0a978fd3b097a5aa3c8965b55f80849c6a9f6
```

## 📧 **Gmail Setup for Email**

### **Step 1: Enable 2-Factor Authentication**

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Click "Security"** in the left sidebar
3. **Find "2-Step Verification"** and click "Get started"
4. **Follow the setup process** to enable 2FA

### **Step 2: Generate App Password**

1. **Go to Google Account Security**: https://myaccount.google.com/security
2. **Find "App passwords"** (under "2-Step Verification")
3. **Click "App passwords"**
4. **Select "Mail"** as the app
5. **Select "Other (Custom name)"** as device
6. **Enter "Datavibe"** as the name
7. **Click "Generate"**
8. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### **Step 3: Configure Email Settings**

Use these settings in your Railway environment variables:

```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password
```

## 🔧 **Complete Railway Environment Variables**

Here's your complete environment configuration for Railway:

```bash
# Database (Railway will provide this)
DATABASE_URL=postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway

# JWT Configuration
JWT_SECRET=b5379a2af2077f23fda03a54d5b8da57f2665c2f3eb280c2ac545bc432edfa61fa8e6015d3d47d8ccddac0580ad0a978fd3b097a5aa3c8965b55f80849c6a9f6
JWT_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
NODE_ENV=production
```

## 📋 **Step-by-Step Setup**

### **1. Gmail Account Setup**
- [ ] Enable 2-Factor Authentication
- [ ] Generate App Password for "Datavibe"
- [ ] Copy the 16-character app password

### **2. Railway Environment Variables**
- [ ] Go to your Railway backend service
- [ ] Click "Variables" tab
- [ ] Add each environment variable from the list above
- [ ] Replace `your_gmail_address@gmail.com` with your actual Gmail
- [ ] Replace `your_16_character_app_password` with the app password from Step 1
- [ ] Replace `your_google_client_id` and `your_google_client_secret` with your Google OAuth credentials

### **3. Test Email Configuration**
After deployment, the system will automatically test email functionality when users:
- Register for an account
- Request password reset
- Complete assessments

## 🔍 **Troubleshooting**

### **Email Not Sending**
1. **Check App Password**: Make sure you're using the 16-character app password, not your regular Gmail password
2. **Verify 2FA**: Ensure 2-Factor Authentication is enabled
3. **Check Railway Logs**: Look for email-related errors in Railway deployment logs

### **JWT Issues**
1. **Secret Length**: The JWT secret should be 128 characters long
2. **Environment Variable**: Make sure `JWT_SECRET` is set in Railway
3. **No Spaces**: Ensure there are no extra spaces in the JWT secret

### **Common Gmail Errors**
- **535 Authentication failed**: Wrong app password or 2FA not enabled
- **550 Relaying not permitted**: Gmail security settings blocking the connection
- **Connection timeout**: Check firewall or network settings

## 🛡️ **Security Best Practices**

✅ **Use App Passwords**: Never use your main Gmail password
✅ **Enable 2FA**: Required for app passwords
✅ **Secure JWT Secret**: Use the generated 128-character secret
✅ **Environment Variables**: Store all secrets in Railway, not in code
✅ **Regular Rotation**: Consider rotating JWT secrets periodically

## 📞 **Support**

If you encounter issues:
1. **Check Railway logs** for error messages
2. **Verify Gmail settings** are correct
3. **Test with a simple email** first
4. **Ensure all environment variables** are set correctly

## 🎯 **Next Steps**

1. **Set up Gmail with 2FA and app password**
2. **Add all environment variables to Railway**
3. **Deploy your application**
4. **Test email functionality** by registering a new user 