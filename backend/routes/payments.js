const express = require('express');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Middleware to get user from token
const getUserFromToken = (req) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');
    const users = global.inMemoryDB?.users || new Map();
    
    for (const [email, userData] of users) {
      if (userData.id === decoded.id) {
        return userData;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent
// @access  Private
router.post('/create-payment-intent', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { subscriptionType, paymentMethod } = req.body;

    // Validate subscription type
    const validTypes = ['basic', 'premium', 'enterprise'];
    if (!validTypes.includes(subscriptionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription type'
      });
    }

    // Get price ID based on subscription type
    let priceId;
    switch (subscriptionType) {
      case 'basic':
        priceId = process.env.STRIPE_BASIC_PRICE_ID;
        break;
      case 'premium':
        priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
        break;
      case 'enterprise':
        priceId = process.env.STRIPE_ENTERPRISE_PRICE_ID;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid subscription type'
        });
    }

    if (!priceId) {
      return res.status(500).json({
        success: false,
        message: 'Price ID not configured for this subscription type'
      });
    }

    // Create real Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: subscriptionType === 'basic' ? 999 : subscriptionType === 'premium' ? 1999 : 4999,
      currency: 'usd',
      metadata: {
        userId: user.id,
        subscriptionType: subscriptionType,
        userEmail: user.email
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        plan: {
          name: subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1),
          features: subscriptionType === 'basic' 
            ? ['Basic assessments', 'Standard reports']
            : subscriptionType === 'premium'
            ? ['All assessments', 'Detailed reports', 'AI recommendations', 'Progress tracking']
            : ['All assessments', 'Detailed reports', 'AI recommendations', 'Progress tracking', 'Priority support', 'Custom insights']
        }
      }
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment creation'
    });
  }
});

// @route   POST /api/payments/confirm-subscription
// @desc    Confirm subscription
// @access  Private
router.post('/confirm-subscription', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { paymentIntentId, subscriptionType } = req.body;

    // Verify payment intent with Stripe
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment not completed successfully'
        });
      }

      // Verify the payment belongs to this user
      if (paymentIntent.metadata.userId !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'Payment does not belong to this user'
        });
      }

    } catch (error) {
      console.error('Stripe payment verification error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid payment intent'
      });
    }

    // Update user subscription status
    user.isSubscribed = true;
    user.hasPaid = true;
    user.subscription = {
      type: subscriptionType,
      status: 'active',
      startDate: new Date().toISOString(),
      paymentIntentId
    };
    user.updatedAt = new Date().toISOString();

    // Update user in storage
    const users = global.inMemoryDB?.users || new Map();
    users.set(user.email, user);

    res.json({
      success: true,
      message: 'Subscription confirmed successfully',
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Confirm subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during subscription confirmation'
    });
  }
});

// @route   GET /api/payments/subscription-status
// @desc    Get subscription status
// @access  Private
router.get('/subscription-status', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      subscription: user.subscription || null,
      isSubscribed: user.isSubscribed || false
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/payments/cancel-subscription
// @desc    Cancel subscription
// @access  Private
router.post('/cancel-subscription', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update user subscription status
    user.isSubscribed = false;
    if (user.subscription) {
      user.subscription.status = 'cancelled';
      user.subscription.endDate = new Date().toISOString();
    }
    user.updatedAt = new Date().toISOString();

    // Update user in storage
    const users = global.inMemoryDB?.users || new Map();
    users.set(user.email, user);

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during subscription cancellation'
    });
  }
});

module.exports = router; 