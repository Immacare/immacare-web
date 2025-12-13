/**
 * Patient Profile Model
 * 
 * PURPOSE:
 * This model stores detailed medical and personal information for patients.
 * It extends the basic User model with comprehensive patient-specific data
 * including medical history, emergency contacts, and health information.
 * 
 * USAGE:
 * Used for storing patient medical records, emergency contact information,
 * medical history, and other patient-specific data required for healthcare services.
 * 
 * RELATIONSHIPS:
 * - References User model (userId) - one-to-one relationship
 * - Referenced by Appointment model (patientId)
 * 
 * NOTE:
 * Some fields are stored as strings to maintain compatibility with the
 * previous MySQL database format.
 */

const mongoose = require('mongoose');

// Patient Profile Schema - References User model
// This schema stores comprehensive patient information beyond basic user account data
const patientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
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
    required: true
  },
  birthdate: {
    type: String, // Keeping as string to match MySQL format
    required: true
  },
  age: {
    type: String, // Keeping as string to match MySQL format
    default: null
  },
  civilStatus: {
    type: String,
    default: null
  },
  mobileNumber: {
    type: String,
    default: null,
    maxlength: 15
  },
  emailAddress: {
    type: String,
    default: null
  },
  homeAddress: {
    type: String,
    default: null
  },
  emergencyName: {
    type: String,
    default: null
  },
  emergencyRelationship: {
    type: String,
    default: null
  },
  emergencyMobileNumber: {
    type: String,
    default: null,
    maxlength: 15
  },
  bloodtype: {
    type: String,
    default: null,
    maxlength: 3
  },
  allergies: {
    type: String,
    default: null
  },
  currentMedication: {
    type: String,
    default: null
  },
  pastMedicalCondition: {
    type: String,
    default: null
  },
  chronicIllness: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes (userId already indexed above)
patientProfileSchema.index({ emailAddress: 1 });

// Virtual for full name
patientProfileSchema.virtual('fullName').get(function() {
  return `${this.firstname} ${this.middlename ? this.middlename + ' ' : ''}${this.lastname}`;
});

// Use explicit collection name for new database
const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema, 'patient_info');

module.exports = PatientProfile;

