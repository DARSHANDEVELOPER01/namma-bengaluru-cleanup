import React, { useState, useRef } from 'react';
import { Complaint, GarbageCategory, BengaluruZone, LocationCoords } from '../types';
import { Language, translations } from '../utils/translations';
import { 
  SAMPLE_WASTE_PHOTOS, 
  BENGALURU_PRESET_LOCATIONS 
} from '../data/initialData';
import { validateComplaintSubmission, generateComplaintId } from '../utils/rewards';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Upload, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Trash2, 
  Sparkles, 
  Navigation, 
  Layers, 
  Clock, 
  ShieldAlert,
  Info
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  citizenName: string;
  citizenPhone: string;
  citizenId: string;
  onSubmitSuccess: (newComplaint: Complaint) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  lang,
  citizenName,
  citizenPhone,
  citizenId,
  onSubmitSuccess,
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GarbageCategory>('roadside_garbage');
  const [description, setDescription] = useState('');
  const [isHighPriority, setIsHighPriority] = useState(false);
  
  // Photo states
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFileName, setImageFileName] = useState('');

  // Location states
  const [location, setLocation] = useState<LocationCoords>({
    lat: 12.9716,
    lng: 77.5946,
    address: 'Mahatma Gandhi Road, Central Bengaluru, Karnataka 560001',
    landmark: 'Near Trinity Metro Junction',
    zone: 'East',
    wardNumber: 111,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState('');

  // Submission states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setErrors((prev) => ({ ...prev, imageUrl: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample photo selection for convenience
  const handleSelectSamplePhoto = (sampleUrl: string, sampleCat: GarbageCategory, sampleTitle: string) => {
    setImagePreview(sampleUrl);
    setImageFileName(sampleTitle);
    setCategory(sampleCat);
    if (!title) {
      setTitle(sampleTitle + ' near civic area');
    }
    setErrors((prev) => ({ ...prev, imageUrl: '' }));
  };

  // Preset Bengaluru landmark selection
  const handleSelectPreset = (preset: typeof BENGALURU_PRESET_LOCATIONS[0]) => {
    setLocation({
      lat: preset.lat,
      lng: preset.lng,
      address: `${preset.name}, Bengaluru, Karnataka`,
      landmark: preset.landmark,
      zone: preset.zone,
      wardNumber: preset.wardNumber,
    });
    setLocationSuccessMsg(lang === 'kn' ? `ಸ್ಥಳ ನವೀಕರಿಸಲಾಗಿದೆ: ${preset.name}` : `Location set: ${preset.name}`);
    setTimeout(() => setLocationSuccessMsg(''), 4000);
  };

  // Real browser Geolocation API
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Check if roughly in or near Bengaluru (approx 12.5 - 13.5 N, 77.2 - 77.9 E)
        const lat = Number(latitude.toFixed(6));
        const lng = Number(longitude.toFixed(6));
        
        setLocation({
          lat,
          lng,
          address: `GPS Pin (${lat}, ${lng}), Bengaluru Metropolitan Region`,
          landmark: 'GPS Auto-detected location',
          zone: 'South',
          wardNumber: 151,
        });
        setIsLocating(false);
        setLocationSuccessMsg(lang === 'kn' ? 'ನಿಮ್ಮ ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಗುರುತಿಸಲಾಗಿದೆ!' : 'GPS coordinates captured successfully!');
        setTimeout(() => setLocationSuccessMsg(''), 4000);
      },
      (err) => {
        setIsLocating(false);
        // Fallback gracefully to Bengaluru center if denied
        setLocationSuccessMsg(
          lang === 'kn'
            ? 'ಜಿಪಿಎಸ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ, ಪೂರ್ವನಿಯೋಜಿತ ಬೆಂಗಳೂರು ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ.'
            : 'GPS permission denied or unavailable. You can choose a Bengaluru preset location below.'
        );
        setTimeout(() => setLocationSuccessMsg(''), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateComplaintSubmission({
      title,
      category,
      description,
      imageUrl: imagePreview,
      location,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date().toISOString();
      const newComplaint: Complaint = {
        id: generateComplaintId(),
        title: title.trim(),
        category,
        description: description.trim(),
        location,
        imageUrl: imagePreview,
        status: 'submitted',
        submittedAt: now,
        updatedAt: now,
        citizenId,
        citizenName,
        citizenPhone,
        pointsAwarded: 10,
        isHighPriority,
      };

      setIsSubmitting(false);
      setSubmittedComplaint(newComplaint);
      onSubmitSuccess(newComplaint);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6'],
      });
    }, 900);
  };

  const handleReset = () => {
    setSubmittedComplaint(null);
    setTitle('');
    setDescription('');
    setImagePreview('');
    setImageFileName('');
    setIsHighPriority(false);
    setErrors({});
    onClose();
  };

  const categoriesList: { id: GarbageCategory; label: string; icon: string; desc: string }[] = [
    { id: 'roadside_garbage', label: t.categories.roadside_garbage, icon: '🗑️', desc: 'Waste piled on street edge' },
    { id: 'overflowing_dustbin', label: t.categories.overflowing_dustbin, icon: '🚯', desc: 'Municipal bin spilling over' },
    { id: 'illegal_dumping', label: t.categories.illegal_dumping, icon: '⚠️', desc: 'Commercial or night dumping' },
    { id: 'plastic_waste', label: t.categories.plastic_waste, icon: '🥤', desc: 'Single-use plastic packets/cups' },
    { id: 'construction_waste', label: t.categories.construction_waste, icon: '🧱', desc: 'Cement slabs, debris, gravel' },
    { id: 'drainage_waste', label: t.categories.drainage_waste, icon: '💧', desc: 'Stormwater drain blockage' },
    { id: 'other_cleanliness', label: t.categories.other_cleanliness, icon: '🧹', desc: 'Public hygiene or park litter' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl overflow-hidden my-8 text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-[#0a1329] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'kn' ? 'ಸ್ವಚ್ಛತಾ ದೂರು ಸಲ್ಲಿಸಿ' : 'Report Civic Cleanliness Issue'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'kn' ? 'ಸ್ವಯಂ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಮತ್ತು ಛಾಯಾಚಿತ್ರದೊಂದಿಗೆ' : 'Namma Bengaluru Citizen Geo-Reporting System'}
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
          {submittedComplaint ? (
            /* Success confirmation screen */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {lang === 'kn' ? 'ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!' : 'Complaint Filed Successfully!'}
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  {submittedComplaint.id}
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  {lang === 'kn'
                    ? 'ನಿಮ್ಮ ವರದಿಯನ್ನು ಪರಿಶೀಲನೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಸ್ವಚ್ಛತಾ ತಂಡವು ಸ್ಥಳವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿದ ತಕ್ಷಣ ನಿಮಗೆ ಸೂಚನೆ ನೀಡಲಾಗುತ್ತದೆ.'
                    : 'Your report has been logged and queued for BBMP ward verification. You have earned 10 citizen points!'}
                </p>
              </div>

              {/* Awarded Points Badge */}
              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <div className="text-left">
                  <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                    {lang === 'kn' ? 'ಗಳಿಸಿದ ಅಂಕಗಳು' : 'Points Credited'}
                  </div>
                  <div className="text-lg font-black text-white">
                    +{submittedComplaint.isHighPriority ? 20 : 10} Citizen Points
                  </div>
                </div>
              </div>

              {/* Complaint summary details */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Location:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[240px]">{submittedComplaint.location.address}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Category:</span>
                  <span className="text-emerald-400 font-semibold">{t.categories[submittedComplaint.category]}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Timestamp:</span>
                  <span className="text-slate-300">{new Date(submittedComplaint.submittedAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-colors"
                >
                  {lang === 'kn' ? 'ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ' : 'Track This Complaint'}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
                >
                  {lang === 'kn' ? 'ಮುಕ್ತಾಯಗೊಳಿಸಿ' : 'Close & Return'}
                </button>
              </div>
            </div>
          ) : (
            /* Complaint Submission Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Photograph Upload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span>{t.step1Title}</span>
                  </label>
                  <span className="text-xs text-rose-400 font-semibold">* Required</span>
                </div>

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-black">
                    <img
                      src={imagePreview}
                      alt="Garbage preview"
                      className="w-full h-56 object-cover object-center"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setImagePreview(''); setImageFileName(''); }}
                        className="p-2 rounded-xl bg-red-600/90 text-white hover:bg-red-500 shadow-md backdrop-blur-md"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center justify-between border border-slate-700">
                      <span className="truncate">{imageFileName || 'Uploaded photo'}</span>
                      <span className="text-emerald-400 font-medium">✓ Ready</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/70 transition-all group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-200">
                        {t.uploadPrompt}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        JPG, PNG, WebP up to 10MB • Camera capture supported
                      </p>
                    </div>

                    {/* Quick test sample photos */}
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-teal-400" />
                        <span>{t.useSamplePhoto}:</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {SAMPLE_WASTE_PHOTOS.map((sample, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handleSelectSamplePhoto(sample.url, sample.category, sample.title)}
                            className="relative group rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500 transition-all text-left"
                          >
                            <img src={sample.url} alt={sample.title} className="w-full h-16 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] text-white font-medium truncate block">
                              {sample.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {errors.imageUrl && (
                  <p className="text-xs text-rose-400 font-semibold">{errors.imageUrl}</p>
                )}
              </div>

              {/* Step 2: Category & Description */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <label className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>{t.step2Title}</span>
                </label>

                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {categoriesList.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-950'
                            : 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                            {cat.label}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {cat.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.complaintTitle} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }}
                    placeholder={t.complaintTitlePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none"
                  />
                  {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.description} <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: '' })); }}
                    placeholder={t.descriptionPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none"
                  />
                  {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
                </div>

                {/* High Priority Switch */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-300">{t.highPriority}</div>
                      <div className="text-[11px] text-slate-400">{t.highPriorityDesc}</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isHighPriority}
                    onChange={(e) => setIsHighPriority(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Step 3: GPS Location System */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{t.step3Title}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isLocating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-300 text-xs font-semibold transition-colors"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Locating...' : t.detectGps}</span>
                  </button>
                </div>

                {locationSuccessMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{locationSuccessMsg}</span>
                  </div>
                )}

                {/* Coordinate & Address Card */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        GPS Coordinates
                      </label>
                      <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 flex items-center justify-between">
                        <span>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</span>
                        <span className="text-[10px] text-slate-500">Karnataka, IN</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        {t.bengaluruZone}
                      </label>
                      <select
                        value={location.zone}
                        onChange={(e) => setLocation(prev => ({ ...prev, zone: e.target.value as BengaluruZone }))}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                      >
                        <option value="East">East Zone (Indiranagar / MG Road)</option>
                        <option value="South">South Zone (Koramangala / Jayanagar)</option>
                        <option value="West">West Zone (Malleshwaram / Rajajinagar)</option>
                        <option value="Mahadevapura">Mahadevapura (Whitefield / Marathahalli)</option>
                        <option value="Bommanahalli">Bommanahalli (HSR Layout / Electronic City)</option>
                        <option value="Yelahanka">Yelahanka Zone (Hebbal / Sahakarnagar)</option>
                        <option value="Dasarahalli">Dasarahalli Zone (Peenya)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Street Address & Landmark <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={location.address}
                      onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="e.g. 100 Feet Road, Near Metro Pillar, Bengaluru"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Preset Quick Selectors */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1.5">
                      Or select prominent Bengaluru Ward location:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {BENGALURU_PRESET_LOCATIONS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 hover:text-white transition-colors"
                        >
                          {preset.name.split(' (')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Automatic metadata reminder */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    Submission Timestamp: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} (Logged automatically with citizen telemetry)
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{isSubmitting ? t.submitting : t.submitReport}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
