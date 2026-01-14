/**
 * DoctorSchedule Model
 * 
 * PURPOSE:
 * This model represents doctor availability schedules in the Immacare system.
 * Doctors can set their available dates and time slots for patient bookings.
 * 
 * USAGE:
 * Used for managing doctor schedules, allowing patients to only book
 * appointments on dates/times when the doctor is available.
 * 
 * RELATIONSHIPS:
 * - References User model for doctor (doctorId)
 */

const mongoose = require('mongoose');

// Doctor Schedule Schema
const doctorScheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  scheduleDate: {
    type: String, // Format: MM-DD-YYYY to match existing date format
    required: true
  },
  timeSlots: [{
    type: String // e.g., "8:00 AM - 9:00 AM"
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  maxPatients: {
    type: Number,
    default: 10 // Maximum patients per day
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
doctorScheduleSchema.index({ doctorId: 1, scheduleDate: 1 }, { unique: true });
doctorScheduleSchema.index({ scheduleDate: 1 });
doctorScheduleSchema.index({ isAvailable: 1 });

const DoctorSchedule = mongoose.model('DoctorSchedule', doctorScheduleSchema, 'doctor_schedules');

module.exports = DoctorSchedule;
