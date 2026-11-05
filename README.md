# MediBook: Doctor Appointment Booking (MERN)

MediBook is a full-stack web app for booking doctor appointments. Patients pick a specialist, a date and a free time slot. Clinic staff use the Admin Desk to see, filter and cancel bookings. The backend makes sure a slot can never be double-booked.

Built with **MongoDB, Express, React and Node.js** as part of the **MERN Stack Developer internship at [Code Sprint](https://www.codesprint.in) (Savna Tech Products Pvt Ltd)**, June to August 2026.

## Features

**Patient Portal**
- Browse specialists with their specialty, experience and consultation fee
- Pick a date (past dates are blocked) and see live availability for that doctor
- Booked or already-passed time slots are shown as unavailable
- Optional phone number and reason for visit
- Confirmation screen with a booking ID

**Admin Desk**
- Stats for today, upcoming, total and cancelled appointments
- Search by patient name or phone; filter by doctor and status (upcoming / past / cancelled / all)
- Appointments sorted by date and time
- Cancel an appointment, which frees the slot for someone else and keeps the record

**Backend**
- REST API with input validation and consistent JSON errors
- Double-booking prevented twice: a check before saving, plus a **unique partial index** in MongoDB, so two requests at the same moment can't both win
- Config through environment variables (`PORT`, `MONGO_URI`, `CLIENT_ORIGIN`)
- In production, serves the built React app itself, so it deploys as a single service

## Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19, Vite, Tailwind CSS, Axios |
| Backend  | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Tooling  | oxlint, Node's built-in test runner, concurrently |

## Project structure

```
medi-book/
├── backend/
│   ├── server.js              # App entry: middleware, routes, static hosting
│   ├── src/
│   │   ├── config/db.js       # MongoDB connection and index sync
│   │   ├── data/doctors.js    # Doctor list and time slots
│   │   ├── models/Appointment.js
│   │   ├── routes/            # /api/doctors, /api/appointments
│   │   ├── middleware/        # Error handling
│   │   └── utils/time.js
│   └── test/
└── frontend/
    ├── vite.config.js         # Proxies /api to the backend in development
    └── src/
        ├── App.jsx
        ├── components/        # Navbar, BookingForm, AdminDashboard, ...
        └── lib/               # API client, date helpers
```

## Getting started

### Prerequisites
- Node.js 20.6 or newer
- MongoDB running locally (`mongodb://127.0.0.1:27017`), or a MongoDB Atlas connection string

### Setup

```bash
git clone <this-repo-url>
cd medi-book
npm run install:all
```

Optional: copy `backend/.env.example` to `backend/.env` and change `MONGO_URI` / `PORT`.

### Run in development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

### Run in production mode

```bash
npm run build
npm start
```

This serves the app and the API together at http://localhost:5000.

### Tests

```bash
npm test
```

## API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/health` | Health check |
| GET    | `/api/doctors` | List doctors |
| GET    | `/api/doctors/time-slots` | All bookable time slots |
| GET    | `/api/doctors/:id/slots?date=YYYY-MM-DD` | Availability for a doctor on a date |
| GET    | `/api/appointments?doctorId=&date=&status=` | List appointments, with optional filters |
| POST   | `/api/appointments` | Book an appointment |
| PATCH  | `/api/appointments/:id/cancel` | Cancel an appointment |

Example booking request:

```json
POST /api/appointments
{
  "doctorId": "d1",
  "patientName": "Asha Rao",
  "phone": "+91 98765 43210",
  "reason": "Routine check-up",
  "date": "2026-12-01",
  "timeSlot": "10:00 AM"
}
```

Responses: `201` booked, `400` invalid input, `409` slot already taken.

## Team

- **Pingili Vishruth**
- **Suraj**
- **Murari**

Internship: MERN Stack Developer, Code Sprint (Savna Tech Products Pvt Ltd), 24 June to 4 August 2026.
