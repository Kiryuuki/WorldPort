"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

export const CursorCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const prevMouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5, // Slight upward push initially
        size: Math.random() * 2.5 + 1, // Similar to star sizes
        life: 1,
        maxLife: 0.02 + Math.random() * 0.03,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const px = prevMouseRef.current.x;
      const py = prevMouseRef.current.y;

      // Spawn particles only when moving
      if (mx > 0 && px > 0) {
        const dist = Math.hypot(mx - px, my - py);
        if (dist > 1) { // If moved
          const spawnCount = Math.min(Math.floor(dist / 4) + 1, 4); // Spawn based on movement speed, max 4
          for (let i = 0; i < spawnCount; i++) {
            // Interpolate position to fill gaps in fast movement
            const t = Math.random();
            const spawnX = px + (mx - px) * t;
            const spawnY = py + (my - py) * t;
            particles.push(createParticle(spawnX, spawnY));
          }
        }
      }

      // Update previous mouse position
      prevMouseRef.current.x = mx;
      prevMouseRef.current.y = my;

      // Update and draw particles
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Gravity
        p.life -= p.maxLife;

        if (p.life <= 0) return false;

        // Draw particle (star circle)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      });

      // Draw Main Cursor (Glowing Star)
      if (mx > 0) {
        // Core
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fill();
        
        // Soft Glow
        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 12);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // If it's the very first move, initialize prevMouse to current to avoid a massive line jump
      if (prevMouseRef.current.x === -100) {
        prevMouseRef.current.x = e.clientX;
        prevMouseRef.current.y = e.clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[10000]"
    />
  );
};

export default CursorCanvas;
