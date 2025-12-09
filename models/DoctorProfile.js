const mongoose = require('mongoose');

// Doctor Profile Schema - References User model
const doctorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  specialty: {
    type: Number,
    default: null
  },
  department: {
    type: String,
    default: ''
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  professionalBoard: {
    type: String,
    default: ''
  },
  certificate: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: '1'
  }
}, {
  timestamps: true
});

// Indexes (userId already indexed above)
doctorProfileSchema.index({ specialty: 1 });
doctorProfileSchema.index({ status: 1 });

// Use explicit collection name for new database
const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema, 'doctors_profile');

module.exports = DoctorProfile;

