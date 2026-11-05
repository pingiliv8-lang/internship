const pad = (n) => String(n).padStart(2, '0');

export const todayString = (now = new Date()) =>
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

export function slotToMinutes(slot) {
  const [, h, m, ampm] = slot.match(/(\d{1,2}):(\d{2}) (AM|PM)/);
  return ((Number(h) % 12) + (ampm === 'PM' ? 12 : 0)) * 60 + Number(m);
}

export function isPastSlot(date, slot, now = new Date()) {
  const today = todayString(now);
  if (date !== today) return date < today;
  return slotToMinutes(slot) <= now.getHours() * 60 + now.getMinutes();
}

export const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const initials = (name) =>
  name
    .replace(/^Dr\.?\s*/i, '')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
