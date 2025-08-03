const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profilePicture: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: null
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    stripeCustomerId: {
      type: String,
      default: null
    },
    stripeSubscriptionId: {
      type: String,
      default: null
    }
  },
  assessmentHistory: [{
    testType: {
      type: String,
      enum: ['iq', 'adhd', 'asd', 'anxiety'],
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    maxScore: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    answers: [{
      questionId: Number,
      selectedAnswer: String,
      isCorrect: Boolean,
      timeSpent: Number
    }],
    completedAt: {
      type: Date,
      default: Date.now
    },
    detailedResults: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    aiRecommendations: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  }],
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      shareResults: {
        type: Boolean,
        default: false
      },
      allowResearch: {
        type: Boolean,
        default: false
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for subscription status
userSchema.virtual('isSubscribed').get(function() {
  return this.subscription.status === 'active' && 
         this.subscription.type !== 'free' &&
         (!this.subscription.endDate || this.subscription.endDate > new Date());
});

// Virtual for total assessments
userSchema.virtual('totalAssessments').get(function() {
  return this.assessmentHistory.length;
});

// Virtual for average score
userSchema.virtual('averageScore').get(function() {
  if (this.assessmentHistory.length === 0) return 0;
  const totalScore = this.assessmentHistory.reduce((sum, assessment) => sum + assessment.percentage, 0);
  return Math.round(totalScore / this.assessmentHistory.length);
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'subscription.stripeCustomerId': 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profilePicture: this.profilePicture,
    subscription: this.subscription,
    totalAssessments: this.totalAssessments,
    averageScore: this.averageScore,
    isSubscribed: this.isSubscribed,
    createdAt: this.createdAt
  };
};

// Method to add assessment result
userSchema.methods.addAssessmentResult = function(assessmentData) {
  this.assessmentHistory.push(assessmentData);
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 