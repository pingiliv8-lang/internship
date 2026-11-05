const { Router } = require('express');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const { TIME_SLOTS, findDoctor } = require('../data/doctors');
const { HttpError } = require('../middleware/errorHandler');
const { isValidDate, isPastSlot, slotToMinutes } = require('../utils/time');

const router = Router();

// List appointments, optionally filtered: ?doctorId=d1&date=2026-11-05&status=booked
router.get('/', async (req, res) => {
  const filter = {};
  for (const key of ['doctorId', 'date', 'status']) {
    if (typeof req.query[key] === 'string' && req.query[key]) filter[key] = req.query[key];
  }
  const appts = await Appointment.find(filter).lean();
  appts.sort((a, b) => a.date.localeCompare(b.date) || slotToMinutes(a.timeSlot) - slotToMinutes(b.timeSlot));
  res.json(appts);
});

// Book an appointment
router.post('/', async (req, res) => {
  const { doctorId, patientName, phone, reason, date, timeSlot } = req.body ?? {};

  const doctor = findDoctor(doctorId);
  if (!doctor) throw new HttpError(400, 'Please select a valid doctor.');
  if (typeof patientName !== 'string' || !patientName.trim()) throw new HttpError(400, 'Patient name is required.');
  if (!isValidDate(date)) throw new HttpError(400, 'Please pick a valid date.');
  if (!TIME_SLOTS.includes(timeSlot)) throw new HttpError(400, 'Please pick a valid time slot.');
  if (isPastSlot(date, timeSlot)) throw new HttpError(400, 'That time has already passed. Please pick a future slot.');
  if (phone && !/^[+\d][\d\s-]{6,19}$/.test(phone)) throw new HttpError(400, 'Please enter a valid phone number.');

  const existing = await Appointment.exists({ doctorId, date, timeSlot, status: 'booked' });
  if (existing) throw new HttpError(409, 'This slot is already booked!');

  const appointment = await Appointment.create({
    doctorId,
    doctorName: doctor.name,
    patientName,
    phone,
    reason,
    date,
    timeSlot,
  });
  res.status(201).json({ message: 'Appointment booked successfully!', appointment });
});

// Cancel an appointment (kept for records, frees the slot)
router.patch('/:id/cancel', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(400, 'Invalid appointment id');
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, status: 'booked' },
    { status: 'cancelled' },
    { new: true }
  );
  if (!appointment) throw new HttpError(404, 'Appointment not found or already cancelled');
  res.json({ message: 'Appointment cancelled.', appointment });
});

module.exports = router;
