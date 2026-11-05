import { initials } from '../lib/time';

export default function DoctorCard({ doctor, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(doctor)}
      aria-pressed={selected}
      className={`text-left p-4 rounded-xl transition-all border-2 flex gap-3 items-start ${
        selected ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-300 bg-white'
      }`}
    >
      <div
        className={`w-11 h-11 shrink-0 rounded-full grid place-items-center font-bold text-sm ${
          selected ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
        }`}
      >
        {initials(doctor.name)}
      </div>
      <div className="min-w-0">
        <p className="font-bold text-slate-900 truncate">{doctor.name}</p>
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{doctor.specialty}</p>
        <p className="text-xs text-slate-500 mt-1">
          {doctor.experience} yrs exp · ₹{doctor.fee}
        </p>
      </div>
    </button>
  );
}
