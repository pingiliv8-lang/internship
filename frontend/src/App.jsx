import { useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import Alert from './components/Alert';
import { errorMessage, getAppointments, getDoctors } from './lib/api';

export default function App() {
  const [view, setView] = useState('patient');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setAppointments(await getAppointments());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoadingAppts(false);
    }
  }, []);

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoadingDoctors(false));
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <Navbar view={view} onChange={setView} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {error && (
          <div className="max-w-3xl mx-auto mb-6">
            <Alert type="error" onClose={() => setError(null)}>{error}</Alert>
          </div>
        )}
        {view === 'patient' ? (
          <BookingForm doctors={doctors} loading={loadingDoctors} onBooked={fetchAppointments} />
        ) : (
          <AdminDashboard
            appointments={appointments}
            doctors={doctors}
            loading={loadingAppts}
            onRefresh={fetchAppointments}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        MediBook · Built with MongoDB, Express, React &amp; Node.js
      </footer>
    </div>
  );
}
