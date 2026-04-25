"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vr: number;
  life: number;
  maxLife: number;
  sides: number;
}

export const CursorCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });

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
      const speed = Math.random() * 2 + 1;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1, // Slight upward push
        size: Math.random() * 4 + 2,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
        life: 1,
        maxLife: 0.02 + Math.random() * 0.03,
        sides: Math.floor(Math.random() * 3) + 3, // 3 to 5 sides for jagged look
      };
    };

    const drawPolygon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, sides: number, rotation: number) => {
      ctx.beginPath();
      ctx.moveTo(x + radius * Math.cos(rotation), y + radius * Math.sin(rotation));
      for (let i = 1; i <= sides; i++) {
        const angle = rotation + (i * 2 * Math.PI) / sides;
        ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Spawn particles
      if (mouseRef.current.x > 0) {
        for (let i = 0; i < 2; i++) {
          particles.push(createParticle(mouseRef.current.x, mouseRef.current.y));
        }
      }

      // Update and draw
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravity
        p.rotation += p.vr;
        p.life -= p.maxLife;

        if (p.life <= 0) return false;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.6})`;
        drawPolygon(ctx, p.x, p.y, p.size * p.life, p.sides, p.rotation);
        
        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
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
