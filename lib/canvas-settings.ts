/**
 * Centralized settings for all Canvas elements.
 * Adjust these values to fine-tune the cinematic aesthetic of WorldPort.
 */

export const canvasSettings = {
  // ─── STARS ──────────────────────────────────────────────────────────────
  stars: {
    // [far, mid, near]
    layerCount: [1800, 800, 300],
    layerSpeed: [0.004, 0.010, 0.022],
    layerSize: [
      [0.2, 0.4],   // far
      [0.7, 1.1],  // mid
      [1.2, 2],   // near
    ] as Array<[number, number]>,
    layerOpacity: [
      [0.45, 0.75], // far
      [0.65, 0.90], // mid
      [0.85, 1.00], // near
    ] as Array<[number, number]>,
    colors: [
      [255, 255, 255], // White
      [210, 225, 255], // Blue-white
      [180, 210, 255], // Cool blue
      [255, 245, 210], // Warm white
      [255, 220, 180], // Pale gold
      [200, 240, 255], // Ice blue
      [240, 200, 255], // Purple
    ] as Array<[number, number, number]>,
  },

  // ─── GLOBE ──────────────────────────────────────────────────────────────
  globe: {
    glassmorphism: {
      scale: 1.0,           // 100% size as the globe
      blur: 20,             // px
      saturate: 1.5,
      opacity: 0.02,       // Toned down by ~10% from 0.03
      // Soft feathered edge so it blends smoothly without hard cutoffs
      maskImage: "radial-gradient(circle, black 70%, transparent 100%)",
      border: "none",
      boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.4)",
    }
  },

  // ─── AURORA / NEBULA EVENTS ────────────────────────────────────────────
  aurora: {
    maxEvents: 3,
    speedMultiplier: 1.0,
    intervalMin: 4000,
    intervalMax: 8000,
    opacityMultiplier: 0.4, // Max opacity of the smoke stream
    colors: [
      0x00ffaa, // Mint
      0x00c8ff, // Cyan
      0x1a80ff, // Deep Blue
      0x7700ff  // Purple
    ]
  },

  // ─── VIGNETTE ──────────────────────────────────────────────────────────
  vignette: {
    height: "30%",     // Covers 20% of the viewport from the bottom
    opacity: 0.7,      // Opacity at the very bottom edge
    color: "1, 6, 17"  // RGB of #010611
  }
};
