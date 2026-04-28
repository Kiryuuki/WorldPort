"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from '@tanstack/react-query';
import dynamic from "next/dynamic";
import { MissionControlSection } from "@/components/dashboard/MissionControlSection";
import { ProjectSection } from "@/components/dashboard/ProjectSection";
import { AboutPanel } from "@/components/about/AboutPanel";
import { ScrollHint } from "@/components/ui/ScrollHint";

gsap.registerPlugin(ScrollTrigger);

async function fetchContent() {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('Failed to fetch content');
  return await res.json();
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const { data } = useQuery({
    queryKey: ['home_content'],
    queryFn: fetchContent,
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Phase 1: Scroll-linked fade out of Hero (0 - 15%)
      // Using fromTo for explicit state management to ensure it always returns to full opacity at top.
      gsap.fromTo(heroContentRef.current, 
        { opacity: 1, y: 0, filter: "blur(0px)" },
        {
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "15% top", 
            scrub: true,
            invalidateOnRefresh: true,
          },
          opacity: 0,
          y: -50,
          filter: "blur(10px)",
          ease: "none",
        }
      );
      
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const [selectedWorkflow, setSelectedWorkflow] = React.useState<any>(null);
  const [selectedService, setSelectedService] = React.useState<any>(null);

  return (
    <section ref={heroRef} className="min-h-[400vh] w-full flex flex-col items-center">
      {/* PHASE 1: HERO (About Content) */}
      <div id="hero" className="h-screen w-full flex items-stretch px-6 md:px-20 fixed top-0 pointer-events-none z-10 pt-24 pb-8">
        <div ref={heroContentRef} className="w-full max-w-[1400px] mx-auto pointer-events-none flex flex-col justify-between">
          <div className="w-full pointer-events-auto flex flex-col h-full">
            <AboutPanel about={data?.about || null} />
            <ScrollHint />
          </div>
        </div>
      </div>
      
      {/* PHASE 2: MISSION CONTROL */}
      <div id="dashboard" className="w-full">
        <MissionControlSection onSelectWorkflow={setSelectedWorkflow} onSelectService={setSelectedService} />
      </div>

      {/* PHASE 3: WORK SECTIONS */}
      <div id="projects" className="w-full">
        <ProjectSection />
      </div>

      {/* GLOBAL OVERLAYS (Drawers) */}
      <WorkflowDrawer execution={selectedWorkflow} onClose={() => setSelectedWorkflow(null)} />
      <ServiceDrawer service={selectedService} onClose={() => setSelectedService(null)} />

    </section>
  );
}

// Dynamically import drawers to avoid hydration issues
const WorkflowDrawer = dynamic(() => import('@/components/dashboard/WorkflowDrawer').then(mod => mod.WorkflowDrawer), { ssr: false });
const ServiceDrawer = dynamic(() => import('@/components/dashboard/ServiceDrawer').then(mod => mod.ServiceDrawer), { ssr: false });

