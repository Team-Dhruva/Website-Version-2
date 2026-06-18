# Astrophysics Club Website (Dhruva)

A high-performance, dark glassmorphic portal for the RVCE Astrophysics Club, featuring dynamic APOD displays, real-time ISS orbit tracking, vertically aligned blogs, recruitment management, sponsorships, and a unified administrative database dashboard.

---

## 1. Prerequisites
Ensure you have the following installed locally:
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)
* A **Firebase Account** (free tier is fully sufficient)

---

## 2. Firebase Backend Setup
To run the database and admin dashboard, you need to create and configure a Firebase project:

1. **Create Firebase Project**:
   * Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**. Name it (e.g., `ad-astra-dhruva`).
2. **Add a Web App**:
   * Click the web icon (`</>`) in the project overview to register a Web App.
   * Copy the configuration object keys (API Key, Auth Domain, Project ID, etc.).
3. **Configure Environment Variables**:
   * Create a file named `.env` in the root of the project.
   * Copy the variables from `.env.example` into `.env` and fill them in with your Firebase keys:
     ```env
     VITE_FIREBASE_API_KEY=AIzaSy...
     VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your-app
     VITE_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
     VITE_FIREBASE_MESSAGING_SENDER_ID=...
     VITE_FIREBASE_APP_ID=...
     ```
4. **Enable Firebase Services**:
   * **Authentication**: Go to *Build > Authentication*, click *Get Started*, and enable the **Email/Password** sign-in provider.
   * **Firestore Database**: Go to *Build > Firestore Database* and click *Create Database*. Set location and start in test/production mode.
   * **Cloud Storage**: Go to *Build > Storage* and click *Get Started*. Set the location rules.

---

## 3. Local Installation & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Local Server**:
   ```bash
   npm run dev
   ```
   * Open `http://localhost:5173` in your browser.

3. **Admin Login**:
   * Click **Admin** (or go to `/admin`) in the header menu.
   * Log in with the admin credentials set in Firebase Authentication. Only users with a `@teamdhruva.org` email are authorized to write to the database.

---

## 4. Production Build & Deployment

### Option A: Firebase Hosting (Recommended & Free)
1. **Login to Firebase CLI**:
   ```bash
   npx firebase login
   ```
2. **Select / Link Your Project**:
   * Verify your active project ID in `.firebaserc` matches your project.
3. **Build the Application**:
   ```bash
   npm run build
   ```
4. **Deploy Assets & Security Rules**:
   ```bash
   npx firebase deploy --only hosting,firestore,storage
   ```

### Option B: Cloudflare Pages (Free)
1. Log into your Cloudflare dashboard and go to **Workers & Pages**.
2. Click **Create Application > Pages > Connect to Git**.
3. Select this repository.
4. Configure Build settings:
   * **Framework Preset**: None (or Vite)
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
5. Add your `.env` environment variables in the Cloudflare dashboard under *Settings > Environment Variables*.

---

## 5. Directory Structure
* `src/components/`: Reusable components (e.g., `SiteHeader.tsx`, `ApodPanel.tsx`).
* `src/pages/`: Page containers (e.g., `BlogPage.tsx`, `admin/AdminDashboardPage.tsx`).
* `src/data/`: fallback static datasets used when database collections are empty.
* `firestore.rules` / `storage.rules`: Security access control files.
* `KNOWLEDGE_TRANSFER.md`: Details developer transition guidelines for mobile responsive adjustments.

---

## 6. Handover & Custom Domain Hosting Guide

If you are a developer taking over this project or forking it, here is how you can host the website under your own name or configure it with the official domain:

### A. Forking & Local Setup
1. **Fork/Clone the Repository**: Clone this repository to your computer or fork it to your own GitHub organization.
2. **Environment Variables**:
   * Do **NOT** commit your real Firebase credentials (secrets) to the repository. The project is pre-configured to load them from environment variables via Vite.
   * Copy the template from `.env.example` into a new `.env` file in the project root and fill in your real credentials for local testing.
   * Add these same environment variables in your deployment platform settings (e.g., Cloudflare Pages, Vercel, Netlify, or Github Actions secrets).

### B. Hosting & Custom Domains Setup

#### Option A: Firebase Hosting (Recommended & Free SSL)
1. **Initialize and Connect**:
   * Build the project: `npm run build`
   * Link the project using the Firebase CLI: `npx firebase use --add`
   * Deploy to your Firebase project: `npx firebase deploy`
2. **Setup Custom Domain**:
   * In the [Firebase Console](https://console.firebase.google.com/), go to **Hosting** under the Build menu.
   * Click **Add Custom Domain**.
   * Enter your domain (e.g., `astrophysicsclub.rvce.edu.in` or `yourdomain.com`).
   * Firebase will generate TXT and A records.
   * Go to your domain provider / DNS registrar (e.g., Cloudflare, GoDaddy) and add these records.
   * Firebase will automatically provision and renew a free SSL certificate for you.

#### Option B: Cloudflare Pages (Free & Custom Domains)
The repo includes `public/_redirects` (SPA routing fallback) and `public/_headers` (cache control) — Cloudflare Pages reads these automatically.

1. **Connect & Deploy**:
   * Log into your Cloudflare Dashboard, go to **Workers & Pages**, and click **Create Application > Pages > Connect to Git**.
   * Authorize GitHub, select this repository, and set:
     * **Build command**: `npm run build`
     * **Build output directory**: `dist`
   * Under **Settings > Environment Variables**, add your `VITE_FIREBASE_*` keys so they are injected at build time.
2. **Setup Custom Domain**:
   * Go to the **Custom Domains** tab in your Pages project.
   * Click **Set up a custom domain** and enter your domain name.
   * Cloudflare will automatically configure the CNAME records if your domain is managed by Cloudflare, or provide instructions if it is hosted elsewhere.

### C. Developer Transition & Future Tasks
* **Mobile Responsiveness**: The desktop and laptop layouts are fully implemented. The next step is adapting the CSS and layout structure for mobile phones. Check the [KNOWLEDGE_TRANSFER.md](file:///home/neo/club/KNOWLEDGE_TRANSFER.md) file for a detailed checklist and guidelines.
* **Security Rules**: Ensure `firestore.rules` and `storage.rules` are deployed alongside hosting to prevent unauthorized access to your database.

---

## 7. Deploy on Cloudflare Pages (from GitHub) with Firebase Backend

### Architecture
- **Hosting**: Cloudflare Pages — auto-builds from GitHub on every push.
- **Domain**: Managed entirely by Cloudflare (no Firebase Hosting).
- **Backend**: Firebase (Firestore + Auth + Storage) — backend services only.

### A. Enable Firebase Storage
1. Go to [Firebase Console](https://console.firebase.google.com/) → your project.
2. Click **Build > Storage > Get Started**, choose a location, set initial rules (test mode is fine).
3. Deploy storage & firestore rules:
   ```bash
   npx firebase deploy --only storage,firestore
   ```

### B. Deploy on Cloudflare Pages (auto-build from GitHub)
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages**.
2. Click **Create Application > Pages > Connect to Git**.
3. Authorize GitHub and select this repository.
4. Configure build settings:
   - **Framework preset**: Vite (or "None" and set manually)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Under **Settings > Environment Variables**, add all `VITE_FIREBASE_*` keys (the same ones from `.env.example`). These are injected at build time so the app can reach Firebase.
6. Click **Save and Deploy** — Cloudflare builds and deploys instantly. Every future push to the repo auto-triggers a new build.

### C. Set Up Your Custom Domain
1. In Cloudflare Pages → your project → **Custom Domains**.
2. Click **Set up a custom domain** and enter your domain (e.g., `astrophysics.rvce.edu.in`).
3. Cloudflare automatically adds the required DNS records (CNAME for subdomain / A+AAAA for apex) with orange-cloud proxy enabled — free SSL, DDoS protection, and caching included.
4. That's it — the domain is live and secured by Cloudflare's edge network.

