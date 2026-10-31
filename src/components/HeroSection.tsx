import React from 'react';
import { Language, translations } from '../utils/translations';
import { 
  Camera, 
  Search, 
  Users, 
  CheckCircle, 
  Trash2, 
  TrendingUp, 
  Gift, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Building2,
  TreePine,
  Calendar,
  Database
} from 'lucide-react';

interface HeroSectionProps {
  lang: Language;
  onOpenReport: () => void;
  onNavigateTrack: () => void;
  onNavigateMap: () => void;
  onNavigateRewards: () => void;
  onOpenAppointment: () => void;
  totalComplaints: number;
  resolvedComplaints: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onOpenReport,
  onNavigateTrack,
  onNavigateMap,
  onNavigateRewards,
  onOpenAppointment,
  totalComplaints,
  resolvedComplaints,
}) => {
  const t = translations[lang];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/60 bg-gradient-to-b from-[#0a1329] via-[#0d1b38] to-[#080e1c]">
      
      {/* Bengaluru Skyline & Ambient Glow Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500 rounded-full blur-[128px]"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal-600 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500 rounded-full blur-[140px]"></div>
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(rgba(16, 185, 129, 0.12) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Civic Initiative Tag & Disclaimer Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === 'kn' ? 'ಸ್ವಚ್ಛ ಬೆಂಗಳೂರು - ನಮ್ಮ ಹೆಮ್ಮೆ' : 'Namma Bengaluru Cleanliness Mission 2026'}</span>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800 hidden md:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'kn' ? 'ನಾಗರಿಕ ತಂತ್ರಜ್ಞಾನ ಉಪಕ್ರಮ • BBMP ವಲಯಗಳೊಂದಿಗೆ ಸಂಯೋಜಿತ' : 'Citizen Tech Platform • Geo-tagged BBMP Ward Coverage'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              {t.heroHeadline.split('. ').map((part, index, arr) => (
                <span key={index} className="block">
                  {index === arr.length - 1 ? (
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                      {part}
                    </span>
                  ) : (
                    part + (index < arr.length - 1 ? '.' : '')
                  )}
                </span>
              ))}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenReport}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 hover:from-emerald-400 hover:to-teal-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Camera className="w-5 h-5 text-emerald-100" />
                <span>{t.reportGarbage}</span>
                <ChevronRight className="w-4 h-4 text-emerald-200" />
              </button>

              <button
                onClick={onNavigateTrack}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/90 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-slate-700 hover:bg-slate-700/80 transition-all"
              >
                <Search className="w-4 h-4 text-slate-300" />
                <span>{t.trackComplaint}</span>
              </button>

              <button
                onClick={onOpenAppointment}
                className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 hover:text-white font-semibold text-sm border border-teal-500/40 hover:bg-teal-600/30 transition-all shadow-md"
              >
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>{lang === 'kn' ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ' : 'Book Appointment'}</span>
              </button>

              <button
                onClick={onNavigateMap}
                className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-900/60 text-emerald-400 hover:text-emerald-300 font-semibold text-sm border border-emerald-900/50 hover:bg-slate-800/80 transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">{t.cleanlinessMap}</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ಜಿಪಿಎಸ್ ಸ್ಥಳ ದೃಢೀಕರಣ' : 'Automatic GPS Geo-tagging'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>{lang === 'kn' ? 'ನಮ್ಮ ಮೆಟ್ರೋ & ಬಿಎಂಟಿಸಿ ಬಹುಮಾನಗಳು' : 'Namma Metro & BMTC Rewards'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>{lang === 'kn' ? '198 ಬಿಬಿಎಂಪಿ ವಾರ್ಡ್‌ಗಳ ವ್ಯಾಪ್ತಿ' : '198 Bengaluru Ward Coverage'}</span>
              </div>
            </div>
          </div>

          {/* 3D Smart City Graphic Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-900/95 to-[#0b1426] p-6 border border-emerald-500/20 shadow-2xl backdrop-blur-xl">
              
              {/* Floating Badge */}
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5">
                <TreePine className="w-3.5 h-3.5" />
                <span>Garden City Bengaluru</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      BBMP
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">
                        {lang === 'kn' ? 'ಲೈವ್ ನಗರ ಸ್ವಚ್ಛತಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'City Cleanliness Pulse'}
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'kn' ? 'ನೈಜ ಸಮಯದ ವರದಿಗಳು & ಪರಿಹಾರಗಳು' : 'Real-time Ward Civic Updates'}
                      </p>
                    </div>
                  </div>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>

                {/* City Card Visual simulation */}
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80"
                    alt="Bengaluru Vidhana Soudha Cityscape"
                    className="w-full h-full object-cover object-center opacity-65"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-xs font-semibold text-slate-200">
                        {lang === 'kn' ? 'ಇತ್ತೀಚಿನ ಶುಚಿಗೊಳಿಸುವಿಕೆ: ಕೋರಮಂಗಲ 4ನೇ ಬ್ಲಾಕ್' : 'Latest Cleaned: Koramangala 4th Blk'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      +40 Pts
                    </span>
                  </div>
                </div>

                {/* Key live numbers */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'kn' ? 'ಒಟ್ಟು ದೂರುಗಳು' : 'Total Reports'}</span>
                    </div>
                    <div className="text-xl font-extrabold text-white mt-1">
                      {1240 + totalComplaints}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">↑ 18 new today</div>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                      <span>{lang === 'kn' ? 'ಪರಿಹಾರದ ದರ' : 'Resolved'}</span>
                    </div>
                    <div className="text-xl font-extrabold text-emerald-400 mt-1">
                      {Math.round(((resolvedComplaints + 1160) / (totalComplaints + 1240)) * 100)}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Avg &lt; 24h turnaround</div>
                  </div>
                </div>

                <button
                  onClick={onNavigateRewards}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 text-amber-300 hover:text-amber-200 hover:border-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'kn' ? 'ನಾಗರಿಕ ಬಹುಮಾನಗಳು ಮತ್ತು ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ನೋಡಿ' : 'Explore Citizen Rewards & Badges'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Cleanliness Statistics Bar */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">1,480+</div>
                <div className="text-xs text-slate-400">{t.statGarbageCleared}</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">94.6%</div>
                <div className="text-xs text-slate-400">{t.statResolvedRate}</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">18,450</div>
                <div className="text-xs text-slate-400">{t.statActiveCitizens}</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400">₹3.8 Lakh</div>
                <div className="text-xs text-slate-400">{t.statRewardsIssued}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
