import React, { useState, useRef } from 'react';
import { Complaint } from '../types';
import { Language, translations } from '../utils/translations';
import confetti from 'canvas-confetti';
import { 
  Wrench, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle, 
  Navigation, 
  Clock, 
  Play, 
  Sparkles, 
  Trash2,
  AlertCircle
} from 'lucide-react';

interface StaffDashboardProps {
  complaints: Complaint[];
  lang: Language;
  onStartCleaning: (complaintId: string) => void;
  onCompleteCleaning: (
    complaintId: string,
    resolvedImageUrl: string,
    cleaningNotes: string
  ) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  complaints,
  lang,
  onStartCleaning,
  onCompleteCleaning,
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter complaints assigned to sanitation team or currently active
  const staffTasks = complaints.filter(
    (c) => c.status === 'assigned' || c.status === 'in_progress' || c.status === 'approved'
  );

  const [selectedTask, setSelectedTask] = useState<Complaint | null>(
    staffTasks[0] || null
  );

  // Field Resolution Form state
  const [resolvedPhotoUrl, setResolvedPhotoUrl] = useState<string>('');
  const [cleaningNotes, setCleaningNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionSuccessMsg, setCompletionSuccessMsg] = useState('');

  // Sample clean photos for quick field demo
  const SAMPLE_RESOLVED_PHOTOS = [
    {
      title: 'Spotless Clean Pavement',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Clear Drainage Grate',
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Emptied Bin & Disinfected Footpath',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResolvedPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMarkResolved = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    if (!resolvedPhotoUrl) {
      alert('Please upload an after-cleaning photograph as official proof of resolution.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onCompleteCleaning(
        selectedTask.id,
        resolvedPhotoUrl,
        cleaningNotes || 'Site cleared of solid waste, swept, and disinfected with bleaching powder by municipal sanitation squad.'
      );
      setIsSubmitting(false);
      setCompletionSuccessMsg(`Task ${selectedTask.id} marked as Resolved! Citizen notified and rewarded.`);
      setResolvedPhotoUrl('');
      setCleaningNotes('');
      setTimeout(() => setCompletionSuccessMsg(''), 5000);

      confetti({
        particleCount: 60,
        spread: 60,
        colors: ['#10b981', '#3b82f6'],
      });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Wrench className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-400">
              BBMP Swachha Field Sanitation App
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.staffDashboard}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Active field assignments, GPS navigation to waste hotspots, and after-cleaning photograph verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
            Field Lead: <strong className="text-emerald-400">Manjunath Naik (Crew #4)</strong>
          </div>
        </div>
      </div>

      {completionSuccessMsg && (
        <div className="my-4 p-4 rounded-2xl bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{completionSuccessMsg}</span>
        </div>
      )}

      {/* Main Split: Assigned Tasks List & Active Work Resolution Form */}
      <div className="my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Assigned Tasks List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>Pending Field Tasks ({staffTasks.length})</span>
            <span className="text-emerald-400">Priority Sorted</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {staffTasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => { setSelectedTask(task); setResolvedPhotoUrl(''); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500 shadow-xl shadow-teal-950/40'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                      {task.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      task.status === 'in_progress'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                    {task.location.address}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span className="text-slate-300 font-medium">
                      {t.categories[task.category]}
                    </span>
                    <span className="text-amber-400 font-medium">
                      Zone: {task.location.zone}
                    </span>
                  </div>
                </div>
              );
            })}

            {staffTasks.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                <p className="text-sm">All assigned tasks for your crew are completed! Great job.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Task Field Console */}
        {selectedTask ? (
          <div className="lg:col-span-7 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  {selectedTask.id}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  {selectedTask.title}
                </h2>
                <p className="text-xs text-slate-400">
                  Reported by {selectedTask.citizenName} • {new Date(selectedTask.submittedAt).toLocaleString()}
                </p>
              </div>

              {/* Navigation button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTask.location.lat},${selectedTask.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-semibold transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in GPS Navigation</span>
              </a>
            </div>

            {/* Before Photo & Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-700 bg-black">
                <img
                  src={selectedTask.imageUrl}
                  alt="Reported spot"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white">
                  Reported (Before Cleaning)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-slate-300">Site Location & Instructions:</div>
                <p className="text-slate-300 leading-relaxed">{selectedTask.location.address}</p>
                <p className="text-amber-400 font-medium">Landmark: {selectedTask.location.landmark}</p>
                {selectedTask.adminNotes && (
                  <div className="pt-2 border-t border-slate-800 text-teal-300">
                    <strong>Admin Note:</strong> {selectedTask.adminNotes}
                  </div>
                )}
              </div>
            </div>

            {/* Status progression control */}
            {selectedTask.status === 'assigned' || selectedTask.status === 'approved' ? (
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Status: Awaiting Crew Arrival</div>
                  <div className="text-[11px] text-slate-400">Click to announce work arrival on site</div>
                </div>
                <button
                  onClick={() => onStartCleaning(selectedTask.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Cleaning</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800 text-blue-300 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Cleaning In Progress: Dispatched team is actively clearing this location.</span>
              </div>
            )}

            {/* After-Cleaning Upload & Resolution Form */}
            <form onSubmit={handleMarkResolved} className="space-y-4 pt-4 border-t border-slate-800">
              <label className="block text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span>{t.uploadAfterPhoto}</span>
              </label>

              {resolvedPhotoUrl ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-black">
                  <img
                    src={resolvedPhotoUrl}
                    alt="Resolved clean site"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setResolvedPhotoUrl('')}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white text-xs"
                  >
                    Retake Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-5 text-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/60 transition-all"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-200">
                      Take or upload photo of the spotless clean site
                    </p>
                  </div>

                  {/* Or pick a sample resolved photo for rapid test */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      Quick Test Field Proof Photos:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {SAMPLE_RESOLVED_PHOTOS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setResolvedPhotoUrl(p.url)}
                          className="relative rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500 text-left h-14"
                        >
                          <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-950/40 hover:bg-transparent"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Cleaning Notes Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.cleaningNotes}
                </label>
                <textarea
                  rows={2}
                  value={cleaningNotes}
                  onChange={(e) => setCleaningNotes(e.target.value)}
                  placeholder="e.g. Cleared 25kg dry solid waste, sprayed disinfectant, reopened pedestrian sidewalk."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Resolution CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !resolvedPhotoUrl}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Verifying & Completing...' : t.markResolved}</span>
              </button>
            </form>

          </div>
        ) : (
          <div className="lg:col-span-7 rounded-3xl bg-slate-900/40 border border-slate-800 p-8 text-center text-slate-400">
            Select a task from the list to review details and begin cleaning.
          </div>
        )}

      </div>

    </div>
  );
};
