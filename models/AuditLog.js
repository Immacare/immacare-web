/**
 * AuditLog Model
 * 
 * PURPOSE:
 * Tracks user activities in the system for auditing purposes.
 * Logs logins, registrations, and booking creations.
 * 
 * USAGE:
 * - Track staff/doctor/patient login activities
 * - Track new user registrations
 * - Track appointment bookings
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['login', 'register', 'booking_created'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    required: true
  },
  userRole: {
    type: String
  },
  userEmail: {
    type: String
  },
  details: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
