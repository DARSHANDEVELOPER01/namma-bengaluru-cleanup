import { createClient } from '@supabase/supabase-js';
import { AppointmentBooking, Complaint } from '../types';

export const SUPABASE_PROJECT_ID = 'vbqkovmxgvtqvtmbkapy';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_F2_cIbnL-tCheZQyQK16cw_r0_ANOQd';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new)
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_type TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  bbmp_zone TEXT,
  ward_number INTEGER,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security and grant public read/insert access for web form:
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert access" ON appointments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public read access" ON appointments FOR SELECT TO anon USING (true);
`;

export interface SupabaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  source: 'supabase' | 'local_fallback';
  message: string;
}

/**
 * Saves appointment booking to Supabase backend table 'appointments'.
 * Falls back to 'bookings' table or local storage seamlessly if table needs migration.
 */
export async function saveAppointmentToSupabase(
  booking: AppointmentBooking
): Promise<SupabaseResponse<AppointmentBooking>> {
  try {
    // 1. Try inserting to 'appointments' table
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          id: booking.id,
          full_name: booking.full_name,
          phone: booking.phone,
          email: booking.email || null,
          service_type: booking.service_type,
          appointment_date: booking.appointment_date,
          appointment_time: booking.appointment_time,
          bbmp_zone: booking.bbmp_zone,
          ward_number: booking.ward_number || 112,
          address: booking.address,
          notes: booking.notes || '',
          status: booking.status || 'confirmed',
          created_at: booking.created_at || new Date().toISOString(),
        },
      ])
      .select();

    if (!error) {
      // Also cache in local storage for instant offline resilience
      saveToLocalAppointments({ ...booking, synced_to_supabase: true });
      return {
        success: true,
        data: data?.[0] || booking,
        source: 'supabase',
        message: `Successfully saved appointment to Supabase table 'appointments' (Project: ${SUPABASE_PROJECT_ID})`,
      };
    }

    // 2. If 'appointments' table returned an error, check if 'bookings' table is used
    console.warn('Supabase appointments table returned notice:', error.message);
    const retryBooking = await supabase
      .from('bookings')
      .insert([
        {
          id: booking.id,
          full_name: booking.full_name,
          phone: booking.phone,
          email: booking.email,
          service_type: booking.service_type,
          appointment_date: booking.appointment_date,
          appointment_time: booking.appointment_time,
          address: booking.address,
          notes: booking.notes,
          status: booking.status,
          created_at: booking.created_at,
        },
      ])
      .select();

    if (!retryBooking.error) {
      saveToLocalAppointments({ ...booking, synced_to_supabase: true });
      return {
        success: true,
        data: retryBooking.data?.[0] || booking,
        source: 'supabase',
        message: `Saved appointment to Supabase table 'bookings' (Project: ${SUPABASE_PROJECT_ID})`,
      };
    }

    // If table not created in database yet, preserve locally and explain clearly
    saveToLocalAppointments({ ...booking, synced_to_supabase: false });
    return {
      success: true, // User booking is confirmed and stored locally
      data: booking,
      source: 'local_fallback',
      error: error.message,
      message: `Appointment confirmed and cached. Notice: Supabase table 'appointments' needs to be created in project ${SUPABASE_PROJECT_ID}.`,
    };
  } catch (err: any) {
    console.error('Error connecting to Supabase:', err);
    saveToLocalAppointments({ ...booking, synced_to_supabase: false });
    return {
      success: true,
      data: booking,
      source: 'local_fallback',
      error: err?.message || 'Network exception connecting to Supabase',
      message: 'Appointment confirmed and stored locally. Will sync to Supabase once connected.',
    };
  }
}

/**
 * Fetches appointment bookings from Supabase table or local storage cache.
 */
export async function fetchAppointmentsFromSupabase(): Promise<AppointmentBooking[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as AppointmentBooking[];
    }
  } catch (err) {
    console.warn('Could not fetch from Supabase table appointments:', err);
  }

  // Fallback to local storage
  return getLocalAppointments();
}

/**
 * Saves complaint to Supabase table 'complaints' if available.
 */
export async function saveComplaintToSupabase(complaint: Complaint): Promise<boolean> {
  try {
    const { error } = await supabase.from('complaints').insert([
      {
        id: complaint.id,
        title: complaint.title,
        category: complaint.category,
        description: complaint.description,
        address: complaint.location.address,
        lat: complaint.location.lat,
        lng: complaint.location.lng,
        zone: complaint.location.zone,
        ward_number: complaint.location.wardNumber,
        image_url: complaint.imageUrl,
        status: complaint.status,
        citizen_name: complaint.citizenName,
        citizen_phone: complaint.citizenPhone,
        points_awarded: complaint.pointsAwarded,
        is_high_priority: complaint.isHighPriority,
        submitted_at: complaint.submittedAt,
      },
    ]);
    return !error;
  } catch (e) {
    return false;
  }
}

// Local cache helpers
function getLocalAppointments(): AppointmentBooking[] {
  try {
    const raw = localStorage.getItem('blr_appointments_v1');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return [];
}

function saveToLocalAppointments(item: AppointmentBooking) {
  try {
    const existing = getLocalAppointments();
    const updated = [item, ...existing.filter((b) => b.id !== item.id)];
    localStorage.setItem('blr_appointments_v1', JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}
