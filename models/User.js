/**
 * User Model
 * 
 * PURPOSE:
 * This model represents user accounts in the Immacare system. It combines functionality
 * from the previous MySQL tables (users_info and account_info) into a single MongoDB document.
 * 
 * USAGE:
 * Used for authentication, user management, and storing user profile information.
 * All users (patients, doctors, staff, admins) are stored using this model.
 * 
 * FEATURES:
 * - Automatic password hashing before saving
 * - Password comparison method for authentication
 * - Virtual field for full name
 * - Automatic exclusion of password in JSON responses
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema - Combines users_info and account_info from MySQL
// This schema defines the structure of user documents in MongoDB
const userSchema = new mongoose.Schema({
  // Account Information (from account_info table)
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    default: null,
    maxlength: 15
  },
  status: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // User Information (from users_info table)
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  middlename: {
    type: String,
    default: null,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  birthdate: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    default: null
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'doctor', 'patient', 'staff'],
    default: 'patient'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

// ============================================================================
// DATABASE INDEXES
// ============================================================================
// Create indexes for frequently queried fields to improve query performance
// Email index already defined in schema above
userSchema.index({ role: 1 });    // Index for role-based queries
userSchema.index({ status: 1 });  // Index for filtering active/inactive users

// ============================================================================
// PRE-SAVE MIDDLEWARE (PASSWORD HASHING)
// ============================================================================
// Automatically hash passwords before saving to database
// This ensures passwords are never stored in plain text
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Hash password with cost of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * comparePassword
 * Purpose: Compare a plain text password with the stored hashed password
 * 
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 * 
 * Usage: Used during login to verify user credentials
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ============================================================================
// VIRTUAL FIELDS
// ============================================================================
// Virtual fields are computed properties that don't exist in the database
// but can be accessed like regular fields

/**
 * fullName
 * Purpose: Get user's full name (firstname + middlename + lastname)
 * 
 * Usage: user.fullName returns formatted full name string
 */
userSchema.virtual('fullName').get(function() {
  return `${this.firstname} ${this.middlename ? this.middlename + ' ' : ''}${this.lastname}`;
});

// ============================================================================
// JSON SERIALIZATION CONFIGURATION
// ============================================================================
// Configure how the model is converted to JSON
// This ensures passwords are never included in API responses
userSchema.set('toJSON', {
  virtuals: true,  // Include virtual fields in JSON
  transform: function(doc, ret) {
    delete ret.password; // Security: Never send password in JSON responses
    return ret;
  }
});

// Use explicit collection name for new database
const User = mongoose.model('User', userSchema, 'users_info');

module.exports = User;

