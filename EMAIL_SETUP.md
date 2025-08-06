# Email Service Setup for DataVine.ai

This guide explains how to set up email functionality for password reset emails in production.

## Quick Setup Options

### Option 1: Gmail SMTP (Recommended for Development)
Add these environment variables to your Railway backend:

```
EMAIL_SERVICE_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=DataVine.ai <your-email@gmail.com>
```

**Steps to get Gmail App Password:**
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > App passwords
4. Generate an app password for "Mail"
5. Use this password (not your regular Gmail password)

### Option 2: SendGrid (Recommended for Production)
Add these environment variables:

```
EMAIL_SERVICE_ENABLED=true
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=DataVine.ai <noreply@datavine.ai>
```

**Steps to get SendGrid API Key:**
1. Sign up at https://sendgrid.com
2. Create an API key with "Mail Send" permissions
3. Verify your sender domain/email

### Option 3: AWS SES (Enterprise)
Add these environment variables:

```
EMAIL_SERVICE_ENABLED=true
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-aws-access-key-id
SMTP_PASS=your-aws-secret-access-key
SMTP_FROM=DataVine.ai <noreply@datavine.ai>
```

## Railway Deployment

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to "Variables" tab
4. Add the environment variables from your chosen option above
5. Deploy the changes

## Testing

After setting up the email service:

1. Try the "Forgot Password" feature
2. Check that you receive the email
3. Verify the reset link works

## Fallback Behavior

- **Development**: Reset links are logged to console
- **Production without email**: Reset links are logged to server console (check Railway logs)
- **Production with email**: Reset links are sent via email

## Email Template

The email includes:
- Professional HTML template
- Clear reset button
- Backup text link
- 1-hour expiration notice
- Security notice

## Troubleshooting

### Common Issues:
1. **"Authentication failed"**: Check username/password
2. **"Connection timeout"**: Check SMTP host/port
3. **"Email not received"**: Check spam folder
4. **"Invalid sender"**: Verify sender email is authorized

### Check Railway Logs:
```bash
# Check if emails are being sent
railway logs --service=your-backend-service
```

Look for messages like:
- "Password reset email sent to: email@example.com" ✅
- "Failed to send password reset email: [error]" ❌

## Security Notes

- Never commit SMTP credentials to git
- Use environment variables only
- Consider using app passwords instead of main passwords
- Monitor email sending quotas
- Set up proper SPF/DKIM records for production domains