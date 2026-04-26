"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// DustCanvas — Consolidates 3D atmospheric dust and 2D high-speed streaks
// — Dash

export const DustCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // ─── 3D Ambient Dust (Three.js) ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 5000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const dustCount3D = isMobile ? 80 : 200;
    const dustGeom3D = new THREE.BufferGeometry();
    const dustPos3D = new Float32Array(dustCount3D * 3);
    const dustVels3D = new Float32Array(dustCount3D);
    const dustColors3D = new Float32Array(dustCount3D * 3);
    const palette = [
      new THREE.Color(0x00c8ff), new THREE.Color(0xffcc00),
      new THREE.Color(0xff00ff), new THREE.Color(0xffffff),
      new THREE.Color(0x00ffaa)
    ];

    for (let i = 0; i < dustCount3D; i++) {
      dustPos3D[i * 3]     = (Math.random() - 0.5) * 3000;
      dustPos3D[i * 3 + 1] = (Math.random() - 0.5) * 3000;
      dustPos3D[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      dustVels3D[i] = 0.1 + Math.random() * 0.3;

      const c = palette[i % palette.length];
      dustColors3D[i * 3] = c.r;
      dustColors3D[i * 3 + 1] = c.g;
      dustColors3D[i * 3 + 2] = c.b;
    }
    dustGeom3D.setAttribute("position", new THREE.BufferAttribute(dustPos3D, 3));
    dustGeom3D.setAttribute("color", new THREE.BufferAttribute(dustColors3D, 3));
    
    const dustMat3D = new THREE.PointsMaterial({
      size: isMobile ? 3.0 : 5.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustSystem3D = new THREE.Points(dustGeom3D, dustMat3D);
    scene.add(dustSystem3D);

    // ─── 2D High-Speed Streaks (Canvas) ──────────────────────────────────────
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    interface SpaceStreak {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number;
      size: number; color: string;
    }
    let streaks: SpaceStreak[] = [];

    const spawnStreak = () => {
      const count = Math.floor(Math.random() * 4) + 1;
      const bx = Math.random() * W;
      const by = Math.random() * H;
      const toX = W / 2 + (Math.random() - 0.5) * 500;
      const toY = H / 2 + (Math.random() - 0.5) * 500;
      const baseAngle = Math.atan2(toY - by, toX - bx);
      const speed = 4.0 + Math.random() * 8.0;

      const colors = ["#00c8ff", "#ffcc00", "#ff00ff", "#ffffff", "#00ffaa"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < count; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * 0.4;
        const life = 20 + Math.random() * 30;
        streaks.push({
          x: bx, y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life, maxLife: life,
          size: Math.random() * 4 + 2,
          color,
        });
      }
    };

    let lastSpawn = 0;
    const animate = (t: number) => {
      requestAnimationFrame(animate);

      // 3D Update
      const pos = dustGeom3D.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount3D; i++) {
        pos[i * 3 + 2] += dustVels3D[i] * 10;
        if (pos[i * 3 + 2] > 1000) pos[i * 3 + 2] = -1000;
      }
      dustGeom3D.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);

      // 2D Update
      ctx.clearRect(0, 0, W, H);
      if (t - lastSpawn > 3000 + Math.random() * 4000) {
        spawnStreak();
        lastSpawn = t;
      }

      streaks = streaks.filter(s => {
        s.x += s.vx; s.y += s.vy;
        s.life--;
        if (s.life <= 0) return false;

        const alpha = s.life / s.maxLife;
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx.stroke();
        
        // Glow tip
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });
      ctx.globalAlpha = 1;
    };
    requestAnimationFrame(animate);

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      controls.dispose(); renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 4 }}>
      <div ref={containerRef} className="absolute inset-0" />
      <canvas ref={canvasRef} className="absolute inset-0" style={{ zIndex: 5 }} />
    </div>
  );
};

export default DustCanvas;
