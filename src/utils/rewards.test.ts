import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePoints,
  generateComplaintId,
  checkBadgeUnlocks,
  validateComplaintSubmission,
  filterComplaints,
} from './rewards';
import { Complaint } from '../types';

test('calculatePoints: awards points correctly based on verification, priority, and resolution', () => {
  // Not verified -> 0 points
  assert.equal(calculatePoints(false, false, false), 0);
  assert.equal(calculatePoints(false, true, true), 0);

  // Standard verified -> 10 points
  assert.equal(calculatePoints(true, false, false), 10);

  // High-priority verified -> 20 points
  assert.equal(calculatePoints(true, true, false), 20);

  // Standard verified + resolved bonus -> 10 + 30 = 40 points
  assert.equal(calculatePoints(true, false, true), 40);

  // High-priority + resolved bonus -> 20 + 30 = 50 points
  assert.equal(calculatePoints(true, true, true), 50);
});

test('generateComplaintId: generates formatted ID BLR-2026-XXXX', () => {
  const id1 = generateComplaintId(4321);
  assert.equal(id1, 'BLR-2026-4321');

  const randomId = generateComplaintId();
  assert.match(randomId, /^BLR-2026-\d{4}$/);
});

test('checkBadgeUnlocks: unlocks badges at proper thresholds', () => {
  // 0 points -> 0 badges
  assert.deepEqual(checkBadgeUnlocks(0, 0), []);

  // 15 points, 0 resolved -> 'first_report'
  assert.deepEqual(checkBadgeUnlocks(15, 0), ['first_report']);

  // 60 points, 1 resolved -> 'first_report' and 'eco_patrol'
  assert.deepEqual(checkBadgeUnlocks(60, 1), ['first_report', 'eco_patrol']);

  // 260 points, 5 resolved -> all 4 badges
  assert.deepEqual(checkBadgeUnlocks(260, 5), [
    'first_report',
    'eco_patrol',
    'swachha_warrior',
    'bengaluru_champion',
  ]);
});

test('validateComplaintSubmission: catches incomplete submissions', () => {
  const emptyRes = validateComplaintSubmission({});
  assert.equal(emptyRes.isValid, false);
  assert.ok(emptyRes.errors.title);
  assert.ok(emptyRes.errors.category);
  assert.ok(emptyRes.errors.description);
  assert.ok(emptyRes.errors.imageUrl);
  assert.ok(emptyRes.errors.location);

  const validRes = validateComplaintSubmission({
    title: 'Overflowing bin near Metro',
    category: 'overflowing_dustbin',
    description: 'Black bin is overflowing onto pedestrian footpath',
    imageUrl: 'https://example.com/bin.jpg',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'MG Road Metro Station',
    },
  });
  assert.equal(validRes.isValid, true);
  assert.deepEqual(validRes.errors, {});
});

test('filterComplaints: filters accurately by status, category, zone, and search term', () => {
  const sampleComplaints: Complaint[] = [
    {
      id: 'BLR-2026-1001',
      title: 'Plastic dumping in drain',
      category: 'plastic_waste',
      description: 'Stormwater drain blocked with pet bottles',
      location: {
        lat: 12.9352,
        lng: 77.6245,
        address: 'Koramangala 4th Block',
        landmark: 'Near BDA Complex',
        zone: 'South',
      },
      imageUrl: 'https://example.com/c1.jpg',
      status: 'submitted',
      submittedAt: '2026-10-30T10:00:00Z',
      updatedAt: '2026-10-30T10:00:00Z',
      citizenId: 'user-1',
      citizenName: 'Arjun Rao',
      citizenPhone: '9845012345',
      pointsAwarded: 0,
      isHighPriority: false,
    },
    {
      id: 'BLR-2026-1002',
      title: 'Construction debris on 100ft road',
      category: 'construction_waste',
      description: 'Piles of cement blocks obstructing traffic',
      location: {
        lat: 12.9784,
        lng: 77.6408,
        address: 'Indiranagar 100ft Road',
        landmark: 'Opposite Toit',
        zone: 'East',
      },
      imageUrl: 'https://example.com/c2.jpg',
      status: 'resolved',
      submittedAt: '2026-10-29T08:00:00Z',
      updatedAt: '2026-10-30T14:00:00Z',
      citizenId: 'user-2',
      citizenName: 'Sneha Murthy',
      citizenPhone: '9845054321',
      pointsAwarded: 40,
      isHighPriority: true,
    },
  ];

  // Filter by status
  const resolvedOnly = filterComplaints(sampleComplaints, { status: 'resolved' });
  assert.equal(resolvedOnly.length, 1);
  assert.equal(resolvedOnly[0].id, 'BLR-2026-1002');

  // Filter by zone
  const southOnly = filterComplaints(sampleComplaints, { zone: 'South' });
  assert.equal(southOnly.length, 1);
  assert.equal(southOnly[0].id, 'BLR-2026-1001');

  // Search keyword
  const searchIndira = filterComplaints(sampleComplaints, { search: 'indiranagar' });
  assert.equal(searchIndira.length, 1);
  assert.equal(searchIndira[0].id, 'BLR-2026-1002');
});
