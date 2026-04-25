"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Aurora Borealis — Three.js sprite particle curtains rising from horizon
// Rendered in its own scene on top of EarthCanvas via canvas2D compositing
// Uses screen blending like real aurora light emission
// — Dash

export const AuroraCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Separate Three.js scene — renders on top of Earth via z-index
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 5000);
    camera.position.set(0, 0, 1800);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    // Screen blending = additive light, aurora never darkens bg
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Sprite texture: soft radial blob ---
    const makeSpriteTex = (color: string): THREE.Texture => {
      const size = 128;
      const cvs = document.createElement("canvas");
      cvs.width = size; cvs.height = size;
      const ctx = cvs.getContext("2d")!;
      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      grad.addColorStop(0,   color.replace(")", ", 1)").replace("rgb", "rgba"));
      grad.addColorStop(0.4, color.replace(")", ", 0.4)").replace("rgb", "rgba"));
      grad.addColorStop(1,   color.replace(")", ", 0)").replace("rgb", "rgba"));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(cvs);
      return tex;
    };

    // Aurora colors matching Mango Media reference
    const texGreen  = makeSpriteTex("rgb(20, 220, 80)");
    const texCyan   = makeSpriteTex("rgb(0, 200, 160)");
    const texWhite  = makeSpriteTex("rgb(180, 255, 220)");

    // Aurora horizon Y — matches Earth position in EarthCanvas (y: -(RADIUS*1.55) = ~-496)
    // In camera space at z=0, y=-496 is below center — we place aurora just above that
    const HORIZON_Y = -300;
    const LEFT_X    = -900; // left side, matching Mango ref

    // --- Build aurora curtain as vertical column of sprites ---
    interface CurtainConfig {
      x: number;
      width: number;
      heightSegments: number;
      maxHeight: number;
      color: THREE.Texture;
      baseOpacity: number;
      waveFreq: number;
      waveAmp: number;
      phaseOffset: number;
      driftSpeed: number;
    }

    const curtains: CurtainConfig[] = [
      // Wide base green wash — leftmost anchor
      { x: LEFT_X + 0,   width: 280, heightSegments: 18, maxHeight: 820, color: texGreen,  baseOpacity: 0.12, waveFreq: 0.8, waveAmp: 60, phaseOffset: 0,   driftSpeed: 0.22 },
      // Bright narrow green spike
      { x: LEFT_X + 100, width: 120, heightSegments: 22, maxHeight: 950, color: texGreen,  baseOpacity: 0.22, waveFreq: 1.4, waveAmp: 35, phaseOffset: 0.6, driftSpeed: 0.35 },
      // Cyan inner shimmer
      { x: LEFT_X + 160, width: 160, heightSegments: 20, maxHeight: 880, color: texCyan,   baseOpacity: 0.14, waveFreq: 1.8, waveAmp: 28, phaseOffset: 1.2, driftSpeed: 0.28 },
      // White hot core filament
      { x: LEFT_X + 120, width: 60,  heightSegments: 16, maxHeight: 760, color: texWhite,  baseOpacity: 0.09, waveFreq: 2.4, waveAmp: 18, phaseOffset: 0.3, driftSpeed: 0.50 },
      // Secondary green band (right of main)
      { x: LEFT_X + 240, width: 140, heightSegments: 18, maxHeight: 700, color: texGreen,  baseOpacity: 0.10, waveFreq: 1.1, waveAmp: 45, phaseOffset: 1.8, driftSpeed: 0.20 },
      // Wide soft base wash
      { x: LEFT_X - 60,  width: 320, heightSegments: 12, maxHeight: 500, color: texGreen,  baseOpacity: 0.07, waveFreq: 0.5, waveAmp: 80, phaseOffset: 2.4, driftSpeed: 0.15 },
    ];

    // Store sprite groups for animation
    const curtainGroups: Array<{
      sprites: THREE.Sprite[];
      config: CurtainConfig;
      basePositions: THREE.Vector3[];
    }> = [];

    curtains.forEach((cfg) => {
      const sprites: THREE.Sprite[] = [];
      const basePositions: THREE.Vector3[] = [];

      for (let i = 0; i < cfg.heightSegments; i++) {
        const t = i / (cfg.heightSegments - 1); // 0 = base, 1 = top

        const mat = new THREE.SpriteMaterial({
          map: cfg.color,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          // Opacity fades: dim at base, bright at mid, fade at top
          opacity: cfg.baseOpacity * (
            t < 0.15 ? t / 0.15 :          // fade in from base
            t > 0.75 ? (1 - t) / 0.25 :    // fade out at top
            1.0                             // full in middle band
          ),
        });

        const sprite = new THREE.Sprite(mat);
        // Width scales with curtain width, height per segment
        const segH = cfg.maxHeight / cfg.heightSegments;
        sprite.scale.set(cfg.width, segH * 1.4, 1); // 1.4 overlap for seamless

        const basePos = new THREE.Vector3(
          cfg.x,
          HORIZON_Y + t * cfg.maxHeight,
          0
        );
        sprite.position.copy(basePos);
        basePositions.push(basePos.clone());
        sprites.push(sprite);
        scene.add(sprite);
      }

      curtainGroups.push({ sprites, config: cfg, basePositions });
    });

    // --- Animation ---
    let rafId: number;
    let t = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.008;

      curtainGroups.forEach(({ sprites, config, basePositions }) => {
        // Global breathe pulse per curtain
        const breathe = 0.7 + 0.3 * Math.sin(t * config.driftSpeed + config.phaseOffset);

        sprites.forEach((sprite, i) => {
          const progress = i / (sprites.length - 1);
          // Lateral wave increases with height (more turbulent near top)
          const wave = Math.sin(
            progress * config.waveFreq * Math.PI * 2 +
            t * config.driftSpeed +
            config.phaseOffset
          ) * config.waveAmp * Math.pow(progress, 0.6);

          sprite.position.x = basePositions[i].x + wave;
          sprite.position.y = basePositions[i].y;

          // Opacity pulse — also modulated by height (top shimmers more)
          const heightMod = progress > 0.5 ? 1 + 0.4 * Math.sin(t * config.driftSpeed * 3 + i) : 1;
          (sprite.material as THREE.SpriteMaterial).opacity =
            config.baseOpacity *
            breathe *
            heightMod *
            (progress < 0.15 ? progress / 0.15 : progress > 0.75 ? (1 - progress) / 0.25 : 1.0);
        });
      });

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    // --- Resize ---
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 3, mixBlendMode: "screen" }}
    />
  );
};

export default AuroraCanvas;
// — Dash
