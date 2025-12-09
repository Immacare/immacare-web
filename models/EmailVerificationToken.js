/**
 * Email Verification Token Model
 * 
 * PURPOSE:
 * Stores email verification tokens for user account verification
 * 
 * USAGE:
 * Used to track and validate email verification tokens sent to users
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const emailVerificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete expired tokens
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Generate a new verification token
 * @param {mongoose.Types.ObjectId} userId - User ID to generate token for
 * @returns {Promise<Object>} Created token document
 */
emailVerificationTokenSchema.statics.generateToken = async function(userId) {
  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Token expires in 24 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Remove any existing tokens for this user
  await this.deleteMany({ userId });
  
  // Create and save new token
  const verificationToken = new this({
    userId,
    token,
    expiresAt
  });
  
  await verificationToken.save();
  return verificationToken;
};

/**
 * Verify a token and return the associated user
 * @param {string} token - Verification token to check
 * @returns {Promise<Object|null>} Token document if valid, null otherwise
 */
emailVerificationTokenSchema.statics.verifyToken = async function(token) {
  const tokenDoc = await this.findOne({ token });
  
  if (!tokenDoc) {
    return null; // Token not found
  }
  
  if (tokenDoc.expiresAt < new Date()) {
    // Token expired, delete it
    await this.deleteOne({ _id: tokenDoc._id });
    return null;
  }
  
  return tokenDoc;
};

const EmailVerificationToken = mongoose.model('EmailVerificationToken', emailVerificationTokenSchema, 'email_verification_tokens');

module.exports = EmailVerificationToken;






