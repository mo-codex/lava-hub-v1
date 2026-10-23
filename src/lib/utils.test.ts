import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cn,
  formatMogadishuTime,
  normalizeEmail,
  sanitizeCsvCell,
  calculateRemainingSeats,
} from './utils.ts';

test('cn combines truthy classnames correctly', () => {
  assert.equal(cn('btn', false && 'hidden', 'btn-primary', null, undefined), 'btn btn-primary');
});

test('normalizeEmail lowercases and trims input', () => {
  assert.equal(normalizeEmail('  Ayan.Ali@LavaHub.org  '), 'ayan.ali@lavahub.org');
  assert.equal(normalizeEmail('USER@DOMAIN.COM'), 'user@domain.com');
});

test('formatMogadishuTime formats UTC time to EAT timezone (UTC+3)', () => {
  // 12:00 UTC = 15:00 EAT (3:00 PM) in Mogadishu
  const utcIso = '2026-10-25T12:00:00Z';
  const result = formatMogadishuTime(utcIso, { format: 'timeOnly' });
  assert.match(result, /3:00\s?PM/);
});

test('sanitizeCsvCell neutralizes formula injection prefixes', () => {
  assert.equal(sanitizeCsvCell('=1+1'), "'=1+1");
  assert.equal(sanitizeCsvCell('+cmd|/c calc'), "'+cmd|/c calc");
  assert.equal(sanitizeCsvCell('-500'), "'-500");
  assert.equal(sanitizeCsvCell('@SUM(A1:A10)'), "'@SUM(A1:A10)");
  assert.equal(sanitizeCsvCell('Safe Text Value'), 'Safe Text Value');
  assert.equal(sanitizeCsvCell(1234), '1234');
  assert.equal(sanitizeCsvCell(null), '');
});

test('calculateRemainingSeats returns non-negative remaining capacity', () => {
  assert.equal(calculateRemainingSeats(50, 20), 30);
  assert.equal(calculateRemainingSeats(50, 50), 0);
  assert.equal(calculateRemainingSeats(50, 60), 0);
  assert.equal(calculateRemainingSeats(0, 0), 0);
  assert.equal(calculateRemainingSeats(-5, 2), 0);
});
