const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');

async function connectDB(uri) {
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);

  // Records created by the first version of the app have no status field.
  const { modifiedCount } = await Appointment.updateMany(
    { status: { $exists: false } },
    { $set: { status: 'booked' } }
  );
  if (modifiedCount) console.log(`Migrated ${modifiedCount} older appointment(s)`);

  await Appointment.syncIndexes();
}

module.exports = connectDB;
