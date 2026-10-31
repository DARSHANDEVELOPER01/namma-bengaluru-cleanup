import React, { useState } from 'react';
import { Role } from '../types';
import { Language, translations } from '../utils/translations';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Camera, 
  Search, 
  Menu, 
  X, 
  User, 
  Wrench, 
  Languages,
  CheckCircle2,
  ChevronDown,
  Calendar
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  role: Role;
  setRole: (role: Role) => void;
  userPoints: number;
  userName: string;
  onOpenAuth: () => void;
  onOpenReport: () => void;
  onOpenAppointment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  lang,
  setLang,
  role,
  setRole,
  userPoints,
  userName,
  onOpenAuth,
  onOpenReport,
  onOpenAppointment,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const t = translations[lang];

  const navItems = [
    { id: 'home', label: lang === 'kn' ? 'ಮುಖಪುಟ' : 'Home' },
    { id: 'track', label: t.trackComplaint, icon: Search },
    { id: 'map', label: t.cleanlinessMap, icon: MapPin },
    { id: 'rewards', label: t.rewardsLeaderboard, icon: Award },
    { id: 'admin', label: t.adminDashboard, icon: ShieldCheck, badge: 'Portal' },
    { id: 'staff', label: t.staffDashboard, icon: Wrench, badge: 'Field' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a1329]/90 backdrop-blur-md border-b border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & City Identity */}
          <div 
            onClick={() => setCurrentView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b1426] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  {t.appName}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  Bengaluru
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {lang === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಸ್ವಚ್ಛ ನಗರ ವೇದಿಕೆ' : 'Smart Clean City Platform'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-amber-300 transition-colors"
              title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
              aria-label="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/70 border border-slate-700 text-slate-300 hover:border-slate-500 transition-colors"
                title="Switch active role mode"
              >
                <span className="capitalize text-emerald-400 font-semibold">{role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch App View
                  </div>
                  <button
                    onClick={() => { setRole('citizen'); setCurrentView('home'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      role === 'citizen' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>Citizen View</span>
                    {role === 'citizen' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => { setRole('admin'); setCurrentView('admin'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      role === 'admin' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>BBMP Admin Portal</span>
                    {role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => { setRole('staff'); setCurrentView('staff'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      role === 'staff' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>Field Staff Dashboard</span>
                    {role === 'staff' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Citizen Points Pill */}
            {role === 'citizen' && (
              <div 
                onClick={() => setCurrentView('rewards')}
                className="hidden sm:flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-400 transition-colors"
                title="View your Cleanliness Rewards"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>{userPoints} <span className="text-[10px] text-slate-300">{t.points}</span></span>
              </div>
            )}

            {/* Book Appointment CTA (Supabase Backend) */}
            <button
              onClick={onOpenAppointment}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-teal-300 hover:text-white border border-teal-500/40 shadow-sm transition-all"
              title="Book Cleanliness / Bulk Waste Pickup Appointment (Saved to Supabase)"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>{lang === 'kn' ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್' : 'Book Appointment'}</span>
            </button>

            {/* Main Action: Report Garbage CTA */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">{t.reportGarbage}</span>
              <span className="sm:hidden">{lang === 'kn' ? 'ವರದಿ' : 'Report'}</span>
            </button>

            {/* Profile / Auth Button */}
            <button
              onClick={onOpenAuth}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title={userName ? `Logged in as ${userName}` : t.login}
              aria-label="User Profile"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => { setLang(lang === 'en' ? 'kn' : 'en'); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 text-xs font-medium text-amber-300 border border-slate-700"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ' : 'Switch to English'}</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-950/60 text-xs font-medium text-emerald-300 border border-emerald-800/40">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{userPoints} {t.points}</span>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="w-4 h-4 text-emerald-400" />}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenAppointment();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಸ್ವಚ್ಛತಾ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ (Supabase)' : 'Book Cleanliness Appointment (Supabase)'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Role Switcher
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => { setRole('citizen'); setCurrentView('home'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded-lg border text-center ${
                  role === 'citizen' ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300 font-semibold' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => { setRole('admin'); setCurrentView('admin'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded-lg border text-center ${
                  role === 'admin' ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300 font-semibold' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => { setRole('staff'); setCurrentView('staff'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded-lg border text-center ${
                  role === 'staff' ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300 font-semibold' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
