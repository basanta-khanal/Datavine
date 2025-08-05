# Stripe Payment Setup Guide

## Required Environment Variables

### Frontend (Vercel)
Add these to your Vercel environment variables:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### Backend (Railway)
Add these to your Railway environment variables:

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
STRIPE_BASIC_PRICE_ID=price_basic_plan_id
STRIPE_PREMIUM_PRICE_ID=price_premium_plan_id
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_plan_id
```

## Stripe Dashboard Setup

### 1. Get API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API keys
3. Copy your Publishable key and Secret key

### 2. Create Products and Prices
1. Go to Products in your Stripe Dashboard
2. Create three products:
   - **Basic Plan** ($9.99)
   - **Premium Plan** ($19.99)
   - **Enterprise Plan** ($49.99)
3. For each product, create a one-time price
4. Copy the Price IDs (start with `price_`)

### 3. Set Up Webhooks (Optional)
1. Go to Developers > Webhooks
2. Add endpoint: `https://your-railway-app.railway.app/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook secret

## Test Cards
Use these test card numbers for testing:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

## Security Notes
- Never commit API keys to version control
- Use test keys for development
- Switch to live keys for production
- Always verify payments on the backend 