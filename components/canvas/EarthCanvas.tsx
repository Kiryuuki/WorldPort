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

<<<<<<< HEAD
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 0.1, 10000);
    camera.position.set(0, 0, CAM_Z);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
=======
    // Camera starts looking at globe center (0,0,0)
    // Offset Y downward so globe appears anchored at bottom of viewport
    const RADIUS = 420; // bigger than before — fills more of the viewport
    const CAM_Z = 1600;
    const CAM_Y = RADIUS * 0.6; // push camera up so globe horizon shows at ~40% from bottom

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 12000);
    camera.position.set(0, 0, CAM_Z); // Camera centered on origin (all offsets via moveState)
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
>>>>>>> f2fc9085ca39ea746dab4ab9c8d535449b5b5917
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); 
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
<<<<<<< HEAD
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = false;
    controls.enablePan = false;
=======
    controls.target.set(0, 0, 0); // Always target the globe at origin
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2; // Calmer rotation
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.1;
    controls.maxPolarAngle = Math.PI * 0.95;
    if (isMobile) {
      controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };
    }

    // ─── Bloom ───────────────────────────────────────────────────────────────
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.6, 0.4, 0.55));
>>>>>>> f2fc9085ca39ea746dab4ab9c8d535449b5b5917

    const loader = new THREE.TextureLoader();
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ─── Textures ────────────────────────────────────────────────────────────
    const dayMap = loader.load("/textures/earth-bg-day.png");
    const bumpMap = loader.load("/textures/earth-bump.jpg");
    // Using spec map as an alpha map: oceans are white (1.0), land is black (0.0)
    const specMap = loader.load("/textures/earth-spec.jpg");

<<<<<<< HEAD
    // ─── Point Cloud Vertex Earth ────────────────────────────────────────────
    const detail = isMobile ? 50 : 100;
    const pointsGeo = new THREE.IcosahedronGeometry(RADIUS, detail);
=======
    // 2. Point cloud — bobbyroe exact shader
    const colorMap = loader.load("/textures/earth-bg-day.png");
    const elevMap = loader.load("/textures/earth-bump.jpg");
    const alphaMap = loader.load("/textures/earth-spec.jpg");

    const icoDetail = isMobile ? 64 : 120;
    const pointsGeo = new THREE.IcosahedronGeometry(RADIUS, icoDetail);
>>>>>>> f2fc9085ca39ea746dab4ab9c8d535449b5b5917

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

<<<<<<< HEAD
        // Sample color
        vec3 color = texture2D(colorTexture, vUv).rgb;
        gl_FragColor = vec4(color, 1.0);
=======
        // Realistic earth color from map
        vec3 color = texture2D(colorTexture, vUv).rgb;

        gl_FragColor = vec4(color, alpha);
>>>>>>> f2fc9085ca39ea746dab4ab9c8d535449b5b5917
      }
    `;

    const pointsMat = new THREE.ShaderMaterial({
      uniforms: {
<<<<<<< HEAD
        size: { value: isMobile ? 2.5 : 3.5 },
        colorTexture: { value: dayMap },
        elevTexture: { value: bumpMap },
        alphaTexture: { value: specMap }
=======
        size: { value: isMobile ? 2.8 : 4.5 },
        colorTexture: { value: colorMap },
        elevTexture: { value: elevMap },
        alphaTexture: { value: alphaMap },
>>>>>>> f2fc9085ca39ea746dab4ab9c8d535449b5b5917
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false
    });

    const points = new THREE.Points(pointsGeo, pointsMat);
    globeGroup.add(points);

<<<<<<< HEAD
    // ─── Scroll Journey ──────────────────────────────────────────────────────
    const scrollState = { offX: 0, offY: -H * 0.75, dist: 950 };
    const tl = gsap.timeline({ scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 } });
    tl.to(scrollState, { offX: 0, offY: 0, dist: 1600, duration: 1, ease: "none" })
      .to(scrollState, { offX: -W * 0.25, offY: -H * 0.1, dist: 1400, duration: 1, ease: "none" });

=======
    // 3. Atmosphere fresnel shells
    const makeAtm = (r: number, col: [number, number, number], alpha: number, pw: number, int_ = 1.0) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          col: { value: new THREE.Vector3(...col) },
          alpha: { value: alpha },
          pw: { value: pw },
          intensity: { value: int_ },
        },
        vertexShader: `
          varying vec3 vN; varying vec3 vEye;
          void main() {
            vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vEye = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 col; uniform float alpha, pw, intensity;
          varying vec3 vN; varying vec3 vEye;
          void main() {
            float r = pow(1.0 - abs(dot(vN, vec3(0,0,1))), pw);
            float v = pow(1.0 - max(dot(vN, vEye), 0.0), pw * 0.5);
            gl_FragColor = vec4(col * intensity, r * v * alpha);
          }
        `,
        side: THREE.FrontSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
      });
      globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(r, 64, 64), mat));
    };
    // Atmosphere removed per user request for cleaner look

    // Hemisphere light
    scene.add(new THREE.HemisphereLight(0x4499ff, 0x081020, 2.0));

    // ─── Dot Earth (Particle Layer) ──────────────────────────────────────────
    const dotGeom = new THREE.IcosahedronGeometry(RADIUS + 2, isMobile ? 40 : 80);
    const dotEarthMat = new THREE.PointsMaterial({
      color: 0x111622, // Lighter shade of black (Deep Charcoal/Midnight)
      size: 1.5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    const dotEarth = new THREE.Points(dotGeom, dotEarthMat);
    globeGroup.add(dotEarth);

    // ─── Dynamic Atmosphere Dust (Very Slow Drift) ───────────────────────────
    const dustCount = 100; // Even less
    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustVels = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 6000;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 4000;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      dustVels[i] = 0.05 + Math.random() * 0.15; // Slow drift
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xcccccc,
      size: 1.8,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const dustSystem = new THREE.Points(dustGeom, dustMat);
    scene.add(dustSystem);

    // ─── 3D Shining Stars (Optimized Volume) ─────────────────────────────────
    /**
     * STAR CONFIGURATION:
     * - STAR_COUNT: 10000 to 20000 for a dense galaxy.
     * - DEPTH_MIN / DEPTH_MAX: How far back they are. 
     *    - Deeper (-30000) = slower movement, smaller stars.
     *    - Closer (-5000) = faster parallax, brighter/larger.
     * - VOL_W / VOL_H: The "box" size stars spawn in. 
     *    - Tighten this (e.g. 15000) to make them denser in the center.
     */
    const STAR_COUNT = 10000;
    const DEPTH_MIN = 8000;
    const DEPTH_MAX = 25000;
    const VOL_W = 25000; // Much tighter
    const VOL_H = 15000;  // Much tighter

    const MIN_SIZE = 20.0;
    const MAX_SIZE = 85.0;
    const TWINKLE_SPEED = 1.2;
    const TWINKLE_INTENSITY = 0.5;

    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const starSizes = new Float32Array(STAR_COUNT);
    const starPhases = new Float32Array(STAR_COUNT);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xccddee),
      new THREE.Color(0xffeebb),
      new THREE.Color(0xddeeff),
      new THREE.Color(0xf0e0ff)
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      // Spawning in a tighter volume centered on view
      starPos[i * 3] = (Math.random() - 0.5) * VOL_W;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * VOL_H;
      starPos[i * 3 + 2] = -DEPTH_MIN - Math.random() * (DEPTH_MAX - DEPTH_MIN);

      const c = palette[Math.floor(Math.random() * palette.length)];
      starCol[i * 3] = c.r; starCol[i * 3 + 1] = c.g; starCol[i * 3 + 2] = c.b;
      starSizes[i] = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
      starPhases[i] = Math.random() * Math.PI * 2;
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeom.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    starGeom.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
    starGeom.setAttribute("phase", new THREE.BufferAttribute(starPhases, 1));

    const starShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uTwinkleSpeed: { value: TWINKLE_SPEED },
        uTwinkleIntensity: { value: TWINKLE_INTENSITY }
      },
      vertexShader: `
        attribute float size;
        attribute float phase;
        varying vec3 vColor;
        uniform float time;
        uniform float uTwinkleSpeed;
        uniform float uTwinkleIntensity;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float t = time * uTwinkleSpeed + phase;
          float twinkle = (1.0 - uTwinkleIntensity) + uTwinkleIntensity * sin(t);
          gl_PointSize = size * twinkle * (1000.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Soft radial glow for "shining" look
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          // Falloff for glow: 1.0 at center, 0.0 at edge
          float glow = pow(1.0 - (dist * 2.0), 2.0);
          gl_FragColor = vec4(vColor, glow);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starSystem = new THREE.Points(starGeom, starShaderMat);
    scene.add(starSystem);


    // ─── Space Mist (ambient nebula around globe) ─────────────────────────────
    const smokeGroup = new THREE.Group();
    const smokeStrands: { mesh: THREE.Mesh; phase: number; dir: THREE.Vector3; base: THREE.Vector3 }[] = [];
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(i % 3 === 0 ? 0x00ffaa : i % 3 === 1 ? 0x00c8ff : 0x1a80ff) },
          opacity: { value: 0 },
        },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          uniform float time; uniform vec3 color; uniform float opacity; varying vec2 vUv;
          float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
          float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
          float fbm(vec2 p){float v=0.,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.;a*=.5;}return v;}
          void main(){
            float t=time*0.1;float n=fbm(vec2(vUv.x*1.5-t,vUv.y*3.+t*.2));float n2=fbm(vec2(vUv.y*2.-t*.5,vUv.x*2.5+t));
            float s=smoothstep(.15,.85,n*n2*1.8);float m=smoothstep(0.,.5,1.-length(vUv-.5)*2.);
            gl_FragColor=vec4(color,s*m*opacity);
          }
        `,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3500, 1500), mat);
      const angle = Math.random() * Math.PI * 2;
      const r2 = RADIUS * 5.0 + Math.random() * 2000; // Pushed MUCH further back
      const base = new THREE.Vector3(Math.cos(angle) * r2, (Math.random() - 0.5) * 4000, -3000 - Math.random() * 2000);
      mesh.position.copy(base);
      mesh.rotation.z = Math.random() * Math.PI;
      smokeGroup.add(mesh);
      smokeStrands.push({ mesh, phase: Math.random() * 20, dir: new THREE.Vector3(Math.random() - .5, Math.random() - .5, 0).normalize(), base });
    }
    scene.add(smokeGroup);

    // ─── GSAP Scroll Journey ─────────────────────────────────────────────────
    // We animate screen-space offsets (in pixels) and distance
    const scrollState = {
      offX: 0,
      offY: -H * 0.75, // Start: 80% hidden at bottom
      dist: 950,       // Start: Zoomed in for ~70% width
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    /**
     * GSAP TRANSITION OPTIONS:
     * - "none": Linear mapping. Constant speed 1:1 with scroll. (Best for "consistent" feel)
     * - "power1.inOut": Subtle acceleration at start/end.
     * - "power2.inOut": Moderate acceleration (Standard smooth feel).
     * - "power4.inOut": Aggressive acceleration. Fast in the middle, slow at ends.
     * - "expo.inOut": Extreme acceleration. Very cinematic.
     * - "circ.inOut": Geometric/Circular curve.
     */
    const TRANSITION_EASE = "none";

    // 1. Start -> Middle (50%)
    tl.to(scrollState, {
      offX: 0,
      offY: 0,
      dist: 1600,
      duration: 1,
      ease: TRANSITION_EASE,
    })
      // 2. Middle -> End (100%)
      // Target: Right Corner (centered at ~75% width, 60% height)
      .to(scrollState, {
        offX: -W * 0.25,
        offY: -H * 0.1,
        dist: 1400,
        duration: 1,
        ease: TRANSITION_EASE,
      });

    // ─── Animation Loop ──────────────────────────────────────────────────────
>>>>>>> f2fc9085ca39ea746dab4ab9c8d535449b5b5917
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

<<<<<<< HEAD
      renderer.render(scene, camera);
=======
      // 1. Update rotation
      controls.update();

      // 2. Apply Scroll Journey (Distance + Viewport Offset)
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      camera.position.copy(controls.target).add(dir.multiplyScalar(scrollState.dist));

      // Shift viewport to move globe out of center
      camera.setViewOffset(W, H, scrollState.offX, scrollState.offY, W, H);

      // 3. Dynamic Dust Animation (Linear Drift)
      const positions = dustGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        positions[i * 3] += dustVels[i]; // move right
        if (positions[i * 3] > 3000) {
          positions[i * 3] = -3000; // wrap to left
          positions[i * 3 + 1] = (Math.random() - 0.5) * 4000; // new height
        }
      }
      dustGeom.attributes.position.needsUpdate = true;

      // 4. Star System Subtle Drift
      starSystem.rotation.y += 0.00005;
      starSystem.rotation.z += 0.00003;

      // 5. Keep nebula/smoke oriented to camera
      starShaderMat.uniforms.time.value = t * 0.001;
      smokeStrands.forEach((ss) => ss.mesh.quaternion.copy(camera.quaternion));
      const solar = Math.max(0, Math.sin(t * 0.0003) * 0.8 + 0.2);
      smokeStrands.forEach((ss) => {
        const pulse = Math.sin(t * 0.0005 + ss.phase) * 0.3 + 0.7;
        const m = ss.mesh.material as THREE.ShaderMaterial;
        m.uniforms.time.value = t * 0.001;
        m.uniforms.opacity.value = solar * pulse * 0.35;
        const drift = t * 0.00004;
        ss.mesh.position.x = ss.base.x + ss.dir.x * Math.sin(drift + ss.phase) * 250;
        ss.mesh.position.y = ss.base.y + ss.dir.y * Math.cos(drift + ss.phase) * 250;
        ss.mesh.quaternion.copy(camera.quaternion);
      });

      controls.update(); // damping + autoRotate
      composer.render();
>>>>>>> f2fc9085ca39ea746dab4ab9c8d535449b5b5917
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
<<<<<<< HEAD
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
=======
    <div ref={containerRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 2, pointerEvents: "auto" }}>
      {/* 
        ─── VIGNETTE SETTINGS ──────────────────────────────────────────────────
        - Change 'transparent 50%' to a lower % (e.g. 30%) for a tighter vignette.
        - Change 'rgba(1, 6, 17, 0.9)' to a lower alpha (e.g. 0.5) for a lighter effect.
        - The color '1, 6, 17' matches the deep space background.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, transparent 10%, rgba(1, 6, 17, 0.9) 100%)`,
          zIndex: 10
>>>>>>> f2fc9085ca39ea746dab4ab9c8d535449b5b5917
        }}
      />
    </div>
  );
};

export default EarthCanvas;
