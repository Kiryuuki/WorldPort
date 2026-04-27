"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CharacterReveal } from "@/components/ui/CharacterReveal";
import { AboutPanel } from "./AboutPanel";
import { CaseStudiesPanel } from "./CaseStudiesPanel";
import { FooterPanel } from "./FooterPanel";
import { About, CaseStudy } from "@/lib/content";

interface AboutContentProps {
  about: About | null;
  caseStudies: CaseStudy[];
}

export const AboutContent: React.FC<AboutContentProps> = ({ about, caseStudies }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Single entrance animation for all panels
      gsap.from(".animate-panel", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-28 pb-12 px-6 md:px-12 space-y-12 max-w-[1400px] mx-auto">
      {/* Top Section: Hero & About Panel (Left-aligned area) */}
      <div className="flex flex-col lg:flex-row items-start gap-12">
        <div className="w-full lg:max-w-[55vw] space-y-12">
          {/* Hero text area */}
          <section className="animate-panel">
            <span className="text-[10px] uppercase tracking-widest font-bold text-accent">
              The Full Story
            </span>
            <CharacterReveal
              text="I BUILD SIGNAL FROM NOISE."
              className="text-5xl md:text-6xl font-bold mt-4 tracking-tighter"
            />
            <p className="text-xl md:text-2xl text-white/55 mt-6 leading-relaxed max-w-2xl">
              I'm Aldrin Roxas, a solo operator and automation architect based in Pasig City, PH.
              I spend my days (and nights) building systems that solve real problems.
            </p>
          </section>

          {/* About Me 2x2 Grid Panel */}
          <section className="animate-panel">
            <AboutPanel about={about} />
          </section>
        </div>

        {/* Right side is intentionally left relatively empty for the Earth Canvas 
            which is positioned via layout.tsx / EarthCanvas.tsx */}
        <div className="hidden lg:block lg:flex-1" />
      </div>

      {/* Full Width Sections below the fold */}
      <section className="animate-panel w-full">
        <CaseStudiesPanel caseStudies={caseStudies} />
      </section>

      <section className="animate-panel w-full">
        <FooterPanel />
      </section>
    </div>
  );
};
