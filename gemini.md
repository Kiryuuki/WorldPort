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

**Status**: Infrastructure ready. Directus and Supabase are deployed and configured. Implementation only.

### What's Already Live
- **Directus** at `cms.kiryuuki.space` — collections confirmed: `about`, `blog_posts`, `case_studies`, `content_ideas`, `github`, `social_posts`
- **Supabase** — `workflow_executions` table live, n8n already writing to it after each run
- **Glance** (uptime monitor) at `192.168.100.144:3001` — not Uptime Kuma. Has a status API. Used for FLEET_STATUS panel.
- **`.env.local`** already contains keys (DIRECTUS_URL, DIRECTUS_TOKEN, Supabase keys, GLANCE_API_KEY)

### 9.1 — Environment Variables Required

**`.env.local`** (already exists on machine, add these if missing):
```env
# Directus
DIRECTUS_URL=https://cms.kiryuuki.space
DIRECTUS_TOKEN=your_static_token

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Glance (homelab uptime)
GLANCE_URL=http://192.168.100.144:3001
GLANCE_API_KEY=your_key
```

**`.env.example`** — commit this:
```env
DIRECTUS_URL=
DIRECTUS_TOKEN=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GLANCE_URL=
GLANCE_API_KEY=
```

### 9.2 — Install Dependencies

```bash
npm install @directus/sdk @supabase/supabase-js react-markdown remark-gfm
```

### 9.3 — Data Layer Files

**`lib/directus.ts`**:
```ts
import { createDirectus, rest, staticToken } from '@directus/sdk';
export const directus = createDirectus(process.env.DIRECTUS_URL!)
  .with(staticToken(process.env.DIRECTUS_TOKEN!))
  .with(rest());
```

**`lib/supabase.ts`**:
```ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

**`lib/content.ts`** — typed fetchers for Directus:
```ts
import { directus } from './directus';
import { readItems } from '@directus/sdk';

export async function getCaseStudies() {
  return directus.request(readItems('case_studies', {
    filter: { status: { _eq: 'published' } }, sort: ['-date_created'],
  }));
}
export async function getPosts() {
  return directus.request(readItems('blog_posts', {
    filter: { status: { _eq: 'published' } }, sort: ['-date_created'],
    fields: ['id', 'title', 'slug', 'date_created', 'excerpt'],
  }));
}
```

**`lib/glance.ts`** — Glance API fetcher (server-side only):
```ts
// Glance has a /api/v1/monitors endpoint — returns service status list
export async function getGlanceStatus() {
  const res = await fetch(`${process.env.GLANCE_URL}/api/v1/monitors`, {
    headers: { 'Authorization': `Bearer ${process.env.GLANCE_API_KEY}` },
    next: { revalidate: 60 }, // ISR: refresh every 60s
  });
  if (!res.ok) return [];
  return res.json();
}
```

**`app/api/fleet/route.ts`** — proxy endpoint (exposes Glance to client without leaking key):
```ts
import { getGlanceStatus } from '@/lib/glance';
import { NextResponse } from 'next/server';
export async function GET() {
  const data = await getGlanceStatus();
  return NextResponse.json(data);
}
```

### 9.4 — Supabase `workflow_executions` Schema

Already live. Confirmed fields from production data:
```
id, execution_id, workflow_id, workflow_name, status,
finished, started_at, finished_at, duration_ms, mode,
node_count, error_message, execution_data (JSON blob),
workflow_data (JSON blob), created_at
```

`execution_data` contains full n8n run graph: nodes, outputs, errors per node.
`workflow_data` contains workflow definition: nodes array with names, types, positions.

**Tasks:**
- [x] Create `lib/directus.ts`, `lib/supabase.ts`, `lib/content.ts`, `lib/glance.ts`
- [x] Create `app/api/fleet/route.ts`
- [x] Create `.env.example`
- [x] Install deps: `@directus/sdk @supabase/supabase-js react-markdown remark-gfm`
- [x] Update `/work` — fetch from `case_studies`
- [x] Update `/blog` — fetch from `blog_posts`
- [x] Update `/about` — fetch from `about` singleton
- [x] Remove MDX pipeline from `next.config.ts`

---

## Phase 10 — Mission Control Dashboard (50% Scroll Section)

**Status**: Reference implementation exists at `n8n-dashboard-anatlycis-ui-main`. Adapt patterns directly, do NOT reinvent.

### Source of Truth
```
C:\Users\MY PC\Documents\ObsidianReal\vault32\Projects\active\n8n-dashboard-anatlycis-ui-main\
  lib/
    api.ts                — React Query hooks: useExecutions, useUptimeStatus
    types.ts              — ExecutionLog, UptimeMonitor, PaginatedResponse types
    serviceDescriptions.ts — SERVICE_DESCRIPTIONS map + getServiceDescription()
    workflowDescriptions.ts — WORKFLOW_DESCRIPTIONS map + getWorkflowDescription()
  components/status/
    ExecutionTable.tsx    — sortable table, StarBorder row effect, pagination
    UptimeKuma.tsx        — monitor list, status dots, click-to-drawer
    ServiceDetailDrawer.tsx — framer-motion slide-in, WHAT_IT_DOES / WHAT_IT_REPLACES
    ExecutionDetailPanel.tsx — workflow step visualizer, meta grid
    ExecutionBadge.tsx    — status badge (success/error/running)
    WorkflowVisualizer.tsx — node step graph from execution_data
  app/api/proxy/[...path]/route.ts — catch-all Next.js proxy to FastAPI
```

### Architecture (CONFIRMED from reference)

```
Supabase n8n_execution_logs table
  ↓ (server-side, service role key)
FastAPI backend (port 8000)
  ↓ (Next.js proxy: /api/proxy/* → http://localhost:8000/api/v1/*)
React Query hooks (useExecutions, useUptimeStatus)
  ↓
React components (ExecutionTable, UptimeKuma)
```

**Uptime source**: NOT Glance API. The reference hits **Uptime Kuma** at `http://192.168.100.144:3001` via:
- `GET /api/status-page/glanstats` — monitor list
- `GET /api/status-page/heartbeat/glanstats` — live up/down state
Both are **public endpoints** (no auth needed). Status: `1 = UP`, `0 = DOWN`.

**Supabase table name**: `n8n_execution_logs` (not `workflow_executions`)
**Supabase anon key**: empty in `.env` — backend uses **service role key** directly.

### What to Copy vs. Adapt

| Reference | WorldPort adaptation |
|---|---|
| `lib/types.ts` | Copy verbatim (ExecutionLog, UptimeMonitor, etc.) |
| `lib/serviceDescriptions.ts` | Copy + extend with beszel, browserless, whisper, chatwoot, twenty |
| `lib/workflowDescriptions.ts` | Copy + add error-alert, book-summary, manga-monitor workflows |
| `app/api/proxy/[...path]/route.ts` | Copy verbatim |
| `ExecutionBadge.tsx` | Copy, restyle to WorldPort palette |
| `UptimeKuma.tsx` | Copy, restyle panels to WorldPort glass |
| `ServiceDetailDrawer.tsx` | Copy framer-motion pattern, restyle |
| `ExecutionTable.tsx` | Copy logic, replace HeroUI Table with custom div rows |
| `WorkflowVisualizer.tsx` | Copy verbatim — parses execution_data JSON |
| FastAPI backend | **NOT needed for WorldPort** — Next.js API routes replace it |

### Simplified Data Layer (No FastAPI needed)

WorldPort is Next.js-only. Replace the FastAPI layer with Next.js API routes:

**`app/api/executions/route.ts`** — replaces FastAPI `/n8n/executions`:
```ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service role key — server-side only, never sent to browser
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page      = parseInt(searchParams.get('page')      || '1');
  const page_size = parseInt(searchParams.get('page_size') || '20');
  const status    = searchParams.get('status');
  const name      = searchParams.get('workflow_name');

  // Columns: exclude execution_data (heavy) from list view
  const cols = 'id,execution_id,workflow_id,workflow_name,status,finished,started_at,finished_at,duration_ms,mode,node_count,error_message,created_at,workflow_data';

  let q = supabase.table('n8n_execution_logs').select(cols, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page-1)*page_size, page*page_size-1);

  if (status && status !== 'all') q = q.eq('status', status);
  if (name) q = q.ilike('workflow_name', `%${name}%`);

  const { data, count, error } = await q.execute();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data,
    total: count || 0,
    page,
    page_size,
    pages: Math.ceil((count || 0) / page_size),
  });
}
```

**`app/api/executions/[id]/route.ts`** — single execution with full execution_data:
```ts
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('n8n_execution_logs')
    .select('*')
    .eq('id', params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
```

**`app/api/uptime/route.ts`** — Uptime Kuma proxy (public API, no auth):
```ts
import { NextResponse } from 'next/server';

const UK_BASE = 'http://192.168.100.144:3001';
const SLUG    = 'glanstats';

export async function GET() {
  // Both endpoints are public — no token needed
  const [statusRes, hbRes] = await Promise.all([
    fetch(`${UK_BASE}/api/status-page/${SLUG}`,           { next: { revalidate: 30 } }),
    fetch(`${UK_BASE}/api/status-page/heartbeat/${SLUG}`, { next: { revalidate: 30 } }),
  ]);

  const statusData = await statusRes.json();
  const hbData     = await hbRes.json();

  const hbList = hbData.heartbeatList || {};
  const monitors = statusData.publicGroupList
    ?.flatMap((g: any) => g.monitorList || [])
    .map((m: any) => ({
      id:     String(m.id),
      name:   m.name,
      active: m.active,
      status: hbList[String(m.id)]?.at(-1)?.status ?? null, // 1=UP, 0=DOWN
      type:   m.type,
    })) || [];

  return NextResponse.json({
    monitors,
    slug: SLUG,
    last_updated: statusData.timestamp || '',
  });
}
```

### React Query Hooks (adapted from reference)

**`lib/api.ts`** (WorldPort version — hits own Next.js routes, not FastAPI):
```ts
import { useQuery } from '@tanstack/react-query';

export const useExecutions = (filters = {}) =>
  useQuery({
    queryKey: ['executions', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any);
      const res = await fetch(`/api/executions?${params}`);
      return res.json();
    },
    refetchInterval: 30_000,
  });

export const useExecution = (id: string) =>
  useQuery({
    queryKey: ['execution', id],
    queryFn: async () => (await fetch(`/api/executions/${id}`)).json(),
    enabled: !!id,
  });

export const useUptimeStatus = () =>
  useQuery({
    queryKey: ['uptime'],
    queryFn: async () => (await fetch('/api/uptime')).json(),
    refetchInterval: 30_000,
  });
```

### Layout Behavior

```
[SCROLL 0%]   Globe centered, panels off-screen (left x:-420, right x:+420)
[SCROLL 30%]  Left panel slides to x:0, right panel slides to x:0 via GSAP scrub
              Globe remains centered behind gap between panels
[SCROLL 70%]  Panels fade out (opacity:0, y:-30) as user scrolls past
```

Panels are `position: fixed`-like but scroll-anchored via GSAP ScrollTrigger pinning.
Center zone stays clear — globe visible through the 50vw+ gap between 340px panels.

### GSAP Scroll Trigger
```tsx
// In MissionControlSection.tsx
useEffect(() => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'top 20%', scrub: 1.2 }
  });
  tl.fromTo(leftRef.current,  { x: -420, opacity: 0 }, { x: 0, opacity: 1 }, 0);
  tl.fromTo(rightRef.current, { x: 420,  opacity: 0 }, { x: 0, opacity: 1 }, 0);

  gsap.to([leftRef.current, rightRef.current], {
    scrollTrigger: { trigger: sectionRef.current, start: 'bottom 60%', end: 'bottom top', scrub: 1 },
    opacity: 0, y: -30,
  });
}, []);
```

### Component Architecture

```
components/dashboard/
  MissionControlSection.tsx  — scroll trigger wrapper, positions left/right panels
  WorkflowPanel/
    index.tsx                — left glass panel, wraps ExecutionTable logic
    Row.tsx                  — adapted from ExecutionTable row (no HeroUI, custom div)
    Drawer.tsx               — adapted from ExecutionDetailPanel + WorkflowVisualizer
  FleetPanel/
    index.tsx                — right glass panel, wraps UptimeKuma logic
    Row.tsx                  — adapted from UptimeKuma monitor row
    Drawer.tsx               — adapted from ServiceDetailDrawer (framer-motion)
lib/
  api.ts                     — React Query hooks (WorldPort version)
  types.ts                   — copy from reference
  serviceDescriptions.ts     — copy + extend from reference
  workflowDescriptions.ts    — copy + extend from reference
app/api/
  executions/route.ts        — Supabase list (no FastAPI)
  executions/[id]/route.ts   — Supabase single
  uptime/route.ts            — Uptime Kuma proxy
```

### Dependencies to Install
```bash
npm install @tanstack/react-query framer-motion date-fns
# Note: HeroUI NOT needed — we use custom divs styled to WorldPort palette
# Note: FastAPI/Python NOT needed — Next.js routes replace the backend
```

### Styling Rules

Adapt reference CSS vars to WorldPort palette (defined in `globals.css`):
```css
/* Panel glass */
background: rgba(255,255,255,0.02);
backdrop-filter: blur(24px) saturate(1.4);
border: 1px solid rgba(255,255,255,0.07);
border-radius: 20px;
width: 340px;
max-height: 70vh;
overflow-y: auto;

/* Font */
font-family: 'JetBrains Mono', monospace; /* install via next/font/google */

/* Status */
--ok:  #00ff88;  /* success / operational */
--err: #ff3355;  /* error / outage */
--wrn: #ffaa00;  /* running / degraded */

/* Row left border (adapted from reference StarBorder pattern) */
border-left: 2px solid [status-color];

/* Drawer (adapted from ServiceDetailDrawer) */
position: fixed;
right: 0; /* WorkflowDrawer */ /* left: 0 for ServiceDrawer */
top: 0; height: 100vh; width: 380px;
background: rgba(6,10,22,0.94);
backdrop-filter: blur(32px);
border-left: 1px solid rgba(255,255,255,0.08);
z-index: 200;
```

### Task List

**Data Layer:**
- [ ] Install: `npm install @tanstack/react-query framer-motion date-fns`
- [ ] Copy `lib/types.ts` from reference verbatim
- [ ] Copy `lib/serviceDescriptions.ts` + extend with beszel, browserless, whisper, chatwoot, twenty
- [ ] Copy `lib/workflowDescriptions.ts` + add error-alert, book-summary, manga-monitor, youtube-obsidian
- [ ] Create `lib/api.ts` (WorldPort version — hits /api/* not FastAPI)
- [ ] Create `app/api/executions/route.ts` (Supabase list)
- [ ] Create `app/api/executions/[id]/route.ts` (Supabase single)
- [ ] Create `app/api/uptime/route.ts` (Uptime Kuma public API proxy)
- [ ] Add `QueryClientProvider` to `app/layout.tsx` (copy Providers.tsx pattern)

**Components:**
- [ ] `components/dashboard/MissionControlSection.tsx` — GSAP scroll trigger, panel positioning
- [ ] `components/dashboard/WorkflowPanel/index.tsx` — React Query hook, search/filter, row list
- [ ] `components/dashboard/WorkflowPanel/Row.tsx` — adapted from ExecutionTable row logic
- [ ] `components/dashboard/WorkflowPanel/Drawer.tsx` — adapted from ExecutionDetailPanel + WorkflowVisualizer
- [ ] `components/dashboard/FleetPanel/index.tsx` — useUptimeStatus, service list
- [ ] `components/dashboard/FleetPanel/Row.tsx` — adapted from UptimeKuma monitor row
- [ ] `components/dashboard/FleetPanel/Drawer.tsx` — adapted from ServiceDetailDrawer (framer-motion)
- [ ] Add `MissionControlSection` to `app/page.tsx`
- [ ] Install JetBrains Mono via `next/font/google`
- [ ] Mobile: stack panels vertically, drawers slide up from bottom
- [ ] Test: panels slide in/out on scroll, drawers open/close, Supabase data loads, Uptime Kuma responds

---

## Phase 11 — Work + About Sections (Bottom, Left-to-Middle)

**Goal**: Below the dashboard, the page transitions to content. Work and About sections occupy the left-to-center zone of the viewport. The right side stays open for the globe as it continues its scroll journey.

### Layout

```
[SCROLL 75%+]
┌────────────────────────────────────────────────────────────────────────────┐
│ [WORK + ABOUT — left 60%]              [Globe scrolling right 40%] │
│                                                                    │
│ // CASE_STUDIES                                                    │
│ [case study cards from Directus]                                   │
│                                                                    │
│ // WHO_I_AM                                                        │
│ [about content from Directus]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

### Tasks
- [ ] Refactor current hero `page.tsx` — extract Work + About into `components/sections/`
- [ ] `WorkSection.tsx` — fetch `case_studies` from Directus, render cards left-to-center
- [ ] `AboutSection.tsx` — fetch `about` singleton from Directus, render with reveal-text GSAP
- [ ] Layout: `max-w-[60vw]` content, right zone empty for globe
- [ ] Case study card: title, hook, stack tags, date, link to `/work/[slug]`
- [ ] `app/work/[slug]/page.tsx` — fetch from Directus `case_studies` by slug, render markdown body

---

## Phase 12 — Footer Tech Stack Carousel

**Goal**: Full-width footer with an infinite auto-scrolling carousel of tech stack icons. Subtle, on-brand, not cluttered.

### Carousel Behavior
- Infinite horizontal scroll (CSS marquee or GSAP ticker)
- Two rows: top row scrolls left, bottom row scrolls right (counter-direction)
- Icons: SVG logos, monochrome white at 40% opacity, brightens on hover to 100%
- Speed: slow drift, ~40s per loop
- No click behavior — purely decorative

### Tech Stack Icons to Include
```
Row 1: n8n, Python, TypeScript, Next.js, Three.js, GSAP, Docker, Supabase,
        PostgreSQL, Directus, Playwright, GitHub Actions
Row 2: Tailwind CSS, React, Node.js, Proxmox, Cloudflare, Linux, Obsidian,
        Claude API, LM Studio, Dokploy, Jupyter, Figma
```

### ReactBits Component
Use `InfiniteScroll` from ReactBits (https://reactbits.dev/components/infinite-scroll) — adapted for icon rows.

### Implementation
- `components/footer/TechCarousel.tsx` — two-row marquee
- `components/footer/Footer.tsx` — contains carousel + minimal footer text (name, year, “Built in Pasig City”)
- Icon source: `simple-icons` npm package (`npm install simple-icons`) for SVG paths

### Tasks
- [ ] Install: `npm install simple-icons`
- [ ] Create `components/footer/TechCarousel.tsx` — two-row infinite marquee
- [ ] Create `components/footer/Footer.tsx` — carousel + copyright line
- [ ] Add Footer to `app/layout.tsx` (below main content, above cursor)
- [ ] Tune: speed, opacity, hover effect, icon sizing (40px)
- [ ] Test on mobile: single row, same drift speed

---

## Notes
- Case studies are the product. Write them well.
- The galaxy theme is load-bearing for the brand. Don't simplify it out.
- Built by Aldrin Roxas, Pasig City, PH — solo operator, automation architect.
- Uptime monitoring: **Glance** (not Uptime Kuma) at `192.168.100.144:3001`
- Directus collections: `about`, `blog_posts`, `case_studies`, `content_ideas`, `social_posts`, `ai_prompts`, `github`
- **Schema Notes**:
  - `about`: bio, philosophy, current_focus, whoiam_section (all markdown)
  - `case_studies`: title, slug, hook, body, outcome, stack (comma-separated string)
  - `blog_posts`: title, slug, excerpt, content, read_time
- Supabase `workflow_executions` already receiving data from n8n
- ReactBits (https://reactbits.dev) for animated UI components compatible with the theme

---
*— Minis*
