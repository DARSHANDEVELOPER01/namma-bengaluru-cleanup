import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus, Role, UserProfile, RewardVoucher } from './types';
import { Language } from './utils/translations';
import { INITIAL_COMPLAINTS, INITIAL_USER } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { RecentResolved } from './components/RecentResolved';
import { ReportModal } from './components/ReportModal';
import { TrackPage } from './components/TrackPage';
import { MapView } from './components/MapView';
import { RewardsPage } from './components/RewardsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<string>('home');
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<Role>('citizen');

  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Complaints state (seeded with authentic Bengaluru data)
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('blr_complaints_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_COMPLAINTS;
  });

  // User profile state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('blr_user_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_USER;
  });

  // Global notification banner / toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('blr_complaints_v1', JSON.stringify(complaints));
    } catch (e) {
      // ignore
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem('blr_user_v1', JSON.stringify(user));
    } catch (e) {
      // ignore
    }
  }, [user]);

  // Handle new complaint submitted by citizen
  const handleNewComplaint = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    const earned = newComplaint.isHighPriority ? 20 : 10;
    setUser((prev) => ({
      ...prev,
      points: prev.points + earned,
      reportsSubmitted: prev.reportsSubmitted + 1,
    }));
    showToast(`Complaint ${newComplaint.id} registered! +${earned} citizen points credited.`);
  };

  // Handle Admin updating status / assigning
  const handleUpdateComplaintStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    adminNotes?: string,
    assignedTeam?: string,
    pointsAwarded?: number
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: newStatus,
            adminNotes: adminNotes || c.adminNotes,
            assignedTeam: assignedTeam || c.assignedTeam,
            pointsAwarded: pointsAwarded !== undefined ? pointsAwarded : c.pointsAwarded,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    showToast(`Complaint ${complaintId} status updated to: ${newStatus.replace('_', ' ')}`);
  };

  // Handle Staff Starting Cleaning
  const handleStaffStartCleaning = (complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'in_progress',
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    showToast(`Sanitation crew arrived at ${complaintId}! Status: In Progress`);
  };

  // Handle Staff Completing Cleaning & Uploading Proof
  const handleStaffCompleteCleaning = (
    complaintId: string,
    resolvedImageUrl: string,
    cleaningNotes: string
  ) => {
    let reportingCitizenId = '';
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          reportingCitizenId = c.citizenId;
          return {
            ...c,
            status: 'resolved',
            resolvedImageUrl,
            cleaningNotes,
            pointsAwarded: (c.pointsAwarded || 10) + 30, // 30 bonus points on resolution!
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // If the logged in user was the reporter, award the 30 bonus points!
    setUser((prev) => ({
      ...prev,
      points: prev.points + 30,
      reportsResolved: prev.reportsResolved + 1,
    }));

    showToast(`Area resolved! Before/After photo verified. +30 bonus points issued.`);
  };

  // Handle redeeming a voucher
  const handleRedeemVoucher = (voucher: RewardVoucher): boolean => {
    if (user.points < voucher.pointsRequired) {
      return false;
    }
    setUser((prev) => ({
      ...prev,
      points: prev.points - voucher.pointsRequired,
    }));
    showToast(`Redeemed ${voucher.title}! Code is ready to use.`);
    return true;
  };

  // Resolved count
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-emerald-950/95 border border-emerald-500 text-white shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-slate-400 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        lang={lang}
        setLang={setLang}
        role={role}
        setRole={setRole}
        userPoints={user.points}
        userName={user.name}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              lang={lang}
              onOpenReport={() => setIsReportModalOpen(true)}
              onNavigateTrack={() => setCurrentView('track')}
              onNavigateMap={() => setCurrentView('map')}
              onNavigateRewards={() => setCurrentView('rewards')}
              totalComplaints={complaints.length}
              resolvedComplaints={resolvedCount}
            />
            <HowItWorks
              lang={lang}
              onOpenReport={() => setIsReportModalOpen(true)}
            />
            <RecentResolved
              complaints={complaints}
              lang={lang}
              onSelectComplaint={(id) => {
                setCurrentView('track');
              }}
              onOpenReport={() => setIsReportModalOpen(true)}
            />
          </>
        )}

        {currentView === 'track' && (
          <TrackPage
            complaints={complaints}
            lang={lang}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}

        {currentView === 'map' && (
          <MapView
            complaints={complaints}
            lang={lang}
            onSelectComplaint={(id) => {
              setCurrentView('track');
            }}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}

        {currentView === 'rewards' && (
          <RewardsPage
            user={user}
            lang={lang}
            onRedeemVoucher={handleRedeemVoucher}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            complaints={complaints}
            lang={lang}
            onUpdateComplaintStatus={handleUpdateComplaintStatus}
          />
        )}

        {currentView === 'staff' && (
          <StaffDashboard
            complaints={complaints}
            lang={lang}
            onStartCleaning={handleStaffStartCleaning}
            onCompleteCleaning={handleStaffCompleteCleaning}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        setLang={setLang}
        onOpenReport={() => setIsReportModalOpen(true)}
        onNavigateTrack={() => setCurrentView('track')}
        onNavigateMap={() => setCurrentView('map')}
        onNavigateRewards={() => setCurrentView('rewards')}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        lang={lang}
        citizenName={user.name}
        citizenPhone={user.phone}
        citizenId={user.id}
        onSubmitSuccess={handleNewComplaint}
      />

      {/* Auth / Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        setLang={setLang}
        currentUser={user}
        currentRole={role}
        setCurrentRole={(newRole) => {
          setRole(newRole);
          if (newRole === 'admin') setCurrentView('admin');
          if (newRole === 'staff') setCurrentView('staff');
          if (newRole === 'citizen') setCurrentView('home');
        }}
        onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
      />

    </div>
  );
}
