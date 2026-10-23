import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCsvCell, normalizeEmail, calculateRemainingSeats } from '../lib/utils.ts';
import { db } from './db.ts';

test('security: sanitizeCsvCell neutralizes dangerous spreadsheet injection attacks', () => {
  const attacks = [
    '=cmd|"/C calc"!A0',
    '+2+5+cmd|"/C calc"!A0',
    '-5+6+cmd|"/C calc"!A0',
    '@SUM(1+1)*cmd|"/C calc"!A0',
    '\t=1+1',
    '\r=HYPERLINK("http://attacker.com")',
  ];

  for (const attack of attacks) {
    const sanitized = sanitizeCsvCell(attack);
    assert.ok(
      sanitized.startsWith("'"),
      `Expected sanitized value to start with single quote, got: ${sanitized}`
    );
  }

  // Safe strings remain unquoted
  assert.equal(sanitizeCsvCell('Ayan Ali'), 'Ayan Ali');
  assert.equal(sanitizeCsvCell('ayan@example.com'), 'ayan@example.com');
  assert.equal(sanitizeCsvCell(2026), '2026');
});

test('security: normalizeEmail strips whitespace and enforces lowercasing', () => {
  assert.equal(normalizeEmail('  Hassan.Warsame@LavaHub.ORG  '), 'hassan.warsame@lavahub.org');
});

test('security: atomic capacity calculations never yield negative seats', () => {
  assert.equal(calculateRemainingSeats(20, 20), 0);
  assert.equal(calculateRemainingSeats(20, 25), 0);
  assert.equal(calculateRemainingSeats(0, 5), 0);
  assert.equal(calculateRemainingSeats(30, 10), 20);
});

test('security: FIFO waitlist queue maintains strict chronological order', () => {
  const ws = db.saveWorkshop({
    title: 'FIFO Order Verification Workshop',
    capacity: 1,
    status: 'published',
  });

  const emailLead = `lead-${Date.now()}@example.com`;
  const emailWait1 = `wait1-${Date.now()}@example.com`;
  const emailWait2 = `wait2-${Date.now()}@example.com`;

  // First attendee gets the seat
  const seatHolder = db.registerGuest({
    workshopId: ws.id,
    fullName: 'Seat Holder',
    email: emailLead,
    experienceLevel: 'beginner',
  });

  // Second attendee is waitlisted position #1
  const w1 = db.registerGuest({
    workshopId: ws.id,
    fullName: 'Waitlist First',
    email: emailWait1,
    experienceLevel: 'intermediate',
  });
  assert.equal(w1.status, 'waitlisted');

  // Third attendee is waitlisted position #2
  const w2 = db.registerGuest({
    workshopId: ws.id,
    fullName: 'Waitlist Second',
    email: emailWait2,
    experienceLevel: 'advanced',
  });
  assert.equal(w2.status, 'waitlisted');

  // Cancel seat holder -> First in line must be promoted!
  const cancelRes = db.cancelRegistration(seatHolder.registration!.cancellationCode!);
  assert.equal(cancelRes.success, true);
  assert.equal(cancelRes.promotedEmail, emailWait1);
});
