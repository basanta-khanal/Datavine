# 🚀 Railway Environment Variables - Quick Reference

## 📋 **Copy & Paste Configuration**

Add these to your Railway backend service environment variables:

```bash
# Database (Railway will provide this automatically)
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

## 🔧 **What You Need to Replace**

| Variable | What to Replace | Example |
|----------|----------------|---------|
| `EMAIL_USER` | `your_gmail_address@gmail.com` | `john.doe@gmail.com` |
| `EMAIL_PASS` | `your_16_character_app_password` | `abcd efgh ijkl mnop` |
| `GOOGLE_CLIENT_ID` | `your_google_client_id` | `123456789-abc123.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `your_google_client_secret` | `GOCSPX-your_secret_here` |

## 🎯 **Quick Setup Steps**

1. **Go to Railway Dashboard** → Your Backend Service → Variables
2. **Add each variable** from the list above
3. **Replace the placeholder values** with your actual credentials
4. **Save and deploy**

## 🔐 **Security Notes**

- ✅ **JWT_SECRET**: Use the provided 128-character secret
- ✅ **EMAIL_PASS**: Use Gmail app password (16 characters), not your regular password
- ✅ **All secrets**: Stored securely in Railway, not in code
- ✅ **No spaces**: Make sure there are no extra spaces in values

## 📧 **Gmail App Password Format**

Your Gmail app password will look like this:
```
abcd efgh ijkl mnop
```
(16 characters with spaces, but enter it without spaces in Railway) 