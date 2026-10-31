import React from 'react';
import { Complaint } from '../types';
import { Language, translations } from '../utils/translations';
import { CheckCircle2, MapPin, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface RecentResolvedProps {
  complaints: Complaint[];
  lang: Language;
  onSelectComplaint: (id: string) => void;
  onOpenReport: () => void;
}

export const RecentResolved: React.FC<RecentResolvedProps> = ({
  complaints,
  lang,
  onSelectComplaint,
  onOpenReport,
}) => {
  const t = translations[lang];
  // Filter resolved complaints
  const resolvedList = complaints.filter((c) => c.status === 'resolved' || c.resolvedImageUrl);

  return (
    <section className="py-16 sm:py-20 bg-[#080e1c] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'kn' ? 'ಯಶಸ್ವಿಯಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸಲಾದ ಪ್ರದೇಶಗಳು' : 'Proof of Impact'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'kn' ? 'ಇತ್ತೀಚೆಗೆ ಪರಿಹರಿಸಲಾದ ದೂರುಗಳು' : 'Recently Resolved Civic Spots'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real before-and-after photographs verified by BBMP ward supervisors and citizens
            </p>
          </div>

          <button
            onClick={onOpenReport}
            className="self-start md:self-auto flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>{lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರದೇಶದ ಕಸ ವರದಿ ಮಾಡಿ' : 'Report an issue in your area'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Resolved Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resolvedList.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item.id)}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 overflow-hidden shadow-xl cursor-pointer group transition-all"
            >
              {/* Dual Before / After Image Thumbnail */}
              <div className="relative h-48 bg-black grid grid-cols-2">
                <div className="relative h-full overflow-hidden border-r border-slate-800">
                  <img
                    src={item.imageUrl}
                    alt="Before cleaning"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 text-[10px] font-bold border border-rose-800">
                    Before
                  </span>
                </div>

                <div className="relative h-full overflow-hidden">
                  <img
                    src={item.resolvedImageUrl || item.imageUrl}
                    alt="After cleaning"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                    Cleaned ✓
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {item.id}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                    +{item.pointsAwarded || 40} Citizen Pts
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.location.address}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-slate-300 font-medium">
                    {item.location.zone} Zone (Ward #{item.location.wardNumber || 151})
                  </span>
                  <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Track &gt;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
