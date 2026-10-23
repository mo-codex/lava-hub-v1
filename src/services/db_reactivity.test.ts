import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from './db.ts';

test('db.subscribe fires when a workshop is created, edited, or cancelled', () => {
  let notifyCount = 0;
  const unsubscribe = db.subscribe(() => {
    notifyCount++;
  });

  // 1. Create a workshop
  const created = db.saveWorkshop({
    title: 'Test Reactive Workshop',
    category: 'React',
    status: 'published',
    capacity: 25,
  });

  assert.ok(created.id, 'Created workshop should have an ID');
  assert.equal(created.status, 'published');
  assert.ok(notifyCount >= 1, 'Listener should have fired on workshop creation');

  const countAfterCreate = notifyCount;

  // 2. Edit workshop
  const updated = db.saveWorkshop({
    id: created.id,
    title: 'Updated Reactive Workshop Title',
  });

  assert.equal(updated.title, 'Updated Reactive Workshop Title');
  assert.ok(notifyCount > countAfterCreate, 'Listener should have fired on workshop edit');

  const countAfterEdit = notifyCount;

  // 3. Cancel workshop
  const cancelled = db.cancelWorkshop(created.id);
  assert.ok(cancelled);
  assert.equal(cancelled?.status, 'cancelled');
  assert.ok(notifyCount > countAfterEdit, 'Listener should have fired on workshop cancellation');

  // Clean up
  db.deleteWorkshop(created.id);
  unsubscribe();
});

test('db.getPublicWorkshops includes published and cancelled, but excludes drafts', () => {
  // Create a draft workshop
  const draftWs = db.saveWorkshop({
    title: 'Hidden Draft Workshop',
    status: 'draft',
  });

  // Create a published workshop
  const publishedWs = db.saveWorkshop({
    title: 'Public Active Workshop',
    status: 'published',
  });

  // Create a cancelled workshop
  const cancelledWs = db.saveWorkshop({
    title: 'Public Cancelled Workshop',
    status: 'cancelled',
  });

  const publicWorkshops = db.getPublicWorkshops();

  // Draft must NOT be in public workshops
  assert.equal(
    publicWorkshops.some((w) => w.id === draftWs.id),
    false,
    'Draft workshop should not be visible to public catalog'
  );

  // Published MUST be in public workshops
  assert.equal(
    publicWorkshops.some((w) => w.id === publishedWs.id),
    true,
    'Published workshop must be visible to public catalog'
  );

  // Cancelled MUST be in public workshops (so students see cohort cancelled notice)
  assert.equal(
    publicWorkshops.some((w) => w.id === cancelledWs.id),
    true,
    'Cancelled workshop must be visible to public catalog'
  );

  // Clean up
  db.deleteWorkshop(draftWs.id);
  db.deleteWorkshop(publishedWs.id);
  db.deleteWorkshop(cancelledWs.id);
});

test('db.subscribeCommunity records subscriptions and prevents duplicate normalization', () => {
  const email = 'student_test_' + Date.now() + '@example.com';

  const res1 = db.subscribeCommunity(email);
  assert.equal(res1.success, true);
  assert.equal(res1.message, 'Welcome to the Lava Hub community!');

  // Subscribing again with uppercase and spaces
  const res2 = db.subscribeCommunity('  ' + email.toUpperCase() + '  ');
  assert.equal(res2.success, true);
  assert.equal(res2.message, 'You are already subscribed to the Lava Hub community!');

  const subs = db.getCommunitySubscribers();
  const matches = subs.filter((s) => s.email === email.toLowerCase());
  assert.equal(matches.length, 1, 'Normalized email should only appear once in community subscribers');
});
