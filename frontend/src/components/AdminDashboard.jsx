import { useMemo, useState } from 'react';
import Alert from './Alert';
import { cancelAppointment, errorMessage } from '../lib/api';
import { formatDate, todayString } from '../lib/time';

export default function AdminDashboard({ appointments, doctors, loading, onRefresh }) {
  const [search, setSearch] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const today = todayString();

  const stats = useMemo(() => {
    const booked = appointments.filter((a) => a.status === 'booked');
    return {
      today: booked.filter((a) => a.date === today).length,
      upcoming: booked.filter((a) => a.date >= today).length,
      total: appointments.length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    };
  }, [appointments, today]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointments.filter((a) => {
      if (doctorId && a.doctorId !== doctorId) return false;
      if (status === 'upcoming' && !(a.status === 'booked' && a.date >= today)) return false;
      if (status === 'past' && !(a.status === 'booked' && a.date < today)) return false;
      if (status === 'cancelled' && a.status !== 'cancelled') return false;
      if (q && !a.patientName.toLowerCase().includes(q) && !(a.phone || '').includes(q)) return false;
      return true;
    });
  }, [appointments, search, doctorId, status, today]);

  const handleCancel = async (appt) => {
    if (!window.confirm(`Cancel ${appt.patientName}'s appointment on ${formatDate(appt.date)} at ${appt.timeSlot}?`)) return;
    setBusyId(appt._id);
    setError(null);
    try {
      await cancelAppointment(appt._id);
      await onRefresh();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const selectCls =
    'bg-white border border-slate-200 text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Today" value={stats.today} accent="text-indigo-600" />
        <Stat label="Upcoming" value={stats.upcoming} accent="text-emerald-600" />
        <Stat label="All bookings" value={stats.total} accent="text-slate-900" />
        <Stat label="Cancelled" value={stats.cancelled} accent="text-rose-600" />
      </div>

      <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="search"
              placeholder="Search patient or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${selectCls} w-full sm:w-56`}
            />
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className={selectCls} aria-label="Filter by doctor">
              <option value="">All doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls} aria-label="Filter by status">
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
              <option value="all">All</option>
            </select>
            <button onClick={onRefresh} className="px-3 py-2.5 text-sm font-medium rounded-xl border border-slate-200 hover:bg-slate-50" title="Refresh">
              ↻ Refresh
            </button>
          </div>
        </div>

        {error && <div className="mb-4"><Alert type="error" onClose={() => setError(null)}>{error}</Alert></div>}

        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left text-sm text-slate-600 min-w-[640px]">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Patient</th>
                <th className="px-5 py-3.5 font-semibold">Specialist</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Time</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-400">Loading appointments…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-400">No appointments match these filters.</td></tr>
              ) : (
                rows.map((a) => (
                  <tr key={a._id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{a.patientName}</p>
                      {a.phone && <p className="text-xs text-slate-400">{a.phone}</p>}
                      {a.reason && <p className="text-xs text-slate-500 max-w-[220px] truncate" title={a.reason}>{a.reason}</p>}
                    </td>
                    <td className="px-5 py-4">{a.doctorName}</td>
                    <td className="px-5 py-4 font-medium whitespace-nowrap">
                      {formatDate(a.date)}
                      {a.date === today && <span className="ml-2 text-[10px] font-bold uppercase text-indigo-600">Today</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg text-xs whitespace-nowrap">{a.timeSlot}</span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge appt={a} today={today} /></td>
                    <td className="px-5 py-4 text-right">
                      {a.status === 'booked' && a.date >= today && (
                        <button
                          onClick={() => handleCancel(a)}
                          disabled={busyId === a._id}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                        >
                          {busyId === a._id ? 'Cancelling…' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`text-3xl font-extrabold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ appt, today }) {
  if (appt.status === 'cancelled') return <Badge cls="bg-rose-50 text-rose-700">Cancelled</Badge>;
  if (appt.date < today) return <Badge cls="bg-slate-100 text-slate-600">Completed</Badge>;
  return <Badge cls="bg-emerald-50 text-emerald-700">Confirmed</Badge>;
}

const Badge = ({ cls, children }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{children}</span>
);
