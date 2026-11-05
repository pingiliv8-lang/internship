export default function Alert({ type = 'info', children, onClose }) {
  const styles = {
    error: 'bg-red-50 text-red-700 border-red-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };
  return (
    <div role="alert" className={`p-4 rounded-xl text-sm font-medium border flex items-start gap-3 animate-fade-up ${styles[type]}`}>
      <span className="flex-1">{children}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100" aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}
