## Goal
- Fix persistent mobile scroll snap, polish header icons, move about section to separate page on mobile.

## Constraints & Preferences
- Header identical on desktop (same height, padding, glass effect, fixed positioning).
- On mobile (≤768px): info column hidden; social icons stacked vertically in left column; logo centered between two symmetric dividers; nav links rigid on right.
- When submenu opens, logo area shows wrapping submenu content instead of logo, starting at very top.
- Page titles (`.radio-headline-text`) as large as about-section headline (`clamp(3rem, 12vw, 6rem)`) on mobile.
- Scramble title on hero one line (`white-space: nowrap`), no wrapping.
- Page content below fixed header with sufficient top padding.
- **No scroll snap to top** — no forced `scrollTo(0,0)` or `scrollTop = 0`.
- Tables horizontally scrollable via touch swipe.
- ISS 3D model supports touch orbit (hold and drag).
- Merchandise images NOT clickable — no lightbox, no download, no expand.
- Header toggle X hides header; reveal arrow in top-right (no background/padding/border box).
- Sponsorship/Join Us submenu text left-aligned; Verticals/Recruitment right-aligned.
- Firebase/Storage writes restricted to `@teamdhruva.org` admin accounts only.
- Admin dashboard mobile: upload card stacked on top, records below after scroll; logout icon-only; tab font reduced.
- Social icons use Feather Icons (`react-icons/fi`).
- About section on landing page: too much snapping on mobile — needs separate `/about` page.

## Progress
### Done
- Left-aligned header nav links on mobile and desktop.
- Constrained `.hero-title` width on mobile — scramble chars wider than screen no longer push header.
- Three `↓` arrows in hero CTA with staggered bounce; 6px gap.
- Removed blue tap highlight globally and on merch cards.
- SpacetimeGrid SVG `pointerEvents: "none"` — was intercepting touch events.
- Deployed with cache-control headers (`index.html`: no-cache; hashed assets: 1-year immutable).
- Added `touch-action: pan-y` to `.hero-scroll-zone`.
- Reverted header reveal arrow to original double-chevron; 1.25× larger (35px mobile, 45px desktop).
- Replaced header logout button's red admin icon with SVG log-out icon.
- Removed dynamic `paddingTop` from layout JS in all 8 pages (MerchandisePage, VerticalPage, TeamPage, BlogPage, IndianAstrophysicsPage, RecruitmentBatchPage, AdminDashboardPage, EventsPage) — CSS handles mobile/desktop padding. Fixes mobile scroll snap: address bar hide/show changed `window.innerHeight`, triggered `resize`, layout JS updated `paddingTop`, causing reflow → browser snapped scroll position.
- Wrote `scroll-snap-analysis.md` documenting root cause.
- Deployed to Firebase hosting (`https://ad-astra-dhruva.web.app`).
- **About section moved to separate `/about` page for mobile.** Created `AboutPage.tsx`, added `/about` route in `main.tsx`. Mobile hero CTA links to `/about`; desktop hero CTA scrolls to `#next`. Mobile header About nav links to `/about`; desktop keeps `/#next`. On landing page, `AboutSection` is hidden on mobile (`!isMobile && <AboutSection />`). `AboutPage.tsx` includes the site footer so bottom-padding layout code works.

### Blocked
- Firebase Storage not enabled in console — `npx firebase deploy --only storage` fails.

## Key Decisions
- Removed dynamic `paddingTop` from layout JS entirely instead of debouncing further — CSS values already handle mobile/desktop padding correctly, JS was redundant and harmful on mobile.
- Moved about section to separate page on mobile instead of fixing scroll on landing page — simpler, better UX.
- Reverted header reveal arrow to original design per user request; only increased size 1.25×.
- Used inline SVG for header logout icon (matching admin dashboard) instead of `react-icons` import.

## Next Steps
- User may enable Firebase Storage and run `npx firebase deploy --only storage`.

## Critical Context
- Scroll snap root cause identified and fixed: `paddingTop = window.innerHeight * 0.32` in layout JS on every page except gallery. Mobile address bar hide/show during scroll changes `window.innerHeight` → triggers `resize` → layout JS changes `paddingTop` → reflow → browser snaps scroll. Gallery works because it lacks this JS.
- SpacetimeGrid SVG has `pointerEvents: "none"` (was `"auto"`) — decorative background, shouldn't catch events.
- Header reveal arrow: `header-reveal-btn` is `position: fixed; top: 12px; right: 12px; z-index: 1000`. Arrow SVG sizes: mobile 35×35px, desktop 45×45px.
- Header logout button in `mobile-social-col` uses inline SVG log-out icon (box + arrow), styled `color: rgba(220, 38, 38, 0.85)`.
- All 8 pages' layout `updateLayout` no longer sets `paddingTop` — CSS handles it.
- Cache headers: `index.html` → `no-cache, no-store, must-revalidate`; hashed assets → `public, max-age=31536000, immutable`.
- Dev server: `fuser -k 5173/tcp` → `nohup npx vite --port 5173 --host > /tmp/vite.log 2>&1 &` → verify at `http://localhost:5173/`.
- `scroll-snap-analysis.md` created with full root cause breakdown.
- Constellation SVG renders with `width=170 height=120 viewBox="0 0 250 180"` — constant outside SiteHeader component.
- `AboutPage.tsx` at `src/pages/AboutPage.tsx` wraps AboutSection in `<main className="page-scroll">` with footer.
- Mobile detection (`isMobile`) via `window.innerWidth <= 768` in both `App.tsx` and `SiteHeader.tsx`.

## Relevant Files
- `/home/neo/club/src/pages/AboutPage.tsx`: New about page wrapping AboutSection with footer.
- `/home/neo/club/src/App.tsx`: Landing page — conditionally hides AboutSection on mobile, CTA href changes to `/about` on mobile.
- `/home/neo/club/src/components/SiteHeader.tsx`: Header — About link `to` overridden to `/about` on mobile.
- `/home/neo/club/src/main.tsx`: Router — added `/about` route.
- `/home/neo/club/src/pages/MerchandisePage.tsx`, `VerticalPage.tsx`, `TeamPage.tsx`, `BlogPage.tsx`, `IndianAstrophysicsPage.tsx`, `RecruitmentBatchPage.tsx`, `EventsPage.tsx`, `admin/AdminDashboardPage.tsx`: All had `paddingTop = window.innerHeight * 0.32` removed from `updateLayout()`.
- `/home/neo/club/src/components/SiteHeader.tsx`: Header with responsive layout, Feather social icons, admin auth (FiUser), header toggle/reveal buttons (35/45px double-chevron), logout SVG icon.
- `/home/neo/club/src/index.css`: All styles.
- `/home/neo/club/src/components/SpacetimeGrid.tsx`: SVG `pointerEvents: "none"`.
- `/home/neo/club/scroll-snap-analysis.md`: Root cause analysis of mobile scroll snap.
- `/home/neo/club/firebase.json`: Hosting config with cache-control headers, rewrites.

## Session Updates (Jun 17, 2026)
- Hamburger drawer: translucent background (rgba(10,10,12,0.7) + blur(50px))
- Mobile header logo: reduced to 80px to match hamburger size
- Created Breadcrumbs.tsx component (DM Mono, hierarchical path labels)
- Added breadcrumbs to App.tsx and all 10 page files
- Footer: proper 3-col grid, 64px gap, centered layout
- Page padding: reduced hero, vertical page, about section for minimal header
- #next scroll-margin-top: 360px → 120px
