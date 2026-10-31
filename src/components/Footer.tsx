import React from 'react';
import { Language, translations } from '../utils/translations';
import { Sparkles, Phone, ShieldCheck, Heart, Download, ExternalLink } from 'lucide-react';

interface FooterProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenReport: () => void;
  onNavigateTrack: () => void;
  onNavigateMap: () => void;
  onNavigateRewards: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  setLang,
  onOpenReport,
  onNavigateTrack,
  onNavigateMap,
  onNavigateRewards,
}) => {
  const t = translations[lang];

  return (
    <footer className="bg-[#060a14] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white">
                {t.appName}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Bengaluru
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed pr-4">
              {lang === 'kn'
                ? 'ನಮ್ಮ ಬೆಂಗಳೂರು - ನಾಗರಿಕ ಆಧಾರಿತ ಸ್ವಚ್ಛತಾ ಉಪಕ್ರಮ. ಕಸ ವರದಿ ಮಾಡಿ, ನಕ್ಷೆಯಲ್ಲಿ ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಮ್ಮ ಮೆಟ್ರೋ ಬಹುಮಾನಗಳನ್ನು ಗಳಿಸಿ.'
                : 'Citizen-powered smart cleanliness platform. Enabling residents across 198 BBMP wards to report waste, geo-tag hotspots, and earn civic mobility rewards.'}
            </p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-slate-200 font-bold">BBMP Sahaya Helpline: 1533</div>
                <div className="text-[10px] text-slate-500">Official 24x7 Municipal Civic Grievance Cell</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Civic Services
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={onOpenReport} className="hover:text-emerald-400 transition-colors">
                  {t.reportGarbage}
                </button>
              </li>
              <li>
                <button onClick={onNavigateTrack} className="hover:text-emerald-400 transition-colors">
                  {t.trackComplaint}
                </button>
              </li>
              <li>
                <button onClick={onNavigateMap} className="hover:text-emerald-400 transition-colors">
                  {t.cleanlinessMap}
                </button>
              </li>
              <li>
                <button onClick={onNavigateRewards} className="hover:text-emerald-400 transition-colors">
                  {t.rewardsLeaderboard}
                </button>
              </li>
            </ul>
          </div>

          {/* BBMP Zones */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Bengaluru Zones
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li>East Zone (Indiranagar / MG Rd)</li>
              <li>South Zone (Koramangala / Jayanagar)</li>
              <li>West Zone (Malleshwaram / Rajajinagar)</li>
              <li>Mahadevapura (Whitefield)</li>
              <li>Bommanahalli (HSR / E-City)</li>
              <li>Yelahanka & Dasarahalli</li>
            </ul>
          </div>

          {/* App Installation & Language */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              App & Language
            </h4>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold border border-slate-700 transition-colors"
              >
                {lang === 'en' ? 'ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ' : 'Switch to English'}
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>PWA Ready: Add to Mobile Home Screen</span>
            </div>
          </div>

        </div>

        {/* Legal & Municipal Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 space-y-3 text-[11px] text-slate-500">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-300">Important Civic Notice:</strong> {t.disclaimer} This application is an independent open civic platform designed to assist Bengaluru citizens in reporting cleanliness issues and verifying cleanup. It does not represent an exclusive municipal monopoly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500">
            <div>
              © 2026 Namma Bengaluru Swachha Platform. Built for citizens of Bengaluru.
            </div>
            <div className="flex items-center gap-1">
              <span>Made with care for Garden City Bengaluru</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
