"use client";

// EarthCanvas.tsx — Phase 7 v4: Correct drag-interactive vertex globe
// Built by Flash (Claude Sonnet 4.6) | 2026-04-25
//
// KEY ARCHITECTURE FIX vs v3:
//   Globe stays at world origin (0,0,0) — OrbitControls.target = (0,0,0) always
//   Camera offset handles the "horizon at bottom" cinematic look
//   GSAP animates camera.position offset (not globeGroup position) so drag never breaks
//   smokeGroup moves independently (world-space decorative, not interactive)
//
// Interaction: drag to spin, auto-rotates when idle, damping on release

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer, RenderPass, UnrealBloomPass, OrbitControls } from "three-stdlib";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export const EarthCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // ─── Scene / Camera / Renderer ───────────────────────────────────────────
    const scene = new THREE.Scene();

    // Camera starts looking at globe center (0,0,0)
    // Offset Y downward so globe appears anchored at bottom of viewport
    const RADIUS = 420; // bigger than before — fills more of the viewport
    const CAM_Z  = 1600;
    const CAM_Y  = RADIUS * 0.6; // push camera up so globe horizon shows at ~40% from bottom

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 12000);
    camera.position.set(0, CAM_Y, CAM_Z);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.65;
    container.appendChild(renderer.domElement);

    // ─── OrbitControls ───────────────────────────────────────────────────────
    // Target = globe center = world origin
    // GSAP will adjust camera.position.y offset, not the target,
    // so drag always orbits correctly around the globe
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping  = true;
    controls.dampingFactor  = 0.04;
    controls.autoRotate     = true;
    controls.autoRotateSpeed = 0.6;
    controls.enableZoom     = false;
    controls.enablePan      = false;
    controls.minPolarAngle  = Math.PI * 0.2;  // don't let user flip over north pole
    controls.maxPolarAngle  = Math.PI * 0.9;  // don't go under south pole
    if (isMobile) {
      controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };
    }

    // ─── Bloom ───────────────────────────────────────────────────────────────
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.6, 0.4, 0.55));

    const loader = new THREE.TextureLoader();

    // ─── Globe Group — sits at origin ─────────────────────────────────────────
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Dark wireframe base — same as bobbyroe (blocks back-face bleed)
    const wireGeo = new THREE.IcosahedronGeometry(RADIUS, 12);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x080d18, wireframe: true });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // 2. Point cloud — bobbyroe exact shader
    const colorMap = loader.load("/textures/earth-color.jpg");
    const elevMap  = loader.load("/textures/earth-bump.jpg");
    const alphaMap = loader.load("/textures/earth-spec.jpg");

    const icoDetail = isMobile ? 48 : 92;
    const pointsGeo = new THREE.IcosahedronGeometry(RADIUS, icoDetail);

    const vertexShader = `
      uniform float size;
      uniform sampler2D elevTexture;
      varying vec2 vUv;
      varying float vVisible;

      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float elv = texture2D(elevTexture, vUv).r;
        vec3 vNormal = normalMatrix * normal;
        // Front-face: dot(-viewDir, normal) > 0 means facing camera
        vVisible = step(0.0, dot(-normalize(mvPosition.xyz), normalize(vNormal)));
        // Elevation displacement toward camera (bobbyroe: 0.35 at r=1 scale)
        mvPosition.z += 0.35 * elv;
        // Distance-scaled size keeps dots consistent as camera.z changes
        gl_PointSize = size * (700.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform sampler2D colorTexture;
      uniform sampler2D alphaTexture;
      varying vec2 vUv;
      varying float vVisible;

      void main() {
        if (floor(vVisible + 0.1) == 0.0) discard;  // back-face cull
        float alpha = 1.0 - texture2D(alphaTexture, vUv).r; // spec: white=ocean=0
        if (alpha < 0.15) discard; // skip faint ocean edge pixels

        // Circular dot
        vec2 c = gl_PointCoord - 0.5;
        if (dot(c, c) > 0.25) discard;

        // WorldPort cyan tint over rainbow color map
        vec3 raw   = texture2D(colorTexture, vUv).rgb;
        vec3 cyan  = vec3(0.15, 0.72, 1.0);
        vec3 color = mix(raw, cyan, 0.5);

        gl_FragColor = vec4(color, alpha * 0.9);
      }
    `;

    const dotMat = new THREE.ShaderMaterial({
      uniforms: {
        size:         { value: isMobile ? 2.8 : 4.5 },
        colorTexture: { value: colorMap },
        elevTexture:  { value: elevMap },
        alphaTexture: { value: alphaMap },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const dotPoints = new THREE.Points(pointsGeo, dotMat);
    globeGroup.add(dotPoints);

    // 3. Atmosphere fresnel shells
    const makeAtm = (r: number, col: [number,number,number], alpha: number, pw: number, int_ = 1.0) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          col:       { value: new THREE.Vector3(...col) },
          alpha:     { value: alpha },
          pw:        { value: pw },
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
    makeAtm(RADIUS + 10,  [0.3, 0.85, 1.0], 1.0,  3.0, 1.8);
    makeAtm(RADIUS + 30,  [0.15, 0.6, 1.0],  0.6,  4.5, 1.3);
    makeAtm(RADIUS + 70,  [0.08, 0.4, 0.9],  0.35, 6.5, 1.0);
    makeAtm(RADIUS + 140, [0.04, 0.2, 0.7],  0.2,  9.0, 0.8);

    // Hemisphere light — front hemisphere brighter (mimics reference hemiLight)
    scene.add(new THREE.HemisphereLight(0x4499ff, 0x081020, 2.0));

    // ─── Internal Starfield ──────────────────────────────────────────────────
    const starCount = 6000;
    const sPosArr = new Float32Array(starCount * 3);
    const sSzArr  = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r  = 4000 + Math.random() * 3000;
      sPosArr[i*3]   = r * Math.sin(ph) * Math.cos(th);
      sPosArr[i*3+1] = r * Math.sin(ph) * Math.sin(th);
      sPosArr[i*3+2] = r * Math.cos(ph);
      sSzArr[i] = Math.random() < 0.05 ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.3;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPosArr, 3));
    sGeo.setAttribute("size",     new THREE.BufferAttribute(sSzArr, 1));
    const starMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float size; uniform float time; varying float vT;
        float hash(float n) { return fract(sin(n) * 43758.5453); }
        void main() {
          float ph = hash(position.x + position.z);
          vT = 0.4 + 0.6 * sin(time * (0.6 + ph * 1.8) + ph * 6.28);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * vT * (700.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vT;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          if (length(uv) > 0.5) discard;
          gl_FragColor = vec4(0.88, 0.93, 1.0, (1.0 - length(uv)*2.0) * vT * 0.85);
        }
      `,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(sGeo, starMat));

    // ─── Space Mist (ambient nebula around globe) ─────────────────────────────
    const smokeGroup = new THREE.Group();
    const smokeStrands: { mesh: THREE.Mesh; phase: number; dir: THREE.Vector3; base: THREE.Vector3 }[] = [];
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time:    { value: 0 },
          color:   { value: new THREE.Color(i % 3 === 0 ? 0x00ffaa : i % 3 === 1 ? 0x00c8ff : 0x1a80ff) },
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
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2800, 1100), mat);
      const angle = Math.random() * Math.PI * 2;
      const r2 = RADIUS * 1.3 + Math.random() * 1400;
      const base = new THREE.Vector3(Math.cos(angle)*r2, (Math.random()-0.5)*1800, -1500+(Math.random()-0.5)*1500);
      mesh.position.copy(base);
      mesh.rotation.z = Math.random() * Math.PI;
      smokeGroup.add(mesh);
      smokeStrands.push({ mesh, phase: Math.random()*20, dir: new THREE.Vector3(Math.random()-.5, Math.random()-.5, 0).normalize(), base });
    }
    scene.add(smokeGroup);

    // ─── GSAP Scroll: camera Y offset + Z zoom ──────────────────────────────
    // Globe stays at origin — we move the camera around it
    // controls.target always stays at (0,0,0) so drag stays correct
    const camState = { y: CAM_Y, z: CAM_Z };

    gsap.to(camState, {
      y: CAM_Y * 0.3,   // camera drops closer to equator as user scrolls
      z: CAM_Z * 0.75,  // slight zoom in
      scrollTrigger: {
        trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5,
      },
      onUpdate: () => {
        // Preserve OrbitControls spherical offset by updating position delta
        // We shift camera.position.y by the delta, keeping orbital rotation intact
        const dy = camState.y - camera.position.y;
        const dz = camState.z - camera.position.z;
        camera.position.y += dy * 0.1;
        camera.position.z += dz * 0.1;
      },
    });

    // ─── Animation Loop ──────────────────────────────────────────────────────
    let rafId: number;
    let prevTime = 0;
    const fpsLimit = isMobile ? 1000 / 30 : 0;

    const animate = (t: number) => {
      rafId = requestAnimationFrame(animate);
      if (fpsLimit > 0 && t - prevTime < fpsLimit) return;
      prevTime = t;

      starMat.uniforms.time.value = t * 0.001;

      // Space mist drift
      const solar = Math.max(0, Math.sin(t * 0.0003) * 0.8 + 0.2);
      smokeStrands.forEach((ss) => {
        const pulse = Math.sin(t * 0.0005 + ss.phase) * 0.3 + 0.7;
        const m = ss.mesh.material as THREE.ShaderMaterial;
        m.uniforms.time.value    = t * 0.001;
        m.uniforms.opacity.value = solar * pulse * 0.35;
        const drift = t * 0.00004;
        ss.mesh.position.x = ss.base.x + ss.dir.x * Math.sin(drift + ss.phase) * 250;
        ss.mesh.position.y = ss.base.y + ss.dir.y * Math.cos(drift + ss.phase) * 250;
        ss.mesh.quaternion.copy(camera.quaternion);
      });

      controls.update(); // damping + autoRotate
      composer.render();
    };
    rafId = requestAnimationFrame(animate);

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      controls.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 2, pointerEvents: "auto" }}
    />
  );
};

export default EarthCanvas;
