"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer, RenderPass, UnrealBloomPass } from "three-stdlib";
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 10000);
    camera.position.set(0, 0, 1800);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    container.appendChild(renderer.domElement);

    // --- OrbitControls (Task 7.1) ---
    // pointer-events enabled on canvas so drag works, but we intercept
    // wheel events and pass them through to Lenis for page scroll
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor  = 0.04;
    controls.enableZoom     = false;   // no zoom — keep locked scale
    controls.enablePan      = false;   // no pan — earth stays centered
    controls.autoRotate     = true;
    controls.autoRotateSpeed = isMobile ? 0.2 : 0.3;
    // Limit vertical orbit so earth doesn't flip
    controls.minPolarAngle  = Math.PI * 0.35;
    controls.maxPolarAngle  = Math.PI * 0.65;
    // Forward wheel events to window so Lenis scroll still works
    renderer.domElement.addEventListener("wheel", (e) => {
      window.dispatchEvent(new WheelEvent("wheel", e));
    }, { passive: true });

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.35, 0.5, 0.7));

    const RADIUS = 320;
    const loader = new THREE.TextureLoader();

    // --- Starfield inside Earth scene ---
    const starCount = 8000;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3500 + Math.random() * 2500;
      starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
      starSizes[i] = Math.random() < 0.05 ? Math.random() * 4 + 2 : Math.random() * 2 + 0.2;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: {
        time:       { value: 0 },
        panOffset:  { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform vec2 panOffset;
        varying float vTwinkle;
        float hash(float n) { return fract(sin(n) * 43758.5453); }
        void main() {
          float phase = hash(position.x + position.y);
          vTwinkle = 0.4 + 0.6 * sin(time * (0.8 + phase * 2.0) + phase * 6.28);
          vec3 pos = position;
          float depthFactor = 4000.0 / length(position);
          pos.x += panOffset.x * (4000.0 / 1000.0) * depthFactor;
          pos.y += panOffset.y * (4000.0 / 1000.0) * depthFactor;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * vTwinkle * (800.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vTwinkle;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = (1.0 - d * 2.0) * vTwinkle;
          gl_FragColor = vec4(0.9, 0.95, 1.0, alpha * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const heroStarMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv - 0.5;
          float d = length(uv);
          float core = smoothstep(0.06, 0.0, d);
          float glow = exp(-d * 9.0) * 0.8;
          float flare = (exp(-abs(uv.x) * 45.0) * exp(-abs(uv.y) * 5.0) + 
                         exp(-abs(uv.y) * 45.0) * exp(-abs(uv.x) * 5.0)) * 0.4;
          float pulse = 0.85 + 0.15 * sin(time * 1.5);
          gl_FragColor = vec4(0.9, 0.95, 1.0, (core + glow + flare) * pulse);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const heroStar = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), heroStarMat);
    heroStar.position.set(0, 0, -3000); 
    scene.add(heroStar);

    // --- 1. Earth Base (Day Surface) ---
    const earthBaseMat = new THREE.MeshBasicMaterial({
      map: loader.load("/textures/earth-bg.png"),
      transparent: true,
    });
    const earthBase = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 80, 80), earthBaseMat);
    earthBase.position.set(0, -(RADIUS * 1.6), 0);
    scene.add(earthBase);

    // --- 2. Night Lights ---
    const nightMat = new THREE.ShaderMaterial({
      uniforms: {
        nightMap: { value: null },
        sunDir:   { value: new THREE.Vector3(1.2, 0.4, 1.0).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D nightMap;
        uniform vec3 sunDir;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          float d = dot(vNormal, sunDir);
          float nightFactor = smoothstep(0.2, -0.3, d);
          vec4 lights = texture2D(nightMap, vUv);
          vec3 warmTint = vec3(1.2, 0.85, 0.5);
          gl_FragColor = vec4(lights.rgb * warmTint * 3.5, lights.r * nightFactor);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    loader.load("/textures/earth-bg.png", (t) => { nightMat.uniforms.nightMap.value = t; });

    const nightLayer = new THREE.Mesh(new THREE.SphereGeometry(RADIUS + 0.3, 80, 80), nightMat);
    nightLayer.position.copy(earthBase.position);
    scene.add(nightLayer);

    // --- 3. Cloud Layer ---
    const cloudMat = new THREE.ShaderMaterial({
      uniforms: {
        cloudMap:    { value: null },
        sunDir:      { value: new THREE.Vector3(1.2, 0.4, 1.0).normalize() },
        cloudOffset: { value: new THREE.Vector2(0, 0) },
        cloudDensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D cloudMap;
        uniform vec3 sunDir;
        uniform vec2 cloudOffset;
        uniform float cloudDensity;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          float d = dot(vNormal, sunDir);
          float dayFactor = smoothstep(-0.2, 0.4, d);
          vec2 driftUv = vec2(fract(vUv.x + cloudOffset.x), fract(vUv.y + cloudOffset.y));
          float alpha = texture2D(cloudMap, driftUv).r;
          float baseAlpha = alpha * cloudDensity;
          float cloudOpacity = mix(baseAlpha * 0.05, baseAlpha * 0.45, dayFactor);
          gl_FragColor = vec4(0.95, 0.98, 1.0, cloudOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    loader.load("/textures/2k_earth_clouds.jpg", (t) => { cloudMat.uniforms.cloudMap.value = t; });

    const cloudLayer = new THREE.Mesh(new THREE.SphereGeometry(RADIUS + 6, 80, 80), cloudMat);
    cloudLayer.position.copy(earthBase.position);
    cloudLayer.rotation.x = Math.PI; 
    scene.add(cloudLayer);

    // --- Independent Space Mist ---
    const smokeGroup = new THREE.Group();
    const smokeStrands: { mesh: THREE.Mesh, phase: number, dir: THREE.Vector3, basePos: THREE.Vector3 }[] = [];
    const SMOKE_COUNT = 12;
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(i % 3 === 0 ? 0x00ffaa : (i % 3 === 1 ? 0x00c8ff : 0x20ff80)) },
          opacity: { value: 0 },
        },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          uniform float opacity;
          varying vec2 vUv;
          float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            f = f*f*(3.0-2.0*f);
            return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
          }
          float fbm(vec2 p) {
            float v = 0.0; float a = 0.5;
            for (int i=0; i<4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
            return v;
          }
          void main() {
            vec2 uv = vUv;
            float t = time * 0.1;
            float n = fbm(vec2(uv.x * 1.5 - t, uv.y * 3.0 + t * 0.2));
            float n2 = fbm(vec2(uv.y * 2.0 - t * 0.5, uv.x * 2.5 + t));
            float smoke = smoothstep(0.15, 0.85, n * n2 * 1.8);
            float mask = (1.0 - length(vUv - 0.5) * 2.0);
            mask = smoothstep(0.0, 0.5, mask);
            gl_FragColor = vec4(color, smoke * mask * opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2400, 1000), mat);
      const angle = Math.random() * Math.PI * 2;
      const r = RADIUS * 1.2 + Math.random() * 1200;
      const basePos = new THREE.Vector3(Math.cos(angle) * r, (Math.random() - 0.5) * 1500, -1500 + (Math.random() - 0.5) * 1500);
      mesh.position.copy(basePos);
      mesh.rotation.z = Math.random() * Math.PI;
      smokeGroup.add(mesh);
      smokeStrands.push({ mesh, phase: Math.random() * 20, dir: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, 0).normalize(), basePos });
    }
    smokeGroup.position.copy(earthBase.position);
    scene.add(smokeGroup);

    // --- Atmosphere Layers ---
    const makeAtm = (r: number, col: [number,number,number], alpha: number, pw: number, intensity: number = 1.0) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: { col: { value: new THREE.Vector3(...col) }, alpha: { value: alpha }, pw: { value: pw }, intensity: { value: intensity } },
        vertexShader: `
          varying vec3 vN; varying vec3 vEye;
          void main() { 
            vN = normalize(normalMatrix * normal); 
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vEye = normalize(-mvPosition.xyz);
            gl_Position = projectionMatrix * mvPosition; 
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
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 64), mat);
      m.position.copy(earthBase.position);
      scene.add(m);
      return m;
    };
    const atm1 = makeAtm(RADIUS + 8,   [0.4, 0.9, 1.0], 0.9,  3.5, 1.5);
    const atm2 = makeAtm(RADIUS + 25,  [0.2, 0.6, 1.0], 0.5,  5.0, 1.2);
    const atm3 = makeAtm(RADIUS + 60,  [0.1, 0.4, 0.9], 0.3,  7.0, 1.0);
    const atm4 = makeAtm(RADIUS + 120, [0.05, 0.2, 0.7], 0.15, 9.0, 0.8);

    scene.add(new THREE.AmbientLight(0x0a1428, 1.0));
    const sun = new THREE.DirectionalLight(0xfff0d0, 1.8);
    sun.position.set(900, 300, 700);
    scene.add(sun);

    // --- Point Cloud Dot-Earth Overlay (Task 7.2) ---
    // IcosahedronGeometry for uniform vertex distribution
    // Vertices displaced by earth texture luminance, ocean culled via alpha
    const DETAIL = isMobile ? 6 : 10; // mobile: fewer verts, desktop: rich dots
    const icoGeo = new THREE.IcosahedronGeometry(RADIUS + 1, DETAIL);

    const dotMat = new THREE.ShaderMaterial({
      uniforms: {
        colorMap:  { value: null },   // earth-bg.png — color + land detection
        time:      { value: 0 },
        dotScale:  { value: isMobile ? 0.7 : 1.0 },
      },
      vertexShader: `
        uniform sampler2D colorMap;
        uniform float time;
        uniform float dotScale;
        varying float vVisible;
        varying vec3 vColor;
        varying float vElevation;

        // Equirectangular UV from sphere normal
        vec2 sphereUV(vec3 n) {
          float u = 0.5 + atan(n.z, n.x) / (2.0 * 3.14159265);
          float v = 0.5 - asin(clamp(n.y, -1.0, 1.0)) / 3.14159265;
          return vec2(u, v);
        }

        void main() {
          vec3 n = normalize(position);
          vec2 uv = sphereUV(n);
          vec4 texColor = texture2D(colorMap, uv);

          // Land detection: ocean is blue-dominant, land has more red/green
          float r = texColor.r;
          float g = texColor.g;
          float b = texColor.b;
          float lum = 0.299*r + 0.587*g + 0.114*b;
          // Ocean = blue >> red, Land = more balanced color
          float isOcean = step(0.1, b - r - 0.05) * step(0.05, b - g + 0.02);
          vVisible = 1.0 - isOcean;  // 1 = land, 0 = ocean

          // Elevation from luminance
          vElevation = lum;
          vColor = texColor.rgb;

          // Displace slightly outward on land for relief effect
          vec3 displaced = position + n * (vVisible * lum * 3.0);

          vec4 mvPos = modelViewMatrix * vec4(displaced, 1.0);
          // Point size: base + elevation boost, perspective-correct
          float ptSize = (1.8 + vElevation * 1.2) * dotScale * (400.0 / -mvPos.z);
          gl_PointSize = clamp(ptSize, 0.5, 4.0);
          gl_Position   = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying float vVisible;
        varying vec3 vColor;
        varying float vElevation;

        void main() {
          // Cull ocean dots
          if (vVisible < 0.5) discard;

          // Circular dot shape — discard corners
          vec2 c = gl_PointCoord - 0.5;
          if (dot(c, c) > 0.25) discard;

          // Color: tint toward cyan for coastlines, warm for land
          vec3 col = mix(vColor * 1.4, vec3(0.4, 0.9, 1.0), 0.15);
          float edge = 1.0 - length(c) * 2.0;
          gl_FragColor = vec4(col, edge * 0.65);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Load colorMap — use earth-bg.png (already loaded for earthBaseMat)
    loader.load("/textures/earth-bg.png", (tex) => {
      dotMat.uniforms.colorMap.value = tex;
    });

    const dotMesh = new THREE.Points(icoGeo, dotMat);
    dotMesh.position.copy(earthBase.position);
    scene.add(dotMesh);

    // Movement State
    const moveState = {
      x: 0,
      y: -(RADIUS * 1.6),
      z: 1800,
      tilt: 0
    };

    const TARGET_X = RADIUS * 1.35;
    const TARGET_Y = -(RADIUS * 1.25);
    const TARGET_Z = 1100;

    gsap.to(moveState, {
      x: TARGET_X,
      y: TARGET_Y,
      z: TARGET_Z,
      tilt: 0.3,
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
      onUpdate: () => {
        camera.position.z = moveState.z;
        [earthBase, nightLayer, cloudLayer, smokeGroup, atm1, atm2, atm3, atm4, dotMesh].forEach(obj => {
          obj.position.x = moveState.x;
          obj.position.y = moveState.y;
        });
        earthBase.rotation.x = moveState.tilt;
        nightLayer.rotation.x = moveState.tilt;
        cloudLayer.rotation.x = Math.PI + moveState.tilt;
        dotMesh.rotation.x = moveState.tilt;
        // Update OrbitControls target to follow earth
        controls.target.set(moveState.x, moveState.y, 0);
      }
    });

    // Animation Loop
    const cloudDriftAccum = new THREE.Vector2(0, 0);
    let rafId: number;
    let mobileLastTime = 0;
    const CLOUD_X_DRIFT = 0.00015;
    const CLOUD_Y_DRIFT = 0.00004;
    const fpsLimit = isMobile ? 1000 / 24 : 0;

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      if (fpsLimit > 0) {
        const dt = now - mobileLastTime;
        if (dt < fpsLimit) return;
        mobileLastTime = now - (dt % fpsLimit);
      }

      // When user is dragging, disable auto-rotation and sync earth rotation
      // When idle, OrbitControls.autoRotate handles spin
      controls.update(); // required for damping + autoRotate

      // Sync earth meshes to OrbitControls azimuthal angle
      // Extract rotation from camera position relative to target
      const camDir = new THREE.Vector3().subVectors(camera.position, controls.target);
      const azimuth = Math.atan2(camDir.x, camDir.z);

      earthBase.rotation.y    = azimuth;
      nightLayer.rotation.y   = azimuth;
      dotMesh.rotation.y      = azimuth;
      dotMat.uniforms.time.value = now * 0.001;
      
      cloudLayer.rotation.y = azimuth * 1.05; // slight offset for cloud drift
      cloudDriftAccum.x = (cloudDriftAccum.x + CLOUD_X_DRIFT + Math.sin(now * 0.0005) * 0.00002) % 1.0;
      cloudDriftAccum.y = (cloudDriftAccum.y + CLOUD_Y_DRIFT + Math.cos(now * 0.0003) * 0.00001) % 1.0;
      cloudMat.uniforms.cloudOffset.value = cloudDriftAccum;
      
      const densityT = now * 0.00004; 
      const targetDensity = Math.max(0.15, Math.sin(densityT) * 0.7 + 0.3);
      cloudMat.uniforms.cloudDensity.value = targetDensity;

      starMat.uniforms.panOffset.value.x += 0.005; 
      starMat.uniforms.panOffset.value.y += Math.sin(now * 0.0002) * 0.002;
      starMat.uniforms.time.value = now * 0.001;

      const orbT = now * 0.00008;
      const orbRadius = 4500;
      heroStar.position.x = Math.cos(orbT) * orbRadius;
      heroStar.position.y = Math.sin(orbT * 0.5) * (orbRadius * 0.2);
      heroStar.position.z = -3000 + Math.sin(orbT) * 1000;
      heroStarMat.uniforms.time.value = now * 0.001;

      const solarActivity = Math.max(0, Math.sin(now * 0.0003) * 0.8 + 0.2); 
      smokeStrands.forEach((ss) => {
        const pulse = Math.sin(now * 0.0005 + ss.phase) * 0.3 + 0.7;
        const mat = ss.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.time.value = now * 0.001;
        mat.uniforms.opacity.value = solarActivity * pulse * 0.4;
        const drift = now * 0.00005;
        ss.mesh.position.x = ss.basePos.x + ss.dir.x * Math.sin(drift + ss.phase) * 200;
        ss.mesh.position.y = ss.basePos.y + ss.dir.y * Math.cos(drift + ss.phase) * 200;
        ss.mesh.quaternion.copy(camera.quaternion);
      });
      smokeGroup.rotation.y = now * 0.00003;
      smokeGroup.rotation.z = Math.sin(now * 0.00002) * 0.1;

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
      controls.dispose(); // Task 7.1: cleanup OrbitControls
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // pointer-events: auto so OrbitControls can capture drag events
  // Wheel is forwarded to window so Lenis scroll still works (see setup above)
  return <div ref={containerRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 2, pointerEvents: 'auto', cursor: 'grab' }} />;
};

export default EarthCanvas;
