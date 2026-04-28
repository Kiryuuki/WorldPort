---

## Phase 17 — UX Fixes, Footer Layer Correction & Nav Replacement

**Status**: Not started. Prerequisite: Phase 16 complete.

**Goal**: Fix the 9 UX issues identified in the post-Phase-16 audit. The highest-priority items are the vignette z-index burying the footer and drawers, the horizontal scrollbar on the case studies panel, and replacing GlassNav with a minimal CardNav from ReactBits.

---

### 17.0 — Z-Index Fix: VignetteCanvas (Fix First, Takes 2 Minutes)

**Root cause identified.**

`VignetteCanvas.tsx` has `zIndex: 100` hardcoded. This buries every UI panel, drawer, and the footer under the vignette overlay. The drawers (WorkflowDrawer, ServiceDrawer at z:200) are being clipped by the GlassNav header — also caused by z-index stacking issues compounded by the vignette.

**The fix:**

```tsx
// components/canvas/VignetteCanvas.tsx — CHANGE ONE LINE

export const VignetteCanvas: React.FC = () => {
  const { height, opacity, color } = canvasSettings.vignette;

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        background: `linear-gradient(to top, rgba(${color}, ${opacity}) 0%, transparent ${height})`,
        zIndex: 4,   // WAS: 100 — this was burying all UI panels and the footer
      }}
    />
  );
};
```

**Confirmed z-index stack after this fix:**

```
z-index   Layer
────────────────────────────────────────────────────────────────
0         StarCanvas     (star field, nebula)
2         EarthCanvas    (Three.js globe)
3         AuroraCanvas   (if mounted)
4         VignetteCanvas (bottom dark gradient) ← FIXED from 100
────────────────────────────────────────────────────────────────
10        Main content sections (app/page.tsx, hero, about strip)
20        Glass panels (WorkflowPanel, FleetPanel, CaseStudiesPanel)
30        CardNav        (replaces GlassNav — see 17.1)
50        Footer
200       Drawers (WorkflowDrawer, ServiceDrawer)
9999      CursorCanvas   (always on top)
```

**Add this comment block to `app/globals.css`** so the stack is never lost:

```css
/* ── Z-Index Stack ─────────────────────────────────────────────────────────
   CRITICAL: VignetteCanvas must stay at z:4. It was previously z:100
   which buried all UI panels, drawers, and the footer.

   0     StarCanvas (canvas element)
   2     EarthCanvas (canvas element)
   3     AuroraCanvas (canvas element)
   4     VignetteCanvas (fixed div, pointer-events:none) ← MUST stay ≤ 5
   10    Main content sections
   20    Glass panels (Mission Control, Case Studies)
   30    CardNav
   50    Footer
   200   Drawers
   9999  CursorCanvas
──────────────────────────────────────────────────────────────────────────── */
```

**Tasks:**
- [ ] `VignetteCanvas.tsx` — change `zIndex: 100` → `zIndex: 4`
- [ ] Add z-index comment block to `globals.css`
- [ ] Verify: footer text and GET IN TOUCH button are visible without a dark wash
- [ ] Verify: WorkflowDrawer and ServiceDrawer slide in without being clipped

---

### 17.1 — Nav Replacement: GlassNav → CardNav (ReactBits)

**Decision**: Replace the fixed full-width `GlassNav` with the ReactBits `CardNav` component — a floating pill-style nav centered at the top of the viewport. Minimal, doesn't own the full header zone, and stops clipping the drawers that slide from the edges.

**Reference**: https://www.reactbits.dev/components/card-nav

**Install:**
```bash
# ReactBits components are copy-paste — no npm install needed.
# Copy the CardNav source from reactbits.dev into:
# components/nav/CardNav.tsx
```

**Implementation:**

```tsx
// components/nav/CardNav.tsx
// Adapted from reactbits.dev/components/card-nav
// Floating pill nav — replaces GlassNav
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/',              label: 'HOME' },
  { href: '/about',         label: 'ABOUT' },
  { href: '/case-studies',  label: 'CASE STUDIES' },
  { href: '/contact',       label: 'CONTACT' },
];

export function CardNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 8px',
        background: 'rgba(8, 10, 20, 0.85)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '100px',
      }}
    >
      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              padding: '7px 16px',
              borderRadius: '100px',
              fontSize: '10px',
              letterSpacing: '0.12em',
              fontFamily: 'var(--font-mono)',
              fontWeight: 400,
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
              background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
              color: active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
```

**In `app/layout.tsx`:**
```tsx
// Remove: import { GlassNav } from '@/components/nav/GlassNav';
// Add:
import { CardNav } from '@/components/nav/CardNav';

// In JSX — replace <GlassNav /> with:
<CardNav />
```

**Keep `GlassNav.tsx`** in the codebase but do not mount it. Rename file to `GlassNav.UNUSED.tsx` or move to `components/nav/_archive/` so the work isn't lost.

**Why this fixes the drawer clipping:**
- GlassNav was `position: fixed; top: 0; left: 0; right: 0` — a full-width bar that physically blocked the top of any drawer sliding in from left/right edges
- CardNav is a floating centered pill — drawers slide in full-height from the viewport edge with nothing blocking them

**Tasks:**
- [ ] Copy CardNav source from reactbits.dev/components/card-nav
- [ ] Create `components/nav/CardNav.tsx` with the implementation above
- [ ] Update `app/layout.tsx`: remove GlassNav, mount CardNav
- [ ] Archive `GlassNav.tsx` → `components/nav/_archive/GlassNav.tsx`
- [ ] Verify: active route highlights correctly
- [ ] Verify: drawers (WorkflowDrawer, ServiceDrawer) slide in full-height with no header clipping
- [ ] Verify: CardNav sits above glass panels (z:30 > z:20) but below drawers (z:200)
- [ ] Verify: WP. logo — if it was in GlassNav, relocate to top-left as a standalone fixed element at z:30

**WP. logo (if previously in GlassNav):**
```tsx
// components/nav/WordmarkLogo.tsx — standalone fixed logo
export function WordmarkLogo() {
  return (
    <Link href="/" style={{
      position: 'fixed',
      top: '20px',
      left: '24px',
      zIndex: 30,
      fontFamily: 'var(--font-hero)',
      fontSize: '18px',
      color: 'rgba(255,255,255,0.92)',
      textDecoration: 'none',
      letterSpacing: '-0.02em',
    }}>
      WP.
    </Link>
  );
}
// Mount in app/layout.tsx alongside CardNav
```

**LET'S TALK button (if previously in GlassNav):**

Move to a standalone fixed element at top-right, or remove if not needed. The CardNav is intentionally minimal — no CTA button inside the pill.

```tsx
// Optional: keep as fixed top-right element
<a href="/contact" style={{
  position: 'fixed',
  top: '20px',
  right: '24px',
  zIndex: 30,
  fontSize: '10px',
  letterSpacing: '0.12em',
  fontFamily: 'var(--font-mono)',
  padding: '8px 18px',
  borderRadius: '100px',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  background: 'transparent',
  transition: 'border-color 0.15s, color 0.15s',
}}>
  LET'S TALK
</a>
```

---

### 17.2 — Footer: Correct Z-Index + Spacing

After the VignetteCanvas fix (17.0), the footer should already be visible. This task confirms and polishes it.

**Fix:**

```tsx
// app/layout.tsx or app/page.tsx — ensure footer wrapper has explicit z-index
<footer style={{ position: 'relative', zIndex: 50 }}>
  <FooterPanel />
</footer>
```

```tsx
// FooterPanel.tsx — add breathing room above + subtle separator
<div
  className="glass-panel"
  style={{
    marginTop: '64px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '20px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
```

**Tasks:**
- [ ] Add `position: relative; z-index: 50` to footer wrapper
- [ ] Add `marginTop: '64px'` and top border to FooterPanel
- [ ] Verify: "Let's build something automatic and impactful." is readable above the vignette
- [ ] Verify: GET IN TOUCH button is clickable (not blocked by vignette overlay)

---

### 17.3 — Case Studies Panel: Fix Horizontal Scroll + Card Clipping

**Problem**: Native OS scrollbar at panel bottom. 4th card clips at right edge at 1440px.

**Fix A — 3 cards visible + peek (recommended):**

```tsx
// CaseStudiesPanel.tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 280px)',
  gap: '0',
  overflow: 'hidden',
  // 3 full cards (840px) + partial 4th visible — no scrollbar needed
}}>
```

**Fix B — hide OS scrollbar:**
```css
.case-studies-scroll {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.case-studies-scroll::-webkit-scrollbar { display: none; }
```

**Tasks:**
- [ ] Implement Fix A (3 + peek) OR Fix B (hidden scrollbar) — Fix A preferred
- [ ] Verify at 1440px: no OS scrollbar visible

---

### 17.4 — Hero: Scroll Affordance

```tsx
// components/ui/ScrollHint.tsx
'use client';
import { useEffect, useState } from 'react';

export function ScrollHint() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const fn = () => { if (window.scrollY > 100) setHidden(true); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{
      position: 'absolute', bottom: '32px', left: '50%',
      transform: 'translateX(-50%)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', gap: '8px',
      opacity: hidden ? 0 : 1, transition: 'opacity 0.4s ease',
      pointerEvents: 'none', zIndex: 10,
    }}>
      <span style={{
        fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.35)',
      }}>SCROLL</span>
      <div style={{
        width: '1px', height: '40px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)',
        animation: 'scrollPulse 1.8s ease-in-out infinite',
      }} />
    </div>
  );
}
```

```css
/* globals.css */
@keyframes scrollPulse {
  0%   { transform: scaleY(0); transform-origin: top;    opacity: 0; }
  40%  { transform: scaleY(1); transform-origin: top;    opacity: 1; }
  80%  { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
  100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
}
```

**Tasks:**
- [ ] Create `components/ui/ScrollHint.tsx`
- [ ] Mount inside hero div in `app/page.tsx`, below `AboutInfoStrip`
- [ ] Add `scrollPulse` keyframe to `globals.css`

---

### 17.5 — Info Strip + Card Heights (Phase 16 Verification)

**Tasks:**
- [ ] Verify `AboutInfoStrip.tsx` uses `display: grid; grid-template-columns: repeat(4, 1fr); align-items: stretch`
- [ ] Verify `AboutInfoCard.tsx` body text has `-webkit-line-clamp: 3` and `overflow: hidden`
- [ ] If not applied: apply now per Phase 16.3 spec

---

### 17.6 — Case Study Cards: Full Click Target + Hover Arrow

```tsx
// CaseStudyCard.tsx
<div
  className="panel-row"
  role="button"
  tabIndex={0}
  onClick={() => router.push(`/case-studies/${slug}`)}
  onKeyDown={(e) => e.key === 'Enter' && router.push(`/case-studies/${slug}`)}
  style={{ borderLeft: '2px solid rgba(100,128,255,0.3)', cursor: 'pointer', position: 'relative' }}
>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <span className="text-accent-label">{id}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="tag">PRODUCTION</span>
      <span className="card-arrow" style={{ fontSize: '11px', color: 'var(--accent)', opacity: 0, transition: 'opacity 0.15s' }}>↗</span>
    </div>
  </div>
  {/* title, summary, tags */}
</div>
```

```css
/* globals.css */
.panel-row:hover .card-arrow { opacity: 1; }
.panel-row { transition: border-left-color 0.15s, background 0.15s; }
.panel-row:hover { border-left-color: var(--accent); }
```

Remove standalone `VIEW_CASE_STUDY ↗` link from card. Arrow on hover replaces it.

**Tasks:**
- [ ] Refactor `CaseStudyCard.tsx` — full card click target, hover arrow, remove standalone link
- [ ] Add `.panel-row:hover .card-arrow` rule to `globals.css`
- [ ] Add `tabIndex` and `onKeyDown` for keyboard nav

---

### 17.7 — Additional Polish

**Panel opacity (case studies):**
```tsx
// CaseStudiesPanel.tsx — local override
background: 'rgba(8, 10, 20, 0.88)'  // was 0.82
```

**Hero subtitle contrast:**
```tsx
color: 'rgba(255, 255, 255, 0.72)'   // was 0.55 — below WCAG AA
```

**Focus rings:**
```css
/* globals.css */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(100, 128, 255, 0.5);
}
.panel-row:focus-visible { box-shadow: 0 0 0 2px rgba(100, 128, 255, 0.5); outline: none; }
```

**Tasks:**
- [ ] CaseStudiesPanel background → `rgba(8,10,20,0.88)`
- [ ] Hero subtitle color → `rgba(255,255,255,0.72)`
- [ ] Add `:focus-visible` styles to `globals.css`

---

### 17.8 — Case Studies Panel: Entrance Animation

```tsx
// CaseStudiesPanel.tsx
useEffect(() => {
  gsap.fromTo(panelRef.current,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: panelRef.current, start: 'top 85%', once: true } }
  );
}, []);
```

**Tasks:**
- [ ] Add GSAP ScrollTrigger entrance to `CaseStudiesPanel.tsx`

---

### 17.9 — (Deferred) Case Study Hover Preview

Low priority. Framer Motion `AnimatePresence` card preview on hover. Implement after all above are verified.

---

### 17.10 — Full Task List (Priority Order)

**Do immediately — unblocks everything else:**
- [x] **17.0** `VignetteCanvas.tsx`: `zIndex: 100` → `zIndex: 4`
- [ ] **17.0** Add z-index comment block to `globals.css`

**Nav replacement:**
- [ ] **17.1** Copy CardNav from reactbits.dev/components/card-nav
- [ ] **17.1** Create `components/nav/CardNav.tsx`
- [ ] **17.1** Update `app/layout.tsx`: unmount GlassNav, mount CardNav
- [ ] **17.1** Archive `GlassNav.tsx` → `components/nav/_archive/`
- [ ] **17.1** Create `components/nav/WordmarkLogo.tsx` (fixed top-left, z:30)
- [ ] **17.1** Create standalone LET'S TALK button (fixed top-right, z:30) or remove
- [ ] **17.1** Verify drawer slide-in not clipped by any header element

**Footer:**
- [ ] **17.2** Add `z-index: 50` to footer wrapper
- [ ] **17.2** Add `marginTop: 64px` + top border to FooterPanel

**Case studies layout:**
- [ ] **17.3** Fix horizontal scroll (Fix A: 3+peek preferred)

**Hero:**
- [ ] **17.4** Create `ScrollHint` component, mount in hero
- [ ] **17.4** Add `scrollPulse` keyframe to `globals.css`

**Verification:**
- [ ] **17.5** Confirm Phase 16 card grid + line-clamp landed

**Cards:**
- [ ] **17.6** CaseStudyCard: full click target + hover arrow + keyboard nav

**Polish:**
- [ ] **17.7** Panel opacity, subtitle contrast, focus rings
- [ ] **17.8** Case studies panel GSAP entrance

---

### Definition of Done (Phase 17)

1. Scrollin## Phase 18 — Navigation & UI Simplification

**Status**: Complete.

**Goal**: Streamline the site into a high-performance single-page dashboard. Remove redundant pages (About, Contact) and unify the navigation/CTA system.

**Changes:**
- Removed `LetsTalkButton.tsx` (redundant).
- Replaced multi-page navigation with anchor-based scroll navigation.
- Final Nav Links: `HOME` (#hero), `DASHBOARD` (#dashboard), `CASE STUDIES` (#projects).
- Deleted `app/about/` and `app/contact/` page directories.
- Unified CTA colors: 'Let's Connect' and 'Get in Touch' both use `bg-accent`.
- Updated `FooterPanel.tsx` to trigger `ContactDrawer` instead of navigating to a page.
- Added smooth-reveal hover expansion to `AboutInfoCard.tsx`.

**Tasks:**
- [x] Refactor `CardNav.tsx` for anchor links + smooth scroll
- [x] Add IDs (`hero`, `dashboard`, `projects`) to `app/page.tsx` sections
- [x] Remove `LetsTalkButton` usage and file
- [x] Unify `AboutPanel` and `FooterPanel` button colors to `bg-accent`
- [x] Delete `app/about` and `app/contact` routes
- [x] Verify: clicking nav items scrolls to correct sections
- [x] Verify: all CTAs open the `ContactDrawer`
- [x] Implement hover expansion for Info Cards (lifting/overlay effect)

### Changelog Entry
```
### [DATE] — Phase 18: Navigation & UI Simplification
- Converted navigation to single-page anchor system (#hero, #dashboard, #projects)
- Removed redundant 'About' and 'Contact' standalone pages
- Deleted LetsTalkButton; streamlined top-right header zone
- Unified 'Let's Connect' and 'Get in Touch' button styles (bg-accent)
- Footer CTA now opens ContactDrawer via UIContext
- Added smooth-scroll logic to CardNav.tsx
- Implemented non-disruptive hover expansion for Hero Info Cards
```

---

## Phase 19 — Deployment & Automation

**Status**: Not started.

**Goal**: Containerize the application for production and establish automated build pipelines for seamless deployment.

**Tasks:**
- [ ] Create production-ready `Dockerfile` (multi-stage build)
- [ ] Create `docker-compose.yml` for orchestration
- [ ] Setup GitHub Actions workflow for automated builds
- [ ] Update documentation for local deployment
- [ ] Verify local containerized execution