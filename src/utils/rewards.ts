import { Complaint, ComplaintStatus, GarbageCategory, Badge, BengaluruZone } from '../types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_report',
    title: 'Civic Starter',
    titleKn: 'ನಾಗರಿಕ ಪ್ರವರ್ತಕ',
    description: 'Submitted first verified cleanliness complaint',
    descriptionKn: 'ಮೊದಲ ಪರಿಶೀಲಿಸಿದ ಸ್ವಚ್ಛತಾ ದೂರು ಸಲ್ಲಿಸಲಾಗಿದೆ',
    icon: '🌱',
    minPoints: 10,
    minResolved: 0,
  },
  {
    id: 'eco_patrol',
    title: 'Eco Patrol',
    titleKn: 'ಪರಿಸರ ಗಸ್ತುಪಡೆ',
    description: 'Earned 50 points by reporting neighborhood waste',
    descriptionKn: 'ಸ್ಥಳೀಯ ತ್ಯಾಜ್ಯ ವರದಿ ಮಾಡಿ 50 ಅಂಕ ಗಳಿಸಲಾಗಿದೆ',
    icon: '🛡️',
    minPoints: 50,
    minResolved: 1,
  },
  {
    id: 'swachha_warrior',
    title: 'Swachha Warrior',
    titleKn: 'ಸ್ವಚ್ಛ ಯೋಧ',
    description: '100+ points and multiple resolved areas',
    descriptionKn: '100+ ಅಂಕಗಳು ಮತ್ತು ಹಲವು ಪರಿಹರಿಸಲಾದ ಪ್ರದೇಶಗಳು',
    icon: '⚡',
    minPoints: 100,
    minResolved: 3,
  },
  {
    id: 'bengaluru_champion',
    title: 'Bengaluru Champion',
    titleKn: 'ಬೆಂಗಳೂರು ಚಾಂಪಿಯನ್',
    description: 'Top civic contributor with 250+ points and 5+ resolutions',
    descriptionKn: '250+ ಅಂಕಗಳು ಮತ್ತು 5+ ಪರಿಹಾರಗಳೊಂದಿಗೆ ಅಗ್ರ ನಾಗರಿಕ',
    icon: '🏆',
    minPoints: 250,
    minResolved: 5,
  },
];

/**
 * Calculates points awarded based on verification, priority, and resolution.
 * - Verified report: 10 points
 * - High-priority verified: 20 points
 * - Successfully resolved bonus: 30 bonus points
 */
export function calculatePoints(
  isVerified: boolean,
  isHighPriority: boolean,
  isResolved: boolean
): number {
  if (!isVerified) return 0;
  let points = isHighPriority ? 20 : 10;
  if (isResolved) {
    points += 30;
  }
  return points;
}

/**
 * Generates an official Bengaluru complaint ID (e.g. BLR-2026-8492)
 */
export function generateComplaintId(randomSeed?: number): string {
  const seed = randomSeed ?? Math.floor(1000 + Math.random() * 9000);
  return `BLR-2026-${seed}`;
}

/**
 * Checks which badges the user qualifies for.
 */
export function checkBadgeUnlocks(totalPoints: number, resolvedCount: number): string[] {
  return ALL_BADGES.filter(
    (b) => totalPoints >= b.minPoints && resolvedCount >= b.minResolved
  ).map((b) => b.id);
}

/**
 * Validates complaint form submission.
 */
export function validateComplaintSubmission(data: {
  title?: string;
  category?: GarbageCategory;
  description?: string;
  imageUrl?: string;
  location?: { lat: number; lng: number; address: string };
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long.';
  }

  if (!data.category) {
    errors.category = 'Please select a garbage category.';
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long.';
  }

  if (!data.imageUrl) {
    errors.imageUrl = 'Please provide or upload a photo of the waste.';
  }

  if (!data.location || !data.location.address || !data.location.lat || !data.location.lng) {
    errors.location = 'Please pin the location on the Bengaluru map.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Filters complaints by status, category, zone, and search query.
 */
export function filterComplaints(
  complaints: Complaint[],
  filters: {
    status?: ComplaintStatus | 'all';
    category?: GarbageCategory | 'all';
    zone?: BengaluruZone | 'all';
    search?: string;
  }
): Complaint[] {
  return complaints.filter((c) => {
    if (filters.status && filters.status !== 'all' && c.status !== filters.status) {
      return false;
    }
    if (filters.category && filters.category !== 'all' && c.category !== filters.category) {
      return false;
    }
    if (filters.zone && filters.zone !== 'all' && c.location.zone !== filters.zone) {
      return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchAddress = c.location.address.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAddress && !matchId) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Generates an official Bengaluru appointment booking ID (e.g. APT-2026-8492)
 */
export function generateAppointmentId(randomSeed?: number): string {
  const seed = randomSeed ?? Math.floor(1000 + Math.random() * 9000);
  return `APT-2026-${seed}`;
}

/**
 * Validates appointment booking form submission.
 */
export function validateAppointmentBooking(data: {
  full_name?: string;
  phone?: string;
  service_type?: string;
  appointment_date?: string;
  appointment_time?: string;
  address?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.full_name || data.full_name.trim().length < 2) {
    errors.full_name = 'Please enter your full name.';
  }

  if (!data.phone || data.phone.trim().length < 10) {
    errors.phone = 'Please enter a valid 10-digit mobile number.';
  }

  if (!data.service_type) {
    errors.service_type = 'Please select a service type.';
  }

  if (!data.appointment_date) {
    errors.appointment_date = 'Please select a preferred appointment date.';
  }

  if (!data.appointment_time) {
    errors.appointment_time = 'Please select a preferred time slot.';
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.address = 'Please provide the street address / ward for the appointment.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
