# Astrophysics Club Website (Dhruva)

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
| Live URL | `https://website-7f518.web.app` |
| Domain (pending) | `temp.teamdhruva.com` |

---

## Setup

```bash
git clone https://github.com/Team-Dhruva/Website-Version-2.git
cd Website-Version-2
npm install
npm run dev
# → http://localhost:5173
```

### Environment Variables

Copy `.env.example` to `.env` and fill in Firebase keys. Never commit `.env`.

---

## Deployment

### Firebase CLI
```bash
npm run build
npx firebase deploy --only hosting
```

### Firebase Console (no CLI)
1. Go to Firebase Console → Build → Hosting
2. Click ⋮ → Upload folder → select `dist/`

---

## Admin Dashboard

**URL**: `/admin` (login via `@rvce.edu.in` or `@gmail.com` account)

### Tabs
- **Gallery** — Add/edit/delete gallery images (requires Storage)
- **Blogs** — Create/edit blog posts with markdown chapters
- **Events** — Manage event listings
- **Merchandise** — Upload merch mockups (requires Storage)

---

## Project Structure

```
src/
├── App.tsx                    # Main app + routing + mobile detection
├── main.tsx                   # Entry point
├── index.css                  # All global styles
├── firebase.ts                # Firebase init (Storage optional)
├── components/
│   ├── SiteHeader.tsx         # Responsive header
│   ├── SiteFooter.tsx         # 3-column footer
│   ├── Layout.tsx             # Page layout wrapper
│   ├── AboutSection.tsx       # About us section
│   ├── Breadcrumbs.tsx        # Hierarchical path breadcrumbs
│   ├── ApodPanel.tsx          # NASA APOD display
│   ├── SpacetimeGrid.tsx      # Decorative SVG
│   ├── VoronoiBackground.tsx  # Animated background
│   ├── ScrambleTitle.tsx      # Scramble text effect
│   └── TextDecode.tsx         # Decode animation
├── pages/
│   ├── AboutPage.tsx
│   ├── BlogPage.tsx
│   ├── EventsPage.tsx
│   ├── GalleryPage.tsx
│   ├── TeamPage.tsx
│   ├── VerticalPage.tsx
│   ├── MerchandisePage.tsx
│   ├── RecruitmentBatchPage.tsx
│   ├── IndianAstrophysicsPage.tsx
│   └── admin/AdminDashboardPage.tsx
├── data/                      # Fallback static data
└── hooks/useTheme.ts
public/
├── _redirects                 # SPA fallback
├── _headers                   # Cache control
├── aeronaut.otf
├── gallery/
├── merchandise/
└── team/
```

---

## Firebase Project

**Project ID**: `website-7f518`  
**Owner**: `dhruvarvceofficial@gmail.com`

| Service | Status |
|---------|--------|
| Firestore Database | ✅ Enabled |
| Authentication (Email/Password) | ✅ Enabled |
| Storage | ❌ Needs billing (free Spark plan) |

### Security Rules

- **Read**: anyone
- **Write**: authenticated users with `@rvce.edu.in` or `@gmail.com`

Rules files: `firestore.rules`, `storage.rules`

---

## Admin To-Do

1. **Enable Storage** — Firebase Console → Build → Storage → Get Started (requires billing card, free Spark)
2. **Set up domain** — Add CNAME `temp` → `website-7f518.web.app` in Cloudflare DNS → Add custom domain in Firebase Hosting
3. **Add admin users** — Firebase Console → Authentication → Users → Add User
4. **Revoke old GitHub token** at `github.com/settings/tokens` (previously leaked)
5. **(Optional) GitHub Actions** — Add CI/CD for auto-deploy on push

---

## Known Issues

- Storage needs billing setup for admin image uploads
- Images should be converted to WebP for smaller bundles
- JS bundle ~950KB — can be split with `React.lazy()`
- Gallery images are large JPEGs — resize + compress recommended

---

## Key Notes

- Header is fixed height on all devices — no dynamic `paddingTop` JS (fixes mobile scroll snap)
- Storage is optional — site works without it, upload forms show a notice
- Admin email check allows `@rvce.edu.in` and `@gmail.com`
- SPA routing via `public/_redirects`
- Cache headers: `index.html` no-cache, hashed assets 1-year immutable
