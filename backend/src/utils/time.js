const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (value) =>
  typeof value === 'string' && DATE_RE.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());

// "02:00 PM" -> 840 (minutes since midnight)
function slotToMinutes(slot) {
  const [, h, m, ampm] = slot.match(/(\d{1,2}):(\d{2}) (AM|PM)/);
  return ((Number(h) % 12) + (ampm === 'PM' ? 12 : 0)) * 60 + Number(m);
}

// Local-time YYYY-MM-DD for "today"
function todayString(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function isPastSlot(date, slot, now = new Date()) {
  const today = todayString(now);
  if (date < today) return true;
  if (date > today) return false;
  return slotToMinutes(slot) <= now.getHours() * 60 + now.getMinutes();
}

module.exports = { isValidDate, slotToMinutes, todayString, isPastSlot };
