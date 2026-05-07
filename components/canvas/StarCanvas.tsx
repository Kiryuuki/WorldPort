"use client";

import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { canvasSettings } from "@/lib/canvas-settings";

gsap.registerPlugin(ScrollTrigger);

// StarCanvas — Cinematic Parallax & Twinkle
// Optimized for premium "floating in space" feeling.
// — Dash

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  phase: number;
  twinkleSpeed: number;
  layer: number;
  r: number; g: number; b: number;
  colorIndex: number;
}

export const StarCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let stars: Star[] = [];
    let panX = 0; let panY = 0;
    const mousePos = { x: 0, y: 0 };
    const lerpMouse = { x: 0, y: 0 };
    let haloCanvases: HTMLCanvasElement[] = [];

    const { layerSpeed: LAYER_SPEED, layerCount: LAYER_COUNT, layerSize: LAYER_SIZE, layerOpacity: LAYER_OPACITY, colors: STAR_COLORS } = canvasSettings.stars;

    const createHaloCanvases = () => {
      haloCanvases = STAR_COLORS.map(([r, g, b]) => {
        const hc = document.createElement('canvas');
        hc.width = 64;
        hc.height = 64;
        const hctx = hc.getContext('2d')!;
        const gradient = hctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, `rgba(${r},${g},${b},0.45)`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
        hctx.beginPath();
        hctx.arc(32, 32, 32, 0, Math.PI * 2);
        hctx.fillStyle = gradient;
        hctx.fill();
        return hc;
      });
    };

    const init = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const dprMax = isMobile ? canvasSettings.performance.dprMaxMobile : canvasSettings.performance.dprMaxDesktop;
      const dpr = Math.min(window.devicePixelRatio, dprMax);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const W = window.innerWidth, H = window.innerHeight;
      const VW = W * 1.6, VH = H * 1.6; // Wider virtual space for parallax margin

      createHaloCanvases();

      stars = [];
      for (let layer = 0; layer < 3; layer++) {
        const [sMin, sMax] = LAYER_SIZE[layer];
        const [oMin, oMax] = LAYER_OPACITY[layer];
        // Reduce star count on mobile to save processing
        const count = isMobile ? Math.floor(LAYER_COUNT[layer] * 0.5) : LAYER_COUNT[layer];
        
        for (let i = 0; i < count; i++) {
          const colorIndex = Math.floor(Math.random() * STAR_COLORS.length);
          const [r, g, b] = STAR_COLORS[colorIndex];
          stars.push({
            x: Math.random() * VW - (VW - W) / 2,
            y: Math.random() * VH - (VH - H) / 2,
            size: sMin + Math.random() * (sMax - sMin),
            baseOpacity: oMin + Math.random() * (oMax - oMin),
            phase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.008 + Math.random() * 0.015, // Faster twinkling
            layer, r, g, b, colorIndex
          });
        }
      }
    };

    // Scroll tracking
    const scrollObj = { y: 0 };
    const st = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => { scrollObj.y = self.scroll(); }
    });

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = (e.clientX / window.innerWidth - 0.5) * 60;
      mousePos.y = (e.clientY / window.innerHeight - 0.5) * 60;
    };

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      const W = window.innerWidth, H = window.innerHeight;

      ctx.clearRect(0, 0, W, H);

      // Mouse lerping for smooth parallax
      lerpMouse.x += (mousePos.x - lerpMouse.x) * 0.05;
      lerpMouse.y += (mousePos.y - lerpMouse.y) * 0.05;

      panX += 0.006; panY += 0.001; // Slower auto drift
      const VW = W * 1.6, VH = H * 1.6, OX = (VW - W) / 2, OY = (VH - H) / 2;

      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        // More noticeable twinkling
        const twinkleDepth = star.layer === 0 ? 0.25 : star.layer === 1 ? 0.45 : 0.65;
        const twinkle = 1.0 - twinkleDepth + twinkleDepth * (Math.sin(star.phase) * 0.5 + 0.5);
        const alpha = star.baseOpacity * twinkle;

        const spd = LAYER_SPEED[star.layer];
        const scrollOffset = scrollObj.y * spd * 1.2; // Vertical parallax from scroll
        const mouseOffsetX = lerpMouse.x * (spd * 20); // Horizontal parallax from mouse
        const mouseOffsetY = lerpMouse.y * (spd * 20);

        // Apply auto drift + scroll + mouse
        const vx = ((star.x + panX * spd + mouseOffsetX + OX) % VW + VW) % VW - OX;
        const vy = ((star.y + panY * spd + mouseOffsetY - scrollOffset + OY) % VH + VH) % VH - OY;

        if (vx < -20 || vx > W + 20 || vy < -20 || vy > H + 20) return;

        // Draw Nearer layers with soft glow using pre-rendered canvas
        if (star.layer >= 1) {
          const haloR = star.size * 2.5;
          const haloCanvas = haloCanvases[star.colorIndex];
          if (haloCanvas) {
            ctx.globalAlpha = alpha;
            ctx.drawImage(haloCanvas, vx - haloR, vy - haloR, haloR * 2, haloR * 2);
            ctx.globalAlpha = 1.0;
          }
        }

        ctx.beginPath(); ctx.arc(vx, vy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.r},${star.g},${star.b},${alpha})`; ctx.fill();

        // Sparkle crosses for near bright stars
        if (star.layer === 2 && star.size > 3.5 && alpha > 0.9) {
          const arm = star.size * 3.2;
          ctx.strokeStyle = `rgba(${star.r},${star.g},${star.b},${alpha * 0.4})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(vx - arm, vy); ctx.lineTo(vx + arm, vy); ctx.moveTo(vx, vy - arm); ctx.lineTo(vx, vy + arm); ctx.stroke();
        }
      });
    };

    init(); draw();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMouseMove);
      st.kill();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
};

export default StarCanvas;
