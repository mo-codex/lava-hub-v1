import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from './db.ts';

test('db prevents duplicate active registrations for the same normalized email', () => {
  const ws = db.getWorkshops()[0];
  const email = `test-duplicate-${Date.now()}@example.com`;

  const res1 = db.registerGuest({
    workshopId: ws.id,
    fullName: 'Test User',
    email: email.toUpperCase(),
    experienceLevel: 'beginner',
  });
  assert.equal(res1.success, true);

  // Attempt duplicate registration
  const res2 = db.registerGuest({
    workshopId: ws.id,
    fullName: 'Test User 2',
    email: email.toLowerCase(),
    experienceLevel: 'intermediate',
  });
  assert.equal(res2.success, true);
  assert.match(res2.message, /already have an active registration/i);
});

test('db places user on waitlist when capacity is exhausted and automatically promotes on cancellation', () => {
  // Create a micro-workshop with capacity 1
  const microWs = db.saveWorkshop({
    title: 'Micro Concurrency Workshop',
    capacity: 1,
    status: 'published',
  });

  const email1 = `attendee1-${Date.now()}@example.com`;
  const email2 = `attendee2-${Date.now()}@example.com`;

  // First attendee claims the only seat
  const reg1 = db.registerGuest({
    workshopId: microWs.id,
    fullName: 'Attendee One',
    email: email1,
    experienceLevel: 'beginner',
  });
  assert.equal(reg1.status, 'confirmed');

  // Second attendee should be placed on waitlist
  const reg2 = db.registerGuest({
    workshopId: microWs.id,
    fullName: 'Attendee Two',
    email: email2,
    experienceLevel: 'intermediate',
  });
  assert.equal(reg2.status, 'waitlisted');

  // Attendee 1 cancels -> Attendee 2 should be automatically cascade promoted!
  const cancelResult = db.cancelRegistration(reg1.registration!.cancellationCode!);
  assert.equal(cancelResult.success, true);
  assert.equal(cancelResult.promotedEmail, email2);

  // Verify reg2 is now confirmed
  const updatedReg2 = db.getRegistrations(microWs.id).find((r) => r.id === reg2.registration!.id);
  assert.equal(updatedReg2?.status, 'confirmed');
});

test('db prevents cancelled or waitlisted attendees from being marked present', () => {
  const ws = db.getWorkshops()[0];
  const waitlistedAttendee = db.getRegistrations(ws.id).find((r) => r.status === 'waitlisted');

  if (waitlistedAttendee) {
    const markRes = db.markAttendance(ws.id, waitlistedAttendee.id, 'present');
    assert.equal(markRes.success, false);
    assert.match(markRes.message, /Cannot mark/i);
  }
});

test('db hides private meeting credentials from unauthenticated public queries', () => {
  const publishedWs = db.getPublishedWorkshops()[0];
  const publicView = db.getWorkshopBySlug(publishedWs.slug, false);

  assert.equal(publicView?.privateMeetingUrl, undefined);
  assert.equal(publicView?.privateMeetingPassword, undefined);

  // Authenticated admin view returns meeting credentials
  const adminView = db.getWorkshopBySlug(publishedWs.slug, true);
  assert.ok(adminView?.privateMeetingUrl !== undefined);
});
