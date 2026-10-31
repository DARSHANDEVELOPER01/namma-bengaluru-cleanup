import React, { useState } from 'react';
import { AppointmentBooking, AppointmentServiceType, BengaluruZone } from '../types';
import { Language, translations } from '../utils/translations';
import { generateAppointmentId, validateAppointmentBooking } from '../utils/rewards';
import { 
  saveAppointmentToSupabase, 
  SUPABASE_PROJECT_ID,
  SUPABASE_SQL_SCHEMA,
  SupabaseResponse 
} from '../utils/supabase';
import { BENGALURU_PRESET_LOCATIONS } from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  X, 
  Database, 
  Sparkles, 
  Copy, 
  ExternalLink, 
  FileText, 
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  defaultName?: string;
  defaultPhone?: string;
  defaultEmail?: string;
  onBookingSuccess: (booking: AppointmentBooking) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  lang,
  defaultName = '',
  defaultPhone = '',
  defaultEmail = '',
  onBookingSuccess,
}) => {
  const t = translations[lang];

  // Form inputs
  const [fullName, setFullName] = useState(defaultName || 'Darshan K R');
  const [phone, setPhone] = useState(defaultPhone || '+91 98450 12345');
  const [email, setEmail] = useState(defaultEmail || 'darshankr2604@gmail.com');
  const [serviceType, setServiceType] = useState<AppointmentServiceType>('bulk_waste_pickup');
  
  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState(defaultDateStr);
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM - 12:00 PM');
  
  const [bbmpZone, setBbmpZone] = useState<BengaluruZone>('East');
  const [wardNumber, setWardNumber] = useState<number>(112);
  const [address, setAddress] = useState('Indiranagar 100ft Road, Bengaluru, Karnataka');
  const [notes, setNotes] = useState('');

  // Submission states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<SupabaseResponse<AppointmentBooking> | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const serviceOptions: { id: AppointmentServiceType; labelEn: string; labelKn: string; desc: string; icon: string }[] = [
    {
      id: 'bulk_waste_pickup',
      labelEn: 'Bulk Solid Waste & E-Waste Pickup',
      labelKn: 'ಮನೆ ತ್ಯಾಜ್ಯ & ಇ-ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ',
      desc: 'Old furniture, electronics, mattress, and large cardboard waste collection',
      icon: '🚛',
    },
    {
      id: 'neighborhood_inspection',
      labelEn: 'Ward Sanitation & Spot Inspection',
      labelKn: 'ಸ್ವಚ್ಛತಾ ಪರಿಶೀಲನಾ ಭೇಟಿ',
      desc: 'Officer visit to inspect recurring street dumping or drainage silting',
      icon: '🔍',
    },
    {
      id: 'dry_waste_drive',
      labelEn: 'Community Dry Waste Drive',
      labelKn: 'ಒಣ ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ ಅಭಿಯಾನ',
      desc: 'Scheduled collection vehicle for apartment society or layout',
      icon: '♻️',
    },
    {
      id: 'composting_guidance',
      labelEn: 'Home Composting & Segregation Visit',
      labelKn: 'ಗೃಹ ಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶನ',
      desc: 'Free expert training for wet-waste composting at source',
      icon: '🌱',
    },
    {
      id: 'officer_consultation',
      labelEn: 'BBMP Health Officer Consultation',
      labelKn: 'ವಾರ್ಡ್ ಆರೋಗ್ಯ ಅಧಿಕಾರಿ ಭೇಟಿ',
      desc: 'Discussion on commercial waste disposal and local bylaws',
      icon: '🏛️',
    },
    {
      id: 'general_sanitation',
      labelEn: 'Public Area Disinfection & Spray',
      labelKn: 'ಸಾರ್ವಜನಿಕ ಪ್ರದೇಶದ ಸ್ವಚ್ಛತಾ ಸಿಂಪಡಣೆ',
      desc: 'Disinfectant spray and lime-powder bleaching for public hygiene',
      icon: '💧',
    },
  ];

  const handleSelectPreset = (preset: typeof BENGALURU_PRESET_LOCATIONS[0]) => {
    setBbmpZone(preset.zone);
    setWardNumber(preset.wardNumber);
    setAddress(`${preset.name}, Bengaluru, Karnataka`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAppointmentBooking({
      full_name: fullName,
      phone,
      service_type: serviceType,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      address,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const newBooking: AppointmentBooking = {
      id: generateAppointmentId(),
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      service_type: serviceType,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      bbmp_zone: bbmpZone,
      ward_number: wardNumber,
      address: address.trim(),
      notes: notes.trim() || undefined,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    // Save directly to Supabase Backend
    const res = await saveAppointmentToSupabase(newBooking);

    setIsSubmitting(false);
    setBookingResult(res);
    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
    });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setBookingResult(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden my-6 text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-[#0a1329] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {lang === 'kn' ? 'ಸ್ವಚ್ಛತಾ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ' : 'Book Cleanliness Appointment'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-700">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>Supabase Live Backend</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'kn' ? 'ಬೃಹತ್ ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ & ಪರಿಶೀಲನಾ ಸೇವೆಗಳು' : 'Schedule bulk waste pickup, ward inspection or officer consultation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {confirmedBooking ? (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {lang === 'kn' ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!' : 'Appointment Confirmed!'}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  {confirmedBooking.id}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  {lang === 'kn'
                    ? 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ನೋಂದಾಯಿಸಲಾಗಿದೆ ಮತ್ತು ನಮ್ಮ ವಾರ್ಡ್ ನೈರ್ಮಲ್ಯ ತಂಡಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ.'
                    : 'Your appointment booking has been registered and dispatched to the BBMP Ward Sanitation Officer.'}
                </p>
              </div>

              {/* Supabase Sync Status Indicator */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 text-left">
                <div className="flex items-center gap-2 mb-1.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">
                    Supabase Database Status
                  </span>
                  <span className="ml-auto text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700">
                    Project: {SUPABASE_PROJECT_ID}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {bookingResult?.message || `Successfully transmitted to Supabase table 'appointments'.`}
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2.5">
                <div className="flex justify-between text-slate-400">
                  <span>Name:</span>
                  <span className="text-slate-100 font-semibold">{confirmedBooking.full_name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Phone:</span>
                  <span className="text-slate-100 font-semibold">{confirmedBooking.phone}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service:</span>
                  <span className="text-emerald-400 font-bold capitalize">
                    {confirmedBooking.service_type.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Scheduled Date & Time:</span>
                  <span className="text-amber-300 font-semibold">
                    {confirmedBooking.appointment_date} ({confirmedBooking.appointment_time})
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Ward & Zone:</span>
                  <span className="text-slate-200">
                    {confirmedBooking.bbmp_zone} Zone (Ward #{confirmedBooking.ward_number || 112})
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Address:</span>
                  <span className="text-slate-300 truncate max-w-[220px]">
                    {confirmedBooking.address}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSqlGuide(!showSqlGuide)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showSqlGuide ? 'Hide Supabase SQL Schema' : 'View Supabase Table Schema'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-colors"
                >
                  Done
                </button>
              </div>

              {/* Collapsible Supabase SQL Schema Viewer */}
              {showSqlGuide && (
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">
                      Supabase Table Schema SQL
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto whitespace-pre">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    If you haven't run this SQL in your Supabase dashboard yet, open Supabase SQL editor and execute it once so that rows appear in your Supabase Table view!
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Supabase Banner */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-slate-300 font-medium">
                    Connected to Supabase Project:
                  </span>
                  <code className="text-emerald-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {SUPABASE_PROJECT_ID}
                  </code>
                </div>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  table: appointments
                </span>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Select Service Type *</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {serviceOptions.map((opt) => {
                    const isSelected = serviceType === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setServiceType(opt.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md shadow-emerald-950'
                            : 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                            {lang === 'kn' ? opt.labelKn : opt.labelEn}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); setErrors(p => ({ ...p, full_name: '' })); }}
                      placeholder="e.g. Darshan K R"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  {errors.full_name && <p className="text-xs text-rose-400 mt-1">{errors.full_name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Number (+91) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
                      placeholder="+91 98450 12345"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address (for appointment confirmation receipt)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="darshankr2604@gmail.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Preferred Date <span className="text-rose-400">*</span></span>
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => { setAppointmentDate(e.target.value); setErrors(p => ({ ...p, appointment_date: '' })); }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                  {errors.appointment_date && <p className="text-xs text-rose-400 mt-1">{errors.appointment_date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Time Slot <span className="text-rose-400">*</span></span>
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Early Sanitation Slot)</option>
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Morning Inspection Slot)</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon Pickup Slot)</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening Consultation Slot)</option>
                  </select>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      BBMP Zone
                    </label>
                    <select
                      value={bbmpZone}
                      onChange={(e) => setBbmpZone(e.target.value as BengaluruZone)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    >
                      <option value="East">East Zone (Indiranagar / MG Road)</option>
                      <option value="South">South Zone (Koramangala / Jayanagar)</option>
                      <option value="West">West Zone (Malleshwaram / Rajajinagar)</option>
                      <option value="Mahadevapura">Mahadevapura (Whitefield / Marathahalli)</option>
                      <option value="Bommanahalli">Bommanahalli (HSR Layout / Electronic City)</option>
                      <option value="Yelahanka">Yelahanka Zone (Hebbal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Ward Number
                    </label>
                    <input
                      type="number"
                      value={wardNumber}
                      onChange={(e) => setWardNumber(Number(e.target.value))}
                      placeholder="112"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Street Address & Landmark <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); setErrors(p => ({ ...p, address: '' })); }}
                      placeholder="e.g. 100 Feet Road, Near Metro Station, Indiranagar"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  {errors.address && <p className="text-xs text-rose-400 mt-1">{errors.address}</p>}
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Quick Ward Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {BENGALURU_PRESET_LOCATIONS.slice(0, 4).map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleSelectPreset(p)}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] text-slate-300 transition-colors"
                      >
                        {p.name.split(' (')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Special Notes or Waste Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. 2 large wooden desks and old e-waste located on 2nd floor, service lift available."
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowSqlGuide(!showSqlGuide)}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supabase Schema Info</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 disabled:opacity-50 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Saving to Supabase...' : 'Confirm & Save to Supabase'}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Supabase SQL Schema helper */}
              {showSqlGuide && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">
                      Supabase PostgreSQL Schema (appointments table)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              )}

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
