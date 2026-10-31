import React from 'react';
import { Language, translations } from '../utils/translations';
import { Camera, ShieldCheck, Wrench, Award, ChevronRight } from 'lucide-react';

interface HowItWorksProps {
  lang: Language;
  onOpenReport: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ lang, onOpenReport }) => {
  const t = translations[lang];

  const steps = [
    {
      num: '01',
      title: lang === 'kn' ? 'ಫೋಟೋ & ಜಿಪಿಎಸ್ ಸ್ಥಳ' : 'Snap & Geo-Tag',
      desc: lang === 'kn'
        ? 'ರಸ್ತೆಬದಿಯ ಕಸ ಅಥವಾ ತುಂಬಿದ ತೊಟ್ಟಿಯ ಫೋಟೋ ತೆಗೆಯಿರಿ. ಜಿಪಿಎಸ್ ಸ್ಥಳ ತಾನಾಗಿಯೇ ದಾಖಲಾಗುತ್ತದೆ.'
        : 'Spot unattended waste or overflowing bins. Snap a photo and let our system automatically log your exact GPS coordinates.',
      icon: Camera,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      num: '02',
      title: lang === 'kn' ? 'ವಾರ್ಡ್ ಮಟ್ಟದ ಪರಿಶೀಲನೆ' : 'Ward Verification',
      desc: lang === 'kn'
        ? 'ಬಿಬಿಎಂಪಿ ವಾರ್ಡ್ ಅಧಿಕಾರಿಗಳು ನಿಮ್ಮ ವರದಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ದೃಢೀಕರಿಸುತ್ತಾರೆ.'
        : 'BBMP ward officers quickly verify the photo evidence and category to filter duplicate or private-property reports.',
      icon: ShieldCheck,
      color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
    },
    {
      num: '03',
      title: lang === 'kn' ? 'ಸ್ವಚ್ಛತಾ ತಂಡದ ನಿಯೋಜನೆ' : 'Rapid Sanitation Dispatch',
      desc: lang === 'kn'
        ? 'ಸ್ಥಳೀಯ ಸ್ವಚ್ಛತಾ ವಾಹನ ಮತ್ತು ಸಿಬ್ಬಂದಿ ಸ್ಥಳಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಕಸ ವಿಲೇವಾರಿ ಮಾಡುತ್ತಾರೆ.'
        : 'Dedicated municipal sanitation crews arrive with tipper autos and loaders to clear and disinfect the area.',
      icon: Wrench,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    },
    {
      num: '04',
      title: lang === 'kn' ? 'ಬಹುಮಾನ & ಸ್ವಚ್ಛ ನಗರ' : 'Earn Verified Rewards',
      desc: lang === 'kn'
        ? 'ಸ್ಥಳ ಸ್ವಚ್ಛವಾದ ನಂತರ ನಿಮಗೆ ಬೋನಸ್ ಅಂಕಗಳು, ನಮ್ಮ ಮೆಟ್ರೋ & ಬಿಎಂಟಿಸಿ ಕೂಪನ್‌ಗಳು ಲಭ್ಯವಾಗುತ್ತವೆ.'
        : 'Receive before-and-after photo verification, unlock achievement badges, and redeem points for Namma Metro & BMTC passes.',
      icon: Award,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#080e1c] via-[#0b1426] to-[#0a1329] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <span>{lang === 'kn' ? 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?' : 'Simple 4-Step Process'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            {lang === 'kn'
              ? 'ಕಸ ವರದಿಯಿಂದ ಪರಿಹಾರದವರೆಗೆ: ಸರಳ ಪ್ರಕ್ರಿಯೆ'
              : 'From Snapshot to Spotless Clean: How It Works'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            {lang === 'kn'
              ? 'ಪ್ರತಿಯೊಬ್ಬ ಬೆಂಗಳೂರಿಗರೂ ನಮ್ಮ ನಗರವನ್ನು ಸ್ವಚ್ಛವಾಗಿಡುವಲ್ಲಿ ಪ್ರಮುಖ ಪಾತ್ರ ವಹಿಸಬಹುದು.'
              : 'Empowering every Bengaluru citizen to protect our Garden City with transparent civic accountability.'}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:-translate-y-1 group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-slate-600 group-hover:text-emerald-400 transition-colors">
                      {step.num}
                    </span>
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${step.color} border`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <span>Bengaluru Standard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenReport}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>{t.reportGarbage}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
