import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { Language, translations } from '../utils/translations';
import { 
  Search, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Share2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  Layers
} from 'lucide-react';

interface TrackPageProps {
  complaints: Complaint[];
  lang: Language;
  onOpenReport: () => void;
}

export const TrackPage: React.FC<TrackPageProps> = ({
  complaints,
  lang,
  onOpenReport,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(
    complaints[0]?.id || ''
  );
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [copiedId, setCopiedId] = useState(false);

  // Filter complaints
  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchAddress = c.location.address.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchAddress) return false;
    }
    return true;
  });

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId) || filtered[0] || complaints[0];

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'submitted':
        return { label: t.statuses.submitted, bg: 'bg-amber-950/80 text-amber-300 border-amber-800' };
      case 'under_review':
        return { label: t.statuses.under_review, bg: 'bg-orange-950/80 text-orange-300 border-orange-800' };
      case 'approved':
        return { label: t.statuses.approved, bg: 'bg-blue-950/80 text-blue-300 border-blue-800' };
      case 'assigned':
        return { label: t.statuses.assigned, bg: 'bg-purple-950/80 text-purple-300 border-purple-800' };
      case 'in_progress':
        return { label: t.statuses.in_progress, bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' };
      case 'resolved':
        return { label: t.statuses.resolved, bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' };
      case 'rejected':
        return { label: t.statuses.rejected, bg: 'bg-rose-950/80 text-rose-300 border-rose-800' };
    }
  };

  const timelineSteps: { status: ComplaintStatus; label: string; desc: string }[] = [
    { status: 'submitted', label: '1. Submitted', desc: 'Complaint registered by citizen with GPS' },
    { status: 'under_review', label: '2. Under Review', desc: 'BBMP Ward officer inspecting validity' },
    { status: 'approved', label: '3. Approved', desc: 'Report verified and civic points credited' },
    { status: 'assigned', label: '4. Assigned', desc: 'Dispatched to local sanitation team' },
    { status: 'in_progress', label: '5. In Progress', desc: 'Sanitation team active on site' },
    { status: 'resolved', label: '6. Resolved', desc: 'Area cleaned & before/after verified' },
  ];

  const getStepState = (stepStatus: ComplaintStatus, currentStatus: ComplaintStatus) => {
    const order: ComplaintStatus[] = [
      'submitted',
      'under_review',
      'approved',
      'assigned',
      'in_progress',
      'resolved',
    ];
    if (currentStatus === 'rejected') {
      return stepStatus === 'submitted' ? 'done' : 'inactive';
    }
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'done';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const handleCopyLink = () => {
    if (selectedComplaint) {
      navigator.clipboard.writeText(
        `Track Bengaluru Complaint ${selectedComplaint.id} - ${selectedComplaint.location.address}`
      );
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Search className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              {lang === 'kn' ? 'ಲೈವ್ ದೂರು ಟ್ರ್ಯಾಕಿಂಗ್' : 'Live Civic Transparency'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.trackComplaint}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {lang === 'kn'
              ? 'ದೂರಿನ ಪ್ರತಿಯೊಂದು ಹಂತವನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸ್ವಚ್ಛತೆಯ ಫೋಟೋಗಳನ್ನು ವೀಕ್ಷಿಸಿ'
              : 'Monitor real-time progress from initial GPS submission to final municipal cleanup'}
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-md hover:from-emerald-400 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.reportGarbage}</span>
        </button>
      </div>

      {/* Search and Filter Row */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchComplaintPlaceholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full py-3 px-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">{t.filterAll} ({complaints.length})</option>
            <option value="submitted">1. {t.statuses.submitted}</option>
            <option value="under_review">2. {t.statuses.under_review}</option>
            <option value="assigned">3. {t.statuses.assigned}</option>
            <option value="in_progress">4. {t.statuses.in_progress}</option>
            <option value="resolved">5. {t.statuses.resolved}</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Complaint List & Detailed Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Complaint Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>{filtered.length} {lang === 'kn' ? 'ದೂರುಗಳು ಕಂಡುಬಂದಿವೆ' : 'Complaints Listed'}</span>
            <span>Click to track progress</span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filtered.map((c) => {
              const isSelected = selectedComplaint?.id === c.id;
              const badge = getStatusBadge(c.status);
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaintId(c.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 shadow-xl shadow-emerald-950/40'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      {c.id}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1 mb-2.5">
                    {c.location.address}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span className="text-slate-300 font-medium">
                      {t.categories[c.category]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                <p className="text-sm">No complaints found matching criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Complaint Detailed Progress View */}
        {selectedComplaint && (
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Header with Title and Share */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-800">
                    {selectedComplaint.id}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedComplaint.status).bg}`}>
                    {getStatusBadge(selectedComplaint.status).label}
                  </span>
                  {selectedComplaint.isHighPriority && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                      High Priority
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {selectedComplaint.title}
                </h2>
              </div>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                title="Share complaint tracking link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedId ? 'Copied Details!' : 'Share'}</span>
              </button>
            </div>

            {/* Before and After Visual Experience */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>{t.beforeAndAfter}</span>
                </span>
                {selectedComplaint.status === 'resolved' && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Area Verified Clean
                  </span>
                )}
              </div>

              {selectedComplaint.resolvedImageUrl ? (
                /* Interactive Before & After comparison slider */
                <div className="space-y-3">
                  <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-700 select-none">
                    {/* Resolved (After) Image in Background */}
                    <img
                      src={selectedComplaint.resolvedImageUrl}
                      alt="After cleaning"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-[11px] font-bold backdrop-blur-md">
                      Cleaned (After)
                    </div>

                    {/* Reported (Before) Image clipped by slider position */}
                    <div
                      className="absolute inset-y-0 left-0 overflow-hidden"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src={selectedComplaint.imageUrl}
                        alt="Before cleaning"
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-600 text-rose-300 text-[11px] font-bold backdrop-blur-md">
                        Reported (Before)
                      </div>
                    </div>

                    {/* Slider bar divider */}
                    <div
                      className="absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-2xl flex items-center justify-center"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                        ⟷
                      </div>
                    </div>
                  </div>

                  {/* Range Slider Control */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-rose-400 font-semibold">Before</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-[11px] text-emerald-400 font-semibold">After</span>
                  </div>
                </div>
              ) : (
                /* Single Image View when unresolved */
                <div className="relative h-60 rounded-2xl overflow-hidden border border-slate-700 bg-black">
                  <img
                    src={selectedComplaint.imageUrl}
                    alt={selectedComplaint.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 text-slate-200 text-xs font-semibold backdrop-blur-md border border-slate-700">
                    Initial Photo Evidence
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
                    <span>Awaiting field staff cleaning & photo resolution</span>
                    <span className="text-amber-400 font-bold">In Pipeline</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-Step 6-Stage Timeline */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{t.timeline}</span>
              </h3>

              <div className="space-y-3">
                {timelineSteps.map((step, idx) => {
                  const state = getStepState(step.status, selectedComplaint.status);
                  return (
                    <div key={step.status} className="flex items-start gap-3">
                      <div className="pt-0.5">
                        {state === 'done' && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        {state === 'active' && (
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
                          </div>
                        )}
                        {state === 'pending' && (
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center text-xs font-medium">
                            {idx + 1}
                          </div>
                        )}
                        {state === 'inactive' && (
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-600 border border-slate-700 flex items-center justify-center text-xs">
                            -
                          </div>
                        )}
                      </div>

                      <div className="flex-1 pb-2 border-b border-slate-800/60">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${
                            state === 'done' ? 'text-emerald-400' : state === 'active' ? 'text-amber-300' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </span>
                          {state === 'done' && (
                            <span className="text-[10px] text-slate-400">Completed</span>
                          )}
                          {state === 'active' && (
                            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Current Stage</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location & Metadata Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">GPS Location:</span>
                <p className="text-slate-200 font-semibold">{selectedComplaint.location.address}</p>
                <div className="text-[10px] font-mono text-emerald-400">
                  Lat: {selectedComplaint.location.lat.toFixed(4)}, Lng: {selectedComplaint.location.lng.toFixed(4)}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">BBMP Zone & Ward:</span>
                <p className="text-slate-200 font-semibold">{selectedComplaint.location.zone} Zone (Ward #{selectedComplaint.location.wardNumber || 112})</p>
                <span className="text-[10px] text-slate-400">Landmark: {selectedComplaint.location.landmark}</span>
              </div>

              {selectedComplaint.assignedTeam && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Assigned Cleaning Team:</span>
                    <span className="text-slate-200 font-semibold">{selectedComplaint.assignedTeam}</span>
                  </div>
                  {selectedComplaint.pointsAwarded > 0 && (
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Points Awarded:</span>
                      <span className="text-emerald-400 font-bold">+{selectedComplaint.pointsAwarded} Pts</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Staff / Admin Notes */}
            {(selectedComplaint.adminNotes || selectedComplaint.cleaningNotes) && (
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-xs space-y-2">
                {selectedComplaint.adminNotes && (
                  <div>
                    <span className="font-bold text-amber-300">BBMP Admin Note: </span>
                    <span className="text-slate-300">{selectedComplaint.adminNotes}</span>
                  </div>
                )}
                {selectedComplaint.cleaningNotes && (
                  <div>
                    <span className="font-bold text-emerald-400">Cleaning Crew Report: </span>
                    <span className="text-slate-300">{selectedComplaint.cleaningNotes}</span>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
};
