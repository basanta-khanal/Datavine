const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    // Only initialize if credentials are provided
    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransport(emailConfig);
      this.initialized = true;
      console.log('📧 Email service initialized');
    } else {
      console.log('⚠️  Email service not configured - missing credentials');
    }
  }

  async sendPasswordResetEmail(email, resetLink) {
    if (!this.initialized) {
      this.initialize();
    }

    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'DataVine.ai <noreply@datavine.ai>',
      to: email,
      subject: 'Password Reset Request - DataVine.ai',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #374151;">Password Reset Request</h2>
          <p>You requested a password reset for your DataVine.ai account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" 
             style="display: inline-block; 
                    background-color: #374151; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, you can safely ignore this email.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">
            This is an automated message from DataVine.ai. Please do not reply to this email.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to: ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email, name) {
    if (!this.initialized) {
      this.initialize();
    }

    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'DataVine.ai <noreply@datavine.ai>',
      to: email,
      subject: 'Welcome to DataVine.ai! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #374151;">Welcome to DataVine.ai!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for joining DataVine.ai. We're excited to have you on board!</p>
          <p>Here's what you can do next:</p>
          <ul style="color: #666;">
            <li>Complete your profile</li>
            <li>Take your first assessment</li>
            <li>Explore our features</li>
          </ul>
          <a href="${process.env.FRONTEND_URL || 'https://datavine.ai'}/dashboard" 
             style="display: inline-block; 
                    background-color: #374151; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    margin: 20px 0;">
            Get Started
          </a>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">
            This is an automated message from DataVine.ai. Please do not reply to this email.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to: ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const emailService = new EmailService();

module.exports = emailService;