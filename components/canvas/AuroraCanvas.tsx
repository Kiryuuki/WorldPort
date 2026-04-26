"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { canvasSettings } from "@/lib/canvas-settings";

/**
 * AuroraCanvas — Phase 10: Event-Driven Spacemist
 * — Clouds appear as random events, drifting through space like smoke streams.
 * — Dash
 */

interface SmokeEvent {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  life: number; // 0 to 1
  speed: number;
  dir: THREE.Vector3;
  basePos: THREE.Vector3;
}

export const AuroraCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let W = container.clientWidth;
    let H = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 10000);
    camera.position.set(0, 0, 1600);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const smokeEvents: SmokeEvent[] = [];
    const auroraSettings = canvasSettings.aurora;
    const MAX_SMOKE_CLOUDS = auroraSettings.maxEvents;

    const smokeGeometry = new THREE.PlaneGeometry(3500, 1800);

    const createSmokeCloud = () => {
      if (smokeEvents.length >= MAX_SMOKE_CLOUDS) return;

      const colors = auroraSettings.colors;
      const selectedColor = colors[Math.floor(Math.random() * colors.length)];

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(selectedColor) },
          opacity: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time; uniform vec3 color; uniform float opacity; varying vec2 vUv;
          float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
          float noise(vec2 p){
            vec2 i=floor(p); vec2 f=fract(p);
            f=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
          }
          float fbm(vec2 p){
            float v=0.,a=0.5;
            for(int i=0;i<4;i++){v+=a*noise(p);p*=2.;a*=.5;}
            return v;
          }
          void main(){
            float t=time*0.15;
            float n1=fbm(vec2(vUv.x*1.2 - t, vUv.y*2.5 + t*0.3));
            float n2=fbm(vec2(vUv.y*1.8 - t*0.4, vUv.x*2.2 + t*0.8));
            float s=smoothstep(0.1, 0.9, n1*n2*2.2);
            // Vignette the plane so edges don't hard cut
            float mask = smoothstep(0.0, 0.4, vUv.x) * smoothstep(1.0, 0.6, vUv.x) * 
                         smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
            gl_FragColor = vec4(color, s * mask * opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(smokeGeometry, mat);
      
      // Random trajectory: Start from one side, move to the other
      const side = Math.random() > 0.5 ? -1 : 1; // -1 = Left, 1 = Right
      const startX = side * (W * 1.5);
      const startY = (Math.random() - 0.5) * H * 1.5;
      const startZ = -1500 - Math.random() * 2000;
      
      const basePos = new THREE.Vector3(startX, startY, startZ);
      mesh.position.copy(basePos);
      mesh.rotation.z = Math.random() * Math.PI * 2;
      mesh.scale.setScalar(0.8 + Math.random() * 0.4);

      scene.add(mesh);

      smokeEvents.push({
        mesh,
        material: mat,
        life: 0,
        speed: (0.00015 + Math.random() * 0.00035) * auroraSettings.speedMultiplier, // Slow drift
        dir: new THREE.Vector3(-side, (Math.random() - 0.5) * 0.5, 0).normalize(),
        basePos
      });
    };

    // Scheduler: Trigger a new smoke event periodically
    let nextEventTime = 0;
    const updateScheduler = (t: number) => {
      if (t > nextEventTime) {
        createSmokeCloud();
        // Next event in intervalMin to intervalMax
        nextEventTime = t + auroraSettings.intervalMin + Math.random() * (auroraSettings.intervalMax - auroraSettings.intervalMin);
      }
    };

    let rafId: number;
    const animate = (t: number) => {
      rafId = requestAnimationFrame(animate);
      updateScheduler(t);

      for (let i = smokeEvents.length - 1; i >= 0; i--) {
        const ev = smokeEvents[i];
        ev.life += ev.speed;

        if (ev.life >= 1.0) {
          scene.remove(ev.mesh);
          ev.material.dispose();
          smokeEvents.splice(i, 1);
          continue;
        }

        // Opacity envelope: fade in -> sustain -> fade out
        const opacity = Math.sin(ev.life * Math.PI) * auroraSettings.opacityMultiplier;
        ev.material.uniforms.opacity.value = opacity;
        ev.material.uniforms.time.value = t * 0.001;

        // Move along direction
        const travelDist = 5000; // Total distance traveled over life
        ev.mesh.position.x = ev.basePos.x + ev.dir.x * (ev.life * travelDist);
        ev.mesh.position.y = ev.basePos.y + ev.dir.y * (ev.life * travelDist);
        
        // Billboard toward camera
        ev.mesh.quaternion.copy(camera.quaternion);
      }

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    const onResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      smokeEvents.forEach(ev => {
        ev.material.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default AuroraCanvas;
