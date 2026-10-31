import React, { useEffect, useRef, useState } from 'react';
import { Complaint, ComplaintStatus, GarbageCategory, BengaluruZone } from '../types';
import { Language, translations } from '../utils/translations';
import L from 'leaflet';
import { 
  Filter, 
  MapPin, 
  Layers, 
  Eye, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface MapViewProps {
  complaints: Complaint[];
  lang: Language;
  onSelectComplaint: (complaintId: string) => void;
  onOpenReport: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  complaints,
  lang,
  onSelectComplaint,
  onOpenReport,
}) => {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [selectedZone, setSelectedZone] = useState<BengaluruZone | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<GarbageCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // Filter complaints based on state
  const filteredComplaints = complaints.filter((c) => {
    if (selectedZone !== 'all' && c.location.zone !== selectedZone) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    return true;
  });

  const getMarkerColor = (status: ComplaintStatus): string => {
    switch (status) {
      case 'submitted':
        return '#ef4444'; // Red: Pending
      case 'under_review':
        return '#f97316'; // Orange: Under review
      case 'assigned':
        return '#a855f7'; // Purple: Assigned
      case 'in_progress':
        return '#3b82f6'; // Blue: Cleaning in progress
      case 'resolved':
        return '#10b981'; // Green: Resolved
      case 'rejected':
        return '#64748b'; // Gray/slate
      default:
        return '#ef4444';
    }
  };

  const createCustomIcon = (status: ComplaintStatus) => {
    const color = getMarkerColor(status);
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: ${color};
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: white;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Bengaluru: 12.9716° N, 77.5946° E
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.5946],
        zoom: 12,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add filtered markers
    filteredComplaints.forEach((c) => {
      const marker = L.marker([c.location.lat, c.location.lng], {
        icon: createCustomIcon(c.status),
      }).addTo(map);

      marker.on('click', () => {
        setActiveComplaint(c);
      });

      markersRef.current.push(marker);
    });

    // Clean up on unmount
    return () => {
      // Keep map instance or clear markers
    };
  }, [filteredComplaints]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              {lang === 'kn' ? 'ನಗರ ಸ್ವಚ್ಛತಾ ನಕ್ಷೆ' : 'Interactive Bengaluru Cleanliness Map'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.cleanlinessMap}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {lang === 'kn'
              ? 'ನಗರದ ವಿವಿಧ ವಲಯಗಳಲ್ಲಿನ ದೂರುಗಳು, ಶುಚಿಗೊಳಿಸುವ ಹಂತಗಳು ಮತ್ತು ಕ್ಲೀನ್ ಸ್ಪಾಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ'
              : 'Live spatial view of reported waste, active sanitation routes, and verified clean spots'}
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

      {/* Legend & Filter Controls */}
      <div className="my-6 space-y-4">
        
        {/* Status Color Legend */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Map Legend:</span>
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
              <span className="text-slate-300">Pending (Submitted)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></span>
              <span className="text-slate-300">Under Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></span>
              <span className="text-slate-300">Assigned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
              <span className="text-slate-300">In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              <span className="text-slate-300">Resolved Clean</span>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Zone Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Filter by BBMP Zone
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
            >
              <option value="all">All Bengaluru Zones</option>
              <option value="East">East Zone (Indiranagar / MG Rd)</option>
              <option value="South">South Zone (Koramangala / Jayanagar)</option>
              <option value="West">West Zone (Malleshwaram)</option>
              <option value="Mahadevapura">Mahadevapura (Whitefield)</option>
              <option value="Bommanahalli">Bommanahalli (HSR / E-City)</option>
              <option value="Yelahanka">Yelahanka (Hebbal)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
            >
              <option value="all">All Waste Categories</option>
              <option value="roadside_garbage">{t.categories.roadside_garbage}</option>
              <option value="overflowing_dustbin">{t.categories.overflowing_dustbin}</option>
              <option value="illegal_dumping">{t.categories.illegal_dumping}</option>
              <option value="plastic_waste">{t.categories.plastic_waste}</option>
              <option value="construction_waste">{t.categories.construction_waste}</option>
              <option value="drainage_waste">{t.categories.drainage_waste}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Pending / Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned to Crew</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved & Clean</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Surface & Selected Spot Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        
        {/* Leaflet Map DOM Node */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-[540px] sm:h-[620px] bg-slate-900"
          style={{ minHeight: '500px' }}
        />

        {/* Floating Active Complaint Popup Card */}
        {activeComplaint && (
          <div className="absolute top-4 right-4 z-20 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-emerald-500/40 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {activeComplaint.id}
              </span>
              <button
                onClick={() => setActiveComplaint(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5"
              >
                ✕
              </button>
            </div>

            <div className="relative h-32 rounded-xl overflow-hidden mb-3 border border-slate-800">
              <img
                src={activeComplaint.imageUrl}
                alt={activeComplaint.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white font-medium">
                {t.categories[activeComplaint.category]}
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
              {activeComplaint.title}
            </h3>
            <p className="text-xs text-slate-300 mb-2 line-clamp-2">
              {activeComplaint.location.address}
            </p>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
              <span className="text-slate-400">
                Zone: <strong className="text-slate-200">{activeComplaint.location.zone}</strong>
              </span>
              <button
                onClick={() => onSelectComplaint(activeComplaint.id)}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Track Details</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Map Footnote Overlay */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300">
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>Centered on Bengaluru Metropolitan Region • Click any marker to view report</span>
        </div>

      </div>

    </div>
  );
};
