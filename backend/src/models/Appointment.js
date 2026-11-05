const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    patientName: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, trim: true, maxlength: 20 },
    reason: { type: String, trim: true, maxlength: 300 },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // e.g. "09:00 AM"
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
  },
  { timestamps: true }
);

// A doctor can only have one active booking per date + time slot.
// Enforced at the database level so two simultaneous requests can't both succeed.
appointmentSchema.index(
  { doctorId: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: 'booked' }, name: 'unique_active_slot' }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
