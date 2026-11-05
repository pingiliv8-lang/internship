const { Router } = require('express');
const Appointment = require('../models/Appointment');
const { doctors, TIME_SLOTS, findDoctor } = require('../data/doctors');
const { HttpError } = require('../middleware/errorHandler');
const { isValidDate } = require('../utils/time');

const router = Router();

router.get('/', (req, res) => res.json(doctors));

router.get('/time-slots', (req, res) => res.json(TIME_SLOTS));

// Which slots are still free for a doctor on a given day.
router.get('/:id/slots', async (req, res) => {
  const doctor = findDoctor(req.params.id);
  if (!doctor) throw new HttpError(404, 'Doctor not found');

  const { date } = req.query;
  if (!isValidDate(date)) throw new HttpError(400, 'Query param "date" must be YYYY-MM-DD');

  const booked = await Appointment.find({ doctorId: doctor.id, date, status: 'booked' }).distinct('timeSlot');
  res.json(TIME_SLOTS.map((time) => ({ time, available: !booked.includes(time) })));
});

module.exports = router;
