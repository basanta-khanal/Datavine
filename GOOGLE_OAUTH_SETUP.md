# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your DataVine.ai application.

## Prerequisites

- Google Cloud Console account
- Domain verification (for production)
- SSL certificate (for production)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

## Step 2: Configure OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "DataVine.ai"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (for development)
6. Save and continue

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://datavine.ai/api/auth/google/callback`
5. Save the Client ID and Client Secret

## Step 4: Install Required Packages

### Backend (Railway)
```bash
cd backend
pnpm add passport passport-google-oauth20
```

### Frontend (Vercel)
```bash
pnpm add next-auth
```

## Step 5: Environment Variables

### Backend Environment Variables (Railway)
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://datavine-production.up.railway.app/api/auth/google/callback
```

### Frontend Environment Variables (Vercel)
```
NEXTAUTH_URL=https://datavine.ai
NEXTAUTH_SECRET=your_nextauth_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Step 6: Backend Implementation

### Update `backend/routes/auth.js`

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const users = global.inMemoryDB?.users || new Map();
      
      // Check if user exists
      let user = null;
      for (const [email, userData] of users) {
        if (userData.googleId === profile.id) {
          user = userData;
          break;
        }
      }

      if (!user) {
        // Create new user
        const userId = Date.now().toString();
        user = {
          id: userId,
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0]?.value,
          isSubscribed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        users.set(user.email, user);
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    const token = generateToken(req.user.id);
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);
```

## Step 7: Frontend Implementation

### Update `app/page.tsx` Google Login Handler

```typescript
const handleGoogleLogin = async () => {
  try {
    // Redirect to Google OAuth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  } catch (error) {
    console.error('Google login error:', error);
    toast({
      title: "Login Error",
      description: "Failed to initiate Google login. Please try again.",
      variant: "destructive",
    });
  }
};
```

### Handle OAuth Callback

Add to your main page component:

```typescript
useEffect(() => {
  // Check for OAuth token in URL
  const urlParams = new URLSearchParams(window.location.search);
  const oauthToken = urlParams.get('token');
  
  if (oauthToken) {
    // Store token and redirect
    localStorage.setItem('token', oauthToken);
    setIsAuthenticated(true);
    
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    toast({
      title: "Login Successful",
      description: "Welcome to DataVine.ai!",
    });
  }
}, []);
```

## Step 8: Production Deployment

### Domain Verification
1. In Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Add your production domain to authorized domains
3. Verify domain ownership if required

### SSL Certificate
Ensure your production domain has a valid SSL certificate for secure OAuth redirects.

## Step 9: Testing

### Development Testing
1. Use test users added to OAuth consent screen
2. Test the complete flow: login → redirect → callback → token storage

### Production Testing
1. Verify domain is properly configured
2. Test with real Google accounts
3. Monitor for any OAuth errors

## Security Considerations

1. **Client Secret**: Never expose in frontend code
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Store tokens securely
4. **Scope Limitation**: Only request necessary scopes
5. **Error Handling**: Implement proper error handling

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**
   - Ensure exact match between Google Console and your app
   - Check for trailing slashes

2. **Domain Not Verified**
   - Verify domain ownership in Google Console
   - Add domain to authorized domains

3. **Invalid Client ID**
   - Double-check environment variables
   - Ensure Client ID is for the correct project

4. **CORS Issues**
   - Configure CORS properly in backend
   - Add frontend domain to allowed origins

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Test OAuth flow in incognito mode
4. Check Google Cloud Console logs

## Support

For additional help:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [NextAuth.js Documentation](https://next-auth.js.org/) 