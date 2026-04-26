# WorldPort — Build Instructions for Gemini
> AI agent build spec. Read this fully before touching any file.

---

## What This Is

**WorldPort** is not a portfolio. It is a personal website that tells a story.

The visitor is not a recruiter scanning a CV. They are a curious human who stumbled in. They should leave knowing:
- Who Aldrin is (not what he does on a resume)
- How he thinks about problems
- That he builds things that actually work — and writes honestly about why and how
- That the site itself *is* the proof of work

Every page is a blog entry in disguise. Every case study is a story with a problem, a villain, a hack, and an outcome. The galaxy aesthetic — rotating Earth, pixel stars, asteroid cursor — is not decoration. It is the metaphor: one person, floating in space, building signal from noise.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Animations | GSAP + ScrollTrigger + Lenis (smooth scroll) |
| 3D / Canvas | Three.js (Earth), Canvas 2D (stars, cursor) |
| Content | **Directus CMS** (blog posts, case studies, dynamic content) |
| Database | **Supabase** (structured data, dashboard live feeds) |
| CMS | Directus (self-hosted on Proxmox/Dokploy) |
| Fonts | Bandeins Strange (hero display) → fallback: Space Grotesk |
| Deployment | Docker → GHCR (GitHub Container Registry) |
| CI/CD | GitHub Actions |

---

## Visual Identity (Do Not Deviate)

- **Background**: `#010611` (near-black deep space) with multi-layered, moving nebula clouds (cyan/blue/purple)
- **Text**: `#ffffff` primary, `rgba(255,255,255,0.55)` secondary
- **Glass effect**: `backdrop-filter: blur(24px) saturate(1.5)` + `background: rgba(255,255,255,0.03)` + `border: 1px solid rgba(255,255,255,0.1)`
- **Accent**: `rgba(100,140,255,0.8)` for links and highlights
- **Border radius**: `100px` for buttons, `20px` for cards, `15px` for nav
- **Cursor**: Custom asteroid particle effect — NO default browser cursor anywhere on the site

### Canvas Effects (Required)
1. **Star field** — `global-shimmer-canvas` fixed overlay. Twinkling stars + animated nebula layers (using noise shaders or transparent gradients).
2. **Cinematic Earth** — Three.js scene. Massive scale (bottom 40% of viewport). Fresnel atmosphere glow, day/night terminator, and UnrealBloom postprocessing. Earth position: `x:0, y:-50, z:800` (adjustable for viewport).
3. **Asteroid cursor** — On `mousemove`, spawn jagged polygon particles that fall with gravity, rotate, and fade.

---

## Site Structure

```
/                  → Hero (animated) + Who I Am (short)
/about             → The full story — origin, philosophy, how I work
/work              → Index of all case studies
/work/[slug]       → Individual case study (MDX-powered, storytelling format)
/blog              → Optional: raw thoughts, experiments, failures
/contact           → One line + email + links. No form needed.
```

---

## Content Philosophy

### Every Case Study Must Have:
1. **The Hook** — one sentence that makes you want to read. Not "I built an automation." More like "My client was drowning in 400 unread leads a day. I fixed it in a weekend."
2. **The Problem** — real pain, real numbers, real frustration. Make the reader feel it.
3. **The Villain** — what was broken. Manual process, bad tooling, human bottleneck.
4. **The Build** — how I thought about it, what I tried, what failed, what worked. Show the thinking, not just the result.
5. **The Stack** — tools used, why each one, any tradeoffs made.
6. **The Outcome** — concrete results. Time saved, money, scale. If unknown, say so honestly.
7. **What I'd Do Differently** — this is the trust-builder. Showing reflection is rare.

### Tone
- First person, conversational, direct
- No buzzwords ("leverage", "synergy", "solution")
- Humor is allowed — dry, nerdy, self-aware
- Never undersell, never oversell
- Treat the reader as smart

---

## Phase 1 — Foundation

**Goal**: Working Next.js project with routing, canvas effects, and MDX support.

### Tasks
- [x] `npx create-next-app@latest worldport --app --tailwind --typescript`
- [x] Install deps: `three gsap lenis @next/mdx @mdx-js/react gray-matter`
- [x] Configure `next.config.ts` for MDX and standalone output
- [x] Set up global CSS variables (colors, glass, fonts)
- [x] Implement `StarCanvas` component — fixed overlay, twinkling stars
- [x] Implement `CursorCanvas` component — asteroid particle cursor, hides native cursor globally
- [x] Implement `EarthCanvas` component (Three.js) — rotating globe with bloom
  - Use `earth.js` pattern: scene, camera, renderer, composer, UnrealBloom
  - Load day/night textures from `/public/textures/`
  - Wire GSAP ScrollTrigger to tilt/scroll Earth on hero scroll
- [x] Implement `GlassNav` component — fixed, blur backdrop, links, CTA button
- [x] Set up Lenis smooth scroll, integrate with GSAP
- [x] Configure MDX pipeline: `content/work/*.mdx` → `/work/[slug]` routes
- [x] Create `lib/posts.ts` — reads MDX frontmatter for index pages

**Deliverable**: `localhost:3000` shows hero with live Earth, stars, asteroid cursor, and nav.

---

## Phase 2 — Pages & Content

**Goal**: All routes populated, first two case studies written.

### Tasks
- [ ] **Hero (`/`)** — Fullscreen. `h1` with name. Subtitle: what I do in 8 words max. Two CTAs: "See my work" + "Read my story". Scroll indicator.
- [ ] **Who I Am strip** — Below hero fold. Short paragraph, honest, no fluff. Links to `/about`.
- [ ] **Work index (`/work`)** — Card grid of case studies. Each card: title, one-line hook, stack tags, read time.
- [ ] **About (`/about`)** — Long-form storytelling page. Not a resume. Sections:
  - Origin (why I got into this)
  - How I work (philosophy, solo operator, async-first)
  - Tools I trust and why
  - What I'm building now
  - Honest section: "What I'm not"
- [ ] **Contact (`/contact`)** — Minimal. One line intro. Email. GitHub. LinkedIn. No form.
- [ ] **Write case study #1**: AI Lead Qualification Funnel
  - Client: unnamed (freelance)
  - Problem: 400+ leads/day, no triage, sales team overwhelmed
  - Build: n8n → Claude API scoring → Supabase → Slack alerts
  - Outcome: 80% reduction in manual review time
- [ ] **Write case study #2**: YouTube-to-Knowledge-Base Pipeline
  - Problem: Hours of automation content, no searchable memory
  - Build: n8n → YouTube transcript → Claude summary → Obsidian vault
  - Outcome: Personal knowledge base that grows automatically
- [ ] **Write case study #3**: WorldPort itself
  - Problem: Every portfolio looks the same. Mine shouldn't.
  - Build: this site, this stack, this philosophy
  - Meta-entry: the site is its own case study

**Deliverable**: Full site navigable, two real case studies live, storytelling tone consistent.

---

## Changelog

### 2026-04-26 — StarCanvas: visible stars rewrite (Dash)
**Root causes of invisible stars:**
1. Count too low — `W*H/2200` ≈ 400 stars at 1080p. Fixed: 320+180+80 = 580 fixed per layer
2. Sub-pixel sizes — far layer was 0.3–1.1px, antialiased to nothing. Fixed: `[0.8–1.6, 1.4–2.6, 2.4–4.2]`
3. Opacity floor crushed by twinkle multiply — `0.25 * 0.35 = 0.09` effective alpha. Fixed: opacity floors `[0.35, 0.55, 0.75]`, twinkle depth `[12%, 25%, 40%]` only
4. All same color — hardcoded `rgba(210,225,255)`. Fixed: 7-color palette per star
5. Nebula `screen` blend unreliable on dark bg. Fixed: `source-over` with higher base alphas `[0.30, 0.14, 0.18, 0.08, 0.22]`
6. Pan too slow (halved last session). Fixed: restored `0.006/0.014/0.028 px/frame`, `PAN_DX=0.008`

**Star rendering improvements:**
- Per-star RGB color from 7-color palette (white, blue-white, cool blue, warm white, pale gold, ice blue, purple)
- Mid+near stars get soft radial halo glow (2.5x radius, 40% alpha) for visible bloom
- Far stars: simple solid dot, no halo (performance)
- Twinkle depth scales by layer: far barely flickers, near shimmers noticeably
- Cross sparkle only on near layer, size>3px, alpha>0.8
- Virtual space 150% viewport, proper centering formula

### 2026-04-26 — Deduplicate Stars: EarthCanvas cleaned, StarCanvas authoritative (Dash)
- **EarthCanvas**: removed entire 3D star system (starGeom, starPos, starCol, starSizes, starPhases, palette, starShaderMat, starSystem + animate loop refs). Stars are now exclusively owned by StarCanvas (canvas 2D, z:0).
- **StarCanvas**: slowed pan/parallax speeds so stars are clearly distinguishable from space dust
  - `LAYER_SPEED`: `[0.006, 0.014, 0.028]` → `[0.003, 0.007, 0.013]` (halved)
  - `PAN_DX`: `0.010` → `0.004`, `PAN_DY`: `0.002` → `0.001`
  - Stars = slow drift, barely perceptible, endless loop via 150% virtual wrap
  - Space dust = fast streaks (1.5–5 px/frame), clearly distinct
- **Architecture**: Stars (StarCanvas z:0) → Globe (EarthCanvas z:2) → Cursor (CursorCanvas z:10000). No overlap, no duplicate rendering.

### 2026-04-26 — StarCanvas Restore + AuroraCanvas Removed (Dash)
- AuroraCanvas: removed from layout.tsx (import + render) — no longer needed
- StarCanvas: full restore of parallax stars + space dust events
  - 3-layer star system: far(z:0.006), mid(z:0.014), near(z:0.028) — wraps in 150% virtual space so pan never shows edge
  - `panX/panY` accumulate each frame at `PAN_DX=0.010, PAN_DY=0.002` → rightward orbital drift
  - Cross sparkle on near-layer bright stars only
  - Space dust: random event scheduler (4–14s interval), 1–4 streak particles per event
    - Entry from random edge, direction toward center with spread
    - 3 colors: blue-white (65%), warm gold (20%), cyan (15%)
    - Gradient streak + glowing tip, life-based fade
  - Nebula: 5 layers with ellipse rotation, screen blend
  - Vignette: source-over (not multiply)

### 2026-04-26 — Startup Error Audit (Dash)
**Bugs found and fixed in `C:\Users\Lite OS\Documents\Obsidian\Projects\active\WorldPort`:**

1. **`AuroraCanvas` never rendered** — `AuroraCanvas.tsx` existed in `components/canvas/` but was never imported or mounted in `layout.tsx`. Fixed: added import + `<AuroraCanvas />` between `<EarthCanvas />` and `<CursorCanvas />`.
2. **`StarCanvas` scale stacks on resize** — `ctx.scale(dpr, dpr)` called in `init()` without resetting the transform first. Every resize multiplied the scale. Fixed: `ctx.setTransform(1,0,0,1,0,0)` before `ctx.scale()`.
3. **`StarCanvas` vignette uses `globalCompositeOperation: multiply`** — `multiply` blend against a canvas that has a dark fill color darkens nebula draws to near-black, crushing all the star/nebula detail painted underneath. Fixed: replaced with `source-over` using `rgba(1, 6, 17, a)` gradient — same visual effect, no blending math side-effect.
4. **`EarthCanvas` scroll offsets stale after resize** — `scrollState.offY` was initialized with `H` from mount-time closure. After window resize, `camera.setViewOffset` used wrong viewport size, breaking globe centering. Fixed: `onResize` now resets `scrollState.offX/offY` to new dimensions.
5. **Missing texture: `2k_earth_nightmap.jpg`** — not present in `/public/textures/`. `EarthCanvas` doesn't load it in this version (uses `earth-bg-day.png` + `earth-bump.jpg` + `earth-spec.jpg`). Non-issue for this codebase, but needed if restoring day/night shader.

**Non-fatal (no action needed):**
- `CAM_Y` computed but never used (`const CAM_Y = RADIUS * 0.6`) — dead variable, TS will warn but not error (skipLibCheck:true).
- `controls.update()` called twice per frame (once before distance recalc, once at bottom of animate). Second call is redundant. No visual impact.

### 2025-04-25 — Aurora Rebuild + Stars Fix Pass 4 (Dash)
- AuroraCanvas: full rewrite using Three.js sprites (no canvas2D)
  - Separate Three.js scene + renderer with alpha:true, screen blend via CSS mixBlendMode on container div
  - 6 curtain columns: wide base wash, bright spike, cyan shimmer, white filament, secondary band, soft wash
  - Each curtain = N sprite segments stacked vertically, AdditiveBlending, sine-wave lateral undulation
  - Opacity envelope: fade in from base, full in mid-band, fade at top per segment
  - Global breathe pulse per curtain + height-modulated shimmer at top
  - No three-nebula dep needed — pure Three.js sprites
- StarCanvas: fixed invisible bug
  - Was: `globalCompositeOperation: screen` on transparent canvas = nebulas invisible
  - Fix: fill bg with `#010611` each frame, use `source-over` throughout
  - Removed `mixBlendMode: screen` from canvas element (was fighting the fill)

### 2025-04-25 — Aurora + Z-index + Shader Pass 3 (Dash)
- Z-stack fixed: Stars z:1 screen blend, Earth z:2, Aurora z:3, Cursor+Nav z:above, main z:10
- StarCanvas: restored `mixBlendMode: screen` — was invisible against dark bg without it
- Night shader: removed `* 0.6` dim — night texture now full opacity (city lights show)
- Cloud shader: `cloudVis = mix(cloudAlpha*0.2, cloudAlpha*0.85, dayFactor)` — transparent on night side, opaque on day
- AuroraCanvas: new component — 8 overlapping curtain rays, sine-wave undulation, screen blend, global pulse breathe
  - Colors: green dominant (20,200,90), cyan-teal (0,200,160), purple fringe (40,80,200)
  - Positioned left side matching Mango ref, base anchored at y:72% (horizon)
  - layout.tsx: added AuroraCanvas import + render order StarCanvas→EarthCanvas→AuroraCanvas→CursorCanvas

### 2025-04-25 — Globe + Stars Pass 2 (Dash)
- Bloom: strength 1.8→0.35, threshold 0.05→0.7, added ACESFilmic tonemapping at exposure 0.6 — kills white blowout
- Camera: FOV 45→35 (tighter lens = more cinematic), z 1200→1800
- RADIUS: 500→320 — globe ~25-30% of viewport height per spec
- Earth y position: `-(RADIUS * 1.55)` — horizon at bottom 30%, top curve visible mid-screen
- Night texture: corrected filename `earth-night.jpg` → `2k_earth_nightmap.jpg`
- Cloud texture: corrected filename `earth-clouds.jpg` → `2k_earth_clouds.jpg`
- Shader: smoothstep terminator (was clamp), cloud overlay baked into earth shader + separate cloud mesh
- Atmosphere: 3-layer system (R+12 cyan rim, R+40 mid, R+100 corona)
- StarCanvas: full rewrite — 3 parallax layers (0.008/0.018/0.035 speed), slow directional pan simulates orbital revolution, cross sparkle on bright stars, blue-white tint, seamless wrap

### 2025-04-25 — EarthCanvas Overhaul (Dash)
- Replaced `MeshStandardMaterial` with custom day/night GLSL shader (`ShaderMaterial`)
- Day/night terminator blending via dot product against `sunDir` uniform
- Night side falls back to deep blue `vec4(0.02, 0.04, 0.12)` if `earth-night.jpg` missing
- Removed static scroll-snapped rotation — added continuous `BASE_ROT_SPEED = 0.0008` ambient spin
- Clouds drift at 1.15× earth speed for parallax effect
- Fresnel atmosphere: `FrontSide` additive blending, rim = `pow(1 - dot, 3.5)` cyan-blue
- Added outer halo sphere (R+80) for softer atmospheric glow corona
- Earth position `y: -420` (was -580) — shows more globe like reference sites
- Added `rimLight` blue fill from opposite sun direction
- Capped pixel ratio at 2, proper `cancelAnimationFrame` + `renderer.dispose()` cleanup
- Missing textures: still need `earth-night.jpg` + `earth-clouds.jpg` in `/public/textures/`
  - Source: https://www.solarsystemscope.com/textures/

---

## Phase 3 — Polish & Performance

**Goal**: Production-grade. Fast. Accessible. Memorable.

### Tasks
- [x] Add GSAP entrance animations: hero text stagger, section reveals on scroll
- [x] Add page transitions (Lenis + GSAP timeline on route change)
- [x] Optimize Earth canvas: mobile FPS cap at 24fps
- [x] Optimize star canvas: pixel ratio awareness, resize debounce
- [ ] Add `og:image` generation per case study (Next.js `ImageResponse`)
- [ ] SEO: `metadata` export on all pages, sitemap, robots.txt
- [ ] Lighthouse audit → target 90+ on all metrics (perf, a11y, SEO)
- [ ] Add `prefers-reduced-motion` media query — disable canvas animations gracefully
- [ ] Typography audit: consistent scale, line heights, spacing tokens
- [ ] Mobile pass: nav collapses to hamburger, Earth resizes, layout reflows correctly
- [ ] 404 page: space-themed, in character

**Deliverable**: Lighthouse 90+. No layout bugs mobile/desktop. Animations feel intentional.

---

---

## Phase 5 — Cinematic Fidelity

**Goal**: Elevate the visual atmosphere to match high-end creative benchmarks.

### Tasks
- [x] **Nebula Starfield**: Update `StarCanvas` to include moving "nebula clouds" (using Canvas 2D gradients or noise shaders).
- [x] **Atmospheric Fresnel**: Add a glowing atmosphere shell to the Three.js Earth model.
- [x] **Advanced GSAP Masks**: Implement "mask" reveal animations where text slides up into view from an invisible line.
- [x] **Floating UI Elements**: Add bottom-corner "pills" for global status/actions (e.g., Email, Easter Egg).
- [x] **Refined Glassmorphism**: Tune CSS tokens for higher blur and saturation.

---

## Phase 6 — Advanced Storytelling

**Goal**: Immersive interaction and unconventional content discovery.

### Tasks
- [ ] **Scroll-Linked Spin**: Link the Earth's rotation directly to scroll progress for a high-parallax effect.
- [ ] **Solar System Projects**: (Optional) Alternative view in `/work` where projects are planets in a solar system.
- [ ] **Character Reveal**: Add "typewriter" or character-by-character reveals for major headings.
- [ ] **Dynamic Soundscape**: (Optional) Subtle ambient space hum/wind that triggers on user interaction.

---

## Phase 7 — Interactive Earth (Vertex/Point Globe)

**Goal**: Upgrade `EarthCanvas` to support drag-rotate via OrbitControls and add the dot/point-cloud overlay effect from bobbyroe's vertex-earth repo.

**Reference**: `wiki/threejs-interactive-vertex-earth.md`
Source repo (interactive branch): https://github.com/bobbyroe/vertex-earth/tree/interactive
YouTube walkthrough: https://www.youtube.com/watch?v=XaDQI1HmoOQ
Texture source: https://planetpixelemporium.com/earth.html

### Strategy: Option B — Augment Existing Globe

Do NOT replace current `EarthCanvas` (already has bloom, atmosphere, fresnel, day/night shader). Layer on top:
1. Add `OrbitControls` for drag-rotate interaction
2. Add elevation-displaced `Points` mesh as dot-earth overlay
3. Use `alphaMap` (land mask) to cull ocean dots — land-only points

Clone repo for reference only (do not use as project base):
```bash
git clone -b interactive https://github.com/bobbyroe/vertex-earth.git reference/vertex-earth
```

### Tasks

#### 7.1 — OrbitControls Integration
- [x] Import `OrbitControls` from `three-stdlib` (three@0.184 project — stdlib has it)
- [x] Verify Three.js import path compatibility (three-stdlib/controls/OrbitControls confirmed)
- [x] Wire controls to `renderer.domElement` inside `useEffect`
- [x] Set `controls.enableDamping = true`, `dampingFactor = 0.05`
- [x] Set `controls.autoRotate = true`, `autoRotateSpeed = 0.3`
- [x] Set `controls.enableZoom = false`, `controls.enablePan = false`
- [x] Call `controls.update()` inside animation loop
- [x] Add `controls.dispose()` to cleanup on unmount
- [ ] Test: drag rotates globe; releases smoothly with damping

#### 7.2 — Point Cloud Dot-Earth Overlay
- [x] Clone reference repo: not needed — shader logic studied from wiki + adapted directly
- [x] Study `src/` shader files — elevation displacement + alpha cull pattern implemented
- [x] Add `IcosahedronGeometry(RADIUS+2, 12)` as Points layer (mobile: detail 8)
- [x] Load elevation map: `/public/textures/earth-bump.jpg` (graceful fallback on missing)
- [x] Load alpha/land mask: `/public/textures/earth-alpha.jpg` (graceful fallback on missing)
- [x] Write vertex shader: spherical UV projection, normal displacement by elevation, PointSize
- [x] Write fragment shader: `discard` if `vVisible < 0.4` (ocean cull), circular point, soft edge
- [x] Wire `ShaderMaterial` with uElevation + uAlpha + uTime + uPointSize uniforms
- [x] Layer over existing sphere with AdditiveBlending, depthWrite:false
- [x] Point color: cyan-teal (low elev) → white (mountains) via mix()

#### 7.3 — Texture Additions
- [x] Elevation map: copied from `vertex-earth-main/src/01_earthbump1k.jpg` → `/public/textures/earth-bump.jpg`
- [x] Spec/alpha map: copied from `vertex-earth-main/src/02_earthspec1k.jpg` → `/public/textures/earth-spec.jpg`
  - Note: spec map used as alpha — ocean=white(1.0) → alpha=1-spec=0 → ocean dots invisible (bobbyroe pattern)
- [x] circle.png: copied from reference → `/public/textures/circle.png` (reference only, not used in shader)
- [ ] Optimize: compress to WebP if > 500KB (low priority, 1k textures are small)

#### 7.4 — Mobile + Performance
- [x] OrbitControls touch: `ONE: THREE.TOUCH.ROTATE` on mobile, pan disabled
- [x] Reduce `IcosahedronGeometry` detail to 8 on mobile (from 12)
- [x] Cap point cloud animation at 30fps on mobile (fpsLimit = 1000/30)
- [ ] Test pinch-zoom disabled, drag-rotate works

#### 7.6 — Scroll Journey (Cinematic)
- [x] **Starting Point (0%)**: Globe positioned under "WORLDPORT" hero text, exactly **30% visible (70% hidden)** at the bottom of the viewport. Zoomed in to cover **60% of viewport width**.
- [x] **Mid Point (50%)**: Globe transitions to absolute **center** of viewport with **100% baseline size**.
- [x] **End Point (100%)**: Globe slides to a **corner position** (40% width, 70% height of viewport).
- [x] **Smooth Scrub**: All transitions linked to total scroll distance via GSAP ScrollTrigger for 1:1 tactile feedback.
- [x] **Drag Interaction**: OrbitControls target updated per frame to allow rotation at any position.

---

## Phase 4 — Dockerize & CI/CD

**Goal**: Every `git push` to `main` builds a new Docker image and pushes to GHCR.

### Docker Setup

**`Dockerfile`** (multi-stage):
```dockerfile
# Stage 1: deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**`next.config.ts`** must include:
```ts
output: 'standalone'
```

**`.dockerignore`**:
```
node_modules
.next
.git
*.md
.env*
```

### GitHub Actions — `.github/workflows/docker.yml`

```yaml
name: Build & Push to GHCR

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository_owner }}/worldport

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=,format=short
            type=raw,value=latest

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Tasks
- [ ] Create `Dockerfile` (multi-stage, as above)
- [ ] Add `output: 'standalone'` to `next.config.ts`
- [ ] Create `.dockerignore`
- [ ] Create `.github/workflows/docker.yml`
- [ ] Create GitHub repo: `aldrinroxas/worldport` (or under your org)
- [ ] Enable GHCR on repo — no extra setup needed, `GITHUB_TOKEN` auto-scoped
- [ ] Test local build: `docker build -t worldport . && docker run -p 3000:3000 worldport`
- [ ] Push to GitHub → verify Action runs → verify image appears at `ghcr.io/[username]/worldport`
- [ ] Optional: add Watchtower or Dokploy hook on homelab to auto-pull `latest` on push

**Deliverable**: `git push` → GitHub Action fires → Docker image tagged `latest` + SHA pushed to GHCR → homelab pulls and runs new version automatically.

---

## Repo Structure

```
worldport/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── blog/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── work/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── canvas/
│   │   ├── AuroraCanvas.tsx
│   │   ├── CursorCanvas.tsx
│   │   ├── DustCanvas.tsx
│   │   ├── EarthCanvas.tsx
│   │   ├── StarCanvas.tsx
│   │   ├── UniverseCanvas.tsx
│   │   └── VignetteCanvas.tsx
│   ├── nav/
│   │   └── GlassNav.tsx
│   ├── ui/
│   │   ├── CharacterReveal.tsx
│   │   └── FloatingPills.tsx
│   ├── LenisProvider.tsx
│   ├── PageTransition.tsx
│   └── WorkList.tsx
├── content/
│   └── work/
│       ├── lead-funnel.mdx
│       ├── worldport.mdx
│       └── yt-knowledge-base.mdx
├── lib/
│   ├── canvas-settings.ts
│   └── posts.ts
├── public/
│   ├── textures/
│   │   ├── 2k_earth_clouds.jpg
│   │   ├── circle.png
│   │   ├── earth-bg-day.png
│   │   ├── earth-bg.png
│   │   ├── earth-bump.jpg
│   │   ├── earth-color.jpg
│   │   └── earth-spec.jpg
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── gemini.md
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── _earth_return.txt
```


---

## Earth Texture Sources (Free)
- Day map: https://www.solarsystemscope.com/textures/ (8K Earth Day)
- Night map: same source (Earth Night)
- Cloud map: same source (Earth Clouds)
- Save to `/public/textures/earth-day.jpg`, `earth-night.jpg`, `earth-clouds.jpg`

---

## Definition of Done

A phase is done when:
- Code runs without errors
- Feature works on both mobile and desktop
- No console errors or warnings
- Committed and pushed to `main`
- Docker image builds successfully (Phase 4+)

The site is done when a stranger reads it and says "I want to work with this person" — not because of the list of tools, but because of how they think.

---

## Phase 9 — CMS + Data Layer (Directus + Supabase)

**Goal**: Replace all hardcoded content with live CMS-driven data. Blog posts, case studies, and dashboard feeds pull from Directus and Supabase. No content is hardcoded in the codebase.

### Architecture

```
Directus CMS (self-hosted, Dokploy)  →  Next.js API routes  →  Page components
Supabase (n8n writes, site reads)    →  Next.js API routes  →  Dashboard section
```

**Directus** handles: blog posts, case studies, about content, any copy that changes.
**Supabase** handles: live workflow execution logs (n8n writes), uptime data (read from Uptime Kuma API).

### 9.1 — Environment Setup

**`.env.local`** (never commit):
```env
# Directus
DIRECTUS_URL=https://cms.kiryuuki.space
DIRECTUS_TOKEN=your_static_token_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**`.env.example`** (commit this, no values):
```env
DIRECTUS_URL=
DIRECTUS_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Docker/GHCR**: inject via GitHub Actions secrets → `--env-file` or Dokploy environment panel.

### 9.2 — Directus Setup (self-hosted)

**Tasks:**
- [ ] Deploy Directus on Dokploy (LXC or container) at `cms.kiryuuki.space`
- [ ] Create collections in Directus:
  - `posts` — blog entries (fields: `title`, `slug`, `date`, `body` (rich text / markdown), `excerpt`, `published`)
  - `case_studies` — (fields: `title`, `slug`, `hook`, `stack[]`, `body`, `outcome`, `date`, `published`)
  - `about` — single (fields: `bio`, `philosophy`, `current_focus`, `not_section`)
- [ ] Create static API token in Directus (Settings → Access Tokens)
- [ ] Set collection permissions: public `read` on published items only
- [ ] Install Directus SDK: `npm install @directus/sdk`

**`lib/directus.ts`**:
```ts
import { createDirectus, rest, staticToken } from '@directus/sdk';

// Server-side only client (uses secret token)
export const directus = createDirectus(process.env.DIRECTUS_URL!)
  .with(staticToken(process.env.DIRECTUS_TOKEN!))
  .with(rest());
```

**`lib/content.ts`** — typed fetchers:
```ts
import { directus } from './directus';
import { readItems, readItem } from '@directus/sdk';

export type CaseStudy = {
  id: string; slug: string; title: string; hook: string;
  stack: string[]; body: string; outcome: string; date: string;
};

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return directus.request(readItems('case_studies', {
    filter: { published: { _eq: true } },
    sort: ['-date'],
  }));
}

export async function getCaseStudy(slug: string): Promise<CaseStudy> {
  const items = await directus.request(readItems('case_studies', {
    filter: { slug: { _eq: slug }, published: { _eq: true } },
    limit: 1,
  }));
  return items[0];
}

export async function getPosts() {
  return directus.request(readItems('posts', {
    filter: { published: { _eq: true } },
    sort: ['-date'],
    fields: ['title', 'slug', 'date', 'excerpt'],
  }));
}
```

**Tasks:**
- [ ] Create `lib/directus.ts` + `lib/content.ts`
- [ ] Replace MDX-based `lib/posts.ts` with Directus fetchers
- [ ] Update `/work` page: fetch case studies from Directus
- [ ] Update `/work/[slug]` page: fetch single case study from Directus, render body as markdown (`react-markdown` or `remark`)
- [ ] Update `/blog` page: fetch posts from Directus
- [ ] Update `/about` page: fetch about content from Directus
- [ ] Add ISR: `revalidate = 3600` on all Directus-fetched pages (content refreshes hourly)
- [ ] Remove MDX pipeline from `next.config.ts` (no longer needed)

### 9.3 — Supabase Setup

**Tables needed:**

```sql
-- n8n workflow execution log (n8n writes via HTTP node after each run)
CREATE TABLE workflow_executions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id text NOT NULL,
  name        text NOT NULL,
  status      text NOT NULL,          -- 'success' | 'error' | 'running'
  started_at  timestamptz NOT NULL,
  duration_ms int,
  trigger     text,                   -- 'manual' | 'schedule' | 'webhook'
  node_count  int,
  error_msg   text,
  created_at  timestamptz DEFAULT now()
);

-- Uptime Kuma service status (n8n polls Uptime Kuma API + writes here)
CREATE TABLE service_status (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  protocol    text NOT NULL,          -- 'HTTP' | 'TCP'
  status      text NOT NULL,          -- 'operational' | 'outage' | 'degraded'
  checked_at  timestamptz DEFAULT now(),
  what_it_does  text,                 -- human-readable description
  what_it_replaces text               -- what manual process it replaces
);
```

**n8n integration**: add an HTTP Request node at the end of every workflow that POSTs execution result to Supabase REST API. Also create a separate n8n workflow that polls Uptime Kuma every 5 minutes and upserts `service_status`.

**Tasks:**
- [ ] Create Supabase project, get URL + keys
- [ ] Run SQL above to create tables
- [ ] Set RLS: `workflow_executions` — anon can SELECT; `service_status` — anon can SELECT
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] Create `lib/supabase.ts`:
  ```ts
  import { createClient } from '@supabase/supabase-js';
  export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  ```
- [ ] Create n8n HTTP node snippet to write workflow results to Supabase
- [ ] Create n8n workflow: Uptime Kuma poller → upsert to `service_status`
- [ ] Populate `what_it_does` + `what_it_replaces` per service in Supabase (one-time seed)

---

## Phase 10 — Mission Control Dashboard (50% Scroll Section)

**Goal**: At 50% scroll depth, the site reveals a split-panel live dashboard. Left: n8n workflow execution feed. Right: homelab service uptime grid. Everything pulls from Supabase in real-time. Consistent with the WorldPort space/terminal aesthetic.

### What It Shows

This section communicates: *"Everything I build actually runs. Here's the proof."*

It's not a demo — it's live infrastructure telemetry, styled as a mission control terminal.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  // 02 // AUTOMATION_OPS                          │  // 03 // FLEET_STATUS                  │
│  ● LIVE_FEED                                      │  ● LIVE_SYNC                            │
│                                                   │                                         │
│  [SEARCH_NODE...]           [ALL_SYSTEMS ▼]       │  [ service list ]                       │
│                                                   │                                         │
│  WORKFLOW          ST      TIME     DUR            │  Radarr     HTTP // OPERATIONAL ●       │
│  ───────────────────────────────────────────────  │  Sonarr     HTTP // OPERATIONAL ●       │
│  Error Alert       ✓ SUCCESS  34m    0.8s         │  NextCloud  HTTP // OUTAGE    ●       │
│  Upwork Scraper    ✕ ERROR    37m    187s         │  n8n        HTTP // OPERATIONAL ●       │
│  Book Summary      ✓ SUCCESS  2h     347s         │  ...                                     │
│  ...                                              │                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

Click any row → side drawer slides in with full details.

### 10.1 — Component Architecture

```
components/
  dashboard/
    MissionControlSection.tsx  — outer section, scroll trigger, two-panel layout
    WorkflowFeed.tsx           — left panel, n8n execution log
    WorkflowRow.tsx            — single row: name, status badge, time, duration
    WorkflowDrawer.tsx         — slide-in detail panel (what it does, what it solves, exec graph)
    FleetStatus.tsx            — right panel, service health grid
    ServiceRow.tsx             — single service: name, protocol, status dot
    ServiceDrawer.tsx          — slide-in: what it does, what it replaces, protocol, status
```

### 10.2 — WorkflowFeed (Left Panel)

**Data source**: Supabase `workflow_executions` table, ordered by `started_at DESC`, limit 20.

**Display columns:**
- `WORKFLOW` — name + short ID fragment (hover reveals full)
- `ST` — status badge: `● SUCCESS` (green), `● ERROR` (red), `● RUNNING` (yellow pulse)
- `TIME` — relative time ago ("34 minutes", "2 hours")
- `DUR` — duration in seconds

**WorkflowDrawer** (click to open):
```
// WHAT_THIS_WORKFLOW_DOES
One clear sentence: what it automates.

// WHAT_IT_SOLVES
One clear sentence: what manual pain it eliminates.

// STARTED / LATENCY / NODES / MODE
Meta grid.

// EXECUTION_PROCESS
Vertical step graph: trigger → node → node → output.
Each step shows node name + status icon (success/error/skip).
```

**UX:**
- Monospace font throughout (`font-mono`)
- Row left border: `2px solid` green (success) / red (error) / yellow (running)
- Row hover: subtle bg lift `rgba(255,255,255,0.03)`
- Drawer slides in from right, 380px wide, glass background
- Search box filters by workflow name client-side
- Status filter dropdown: ALL / SUCCESS / ERROR / RUNNING
- Auto-refreshes every 30s via Supabase realtime or polling

### 10.3 — FleetStatus (Right Panel)

**Data source**: Supabase `service_status` table, ordered by `name ASC`.

**Display per row:**
- Service name (monospace, uppercase)
- Protocol label (`HTTP` / `TCP` in muted text)
- Status dot: `●` green (operational) / red (outage) / yellow (degraded)

**ServiceDrawer** (click to open):
```
[service name] — [protocol] ● [status]

// WHAT_IT_DOES
[what_it_does from Supabase — clear, no jargon]

// WHAT_IT_REPLACES
[what_it_replaces from Supabase — what this service makes obsolete]

// STACK_DETAILS
Protocol: HTTP | Status: OPERATIONAL
```

**Service copy guide** (seed into Supabase `service_status.what_it_does` + `what_it_replaces`):

| Service | what_it_does | what_it_replaces |
|---|---|---|
| n8n | Orchestrates all automation workflows — triggers, logic, and API calls in one place | Zapier, Make.com, and writing glue scripts by hand |
| Radarr | Monitors and auto-downloads movies based on quality profiles | Manually tracking releases and downloading files |
| Sonarr | Same as Radarr but for TV series, episode by episode | Manually checking show feeds and managing files |
| Browserless | Headless Chrome API for Playwright automations without a local browser | Running Chrome on a dev machine; fragile local browser sessions |
| SearXNG | Privacy-respecting metasearch engine that aggregates results without tracking | Google and Bing, which log every query and personalize results |
| Whisper | Local speech-to-text transcription for audio and video files | Paying for cloud transcription APIs per minute |
| Chatwoot | Self-hosted customer messaging hub — inbox for all channels | Intercom, Crisp, or juggling multiple chat tabs manually |
| Twenty CRM | Open-source CRM for tracking leads and client relationships | Notion databases or spreadsheets as makeshift CRMs |
| SpiderFoot | OSINT automation for reconnaissance and data gathering | Running manual lookups across a dozen separate tools |
| Nextcloud | Self-hosted file sync and collaboration platform | Google Drive and Dropbox, with their data privacy tradeoffs |
| Jellyfin | Self-hosted media server that streams to any device | Netflix subscriptions for content I already own |
| SyncThing | Continuous file sync between machines without a cloud middleman | Dropbox or manual USB transfers |

**UX:**
- Section header: `// 03 // FLEET_STATUS ✓` + `● LIVE_SYNC` indicator
- Status dot pulses on `outage` or `degraded`
- Drawer matches WorkflowDrawer glass style
- Shows total counts: `12 SERVICES — 11 OPERATIONAL — 1 OUTAGE`

### 10.4 — MissionControlSection Scroll Trigger

```tsx
// Section appears at ~50% page scroll
// GSAP ScrollTrigger: fade in from below + slight Y translate
gsap.from('.mission-control', {
  opacity: 0, y: 60,
  scrollTrigger: {
    trigger: '.mission-control',
    start: 'top 80%',
    end: 'top 40%',
    scrub: false,
    once: true,
  }
});
```

**Tasks:**
- [ ] Create `components/dashboard/` directory + all 7 component files
- [ ] `MissionControlSection.tsx`: two-column layout, section heading, GSAP entrance
- [ ] `WorkflowFeed.tsx`: fetch from Supabase `workflow_executions`, search + filter, auto-refresh 30s
- [ ] `WorkflowRow.tsx`: name, status badge, relative time, duration, left border color
- [ ] `WorkflowDrawer.tsx`: slide-in drawer, what it does / what it solves, step graph, meta grid
- [ ] `FleetStatus.tsx`: fetch from Supabase `service_status`, count summary header
- [ ] `ServiceRow.tsx`: name, protocol, animated status dot
- [ ] `ServiceDrawer.tsx`: slide-in drawer, what_it_does, what_it_replaces, stack details
- [ ] Integrate `MissionControlSection` into `app/page.tsx` at ~50% scroll position
- [ ] Seed `service_status` table with all services + copy from table above
- [ ] Create n8n "heartbeat" node snippet: POST to Supabase after every workflow run
- [ ] Create n8n Uptime Kuma poller workflow (every 5 min → upsert service_status)
- [ ] Style audit: monospace fonts, glass drawers, terminal color palette matches site theme
- [ ] Mobile: stack panels vertically, drawers full-width slide-up from bottom

### 10.5 — Styling Rules for Dashboard

The dashboard lives inside the WorldPort aesthetic. It should feel like a terminal window floating in space — not a SaaS dashboard.

```css
/* Panel glass */
background: rgba(255, 255, 255, 0.02);
backdrop-filter: blur(20px) saturate(1.4);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 16px;

/* Monospace everything */
font-family: 'JetBrains Mono', 'Fira Code', monospace;

/* Status colors */
--status-ok:  #00ff88;    /* green — operational */
--status-err: #ff3355;    /* red — outage/error */
--status-wrn: #ffaa00;    /* amber — degraded/running */

/* Row hover */
background: rgba(255, 255, 255, 0.03);
transition: background 150ms ease;

/* Drawer */
position: fixed; right: 0; top: 0; height: 100vh;
width: 380px;
background: rgba(8, 14, 28, 0.92);
backdrop-filter: blur(32px);
border-left: 1px solid rgba(255, 255, 255, 0.1);
```

**Font**: install JetBrains Mono via `next/font/google` or self-host. Used exclusively in dashboard components.

---


- Keep MDX frontmatter consistent: `title`, `slug`, `date`, `stack[]`, `hook`, `readTime`
- Case studies are the product. Write them well.
- The galaxy theme is load-bearing for the brand. Don't simplify it out.
- Built by Aldrin Roxas, Pasig City, PH — solo operator, automation architect.

---
*— Minis*
