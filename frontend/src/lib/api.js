import axios from 'axios';

// Defaults to the same origin (/api). Set VITE_API_URL to point at a separately hosted backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

export const errorMessage = (err) =>
  err.response?.data?.error || 'Could not reach the server. Is the backend running?';

export const getDoctors = () => api.get('/doctors').then((r) => r.data);
export const getSlots = (doctorId, date) =>
  api.get(`/doctors/${doctorId}/slots`, { params: { date } }).then((r) => r.data);
export const getAppointments = () => api.get('/appointments').then((r) => r.data);
export const bookAppointment = (data) => api.post('/appointments', data).then((r) => r.data);
export const cancelAppointment = (id) => api.patch(`/appointments/${id}/cancel`).then((r) => r.data);
