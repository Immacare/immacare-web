/**
 * Appointment Model
 * 
 * PURPOSE:
 * This model represents appointment bookings in the Immacare system.
 * It stores information about scheduled appointments between patients and doctors.
 * 
 * USAGE:
 * Used for managing appointment bookings, scheduling, queue management, and
 * tracking appointment status throughout the patient care workflow.
 * 
 * RELATIONSHIPS:
 * - References PatientProfile (patientId)
 * - References User model for doctor (doctorId, optional)
 */

const mongoose = require('mongoose');

// Appointment Booking Schema
// Defines the structure of appointment documents in MongoDB
const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientProfile',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Can be null for non-doctor consultations
  },
  consultationType: {
    type: String,
    required: true
  },
  bookingDate: {
    type: String, // Keeping as string to match MySQL format (MM-DD-YYYY)
    required: true
  },
  bookingTime: {
    type: String,
    required: true
  },
  queueNo: {
    type: String,
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: ['Booked', 'Completed', 'Cancelled', 'In Queue', 'Emergency'],
    default: 'Booked'
  },
  reason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster queries
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ bookingDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ consultationType: 1 });
appointmentSchema.index({ createdAt: -1 });

// Use explicit collection name for new database
const Appointment = mongoose.model('Appointment', appointmentSchema, 'appointment_booking');

module.exports = Appointment;

