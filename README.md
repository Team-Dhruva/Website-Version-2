# Astrophysics Club Website (Dhruva)

Modern, dark glassmorphic portal for the RVCE Astrophysics Club — built with React + Vite, hosted on Firebase, featuring APOD display, ISS 3D model, blogs, events, gallery, merchandise, recruitment, team, projects, Indian Astrophysics articles, and a full admin CMS.

---

## Live URL

| Environment | URL |
|-------------|-----|
| Firebase Hosting | `https://website-7f518.web.app` |
| Custom domain (pending) | `temp.teamdhruva.com` → needs CNAME + Firebase config |

Firebase owner: **dhruvarvceofficial@gmail.com**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Bundler | Vite 5 |
| Routing | react-router-dom v7 |
| Icons | Feather Icons (`react-icons/fi`) |
| Backend | Firebase (Firestore, Auth) |
| Image/Video Hosting | Cloudinary (unsigned uploads, free tier) |
| Hosting | Firebase Hosting |

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

Copy `.env.example` to `.env` and fill in Firebase keys and Cloudinary credentials. Never commit `.env`.

Required vars:
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc.
- `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`

---

## Deployment

```bash
npm run build
npx firebase deploy --only hosting
```

---

## Admin Dashboard

**URL**: `/admin`
**Login**: `sunisactuallycalledsol` (password) — any email format works (auto-appends `@rvce.edu.in` if no `@`)

### Full CMS Tabs

| Tab | Description |
|-----|-------------|
| **Gallery** | Upload images/videos to Cloudinary, add alt text + description, delete records |
| **Blogs** | Create/edit blog posts with markdown chapters, image/video upload in chapter editor |
| **Events** | Manage event listings with title, speaker, date, registration status |
| **Merchandise** | Upload merch mockups to Cloudinary with title, category, description |
| **Projects** | Override static project data, add chapters with markdown + image/video upload |
| **Team** | Add/edit/delete team members per batch (Core, Semi-Core, Faculty) |
| **Recruitment** | Manage recruits per epoch, create/delete epochs |
| **IA Articles** | Create Indian Astrophysics articles with chapters, markdown + image/video upload |

### Image/Video Upload

All uploads go through **Cloudinary** (unsigned preset). No Firebase Storage needed. In chapter editors (blogs, projects, IA articles), click **"+ Upload Image/Video"** to upload and get `![[cloudinary-url]]` inserted at cursor position.

### Markdown Support

Content renderers support:
- `![alt](url)` — standard markdown images
- `![[url]]` or `![[url|alt]]` — Obsidian-style embeds
- `<img src="url">` / `<video src="url" controls>` — HTML tags
- `#` headers, `-` lists, `>` blockquotes, `|` tables, `**bold**`, `*italic*`, `[links](url)`, `---` horizontal rules
- Video detection via file extension (`.mp4`, `.webm`, `.ogg`, `.mov`)

---

## Features

- **ISS 3D Model** — interactive WebGL model (model-viewer), touch orbit + pinch zoom
- **Gallery** — collage grid with hover overlays (alt + description), lightbox with nav
- **Blogs** — multi-chapter reader with prev/next nav
- **Events** — timeline cards with registration links
- **Merchandise** — product grid (images not clickable/expandable)
- **Team** — filterable by batch with role badges
- **Recruitment** — per-epoch recruit listings with department filters
- **Verticals** — Radio, Optical, Data-Driven, Research projects with Firestore override
- **Indian Astrophysics** — article reader with chapter nav
- **APOD** — NASA Astronomy Picture of the Day with localStorage caching
- **Dark/Light Mode** — persistent theme toggle
- **Responsive** — mobile-first with separate About page on mobile
- **Admin Auth** — email/password login, write access via Firestore security rules

---

## Firebase Project

**Project ID**: `website-7f518`
**Owner**: `dhruvarvceofficial@gmail.com`

| Service | Status |
|---------|--------|
| Firestore Database | ✅ Enabled |
| Authentication (Email/Password) | ✅ Enabled |
| Storage | ❌ Not used — all media via Cloudinary |

### Security Rules

- **Read**: anyone
- **Write**: authenticated users with `@rvce.edu.in` or `@gmail.com`

Rules files: `firestore.rules`

---

## Project Structure

```
src/
├── App.tsx                    # Main app + routing + mobile detection
├── main.tsx                   # Entry point + router
├── index.css                  # All global styles (3300+ lines)
├── firebase.ts                # Firebase init (app, auth, db)
├── cloudinary.ts              # Cloudinary upload helper
├── components/
│   ├── SiteHeader.tsx         # Responsive header with hamburger
│   ├── SiteFooter.tsx         # 3-column footer
│   ├── Layout.tsx             # Page layout wrapper
│   ├── AboutSection.tsx       # About us section
│   ├── Breadcrumbs.tsx        # Hierarchical breadcrumbs
│   ├── ApodPanel.tsx          # NASA APOD
│   ├── SpacetimeGrid.tsx      # Decorative SVG background
│   ├── VoronoiBackground.tsx  # Animated background
│   ├── ScrambleTitle.tsx      # Scramble text effect
│   └── TextDecode.tsx         # Decode animation
├── pages/
│   ├── AboutPage.tsx          # Standalone about page (mobile)
│   ├── BlogPage.tsx           # Blogs with markdown reader
│   ├── EventsPage.tsx         # Event listings
│   ├── GalleryPage.tsx        # Photo/video gallery with lightbox
│   ├── TeamPage.tsx           # Team directory
│   ├── VerticalPage.tsx       # Vertical projects + IA articles
│   ├── MerchandisePage.tsx    # Merch store
│   ├── RecruitmentBatchPage.tsx # Recruit listings
│   ├── IndianAstrophysicsPage.tsx # IA article reader
│   ├── ProjectDetailPage.tsx  # Project chapter reader
│   └── admin/AdminDashboardPage.tsx # Full CMS
├── data/                      # Fallback static data
└── hooks/useTheme.ts
public/
├── _redirects                 # SPA fallback (Firebase Hosting)
├── _headers                   # Cache-control headers
├── aeronaut.otf               # Custom font
├── gallery/                   # Static gallery images (WebP)
├── merchandise/               # Static merch images (WebP)
└── team/                      # Team member photos
```

---

## Remaining Work

1. **Custom domain** — Add CNAME `temp` → `website-7f518.web.app` in Cloudflare DNS → configure custom domain in Firebase Hosting console
2. **Take down old Svelte site** at `teamdhruva.com`
3. **Code-split** JS bundle (currently ~950KB, can use `React.lazy()`)
4. **Firebase Storage** can be enabled if Cloudinary limit is reached

---

## Key Notes

- All images served as WebP (gallery: 20MB→11MB, merch: 4.6MB→252KB)
- Gallery images have `loading="lazy"` for performance
- Scroll snap on mobile was caused by dynamic `paddingTop` JS — fixed by using CSS only
- SPA routing via `_redirects` (Firebase Hosting catch-all)
- Cache headers: `index.html` no-cache, hashed assets 1-year immutable
