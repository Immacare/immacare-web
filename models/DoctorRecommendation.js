const mongoose = require('mongoose');

// Doctor Recommendation Schema
const doctorRecommendationSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  recommendation: {
    type: String,
    default: null
  },
  followUpRequired: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No'
  },
  prescriptionGiven: {
    type: Boolean,
    default: false
  },
  prescription: {
    type: String,
    default: null,
    maxlength: 50
  }
}, {
  timestamps: true
});

// Indexes
doctorRecommendationSchema.index({ appointmentId: 1 });
doctorRecommendationSchema.index({ doctorId: 1 });

// Use explicit collection name for new database
const DoctorRecommendation = mongoose.model('DoctorRecommendation', doctorRecommendationSchema, 'doctor_recommendations');

module.exports = DoctorRecommendation;

