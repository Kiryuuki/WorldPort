"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import gsap from "gsap";
import { useRouter } from "next/navigation";

interface Project {
  slug: string;
  title: string;
}

export const UniverseCanvas: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 400, 800);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Sun (Core)
    const sunGeometry = new THREE.SphereGeometry(40, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planets (Projects)
    const planets: THREE.Group[] = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    projects.forEach((project, i) => {
      const orbitGroup = new THREE.Group();
      const distance = 150 + i * 100;
      
      const planetGeometry = new THREE.SphereGeometry(15, 32, 32);
      const planetMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color().setHSL(i / projects.length, 0.7, 0.5),
        emissive: new THREE.Color().setHSL(i / projects.length, 0.7, 0.2),
      });
      
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.x = distance;
      planet.userData = { slug: project.slug, title: project.title };
      
      orbitGroup.add(planet);
      
      // Orbit Ring
      const ringGeometry = new THREE.RingGeometry(distance - 0.5, distance + 0.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      
      scene.add(orbitGroup);
      planets.push(orbitGroup);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    scene.add(pointLight);

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const planet = intersects.find(obj => obj.object.userData.slug);
      if (planet) {
        router.push(`/work/${planet.object.userData.slug}`);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    const animate = () => {
      planets.forEach((p, i) => {
        p.rotation.y += 0.005 / (i + 1);
      });

      // Raycasting for hover state
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const hovered = intersects.find(obj => obj.object.userData.title);
      if (hovered) {
        setSelectedProject(hovered.object.userData.title);
      } else {
        setSelectedProject(null);
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      container.removeChild(renderer.domElement);
    };
  }, [projects, router]);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-pointer">
      {selectedProject && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none glass px-6 py-3 rounded-full">
          <span className="text-sm font-bold tracking-widest uppercase">{selectedProject}</span>
        </div>
      )}
    </div>
  );
};

export default UniverseCanvas;
