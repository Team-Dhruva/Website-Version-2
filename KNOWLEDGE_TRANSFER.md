# Knowledge Transfer: Astrophysics Club Website (Dhruva)

This document provides a comprehensive overview of the project's current state, codebase updates completed in this session, and technical instructions for the next phase of development (Mobile Responsiveness).

---

## 1. Project & Tech Stack Overview
* **Frontend**: React (v18) + TypeScript + Vite + Vanilla CSS.
* **Backend Services**: Firebase (Auth, Firestore, Cloud Storage).
* **Key Integrations**: NASA APOD API & ISS Live Orbit 3D tracker (Three.js/Canvas).
* **Local Dev Server**: `http://localhost:5173`
* **Production Deployment**: Firebase Hosting ([https://ad-astra-dhruva.web.app](https://ad-astra-dhruva.web.app)).

---

## 2. Session Achievements & Changes
We successfully optimized load times, streamlined assets, and completed the desktop-sized layout and admin management interface:

### A. Performance & Asset Optimizations
* **Static Assets Cleanup**: Deleted heavy unused directories (`public/team/`, `public/events/`, `public/projects/`, and `public/white-paint-texture.jpg`) from the workspace.
* **NASA APOD Optimization**: Configured `ApodPanel.tsx` to load the standard web-friendly image URL (`data.url`) instead of the massive HD image (`data.hdurl`), reducing initial payload sizes by several megabytes.
* **ISS 3D Tracker Deferral**: Delayed the loading and mounting of the heavy ISS 3D model canvas in `App.tsx` by `1.2s` and added a smooth `1s` opacity fade-in to prevent layout blocking on initial load.
* **ISS Clipping & Zoom Fix**: Set the `.hero-iss-container` bounds to fill exactly `100%` width and height without horizontal offsets, eliminating the layout "window" bounds so the ISS is draggable anywhere on the screen without getting cut. Expanded the `min-camera-orbit` and `max-camera-orbit` zoom bounds to allow much wider zooming in and out.
* **Preconnections**: Injected `preconnect` link tags to `api.nasa.gov` and NASA media domains inside `index.html`.

### B. Header Navigation & SPA Routing (`SiteHeader.tsx`)
* **React Router Integration**: Replaced standard anchor links (`<a>` tags with `href`) with `<Link>` components from `react-router-dom` for all internal routes. This prevents full page reloads and maintains the application's in-memory Firebase auth state.
* **Conditional Auth Menu**:
  * If a user is **not logged in**: The menu displays `"Admin"`. Clicking it toggles a clean login submenu.
  * If a user is **logged in**: The menu displays `"Dashboard"` (linking to `/admin`) and `"Logout"` directly below it in a uniform vertical column alignment.
* **Auth State Resolution**: Implemented `authResolved` status to prevent the header from flickering or flashing `"Admin"` on page load while Firebase resolves the auth token.

### C. Admin Dashboard (`/admin` | `AdminDashboardPage.tsx`)
* **Standardized Alignment**: Removed custom inline paddings from the dashboard container so it automatically inherits default layout styles (`padding-left: 96px; padding-right: 180px;`) matching the rest of the vertical pages.
* **Aesthetic Formatting**:
  * Removed all uppercase headings and titles to display standard Title Case.
  * Deleted the redundant `"Admin Controls & Seed Manager"` tagline and `"Create/Edit Item"` section header to keep the interface minimal.
  * Formatted selection tab buttons (`Gallery`, `Blogs`, `Events`, `Merchandise`) and database headers to use the `'Inter', sans-serif` font instead of monospace.
  * Enlarged selection menu tabs to `1.35rem` to match the `"Active Database Records"` header.
* **Neutral Theme Overhaul**: Removed all teal/blue text colors (`var(--glass-teal)`) from active elements, edit/delete links, and badges, replacing them with high-contrast text (`#ffffff` / `#18181b`), standard muted grays, and natural green (`#22c55e`) for open status.

---

## 3. Next Task: Mobile Responsiveness Checklist
The laptop and desktop web versions are fully functional. The next phase is to adapt the layout for mobile phones:

### A. Global Layout (`index.css` & Page Containers)
* **Sidebar Padding**: `.vertical-page-container` has a large left padding (`padding-left: 96px;`) and right padding (`padding-right: 180px;`). On mobile viewports (widths `< 768px`), these paddings should be reduced to standard fluid gutters (e.g., `padding: 120px 24px 60px 24px;`).
* **Header Position**: The logo and sidebar menus are absolutely positioned. You will need to implement a mobile-friendly slide-out drawer or a sticky bottom/top header for small screens.

### B. Dynamic Font Resize Handler
* **Headline scaling**: Pages like `EventsPage`, `BlogPage`, and `AdminDashboardPage` use a `ResizeObserver` script to compute precise font-size for titles on load. Make sure the mobile CSS overrides or supports this calculation so titles do not clip out of viewports.

### C. Grid Layouts & Cards
* **Admin Column Grid**: The admin page uses a two-column grid (`gridTemplateColumns: "1.1fr 1fr"`). On screens under `1024px`, this grid must collapse to a single column (`gridTemplateColumns: "1fr"`).
* **Forms & Fields**: Input fields and textareas should span 100% width with touch-friendly tap targets (minimum `44px` height).
* **Active Records List**: Horizontal flex rows (e.g., image thumbnail next to record actions) should stack vertically on narrow devices.

---

## 4. Run & Deployment Guide
To pick up the project locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
3. **Build & Verify Production Bundle**:
   ```bash
   npm run build
   ```
4. **Deploy Updates**:
   ```bash
   npx firebase deploy --only hosting --project=ad-astra-dhruva
   ```

*Note: Firebase authentication uses the credential `admin` / `adastra` (which resolves internally to `admin@teamdhruva.org` in the backend).*
