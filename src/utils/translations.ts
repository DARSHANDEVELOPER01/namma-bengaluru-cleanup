export type Language = 'en' | 'kn';

export const translations = {
  en: {
    appName: 'Namma Bengaluru',
    tagline: 'Smart Clean City & Citizen Reward Platform',
    heroHeadline: 'Your Photo. Your Location. Your Contribution. A Cleaner Bengaluru.',
    heroSubtitle: 'Report garbage, help clean your neighbourhood and earn verified rewards from Namma Metro, BMTC, and local partners.',
    reportGarbage: 'Report Garbage',
    trackComplaint: 'Track Complaint',
    joinMovement: 'Join the Movement',
    cleanlinessMap: 'City Map',
    rewardsLeaderboard: 'Rewards & Badges',
    adminDashboard: 'Admin Portal',
    staffDashboard: 'Cleaning Staff',
    login: 'Login / Register',
    logout: 'Logout',
    points: 'Points',
    myPoints: 'My Points',
    
    // Stats
    statGarbageCleared: 'Tons of Waste Cleared',
    statResolvedRate: 'Cleanliness Resolution Rate',
    statActiveCitizens: 'Active Bengaluru Citizens',
    statRewardsIssued: 'Rewards Distributed',
    
    // Categories
    categories: {
      roadside_garbage: 'Roadside Garbage',
      overflowing_dustbin: 'Overflowing Dustbin',
      illegal_dumping: 'Illegal Waste Dumping',
      plastic_waste: 'Plastic Waste',
      construction_waste: 'Construction Debris',
      drainage_waste: 'Drainage / Stormwater Waste',
      other_cleanliness: 'Other Cleanliness Issue',
    },
    
    // Statuses
    statuses: {
      submitted: 'Submitted',
      under_review: 'Under Review',
      approved: 'Approved',
      assigned: 'Assigned to Crew',
      in_progress: 'Cleaning in Progress',
      resolved: 'Resolved',
      rejected: 'Rejected',
    },

    // Form
    step1Title: '1. Photograph Evidence',
    step2Title: '2. Issue Category & Details',
    step3Title: '3. GPS Location in Bengaluru',
    uploadPrompt: 'Click to take a photo or select an image',
    captureLiveCamera: 'Take Live Photo',
    useSamplePhoto: 'Or pick a sample Bengaluru street photo',
    complaintTitle: 'Complaint Title',
    complaintTitlePlaceholder: 'e.g. Overflowing bin near metro station pillar 142',
    description: 'Detailed Description',
    descriptionPlaceholder: 'Describe the waste quantity, odor, obstruction to pedestrians, etc.',
    selectCategory: 'Select Category',
    highPriority: 'Mark as Urgent / High Priority',
    highPriorityDesc: 'Blocking traffic, toxic waste, or health hazard (+10 bonus points)',
    pinLocation: 'Pinpoint Location on Map',
    detectGps: 'Detect Current GPS Location',
    landmark: 'Landmark / Cross / Street',
    landmarkPlaceholder: 'e.g. Near Indiranagar 100ft Rd BDA complex',
    bengaluruZone: 'BBMP Zone',
    submitReport: 'Submit Complaint & Earn Points',
    submitting: 'Submitting & Verifying...',
    
    // Tracking
    searchComplaintPlaceholder: 'Search by Complaint ID (e.g. BLR-2026-1001) or address...',
    filterAll: 'All Complaints',
    beforeAndAfter: 'Before & After Cleanup',
    timeline: 'Resolution Timeline',
    
    // Rewards
    rewardsTitle: 'Citizen Cleanliness Rewards',
    rewardsSubtitle: 'Your civic reports keep Bengaluru garden city green and clean. Redeem your points for mobility and lifestyle rewards.',
    badgesTitle: 'Your Civic Achievement Badges',
    redeemVouchers: 'Redeem Civic Vouchers',
    leaderboardTitle: 'Bengaluru Swachha Leaderboard',
    pointsEarned: 'Points Earned',
    
    // Admin & Staff
    verifyReport: 'Verify Report',
    rejectReport: 'Reject Report',
    assignCrew: 'Assign to Cleaning Crew',
    markInProgress: 'Start Cleanup',
    markResolved: 'Complete & Mark Resolved',
    uploadAfterPhoto: 'Upload After-Cleanup Photo',
    cleaningNotes: 'Staff Cleanup Notes',
    adminNotes: 'Admin Verification Notes',

    // Disclaimer
    disclaimer: 'Citizen-powered civic tech initiative inspired by BBMP Namma Bengaluru cleanliness guidelines. For official emergency municipal triage, contact BBMP Sahaya 1533.',
  },

  kn: {
    appName: 'ನಮ್ಮ ಬೆಂಗಳೂರು',
    tagline: 'ಸ್ಮಾರ್ಟ್ ಸ್ವಚ್ಛ ನಗರ ಮತ್ತು ನಾಗರಿಕ ಬಹುಮಾನ ವೇದಿಕೆ',
    heroHeadline: 'ನಿಮ್ಮ ಛಾಯಾಚಿತ್ರ. ನಿಮ್ಮ ಸ್ಥಳ. ನಿಮ್ಮ ಕೊಡುಗೆ. ಸ್ವಚ್ಛ ಬೆಂಗಳೂರು.',
    heroSubtitle: 'ಕಸ ವರದಿ ಮಾಡಿ, ನಿಮ್ಮ ನೆರೆಹೊರೆಯನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ ಮತ್ತು ನಮ್ಮ ಮೆಟ್ರೋ, ಬಿಎಂಟಿಸಿಯಿಂದ ದೃಢೀಕೃತ ಬಹುಮಾನಗಳನ್ನು ಗಳಿಸಿ.',
    reportGarbage: 'ಕಸ ವರದಿ ಮಾಡಿ',
    trackComplaint: 'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    joinMovement: 'ಅಭಿಯಾನಕ್ಕೆ ಸೇರಿ',
    cleanlinessMap: 'ನಗರ ನಕ್ಷೆ',
    rewardsLeaderboard: 'ಬಹುಮಾನಗಳು & ಬ್ಯಾಡ್ಜ್‌ಗಳು',
    adminDashboard: 'ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್',
    staffDashboard: 'ಸ್ವಚ್ಛತಾ ಸಿಬ್ಬಂದಿ',
    login: 'ಲಾಗಿನ್ / ನೋಂದಣಿ',
    logout: 'ನಿರ್ಗಮಿಸಿ',
    points: 'ಅಂಕಗಳು',
    myPoints: 'ನನ್ನ ಅಂಕಗಳು',
    
    // Stats
    statGarbageCleared: 'ವಿಲೇವಾರಿಯಾದ ತ್ಯಾಜ್ಯ (ಟನ್‌ಗಳಲ್ಲಿ)',
    statResolvedRate: 'ಸ್ವಚ್ಛತಾ ಪರಿಹಾರ ದರ',
    statActiveCitizens: 'ಸಕ್ರಿಯ ಬೆಂಗಳೂರು ನಾಗರಿಕರು',
    statRewardsIssued: 'ವಿತರಿಸಲಾದ ಬಹುಮಾನಗಳು',
    
    // Categories
    categories: {
      roadside_garbage: 'ರಸ್ತೆಬದಿಯ ಕಸ',
      overflowing_dustbin: 'ತುಂಬಿ ಹರಿಯುವ ಕಸದ ತೊಟ್ಟಿ',
      illegal_dumping: 'ಅಕ್ರಮ ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ',
      plastic_waste: 'ಪ್ಲಾಸ್ಟಿಕ್ ತ್ಯಾಜ್ಯ',
      construction_waste: 'ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಅವಶೇಷಗಳು',
      drainage_waste: 'ಚರಂಡಿ ತ್ಯಾಜ್ಯ',
      other_cleanliness: 'ಇತರ ಸ್ವಚ್ಛತಾ ಸಮಸ್ಯೆ',
    },
    
    // Statuses
    statuses: {
      submitted: 'ಸಲ್ಲಿಕೆಯಾಗಿದೆ',
      under_review: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
      approved: 'ಅನುಮೋದಿಸಲಾಗಿದೆ',
      assigned: 'ಸಿಬ್ಬಂದಿಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ',
      in_progress: 'ಸ್ವಚ್ಛತಾ ಕಾರ್ಯ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
      resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
      rejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    },

    // Form
    step1Title: '೧. ಛಾಯಾಚಿತ್ರ ಪುರಾವೆ',
    step2Title: '೨. ಸಮಸ್ಯೆಯ ವಿವರಗಳು',
    step3Title: '೩. ಜಿಪಿಎಸ್ ಸ್ಥಳ',
    uploadPrompt: 'ಫೋಟೋ ತೆಗೆಯಲು ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
    captureLiveCamera: 'ಲೈವ್ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    useSamplePhoto: 'ಅಥವಾ ಬೆಂಗಳೂರು ಮಾದರಿ ಫೋಟೋ ಆರಿಸಿ',
    complaintTitle: 'ದೂರಿನ ಶೀರ್ಷಿಕೆ',
    complaintTitlePlaceholder: 'ಉದಾ: ಮೆಟ್ರೋ ಪಿಲ್ಲರ್ 142 ಬಳಿ ತುಂಬಿರುವ ತೊಟ್ಟಿ',
    description: 'ವಿವರವಾದ ವಿವರಣೆ',
    descriptionPlaceholder: 'ತ್ಯಾಜ್ಯದ ಪ್ರಮಾಣ, ದುರ್ನಾತ, ಪಾದಚಾರಿಗಳಿಗೆ ಅಡ್ಡಿ ಇತ್ಯಾದಿ ವಿವರಗಳನ್ನು ಬರೆಯಿರಿ',
    selectCategory: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    highPriority: 'ತುರ್ತು / ಆದ್ಯತೆಯ ಸಮಸ್ಯೆ ಎಂದು ಗುರುತಿಸಿ',
    highPriorityDesc: 'ಸಂಚಾರಕ್ಕೆ ಅಡ್ಡಿ, ಅಪಾಯಕಾರಿ ತ್ಯಾಜ್ಯ ಅಥವಾ ಆರೋಗ್ಯಕ್ಕೆ ಹಾನಿಕರ (+10 ಬೋನಸ್ ಅಂಕ)',
    pinLocation: 'ನಕ್ಷೆಯಲ್ಲಿ ನಿಖರ ಸ್ಥಳ ಗುರುತಿಸಿ',
    detectGps: 'ಪ್ರಸ್ತುತ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಿ',
    landmark: 'ಪ್ರಮುಖ ಗುರುತು / ರಸ್ತೆ',
    landmarkPlaceholder: 'ಉದಾ: ಇಂದಿರಾನಗರ 100 ಅಡಿ ರಸ್ತೆ ಬಿಡಿಎ ಕಾಂಪ್ಲೆಕ್ಸ್ ಬಳಿ',
    bengaluruZone: 'ಬಿಬಿಎಂಪಿ ವಲಯ',
    submitReport: 'ದೂರು ಸಲ್ಲಿಸಿ ಮತ್ತು ಅಂಕಗಳನ್ನು ಗಳಿಸಿ',
    submitting: 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
    
    // Tracking
    searchComplaintPlaceholder: 'ದೂರು ಸಂಖ್ಯೆ (ಉದಾ: BLR-2026-1001) ಅಥವಾ ವಿಳಾಸದಿಂದ ಹುಡುಕಿ...',
    filterAll: 'ಎಲ್ಲಾ ದೂರುಗಳು',
    beforeAndAfter: 'ಸ್ವಚ್ಛತೆಗೆ ಮೊದಲು ಮತ್ತು ನಂತರ',
    timeline: 'ಪರಿಹಾರದ ಪ್ರಗತಿ',
    
    // Rewards
    rewardsTitle: 'ನಾಗರಿಕ ಸ್ವಚ್ಛತಾ ಬಹುಮಾನಗಳು',
    rewardsSubtitle: 'ನಿಮ್ಮ ನಾಗರಿಕ ವರದಿಗಳು ಬೆಂಗಳೂರನ್ನು ಹಸಿರಾಗಿ ಮತ್ತು ಸುಂದರವಾಗಿಡುತ್ತವೆ. ಅಂಕಗಳನ್ನು ಕೂಪನ್‌ಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ.',
    badgesTitle: 'ನಿಮ್ಮ ಸಾಧನೆಯ ಬ್ಯಾಡ್ಜ್‌ಗಳು',
    redeemVouchers: 'ಕೂಪನ್ ರಿಡೀಮ್ ಮಾಡಿ',
    leaderboardTitle: 'ಬೆಂಗಳೂರು ಸ್ವಚ್ಛ ನಾಯಕರ ಪಟ್ಟಿ',
    pointsEarned: 'ಗಳಿಸಿದ ಅಂಕಗಳು',
    
    // Admin & Staff
    verifyReport: 'ವರದಿ ಪರಿಶೀಲಿಸಿ',
    rejectReport: 'ವರದಿ ತಿರಸ್ಕರಿಸಿ',
    assignCrew: 'ಸ್ವಚ್ಛತಾ ತಂಡಕ್ಕೆ ವಹಿಸಿ',
    markInProgress: 'ಸ್ವಚ್ಛತಾ ಕಾರ್ಯ ಪ್ರಾರಂಭಿಸಿ',
    markResolved: 'ಸ್ವಚ್ಛತಾ ಕಾರ್ಯ ಪೂರ್ಣಗೊಳಿಸಿ',
    uploadAfterPhoto: 'ಸ್ವಚ್ಛತೆಯ ನಂತರದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    cleaningNotes: 'ಸಿಬ್ಬಂದಿಯ ಸ್ವಚ್ಛತಾ ಟಿಪ್ಪಣಿ',
    adminNotes: 'ನಿರ್ವಾಹಕರ ಪರಿಶೀಲನಾ ಟಿಪ್ಪಣಿ',

    // Disclaimer
    disclaimer: 'ಬಿಬಿಎಂಪಿ ನಮ್ಮ ಬೆಂಗಳೂರು ಸ್ವಚ್ಛತಾ ನಿಯಮಾವಳಿಗಳಿಂದ ಪ್ರೇರಿತವಾದ ನಾಗರಿಕ ತಂತ್ರಜ್ಞಾನ ಉಪಕ್ರಮ. ತುರ್ತು ಪಾಲಿಕೆ ಸೇವೆಗಾಗಿ ಬಿಬಿಎಂಪಿ ಸಹಾಯ 1533 ಸಂಪರ್ಕಿಸಿ.',
  },
};
