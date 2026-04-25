"use client";

import React, { useEffect, useRef } from "react";

// StarCanvas — deep space nebula background
// Stars are rendered inside EarthCanvas (Three.js Points) for proper 3D parallax
// This canvas provides the nebula color wash beneath everything
// — Dash

export const StarCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = (time: number) => {
      rafId = requestAnimationFrame(draw);
      const W = window.innerWidth;
      const H = window.innerHeight;

      // Deep space bg
      ctx.fillStyle = "#010611";
      ctx.fillRect(0, 0, W, H);

      const t = time * 0.00006;

      // Draw nebula washes — more layers, more depth
      ctx.globalCompositeOperation = "screen"; // Blend layers together

      const nebula = (cx: number, cy: number, rx: number, ry: number, color: string, a: number, rot: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        g.addColorStop(0,   `rgba(${color},${a})`);
        g.addColorStop(0.4, `rgba(${color},${a * 0.4})`);
        g.addColorStop(1,   `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      // 1. Deep Core Blue (Massive background wash)
      nebula(
        W * 0.5 + Math.sin(t * 0.1) * 100,
        H * 0.5 + Math.cos(t * 0.15) * 80,
        W * 1.2, H * 0.8,
        "10, 20, 80", 0.15, t * 0.05
      );

      // 2. Cyan Filament (Upper right shimmer)
      nebula(
        W * 0.8 + Math.cos(t * 0.2) * 150,
        H * 0.2 + Math.sin(t * 0.25) * 100,
        W * 0.6, H * 0.4,
        "0, 180, 220", 0.08, -t * 0.1
      );

      // 3. Purple Dust (Lower left mass)
      nebula(
        W * 0.2 + Math.sin(t * 0.3) * 120,
        H * 0.8 + Math.cos(t * 0.2) * 90,
        W * 0.8, H * 0.5,
        "60, 10, 150", 0.1, t * 0.08
      );

      // 4. Subtle Teal Highlights (Scattered)
      nebula(
        W * 0.4 + Math.cos(t * 0.5) * 200,
        H * 0.3 + Math.sin(t * 0.4) * 150,
        W * 0.3, H * 0.2,
        "0, 255, 180", 0.05, t * 0.15
      );

      // 5. Horizon Blue (Base glow for Earth)
      nebula(
        W * 0.5, H * 1.0,
        W * 0.8, H * 0.4,
        "20, 50, 140", 0.12, 0
      );

      // 6. Cinematic Vignetting & Upper Cloudy Layer
      ctx.globalCompositeOperation = "multiply"; // Use multiply for dark "enclosing" vignetting
      
      const vignette = (cx: number, cy: number, rx: number, ry: number, color: string, a: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        const g = ctx.createRadialGradient(0, 0, rx * 0.5, 0, 0, rx);
        g.addColorStop(0, `rgba(${color}, 0)`);
        g.addColorStop(1, `rgba(${color}, ${a})`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      // Top-edge cloudy vignette (Deep dark space)
      vignette(W * 0.5, 0, W * 1.2, H * 0.5, "1, 6, 17", 0.4);
      // Bottom-edge cloudy vignette
      vignette(W * 0.5, H, W * 1.2, H * 0.4, "1, 6, 17", 0.3);
    };

    init();
    rafId = requestAnimationFrame(draw);

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", onResize); };
  }, []);

  // z:0 — bottommost layer, everything renders on top
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default StarCanvas;
// — Dash
