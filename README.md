# Namma Bengaluru – Smart Clean City & Citizen Reward Platform

A modern, responsive, citizen-powered cleanliness and civic reporting platform inspired by BBMP's Namma Bengaluru initiative. Built with React 19, TypeScript, Tailwind CSS, Leaflet Maps, and automated GPS geo-tagging.

---

## 🌟 Key Features

1. **Smart City Hero & Live Statistics**
   - Real-time Bengaluru cleanliness metrics (Tons of waste cleared, resolution rate, active citizens, and rewards distributed).
   - Live pulse ticker showing recently cleaned spots across BBMP wards.

2. **Garbage Photo Upload & Reporting System**
   - Camera snapshot & gallery file upload with live preview and validation.
   - 7 distinct garbage categories (Roadside garbage, Overflowing dustbin, Illegal dumping, Plastic waste, Construction waste, Drainage waste, Other cleanliness).
   - High-priority / hazard flag (+10 bonus points).
   - Automatic ISO timestamp and citizen telemetry recording.

3. **GPS Location System**
   - Browser Geolocation API integration with automatic latitude & longitude detection.
   - Interactive Bengaluru map pin adjustment with OpenStreetMap tiles.
   - Quick-select presets for prominent Bengaluru wards (Indiranagar, Koramangala, Whitefield, Malleshwaram, Jayanagar, MG Road, HSR Layout, Hebbal).
   - Reverse geocoded address & landmark indicator.

4. **Civic Rewards & Badges System**
   - Verified report: **10 points**
   - High-priority report: **20 points**
   - Successfully resolved cleanup bonus: **30 points**
   - Digital badges shelf (Civic Starter, Eco Patrol, Swachha Warrior, Bengaluru Champion).
   - Redeemable civic vouchers with unique codes & QR display (Namma Metro Smart Card Top-Up, BMTC Vajra AC Bus Pass, Lalbagh Sapling Voucher, Sapna Book House, Cafe Coffee Day).
   - Bengaluru Cleanliness Leaderboard.

5. **Live Complaint Tracking & Before/After Slider**
   - Unique Complaint ID format: `BLR-2026-XXXX`.
   - 6-stage transparent progress timeline: `Submitted` ➔ `Under Review` ➔ `Approved` ➔ `Assigned to Crew` ➔ `In Progress` ➔ `Resolved`.
   - Interactive Before & After comparison slider for verified clean sites.

6. **Municipal Officer (Admin) Portal**
   - Triage complaints across all 8 BBMP zones.
   - Review uploaded photos and GPS coordinates.
   - Verify, reject (with reasoning), or assign to sanitation teams.
   - Manage civic points.

7. **Field Sanitation Staff Console**
   - Crew assignments and direct GPS navigation link.
   - Update work status (`In Progress`).
   - Upload after-cleaning photograph evidence and resolution notes.
   - Automatically award citizen resolution bonus upon completion.

8. **Interactive Bengaluru Map**
   - OpenStreetMap & Leaflet with color-coded markers:
     - 🔴 Red: Submitted (Pending)
     - 🟠 Orange: Under Review
     - 🟣 Purple: Assigned to Crew
     - 🔵 Blue: Cleaning in Progress
     - 🟢 Green: Resolved & Clean
   - Filter by BBMP Zone and Waste Category.

9. **Bilingual Support (English & ಕನ್ನಡ)**
   - Complete 1-click toggle between English and Kannada across all UI elements, headings, categories, and instructions.

10. **Supabase Live Backend Integration**
   - **Project ID**: `vbqkovmxgvtqvtmbkapy`
   - **API URL**: `https://vbqkovmxgvtqvtmbkapy.supabase.co`
   - **Table**: `appointments`
   - **Features**: Automatically saves all submitted appointment bookings (bulk waste pickup, ward sanitation inspection, officer consultations) to your Supabase PostgreSQL database in real-time.
   - **SQL Setup**:
     ```sql
     CREATE TABLE IF NOT EXISTS appointments (
       id TEXT PRIMARY KEY,
       full_name TEXT NOT NULL,
       phone TEXT NOT NULL,
       email TEXT,
       service_type TEXT NOT NULL,
       appointment_date TEXT NOT NULL,
       appointment_time TEXT NOT NULL,
       bbmp_zone TEXT,
       ward_number INTEGER,
       address TEXT,
       notes TEXT,
       status TEXT DEFAULT 'confirmed',
       created_at TIMESTAMPTZ DEFAULT NOW()
     );
     ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
     CREATE POLICY "Public insert access" ON appointments FOR INSERT TO anon WITH CHECK (true);
     CREATE POLICY "Public read access" ON appointments FOR SELECT TO anon USING (true);
     ```

---

## 📁 Folder Structure

```
├── index.html                   # HTML entry point with Leaflet CSS & Google Fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration with Tailwind CSS plugin
├── src/
│   ├── main.tsx                 # React DOM root entry
│   ├── index.css                # Global Tailwind CSS and scrollbar styling
│   ├── App.tsx                  # Root component with role router & global state
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (Complaint, User, Badge, Voucher)
│   ├── utils/
│   │   ├── rewards.ts           # Pure business logic (Points calculation, validation, badges)
│   │   ├── rewards.test.ts      # Unit tests using Node test runner (node:test)
│   │   └── translations.ts      # English & Kannada (ಕನ್ನಡ) localized dictionary
│   ├── data/
│   │   └── initialData.ts       # Bengaluru seed complaints, locations, and vouchers
│   └── components/
│       ├── Navbar.tsx           # Responsive header with language and role toggles
│       ├── HeroSection.tsx      # Smart-city hero with 3D city card & live counters
│       ├── HowItWorks.tsx       # 4-step glassmorphic workflow cards
│       ├── RecentResolved.tsx   # Verified before-and-after photo showcase
│       ├── ReportModal.tsx      # Camera/photo upload, category selection, & GPS picker
│       ├── TrackPage.tsx        # 6-stage timeline and interactive before/after slider
│       ├── MapView.tsx          # Leaflet OpenStreetMap with color-coded ward pins
│       ├── RewardsPage.tsx      # Points balance, badge shelf, leaderboard, voucher modal
│       ├── AdminDashboard.tsx   # Municipal officer complaint review & dispatch console
│       ├── StaffDashboard.tsx   # Field sanitation crew GPS navigation & after-photo upload
│       ├── AuthModal.tsx        # Citizen login, mobile OTP verification, & role switcher
│       └── Footer.tsx           # BBMP Sahaya 1533 helpline, zone directory, & disclaimers
```

---

## 💻 Installation Instructions for VS Code

1. **Clone or Open Folder**
   Open the repository folder in VS Code:
   ```bash
   cd namma-bengaluru-clean-city
   code .
   ```

2. **Install Dependencies**
   Ensure Node.js 18+ is installed. Then run:
   ```bash
   npm install
   ```

3. **Run Unit Tests**
   Run the pure business logic test suite:
   ```bash
   npx --yes tsx --test src/utils/rewards.test.ts
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 🚀 Deployment Instructions

### Option 1: Vercel / Netlify / Cloudflare Pages (Frontend SPA)
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the generated `dist/` directory.

### Option 2: Docker / Google Cloud Run
Build the container image using the included standard Node Vite build and serve with Express or NGINX.

---

## ⚖️ Civic Transparency & Disclaimer

*This application is an independent open civic platform inspired by the BBMP Namma Bengaluru clean city concept. For official emergency municipal triage, contact the official BBMP Sahaya Helpline at 1533.*
