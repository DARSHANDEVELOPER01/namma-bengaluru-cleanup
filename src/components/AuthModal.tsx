import React, { useState } from 'react';
import { UserProfile, Role } from '../types';
import { Language, translations } from '../utils/translations';
import { 
  User, 
  Phone, 
  Mail, 
  KeyRound, 
  CheckCircle, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Languages, 
  LogOut,
  Smartphone
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currentUser: UserProfile;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  setLang,
  currentUser,
  currentRole,
  setCurrentRole,
  onUpdateUser,
}) => {
  const t = translations[lang];

  // Auth flow states: 'profile' (if logged in) or 'login' -> 'otp'
  const [step, setStep] = useState<'profile' | 'login' | 'otp'>('profile');
  const [phoneInput, setPhoneInput] = useState('+91 98450 11223');
  const [emailInput, setEmailInput] = useState('priya.sharma@bengaluru.in');
  const [nameInput, setNameInput] = useState('Priya Sharma');
  const [otpInput, setOtpInput] = useState('');
  const [mockSentOtp, setMockSentOtp] = useState('123456');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setAuthError('');
    setStep('otp');
    setMockSentOtp('123456');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '123456' || otpInput.length === 6) {
      onUpdateUser({
        name: nameInput || 'Bengaluru Citizen',
        phone: phoneInput,
        email: emailInput,
      });
      setAuthSuccess('Logged in successfully!');
      setTimeout(() => {
        setAuthSuccess('');
        setStep('profile');
      }, 1000);
    } else {
      setAuthError('Invalid OTP. Please enter the demo code 123456.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {step === 'profile'
                  ? (lang === 'kn' ? 'ನಾಗರಿಕ ಪ್ರೊಫೈಲ್' : 'Citizen Account & Role')
                  : (lang === 'kn' ? 'ನೋಂದಣಿ / ಲಾಗಿನ್' : 'Citizen Login & OTP')}
              </h2>
              <p className="text-[11px] text-slate-400">
                Namma Bengaluru Civic Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {authError && (
          <div className="my-3 p-2.5 rounded-xl bg-rose-950 border border-rose-600 text-rose-300 text-xs">
            {authError}
          </div>
        )}

        {authSuccess && (
          <div className="my-3 p-2.5 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Step: User Profile & Role Switcher */}
        {step === 'profile' && (
          <div className="space-y-5 pt-4">
            {/* User Details Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
                  <p className="text-xs text-slate-400">{currentUser.phone}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase font-extrabold text-amber-400">Points</div>
                  <div className="text-xl font-black text-white">{currentUser.points}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
                <span>Reports Filed: <strong className="text-slate-200">{currentUser.reportsSubmitted}</strong></span>
                <span>Resolved: <strong className="text-emerald-400">{currentUser.reportsResolved}</strong></span>
              </div>
            </div>

            {/* Language Switch */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Languages className="w-4 h-4 text-amber-400" />
                <span>Language / ಭಾಷೆ:</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    lang === 'en' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang('kn')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    lang === 'kn' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>
            </div>

            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Active System Role (Evaluation Switcher):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentRole('citizen')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    currentRole === 'citizen'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-xs">Citizen</div>
                  <div className="text-[10px] text-slate-400">Reporter</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentRole('admin')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    currentRole === 'admin'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-xs">BBMP Admin</div>
                  <div className="text-[10px] text-slate-400">Officer</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentRole('staff')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    currentRole === 'staff'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-xs">Field Staff</div>
                  <div className="text-[10px] text-slate-400">Sanitation</div>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep('login')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Re-login</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Step: Login Form */}
        {step === 'login' && (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Arjun Rao"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mobile Number (+91)
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              ℹ️ A 6-digit secure SMS OTP will be generated for citizen identity verification.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-600/25"
            >
              Get OTP Verification Code
            </button>
          </form>
        )}

        {/* Step: OTP Screen */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Enter OTP</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sent to {phoneInput} • Demo code: <strong className="text-emerald-400 font-mono">123456</strong>
              </p>
            </div>

            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="123456"
              className="w-48 mx-auto text-center font-mono text-xl tracking-widest py-2 rounded-xl bg-slate-800 border border-emerald-500/60 text-white outline-none"
            />

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setOtpInput('123456')}
                className="text-xs text-amber-400 hover:underline"
              >
                Auto-fill Demo Code (123456)
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-1/2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Verify & Enter
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
