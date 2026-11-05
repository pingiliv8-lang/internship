import { useEffect, useState } from 'react';
import DoctorCard from './DoctorCard';
import Alert from './Alert';
import { bookAppointment, errorMessage, getSlots } from '../lib/api';
import { formatDate, isPastSlot, todayString } from '../lib/time';

const emptyForm = { patientName: '', phone: '', reason: '', date: '', timeSlot: '' };
const inputCls =
  'w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-all';

export default function BookingForm({ doctors, loading, onBooked }) {
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Load availability whenever doctor or date changes
  useEffect(() => {
    if (!doctor || !form.date) return;
    let cancelled = false;
    setSlotsLoading(true);
    getSlots(doctor.id, form.date)
      .then((data) => !cancelled && setSlots(data))
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setSlotsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [doctor, form.date]);

  const selectDoctor = (d) => {
    setDoctor(d);
    setForm((f) => ({ ...f, timeSlot: '' }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.timeSlot) return setError('Please choose a time slot.');
    setSubmitting(true);
    setError(null);
    try {
      const { appointment } = await bookAppointment({ doctorId: doctor.id, ...form });
      setConfirmation(appointment);
      setForm(emptyForm);
      setDoctor(null);
      setSlots([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onBooked();
    } catch (err) {
      setError(errorMessage(err));
      // Refresh availability in case someone else just took the slot
      getSlots(doctor.id, form.date).then(setSlots).catch(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center animate-fade-up">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 grid place-items-center text-3xl mb-5">✓</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Appointment confirmed</h2>
        <p className="text-slate-500 text-sm mb-6">We've reserved your slot. Please arrive 10 minutes early.</p>
        <dl className="text-left bg-slate-50 rounded-xl p-5 space-y-2 text-sm mb-8">
          <Row label="Patient" value={confirmation.patientName} />
          <Row label="Doctor" value={confirmation.doctorName} />
          <Row label="Date" value={formatDate(confirmation.date)} />
          <Row label="Time" value={confirmation.timeSlot} />
          <Row label="Booking ID" value={confirmation._id.slice(-8).toUpperCase()} />
        </dl>
        <button
          onClick={() => setConfirmation(null)}
          className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Book an Appointment</h2>
      <p className="text-slate-500 mb-8 text-sm">Select a specialist and secure your time slot in under a minute.</p>

      {error && (
        <div className="mb-6">
          <Alert type="error" onClose={() => setError(null)}>{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <Label step={1}>Select Specialist</Label>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[84px] rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {doctors.map((d) => (
                <DoctorCard key={d.id} doctor={d} selected={doctor?.id === d.id} onSelect={selectDoctor} />
              ))}
            </div>
          )}
        </section>

        {doctor && (
          <div className="space-y-8 animate-fade-up">
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label step={2}>Patient Name</Label>
                <input type="text" required maxLength={80} placeholder="Full name" className={inputCls} value={form.patientName} onChange={set('patientName')} />
              </div>
              <div>
                <Label>Phone <span className="font-normal text-slate-400">(optional)</span></Label>
                <input type="tel" maxLength={20} placeholder="+91 98765 43210" className={inputCls} value={form.phone} onChange={set('phone')} />
              </div>
              <div className="sm:col-span-2">
                <Label>Reason for visit <span className="font-normal text-slate-400">(optional)</span></Label>
                <textarea rows={2} maxLength={300} placeholder="Briefly describe your symptoms" className={inputCls} value={form.reason} onChange={set('reason')} />
              </div>
            </section>

            <section>
              <Label step={3}>Select Date</Label>
              <input
                type="date"
                required
                min={todayString()}
                className={`${inputCls} sm:max-w-xs`}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, timeSlot: '' }))}
              />
            </section>

            {form.date && (
              <section className="animate-fade-up">
                <Label step={4}>Choose Time Slot</Label>
                {slotsLoading ? (
                  <p className="text-sm text-slate-400">Checking availability…</p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {slots.map(({ time, available }) => {
                      const past = isPastSlot(form.date, time);
                      const disabled = !available || past;
                      const active = form.timeSlot === time;
                      return (
                        <button
                          type="button"
                          key={time}
                          disabled={disabled}
                          title={!available ? 'Already booked' : past ? 'Time has passed' : undefined}
                          onClick={() => setForm((f) => ({ ...f, timeSlot: time }))}
                          className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all border ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                              : disabled
                                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            <button
              type="submit"
              disabled={submitting || !form.timeSlot}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold tracking-wide hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Booking…' : form.timeSlot ? `Confirm ${form.timeSlot} with ${doctor.name}` : 'Confirm Appointment'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function Label({ step, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
      {step && <span className="text-indigo-600 mr-1">{step}.</span>}
      {children}
    </label>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900 text-right">{value}</dd>
    </div>
  );
}
