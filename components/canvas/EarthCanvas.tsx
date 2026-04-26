"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { canvasSettings } from "@/lib/canvas-settings";

gsap.registerPlugin(ScrollTrigger);

/**
 * EarthCanvas — Phase 12: Interactive Vertex Earth with Inner Glassmorphism
 * — Dash
 */

export const EarthCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let W = container.clientWidth;
    let H = container.clientHeight;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const scene = new THREE.Scene();
    const RADIUS = 420; 
    const CAM_Z = 1600;
    const FOV = 40;

    const camera = new THREE.PerspectiveCamera(FOV, W / H, 0.1, 10000);
    camera.position.set(0, 0, CAM_Z);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); 
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = false;
    controls.enablePan = false;

    const loader = new THREE.TextureLoader();
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ─── Textures ────────────────────────────────────────────────────────────
    const dayMap = loader.load("/textures/earth-bg-day.png");
    const bumpMap = loader.load("/textures/earth-bump.jpg");
    // Using spec map as an alpha map: oceans are white (1.0), land is black (0.0)
    const specMap = loader.load("/textures/earth-spec.jpg");

    // ─── Point Cloud Vertex Earth ────────────────────────────────────────────
    const detail = isMobile ? 50 : 100;
    const pointsGeo = new THREE.IcosahedronGeometry(RADIUS, detail);

    const vertexShader = `
      uniform float size;
      uniform sampler2D elevTexture;
      varying vec2 vUv;
      varying float vVisible;
      
      void main() {
        vUv = uv;
        
        // Sample elevation
        float elv = texture2D(elevTexture, vUv).r;
        
        // Calculate visibility based on normal vs view direction
        vec3 vNormal = normalMatrix * normal;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vVisible = step(0.0, dot( -normalize(mvPosition.xyz), normalize(vNormal)));
        
        // Displace vertex outward based on elevation (exaggerated for effect)
        // Since we are in model view, Z is toward the camera
        mvPosition.z += 25.0 * elv;
        
        // Size attenuation
        gl_PointSize = size * (1000.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform sampler2D colorTexture;
      uniform sampler2D alphaTexture;
      varying vec2 vUv;
      varying float vVisible;
      
      void main() {
        // Discard points facing away from camera
        if (floor(vVisible + 0.1) == 0.0) discard;
        
        // Discard points over the ocean. 
        // specMap: oceans are white (1.0), land is dark (0.0)
        float specValue = texture2D(alphaTexture, vUv).r;
        if (specValue > 0.4) discard; 

        // Make points circular
        vec2 c = gl_PointCoord - 0.5;
        if (dot(c, c) > 0.25) discard;

        // Sample color
        vec3 color = texture2D(colorTexture, vUv).rgb;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const pointsMat = new THREE.ShaderMaterial({
      uniforms: {
        size: { value: isMobile ? 2.5 : 3.5 },
        colorTexture: { value: dayMap },
        elevTexture: { value: bumpMap },
        alphaTexture: { value: specMap }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false
    });

    const points = new THREE.Points(pointsGeo, pointsMat);
    globeGroup.add(points);

    // ─── Scroll Journey ──────────────────────────────────────────────────────
    const scrollState = { offX: 0, offY: -H * 0.75, dist: 950 };
    const tl = gsap.timeline({ scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 } });
    tl.to(scrollState, { offX: 0, offY: 0, dist: 1600, duration: 1, ease: "none" })
      .to(scrollState, { offX: -W * 0.25, offY: -H * 0.1, dist: 1400, duration: 1, ease: "none" });

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      camera.position.copy(controls.target).add(dir.multiplyScalar(scrollState.dist));
      camera.setViewOffset(W, H, scrollState.offX, scrollState.offY, W, H);
      
      if (blurRef.current) {
        const focalLength = (H / 2) / Math.tan((FOV / 2) * (Math.PI / 180));
        // Use settings scale (e.g. 1.0 for 100% size)
        const innerScale = canvasSettings.globe.glassmorphism.scale; 
        const diameterPx = (RADIUS * 2.0 * innerScale * focalLength) / scrollState.dist;
        const screenX = W / 2 - scrollState.offX;
        const screenY = H / 2 - scrollState.offY;
        
        blurRef.current.style.width = `${diameterPx}px`;
        blurRef.current.style.height = `${diameterPx}px`;
        blurRef.current.style.transform = `translate(${screenX - diameterPx / 2}px, ${screenY - diameterPx / 2}px)`;
      }

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    const onResize = () => {
      W = container.clientWidth; H = container.clientHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      controls.dispose();
      renderer.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
    };
  }, []);

  const glassSettings = canvasSettings.globe.glassmorphism;

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
      {/* Inner Glassmorphism Layer — Dynamically scaled with feathered edges */}
      <div 
        ref={blurRef} 
        className="absolute top-0 left-0 rounded-full"
        style={{ 
          backdropFilter: `blur(${glassSettings.blur}px) saturate(${glassSettings.saturate})`, 
          background: `rgba(255, 255, 255, ${glassSettings.opacity})`, 
          border: glassSettings.border,
          boxShadow: glassSettings.boxShadow,
          WebkitMaskImage: glassSettings.maskImage,
          maskImage: glassSettings.maskImage,
          pointerEvents: "none",
          zIndex: -1 
        }}
      />
    </div>
  );
};

export default EarthCanvas;
