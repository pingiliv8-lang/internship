const tabs = [
  { id: 'patient', label: 'Patient Portal' },
  { id: 'admin', label: 'Admin Desk' },
];

export default function Navbar({ view, onChange }) {
  return (
    <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-3 justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="w-8 h-8" />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Medi<span className="text-indigo-600">Book</span>
          </h1>
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={view === t.id}
              onClick={() => onChange(t.id)}
              className={`px-4 sm:px-5 py-2 rounded-md text-sm font-medium transition-all ${
                view === t.id ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
