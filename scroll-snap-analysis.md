# Mobile Scroll Snap Analysis

## Symptoms
- Page snaps back to top when scrolling, especially on landing page (hero → about section)
- Happens on all pages EXCEPT gallery
- Only on mobile (desktop is smooth)
- Most severe when trying to scroll past the hero section on landing page

## What Makes Gallery Different
The gallery page is the only page WITHOUT the layout measurement JS pattern:
```js
const updateLayout = () => {
  // ... measures title width, adjusts fontSize
  // ... sets paddingTop = window.innerHeight * 0.32
};
```
All other pages (Merchandise, Events, Blog, Team, IndianAstrophysics, RecruitmentBatch, AdminDashboard) have this. The gallery doesn't — it uses a static layout.

## Root Cause

### Multi-factor cascade on mobile

1. **Address bar hide/show during scroll** (mobile-only)
   - On mobile Chrome, `window.innerHeight` changes when the address bar hides (~560px → ~700px on typical phone)
   - This fires `resize` events → triggers layout recalculation

2. **Dynamic paddingTop from `window.innerHeight * 0.32`**
   - Every page (except gallery) calls `updateLayout()` which sets `pageContainer.style.paddingTop = Math.max(80, window.innerHeight * 0.32)`
   - When address bar hides, this value changes (e.g., 179px → 224px)
   - This changes the page layout mid-scroll → browser compensates → scroll jumps

3. **`min-height: 100svh` on `.section-hero`** (landing page)
   - Hero section is exactly one viewport tall
   - When address bar hides, the viewport grows but the hero section doesn't (100svh is fixed)
   - The content below the hero shifts relative to the viewport
   - Combined with the paddingTop reflow above, this creates a double layout shift

4. **Scroll anchoring override**
   - `overflow-anchor: none` is set globally, but mobile Chrome's viewport-level adjustments (address bar) may bypass CSS scroll anchoring
   - The browser's internal "pinch-zoom/viewport management" can override web content scroll anchoring

5. **The layout measurement creates reflows on every resize**
   - `updateLayout()` creates DOM nodes, measures them, removes them, then sets styles
   - Each of these steps causes a layout recalculation
   - On mobile, `ResizeObserver` can fire during viewport transitions (address bar show/hide) even when the observed element hasn't actually changed size

## Why Desktop is Fine
- No address bar that hides/shows — viewport height is constant
- `window.innerHeight` never changes during scroll
- No `resize` events fire during scroll

## Potential Fixes (not applied)

### Option A: Remove dynamic paddingTop, use fixed CSS
Replace `pageContainer.style.paddingTop = Math.max(80, window.innerHeight * 0.32)` with the existing CSS value (`padding-top: 150px` desktop, `240px` mobile). The JS font-size calculation can stay if debounced more aggressively (500ms+).

### Option B: Use `100dvh` instead of `100svh`
`100dvh` (dynamic viewport height) changes with the address bar, matching the actual visible viewport. This eliminates the mismatch between hero height and viewport during scroll.

### Option C: Remove `min-height: 100svh` entirely, use a pixel value
Set `min-height: 450px` or similar on mobile that's tall enough for the scramble/ISS but not tied to viewport height. On desktop keep a larger pixel value.

### Option D: Kill layout JS on scroll
Add a scroll listener that sets a flag to skip layout updates while scrolling, only applying them after scroll ends (200ms debounce after touchend/scrollstop).

### Option E: Debounce the resize handler to 500ms+
The current 200ms debounce might not be enough. A longer debounce (500ms–1s) would ensure the address bar has fully transitioned before any layout changes fire.

## Verdict
The primary cause is **`paddingTop` changing during scroll** due to `window.innerHeight` changing when the address bar hides, combined with **`min-height: 100svh`** creating a layout boundary at the viewport edge. The gallery page avoids this because it has no dynamic layout JS.
