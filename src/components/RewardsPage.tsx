import React, { useState } from 'react';
import { UserProfile, RewardVoucher, Badge } from '../types';
import { Language, translations } from '../utils/translations';
import { ALL_BADGES } from '../utils/rewards';
import { 
  REWARD_VOUCHERS, 
  LEADERBOARD_CITIZENS 
} from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Gift, 
  Trophy, 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  QrCode, 
  Copy, 
  ExternalLink, 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  TreePine,
  Ticket
} from 'lucide-react';

interface RewardsPageProps {
  user: UserProfile;
  lang: Language;
  onRedeemVoucher: (voucher: RewardVoucher) => boolean;
  onOpenReport: () => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({
  user,
  lang,
  onRedeemVoucher,
  onOpenReport,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'vouchers' | 'badges' | 'leaderboard'>('vouchers');
  const [selectedVoucher, setSelectedVoucher] = useState<RewardVoucher | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [insufficientMsg, setInsufficientMsg] = useState(false);

  const handleRedeemClick = (voucher: RewardVoucher) => {
    if (user.points < voucher.pointsRequired) {
      setInsufficientMsg(true);
      setTimeout(() => setInsufficientMsg(false), 3000);
      return;
    }

    const success = onRedeemVoucher(voucher);
    if (success) {
      setSelectedVoucher(voucher);
      setRedeemedCode(voucher.code || `BLR-${Math.floor(100000 + Math.random() * 900000)}`);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });
    }
  };

  const copyCodeToClipboard = () => {
    if (redeemedCode) {
      navigator.clipboard.writeText(redeemedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
              {lang === 'kn' ? 'ನಾಗರಿಕ ಗೌರವ & ಬಹುಮಾನಗಳು' : 'Bengaluru Civic Rewards'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.rewardsTitle}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.rewardsSubtitle}
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-md hover:from-emerald-400 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'kn' ? 'ವರದಿ ಮಾಡಿ ಅಂಕ ಗಳಿಸಿ' : 'Report Waste & Earn'}</span>
        </button>
      </div>

      {/* Citizen Points Balance Overview Card */}
      <div className="my-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d1e3d] to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bengaluru Clean Citizen Tier: Swachha Warrior</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Hello, {user.name}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              You have submitted <strong className="text-emerald-400">{user.reportsSubmitted}</strong> verified civic reports with <strong className="text-emerald-400">{user.reportsResolved}</strong> completed municipal resolutions in Bengaluru.
            </p>

            {/* Reward System Rule explainer */}
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] text-slate-400">
              <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">
                🌱 Verified Report: <strong className="text-emerald-400">+10 Pts</strong>
              </span>
              <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">
                🚨 High-Priority: <strong className="text-amber-400">+20 Pts</strong>
              </span>
              <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">
                ✨ Resolved Cleanup: <strong className="text-teal-400">+30 Pts</strong>
              </span>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col sm:flex-row items-center justify-end gap-4">
            <div className="w-full sm:w-auto p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-center shadow-lg">
              <div className="text-xs uppercase font-extrabold tracking-wider text-amber-400 mb-1">
                {t.myPoints}
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {user.points}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                Ready to Redeem
              </div>
            </div>
          </div>
        </div>
      </div>

      {insufficientMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs font-semibold flex items-center gap-2">
          <span>⚠️ You need more points to redeem this voucher. Submit more verified garbage reports to earn points!</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-800 mb-8 space-x-2">
        <button
          onClick={() => setActiveTab('vouchers')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'vouchers'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>{t.redeemVouchers}</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'badges'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t.badgesTitle}</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'leaderboard'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{t.leaderboardTitle}</span>
        </button>
      </div>

      {/* Tab 1: Redeem Vouchers Grid */}
      {activeTab === 'vouchers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REWARD_VOUCHERS.map((voucher) => {
            const canAfford = user.points >= voucher.pointsRequired;
            return (
              <div
                key={voucher.id}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-800 border border-slate-700/80">
                      {voucher.icon}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {voucher.pointsRequired} Pts
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
                    {lang === 'kn' ? voucher.titleKn : voucher.title}
                  </h3>

                  <p className="text-xs text-slate-400 mb-2">
                    Partner: <strong className="text-slate-300">{voucher.provider}</strong>
                  </p>

                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-900/40 mb-4">
                    {voucher.discountValue}
                  </div>
                </div>

                <button
                  onClick={() => handleRedeemClick(voucher)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    canAfford
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>
                    {canAfford
                      ? (lang === 'kn' ? 'ಕೂಪನ್ ಪಡೆದುಕೊಳ್ಳಿ' : 'Redeem Now')
                      : `Need ${voucher.pointsRequired - user.points} more points`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Civic Badges Shelf */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_BADGES.map((badge) => {
              const isUnlocked = user.points >= badge.minPoints && user.reportsResolved >= badge.minResolved;
              return (
                <div
                  key={badge.id}
                  className={`p-6 rounded-3xl border text-center transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-950/50'
                      : 'bg-slate-900/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    {lang === 'kn' ? badge.titleKn : badge.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    {lang === 'kn' ? badge.descriptionKn : badge.description}
                  </p>

                  <div className="text-[11px] font-semibold">
                    {isUnlocked ? (
                      <span className="text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                        ✓ Unlocked
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">
                        Requires {badge.minPoints} pts & {badge.minResolved} fixes
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Cleanliness Challenge Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
                🔥
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {lang === 'kn' ? 'ಮಾಸಿಕ ಸ್ವಚ್ಛತಾ ಸವಾಲು: ಪ್ಲಾಸ್ಟಿಕ್ ಮುಕ್ತ ವಲಯ' : 'October Civic Challenge: Indiranagar Plastic Free Sprint'}
                </h4>
                <p className="text-xs text-slate-300">
                  Report 3 plastic waste spots this week to unlock an extra 50 bonus points and an exclusive digital certificate!
                </p>
              </div>
            </div>
            <button
              onClick={onOpenReport}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex-shrink-0"
            >
              Participate Now
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Bengaluru Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-5 bg-gradient-to-r from-slate-900 to-[#0c1933] border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>October 2026 Cleanliness Champions</span>
              </h3>
              <p className="text-xs text-slate-400">
                Top citizens maintaining Bengaluru's beauty across BBMP wards
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              Updated Hourly
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {LEADERBOARD_CITIZENS.map((item) => (
              <div
                key={item.rank}
                className={`p-4 flex items-center justify-between gap-3 text-sm transition-colors ${
                  item.name.includes('(You)')
                    ? 'bg-emerald-950/30 hover:bg-emerald-950/50'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                    item.rank === 1
                      ? 'bg-amber-500 text-slate-950'
                      : item.rank === 2
                      ? 'bg-slate-300 text-slate-900'
                      : item.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{item.rank}
                  </div>

                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.name.includes('(You)') && (
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      BBMP Ward: {item.ward} • {item.badge}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-amber-400">
                    {item.points} <span className="text-xs font-normal text-slate-400">Pts</span>
                  </div>
                  <div className="text-[11px] text-emerald-400">
                    {item.resolved} resolved
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redemption Success Modal */}
      {selectedVoucher && redeemedCode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Reward Voucher Unlocked!
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                {selectedVoucher.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Show this voucher code at partner counter or apply in app
              </p>
            </div>

            {/* Simulated QR Code & Voucher Code */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-32 h-32 mx-auto bg-white rounded-xl p-2 flex items-center justify-center shadow-md">
                <QrCode className="w-28 h-28 text-slate-950" />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Unique Redemption Code:
                </span>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-base font-mono font-bold text-amber-400 bg-slate-900 px-3 py-1 rounded border border-slate-700">
                    {redeemedCode}
                  </code>
                  <button
                    onClick={copyCodeToClipboard}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy Code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedCode && <span className="text-[10px] text-emerald-400">Copied!</span>}
              </div>
            </div>

            <button
              onClick={() => { setSelectedVoucher(null); setRedeemedCode(null); }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
