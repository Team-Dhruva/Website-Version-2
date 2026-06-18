# Website Handover — Astrophysics Club (Dhruva)

## Overview

Modern, dark glassmorphic portal for the RVCE Astrophysics Club — built with React + Vite, hosted on Firebase, featuring APOD display, ISS 3D tracking, blogs, events, recruitment, admin dashboard, and more.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Bundler | Vite 5 |
| Routing | react-router-dom v7 |
| Icons | Feather Icons (`react-icons/fi`) |
| Backend | Firebase (Firestore, Auth, Storage) |
| Hosting | Firebase Hosting |
| Domain (temp) | `website-7f518.web.app` → `temp.teamdhruva.com` (pending DNS) |

---

## Repository

**GitHub**: `github.com/Team-Dhruva/Website-Version-2`

Branch: `main`

### Setup locally
```bash
git clone https://github.com/Team-Dhruva/Website-Version-2.git
cd Website-Version-2
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## What's Deployed & Working

- [x] Landing page with hero, scramble title, CTA
- [x] About section (separate `/about` page on mobile)
- [x] Verticals / Recruitment / Team / Events / Blog pages
- [x] Gallery page with image grid
- [x] Merchandise page (static images, no lightbox)
- [x] ISS 3D tracker with touch orbit support
- [x] APOD (Astronomy Picture of the Day) panel with date navigation
- [x] Indian Astronomy resources page
- [x] Responsive header with hamburger drawer on mobile
- [x] Breadcrumbs on all pages
- [x] Admin dashboard with Firestore CRUD for blogs, events, gallery, merch
- [x] Firebase Auth with Email/Password
- [x] Firebase Security Rules (write restricted to `@rvce.edu.in` / `@gmail.com`)
- [x] SPA routing via `public/_redirects`
- [x] Cache headers for assets (1-year immutable)
- [x] Storage made optional — site works even if Storage not enabled

---

## Firebase Project Details

**Project ID**: `website-7f518`
**Owner email**: `dhruvarvceofficial@gmail.com`
**Live URL**: `https://website-7f518.web.app`

### Services Enabled

| Service | Status |
|---------|--------|
| Firestore Database | ✅ Enabled — rules deployed |
| Authentication (Email/Password) | ✅ Enabled |
| Storage | ❌ Needs billing setup (free Spark plan) |

### Firestore Collections

- `gallery` — Gallery image entries
- `blogs` — Blog posts with chapters
- `events` — Event listings
- `merchandise` — Merchandise items

### Security Rules

**Firestore** (`firestore.rules`):
- Read: anyone
- Write: authenticated users with `@rvce.edu.in` or `@gmail.com` emails

**Storage** (`storage.rules`):
- Same policy (once Storage is enabled)

---

## Environment Variables

File: `.env` (not committed — Cloudflare/Firebase CI injects these)

| Variable | Value |
|----------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBw7WX13xkI2iGy3wC4P-mM2TLUEKAtmV4` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `website-7f518.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `website-7f518` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `website-7f518.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `859681006151` |
| `VITE_FIREBASE_APP_ID` | `1:859681006151:web:4e128025f4e6934c804762` |

---

## Deployment

### Option A: Firebase CLI (manual)
```bash
npm run build
npx firebase deploy --only hosting
```

### Option B: Firebase Console (no CLI)
1. Go to Firebase Console → Build → Hosting
2. Click ⋮ (three dots) → Upload folder
3. Select the `dist/` directory

### Option C: GitHub Actions (auto-deploy)
Push to `main` branch triggers auto-deploy. Workflow file: `.github/workflows/deploy.yml` (to be added if desired).

---

## Admin Dashboard

**URL**: `https://website-7f518.web.app/admin`

Login with any `@rvce.edu.in` or `@gmail.com` account added in Firebase Authentication.

### Tabs
- **Gallery** — Add/edit/delete gallery images (requires Storage)
- **Blogs** — Create/edit blog posts with markdown chapters
- **Events** — Manage event listings with registration links
- **Merchandise** — Upload merchandise mockups (requires Storage)

---

## Admin To-Do List

### 1. Enable Firebase Storage
- Go to Firebase Console → Build → Storage → Get Started
- Select location, set rules (copy from `storage.rules`)
- Requires adding a billing card (Spark free tier — no charge)

### 2. Set Up Custom Domain
- In Cloudflare DNS, add a CNAME record:
  - **Name**: `temp`
  - **Target**: `website-7f518.web.app`
  - **Proxy**: Orange cloud (proxied)
- In Firebase Console → Hosting → Add custom domain → enter `temp.teamdhruva.com`
- Firebase auto-provisions SSL certificate

### 3. Add Admin Users
- Firebase Console → Authentication → Users → Add User
- Add emails for team members who need admin dashboard access

### 4. Revoke Old GitHub Token
The previous git remote URL contained a personal access token (`ghp_Ci6EDl...`). Go to `github.com/settings/tokens` and revoke it.

### 5. (Optional) Set Up GitHub Actions Auto-Deploy
Create `.github/workflows/deploy.yml` with Firebase CI token to auto-deploy on every push.

---

## Directory Structure

```
src/
├── App.tsx                    # Main app with routing + mobile detection
├── main.tsx                   # Entry point with router
├── index.css                  # All global styles
├── firebase.ts                # Firebase init (Storage optional)
├── components/
│   ├── SiteHeader.tsx         # Responsive header with nav, auth, toggle
│   ├── SiteFooter.tsx         # 3-column footer
│   ├── Layout.tsx             # Page layout wrapper
│   ├── AboutSection.tsx       # About us section
│   ├── Breadcrumbs.tsx        # Hierarchical path breadcrumbs
│   ├── ApodPanel.tsx          # NASA APOD display
│   ├── SpacetimeGrid.tsx      # Decorative SVG background
│   ├── VoronoiBackground.tsx  # Animated voronoi background
│   ├── ScrambleTitle.tsx      # Scramble text effect
│   └── TextDecode.tsx         # Decode text animation
├── pages/
│   ├── AboutPage.tsx          # Standalone about page (mobile)
│   ├── BlogPage.tsx           # Blog listing
│   ├── EventsPage.tsx         # Events listing
│   ├── GalleryPage.tsx        # Photo gallery
│   ├── TeamPage.tsx           # Team members
│   ├── VerticalPage.tsx       # Club verticals
│   ├── MerchandisePage.tsx    # Merch showcase
│   ├── RecruitmentBatchPage.tsx
│   ├── IndianAstrophysicsPage.tsx
│   └── admin/
│       └── AdminDashboardPage.tsx  # Admin CRUD dashboard
├── data/
│   ├── blogData.ts
│   ├── eventsData.ts
│   ├── galleryData.ts
│   ├── indianAstrophysicsData.ts
│   ├── recruitmentData.ts
│   └── verticals.ts
└── hooks/
    └── useTheme.ts
public/
├── _redirects                # SPA fallback routing
├── _headers                   # Cache control headers
├── aeronaut.otf              # Custom font
├── gallery/                   # Static gallery images
├── merchandise/               # Merch mockup images
└── team/                      # Team member photos
```

---

## Known Issues / Future Work

1. **Storage billing** — Enable to allow admin image uploads
2. **WebP conversion** — Convert gallery/merch images to WebP for smaller bundles
3. **Code splitting** — JS bundle is ~950KB, can be split with `React.lazy()`
4. **Image optimization** — Gallery images are large JPEGs, resize + compress
5. **Domain switch** — Once `teamdhruva.com` old site is down, point root domain here

---

## Notes

- The header is fixed height on desktop/mobile, no dynamic `paddingTop` JS (previously caused scroll snapping issues on mobile)
- All 8 main pages have no layout JS padding — CSS handles spacing
- Constellation SVG is constant `170×120` outside `SiteHeader`
- Only `@teamdhruva.org` was originally allowed — updated to `@rvce.edu.in` + `@gmail.com` per request
- `dhruvarvceofficial@gmail.com` is the Firebase project owner
