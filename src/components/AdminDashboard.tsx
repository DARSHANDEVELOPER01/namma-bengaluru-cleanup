import React, { useState } from 'react';
import { Complaint, ComplaintStatus, BengaluruZone, AppointmentBooking } from '../types';
import { Language, translations } from '../utils/translations';
import { SUPABASE_PROJECT_ID } from '../utils/supabase';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Users, 
  Trash2, 
  Clock, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  Award, 
  Search, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  Filter,
  Calendar,
  Database,
  Mail,
  Phone
} from 'lucide-react';

interface AdminDashboardProps {
  complaints: Complaint[];
  appointments: AppointmentBooking[];
  lang: Language;
  onOpenAppointment: () => void;
  onUpdateComplaintStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    adminNotes?: string,
    assignedTeam?: string,
    pointsAwarded?: number
  ) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  complaints,
  appointments = [],
  lang,
  onOpenAppointment,
  onUpdateComplaintStatus,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'complaints' | 'appointments'>('complaints');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints[0] || null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState<BengaluruZone | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');

  // Modal action state
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Ward 112 Rapid Sanitation Team');
  const [bonusPoints, setBonusPoints] = useState(10);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Sanitation teams available for assignment in BBMP
  const SANITATION_TEAMS = [
    'Ward 112 Rapid Sanitation Team (Indiranagar)',
    'Ward 151 Solid Waste Clean Crew (Koramangala)',
    'Ward 45 Heritage Zone Sweeping Unit (Malleshwaram)',
    'Ward 84 IT Corridor Quick Response (Whitefield)',
    'Ward 153 South Zone Silt & Drainage Unit (Jayanagar)',
    'Central Night Mechanical Sweeper Squad',
  ];

  const filteredComplaints = complaints.filter((c) => {
    if (zoneFilter !== 'all' && c.location.zone !== zoneFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchName = c.citizenName.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchName) return false;
    }
    return true;
  });

  const handleVerifyAndApprove = (complaint: Complaint) => {
    const points = complaint.isHighPriority ? 20 : 10;
    onUpdateComplaintStatus(
      complaint.id,
      'approved',
      adminNoteInput || 'Verified as valid civic cleanliness report by Municipal Officer.',
      selectedTeam,
      points
    );
    setActionSuccessMsg(`Complaint ${complaint.id} approved! ${points} citizen points released.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleAssignToCrew = (complaint: Complaint) => {
    onUpdateComplaintStatus(
      complaint.id,
      'assigned',
      `Assigned to ${selectedTeam}. Crew notified for field dispatch.`,
      selectedTeam,
      complaint.pointsAwarded || (complaint.isHighPriority ? 20 : 10)
    );
    setActionSuccessMsg(`Assigned to ${selectedTeam}!`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleReject = (complaint: Complaint) => {
    onUpdateComplaintStatus(
      complaint.id,
      'rejected',
      adminNoteInput || 'Report could not be verified or is on private property.',
      undefined,
      0
    );
    setActionSuccessMsg(`Complaint ${complaint.id} marked as Rejected.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Metrics
  const submittedCount = complaints.filter(c => c.status === 'submitted').length;
  const underReviewCount = complaints.filter(c => c.status === 'under_review').length;
  const inProgressCount = complaints.filter(c => c.status === 'in_progress' || c.status === 'assigned').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              BBMP Municipal Officer Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.adminDashboard}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review citizen complaints, verify photographs, dispatch sanitation squads, and award civic points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
            Officer ID: <strong className="text-white">BBMP-OFF-4402</strong>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="my-4 p-3.5 rounded-2xl bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="my-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">New Reports (Pending)</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{submittedCount}</div>
          <div className="text-[10px] text-slate-500">Needs review & GPS check</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Under Review</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{underReviewCount}</div>
          <div className="text-[10px] text-slate-500">Ward officer triage</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Cleaning In Field</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{inProgressCount}</div>
          <div className="text-[10px] text-slate-500">Dispatched sanitation squads</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Total Resolved</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-500">With after-cleaning photo</div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'complaints'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Complaints Inbox ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'appointments'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Supabase Appointments ({appointments.length})</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
            {SUPABASE_PROJECT_ID}
          </span>
        </button>

        <button
          onClick={onOpenAppointment}
          className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-2 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>+ Book New Appointment</span>
        </button>
      </div>

      {activeTab === 'appointments' ? (
        /* Supabase Appointments View */
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl space-y-4">
          <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Supabase Live Database: Table 'appointments'
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Appointments submitted via citizen form are automatically inserted and synchronized in Supabase project <code className="text-emerald-300 font-mono">{SUPABASE_PROJECT_ID}</code>.
              </p>
            </div>

            <button
              onClick={onOpenAppointment}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-md hover:from-emerald-400 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Fill Appointment Booking Form</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto">
            {appointments.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">ID</th>
                    <th className="pb-3">Citizen Contact</th>
                    <th className="pb-3">Service Type</th>
                    <th className="pb-3">Scheduled Slot</th>
                    <th className="pb-3">Ward & Zone</th>
                    <th className="pb-3">Address</th>
                    <th className="pb-3">Database Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pl-2 font-mono font-bold text-teal-400">
                        {apt.id}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-white">{apt.full_name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{apt.phone}</span>
                        </div>
                        {apt.email && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{apt.email}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="capitalize font-medium text-emerald-300">
                          {apt.service_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="text-white font-semibold">{apt.appointment_date}</div>
                        <div className="text-[10px] text-amber-400">{apt.appointment_time}</div>
                      </td>
                      <td className="py-3">
                        <div>{apt.bbmp_zone} Zone</div>
                        <div className="text-[10px] text-slate-400">Ward #{apt.ward_number || 112}</div>
                      </td>
                      <td className="py-3 max-w-[180px] truncate text-slate-300">
                        {apt.address}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Supabase Synced</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center space-y-3">
                <Database className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Appointments Logged Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the button below to book an appointment. It will automatically save to your Supabase project <code className="text-emerald-400">{SUPABASE_PROJECT_ID}</code>.
                </p>
                <button
                  onClick={onOpenAppointment}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Book First Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Complaints View */
        <>
          {/* Filter and Search Bar */}
          <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Complaint ID, citizen name, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="all">All Zones (All 8 BBMP Zones)</option>
            <option value="East">East Zone</option>
            <option value="South">South Zone</option>
            <option value="West">West Zone</option>
            <option value="Mahadevapura">Mahadevapura</option>
            <option value="Bommanahalli">Bommanahalli</option>
            <option value="Yelahanka">Yelahanka</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">1. Submitted (Pending)</option>
            <option value="under_review">2. Under Review</option>
            <option value="approved">3. Approved</option>
            <option value="assigned">4. Assigned to Crew</option>
            <option value="in_progress">5. In Progress</option>
            <option value="resolved">6. Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Split: Complaints Table & Selected Review Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Table */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Complaints Inbox ({filteredComplaints.length})</span>
            <span>Click row to review & dispatch</span>
          </div>

          <div className="divide-y divide-slate-800 max-h-[580px] overflow-y-auto">
            {filteredComplaints.map((c) => {
              const isSelected = selectedComplaint?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => { setSelectedComplaint(c); setAdminNoteInput(''); }}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-800/90 border-l-4 border-l-emerald-500' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {c.id}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {c.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {c.location.address}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                    <span>By: <strong className="text-slate-300">{c.citizenName}</strong></span>
                    <span className="text-amber-400 font-medium">Zone: {c.location.zone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Review & Dispatch Actions */}
        {selectedComplaint && (
          <div className="lg:col-span-5 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {selectedComplaint.id}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedComplaint.title}
                </h3>
              </div>
            </div>

            {/* Photo & GPS */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-700 bg-black">
              <img
                src={selectedComplaint.imageUrl}
                alt={selectedComplaint.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white">
                GPS Verified Evidence
              </div>
              <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-lg bg-slate-900/90 text-[10px] text-slate-300 flex items-center justify-between border border-slate-700">
                <span>Lat: {selectedComplaint.location.lat}, Lng: {selectedComplaint.location.lng}</span>
                <span className="text-emerald-400 font-semibold">{selectedComplaint.location.zone} Zone</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div><strong className="text-slate-400">Citizen:</strong> {selectedComplaint.citizenName} ({selectedComplaint.citizenPhone})</div>
              <div><strong className="text-slate-400">Category:</strong> {t.categories[selectedComplaint.category]}</div>
              <div><strong className="text-slate-400">Description:</strong> {selectedComplaint.description}</div>
            </div>

            {/* Admin Note Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Officer Notes / Instructions:
              </label>
              <textarea
                rows={2}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Enter inspection remarks or specific site directions..."
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Sanitation Team Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assign Cleaning Squad:
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
              >
                {SANITATION_TEAMS.map((team, idx) => (
                  <option key={idx} value={team}>{team}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleVerifyAndApprove(selectedComplaint)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verify & Approve</span>
                </button>

                <button
                  onClick={() => handleAssignToCrew(selectedComplaint)}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Dispatch Crew</span>
                </button>
              </div>

              <button
                onClick={() => handleReject(selectedComplaint)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject (Invalid / Private Property)</span>
              </button>
            </div>

          </div>
        )}

      </div>
      </>
      )}

    </div>
  );
};

