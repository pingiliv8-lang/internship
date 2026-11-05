const test = require('node:test');
const assert = require('node:assert');
const { isValidDate, slotToMinutes, isPastSlot } = require('../src/utils/time');

test('slotToMinutes handles AM, PM and noon', () => {
  assert.strictEqual(slotToMinutes('09:00 AM'), 540);
  assert.strictEqual(slotToMinutes('12:00 PM'), 720);
  assert.strictEqual(slotToMinutes('02:00 PM'), 840);
});

test('isValidDate accepts only YYYY-MM-DD', () => {
  assert.ok(isValidDate('2026-11-05'));
  assert.ok(!isValidDate('05-11-2026'));
  assert.ok(!isValidDate(undefined));
});

test('isPastSlot compares against the current time', () => {
  const now = new Date(2026, 10, 5, 10, 30); // 5 Nov 2026, 10:30
  assert.ok(isPastSlot('2026-11-04', '04:00 PM', now));
  assert.ok(isPastSlot('2026-11-05', '10:00 AM', now));
  assert.ok(!isPastSlot('2026-11-05', '11:00 AM', now));
  assert.ok(!isPastSlot('2026-11-06', '09:00 AM', now));
});
