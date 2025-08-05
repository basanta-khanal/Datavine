# Google OAuth Setup Guide for DataVine.ai

This guide will help you set up real Google OAuth authentication for production deployment.

## Current Status

✅ **Development Version**: Currently using a simulated Google login for development purposes
🔄 **Production Version**: Needs real Google OAuth implementation

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

### 1.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "DataVine.ai"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses)

### 1.3 Create OAuth 2.0 Client ID
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (for development)
   - `https://datavine.ai/auth/google/callback` (for production)
5. Note down the Client ID and Client Secret

## Step 2: Backend Setup

### 2.1 Install Required Packages
```bash
cd backend
pnpm add passport passport-google-oauth20
```

### 2.2 Environment Variables
Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

For production (Railway):
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-railway-app.up.railway.app/api/auth/google/callback
FRONTEND_URL=https://datavine.ai
```

### 2.3 Update Backend Routes
Replace the current Google route in `backend/routes/auth.js`:

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const users = global.inMemoryDB?.users || new Map();
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const googleId = profile.id;
      
      let user = users.get(email);
      
      if (!user) {
        // Create new user
        const userId = Date.now().toString();
        user = {
          id: userId,
          name,
          email,
          googleId,
          profilePicture: profile.photos[0]?.value || null,
          isSubscribed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        users.set(email, user);
      } else {
        // Update existing user
        user.googleId = googleId;
        user.name = name;
        user.profilePicture = profile.photos[0]?.value || user.profilePicture;
        user.updatedAt = new Date().toISOString();
        users.set(email, user);
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  const users = global.inMemoryDB?.users || new Map();
  for (const [email, user] of users) {
    if (user.id === id) {
      return done(null, user);
    }
  }
  done(null, null);
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user.id);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);
```

## Step 3: Frontend Setup

### 3.1 Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

For production (Vercel):
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3.2 Update Google Login Handler
Replace the current `handleGoogleLogin` in `app/page.tsx`:

```typescript
const handleGoogleLogin = async () => {
  try {
    // Redirect to backend Google OAuth
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

### 3.3 Handle OAuth Callback
Add to your main page component to handle the token from OAuth callback:

```typescript
useEffect(() => {
  // Check for OAuth callback token
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Clear the token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Set token and get user data
    apiClient.setToken(token);
    handleOAuthSuccess(token);
  }
}, []);

const handleOAuthSuccess = async (token: string) => {
  try {
    const userResponse = await apiClient.getCurrentUser();
    if (userResponse.success) {
      const userData = {
        ...userResponse.data,
        assessmentHistory: userResponse.data.assessmentHistory || [],
        subscription: userResponse.data.subscription?.type || "Free",
        subscriptionExpiry: userResponse.data.subscription?.endDate || "N/A",
        usedCoupon: userResponse.data.usedCoupon || false,
        hasPaid: userResponse.data.hasPaid || false,
      };
      
      updateState({
        user: userData,
        isAuthenticated: true,
        showAuthModal: false
      });
      
      localStorage.setItem('datavine_token', token);
      localStorage.setItem('datavine_user', JSON.stringify(userData));
      
      toast({
        title: "Welcome!",
        description: `Successfully signed in with Google as ${userData.name}`,
      });
    }
  } catch (error) {
    console.error('OAuth success error:', error);
    toast({
      title: "Login Error",
      description: "Failed to complete Google login. Please try again.",
      variant: "destructive",
    });
  }
};
```

## Step 4: Production Deployment

### 4.1 Railway (Backend)
1. Set environment variables in Railway dashboard
2. Deploy the updated backend code
3. Update the callback URL to use your Railway domain

### 4.2 Vercel (Frontend)
1. Set environment variables in Vercel dashboard
2. Deploy the updated frontend code
3. Update the callback URL to use your Vercel domain

## Step 5: Testing

### 5.1 Development Testing
1. Start backend: `cd backend && pnpm start`
2. Start frontend: `pnpm dev`
3. Click "Continue with Google" button
4. Complete OAuth flow
5. Verify user is logged in

### 5.2 Production Testing
1. Deploy to Railway and Vercel
2. Test OAuth flow on production domain
3. Verify user creation and login
4. Test profile picture sync from Google

## Security Considerations

1. **HTTPS Only**: Ensure all production URLs use HTTPS
2. **Environment Variables**: Never commit secrets to version control
3. **Token Security**: Use secure JWT tokens with proper expiration
4. **CORS**: Configure CORS properly for your domains
5. **Rate Limiting**: Implement rate limiting on OAuth endpoints

## Troubleshooting

### Common Issues:
1. **"Invalid redirect URI"**: Check that your redirect URI matches exactly in Google Console
2. **"OAuth consent screen not configured"**: Complete the OAuth consent screen setup
3. **"Client ID not found"**: Verify environment variables are set correctly
4. **CORS errors**: Check CORS configuration in backend

### Debug Steps:
1. Check browser console for errors
2. Check backend logs for authentication errors
3. Verify environment variables are loaded
4. Test OAuth flow step by step

## Current Development Version

The current implementation uses a simulated Google login for development:
- Creates a demo user with Google-like data
- Works without real Google OAuth setup
- Perfect for development and testing
- Ready to be replaced with real OAuth

To switch to real Google OAuth, follow the steps above and replace the simulated implementation. 