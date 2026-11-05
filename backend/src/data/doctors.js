// Doctors are kept as static data so the app works out of the box
// without a separate seeding step.
const doctors = [
  { id: 'd1', name: 'Dr. Sarah Smith', specialty: 'Cardiologist', experience: 12, fee: 800 },
  { id: 'd2', name: 'Dr. John Doe', specialty: 'Dermatologist', experience: 8, fee: 600 },
  { id: 'd3', name: 'Dr. Emily Chen', specialty: 'Neurologist', experience: 15, fee: 1000 },
  { id: 'd4', name: 'Dr. Arjun Mehta', specialty: 'Orthopedic Surgeon', experience: 10, fee: 900 },
  { id: 'd5', name: 'Dr. Priya Nair', specialty: 'Pediatrician', experience: 9, fee: 500 },
  { id: 'd6', name: 'Dr. Michael Brown', specialty: 'General Physician', experience: 6, fee: 400 },
];

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

const findDoctor = (id) => doctors.find((d) => d.id === id);

module.exports = { doctors, TIME_SLOTS, findDoctor };
