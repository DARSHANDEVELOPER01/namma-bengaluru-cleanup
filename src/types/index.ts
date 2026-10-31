export type Role = 'citizen' | 'admin' | 'staff';

export type GarbageCategory =
  | 'roadside_garbage'
  | 'overflowing_dustbin'
  | 'illegal_dumping'
  | 'plastic_waste'
  | 'construction_waste'
  | 'drainage_waste'
  | 'other_cleanliness';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export type BengaluruZone =
  | 'East'
  | 'West'
  | 'South'
  | 'Mahadevapura'
  | 'Bommanahalli'
  | 'Rajajinagar'
  | 'Yelahanka'
  | 'Dasarahalli';

export interface LocationCoords {
  lat: number;
  lng: number;
  address: string;
  landmark: string;
  zone: BengaluruZone;
  wardNumber?: number;
}

export interface Complaint {
  id: string; // e.g. BLR-2026-1042
  title: string;
  category: GarbageCategory;
  description: string;
  location: LocationCoords;
  imageUrl: string;
  resolvedImageUrl?: string;
  status: ComplaintStatus;
  submittedAt: string;
  updatedAt: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedTeam?: string;
  pointsAwarded: number;
  isHighPriority: boolean;
  adminNotes?: string;
  cleaningNotes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  points: number;
  reportsSubmitted: number;
  reportsResolved: number;
  badges: string[];
  joinedDate: string;
}

export interface Badge {
  id: string;
  title: string;
  titleKn: string;
  description: string;
  descriptionKn: string;
  icon: string;
  minPoints: number;
  minResolved: number;
  unlockedAt?: string;
}

export interface RewardVoucher {
  id: string;
  title: string;
  titleKn: string;
  provider: string;
  pointsRequired: number;
  discountValue: string;
  category: 'transit' | 'food' | 'culture' | 'eco';
  icon: string;
  code?: string;
}
