"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { canvasSettings } from "@/lib/canvas-settings";

gsap.registerPlugin(ScrollTrigger);

/**
 * EarthCanvas — Phase 15: Persistent Cinematic Redesign
 * — Dash
 */
export const EarthCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isCaseStudyPage = pathname?.includes("/case-studies/") && pathname.split("/").length > 2;
  const journey = canvasSettings.globe.scrollJourney;

  // State refs to persist Three.js objects across re-renders
  const stateRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    controls?: OrbitControls;
    pointsGeo?: THREE.IcosahedronGeometry;
    pointsMat?: THREE.ShaderMaterial;
    scrollState: { offX: number; offY: number; dist: number };
    rafId?: number;
    timeline?: gsap.core.Timeline;
  }>({
    scrollState: { 
      offX: 0, 
      offY: 0, 
      dist: 1600 
    }
  });

  // 1. Scene Initialization (Mount Once)
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let W = container.clientWidth;
    let H = container.clientHeight;

    // Set initial values properly based on path
    if (isCaseStudyPage) {
      stateRef.current.scrollState = { offX: 0, offY: 0, dist: 530 };
    } else {
      stateRef.current.scrollState = { 
        offX: W * journey.start.offXMult, 
        offY: H * journey.start.offYMult, 
        dist: journey.start.dist 
      };
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const scene = new THREE.Scene();
    const RADIUS = 420; 
    const FOV = 40;

    const camera = new THREE.PerspectiveCamera(FOV, W / H, 0.1, 12000);
    camera.position.set(0, 0, 1600);
    camera.lookAt(0, 0, 0);

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
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.1;
    controls.maxPolarAngle = Math.PI * 0.95;
    if (isMobile) {
      controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };
    }

    const loader = new THREE.TextureLoader();
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const dayMap = loader.load("/textures/earth-bg-day.png");
    const bumpMap = loader.load("/textures/earth-bump.jpg");
    const specMap = loader.load("/textures/earth-spec.jpg");

    const detail = isMobile ? 50 : 100;
    const pointsGeo = new THREE.IcosahedronGeometry(RADIUS, detail);

    const vertexShader = `
      uniform float size;
      uniform sampler2D elevTexture;
      varying vec2 vUv;
      varying float vVisible;
      void main() {
        vUv = uv;
        float elv = texture2D(elevTexture, vUv).r;
        vec3 vNormal = normalMatrix * normal;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vVisible = step(0.0, dot( -normalize(mvPosition.xyz), normalize(vNormal)));
        mvPosition.z += 25.0 * elv;
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
        if (floor(vVisible + 0.1) == 0.0) discard;
        float specValue = texture2D(alphaTexture, vUv).r;
        if (specValue > 0.4) discard; 
        vec2 c = gl_PointCoord - 0.5;
        if (dot(c, c) > 0.25) discard;
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

    stateRef.current = {
      ...stateRef.current,
      renderer, scene, camera, controls, pointsGeo, pointsMat
    };

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const s = stateRef.current;
      if (!s.renderer || !s.scene || !s.camera || !s.controls) return;
      
      s.controls.update();
      const dir = new THREE.Vector3().subVectors(s.camera.position, s.controls.target).normalize();
      s.camera.position.copy(s.controls.target).add(dir.multiplyScalar(s.scrollState.dist));
      s.camera.setViewOffset(W, H, s.scrollState.offX, s.scrollState.offY, W, H);
      
      if (blurRef.current) {
        const focalLength = (H / 2) / Math.tan((FOV / 2) * (Math.PI / 180));
        const innerScale = canvasSettings.globe.glassmorphism.scale; 
        const dPx = (RADIUS * 2.0 * innerScale * focalLength) / s.scrollState.dist;
        const sX = W / 2 - s.scrollState.offX;
        const sY = H / 2 - s.scrollState.offY;
        blurRef.current.style.width = `${dPx}px`;
        blurRef.current.style.height = `${dPx}px`;
        blurRef.current.style.transform = `translate(${sX - dPx / 2}px, ${sY - dPx / 2}px)`;
      }
      s.renderer.render(s.scene, s.camera);
    };
    rafId = requestAnimationFrame(animate);
    stateRef.current.rafId = rafId;

    const onResize = () => {
      W = container.clientWidth; H = container.clientHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      controls.dispose();
    };
  }, []); // Run once on mount

  // 2. Journey/Cinematic Transition Logic (Path Dependent)
  useEffect(() => {
    const s = stateRef.current;
    if (!s.camera || !s.controls) return;
    const journey = canvasSettings.globe.scrollJourney;
    const container = containerRef.current;
    if (!container) return;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Clean up existing timeline/triggers
    if (s.timeline) {
      s.timeline.kill();
      s.timeline = undefined;
    }
    // Kill all scroll triggers to start fresh
    ScrollTrigger.getAll().forEach(t => t.kill());

    if (isCaseStudyPage) {
      // Transition to Cinematic Mode (Centered, 300% Zoom)
      gsap.to(s.scrollState, {
        offX: 0, offY: 0, dist: 530,
        duration: 1.2, ease: "power3.inOut"
      });
      s.controls.minDistance = 530;
      s.controls.maxDistance = 530;
      s.camera.clearViewOffset();
    } else {
      // Transition BACK to Scroll Journey Mode (Home)
      // Mirror the expansion with a smooth contraction to the CURRENT scroll position
      
      // Delay slightly to allow Next.js/Browser to restore scroll position
      setTimeout(() => {
        const currentScroll = window.scrollY;
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalScroll > 0 ? Math.min(Math.max(currentScroll / totalScroll, 0), 1) : 0;
        
        // Target values based on journey phases
        let targetX = W * journey.start.offXMult;
        let targetY = H * journey.start.offYMult;
        let targetDist = journey.start.dist;
        
        if (progress < 0.33) {
          const p = progress / 0.33;
          targetX = gsap.utils.interpolate(W * journey.start.offXMult, journey.phase1.offX, p);
          targetY = gsap.utils.interpolate(H * journey.start.offYMult, journey.phase1.offY, p);
          targetDist = gsap.utils.interpolate(journey.start.dist, journey.phase1.dist, p);
        } else if (progress < 0.66) {
          targetX = journey.phase2.offX;
          targetY = journey.phase2.offY;
          targetDist = journey.phase2.dist;
        } else {
          const p = (progress - 0.66) / 0.34;
          targetX = gsap.utils.interpolate(journey.phase2.offX, W * journey.phase3.offXMult, p);
          targetY = gsap.utils.interpolate(journey.phase2.offY, H * journey.phase3.offYMult, p);
          targetDist = gsap.utils.interpolate(journey.phase2.dist, journey.phase3.dist, p);
        }

        gsap.to(s.scrollState, {
          offX: targetX,
          offY: targetY,
          dist: targetDist,
          duration: 1.2,
          ease: "power3.inOut",
          onComplete: () => {
            s.controls.minDistance = 100;
            s.controls.maxDistance = 5000;
            
            const tl = gsap.timeline({ 
              scrollTrigger: { 
                trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5,
                invalidateOnRefresh: true
              } 
            });

            tl.set(s.scrollState, {
              offX: W * journey.start.offXMult,
              offY: H * journey.start.offYMult,
              dist: journey.start.dist
            })
            .to(s.scrollState, { 
              offX: journey.phase1.offX, offY: journey.phase1.offY, dist: journey.phase1.dist, 
              duration: journey.phase1.duration, ease: journey.phase1.ease 
            })
            .to(s.scrollState, { 
              offX: journey.phase2.offX, offY: journey.phase2.offY, dist: journey.phase2.dist, 
              duration: journey.phase2.duration, ease: journey.phase2.ease 
            })
            .to(s.scrollState, { 
              offX: W * journey.phase3.offXMult, offY: H * journey.phase3.offYMult, dist: journey.phase3.dist, 
              duration: journey.phase3.duration, ease: journey.phase3.ease 
            });
            
            s.timeline = tl;
            ScrollTrigger.refresh();
          }
        });
      }, 50); // 50ms delay for scroll restoration
    }
  }, [isCaseStudyPage]);

  const glassSettings = canvasSettings.globe.glassmorphism;

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 2, pointerEvents: "auto" }}>
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
