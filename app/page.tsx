"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { MissionControlSection } from "@/components/dashboard/MissionControlSection";

const HomeContent = dynamic(() => import("@/components/HomeContent"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const whoAmIRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero Animations
    const ctx = gsap.context(() => {
      gsap.from(".hero-title-mask span", {
        y: "110%",
        opacity: 0,
        filter: "blur(20px)",
        duration: 2,
        ease: "power4.out",
        stagger: 0.1,
      });

      gsap.from(".hero-subtitle, .hero-ctas", {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        duration: 1.5,
        delay: 1,
        ease: "power3.out",
      });

      // Phase 1: Scroll-linked fade out of Hero (0 - 33.3%)
      gsap.to(".hero-title-mask, .hero-subtitle, .hero-ctas", {
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "25% top", // Fade out slightly earlier so it's gone by the time globe is center
          scrub: true,
        },
        opacity: 0,
        y: -100,
        ease: "power2.in",
      });

      gsap.from(".scroll-indicator", {
        opacity: 0,
        duration: 1,
        delay: 1.5,
      });

      // Phase 3: Work/About Section Fade-in (66.6% - 100%)
      gsap.fromTo(".work-about-placeholder", {
        opacity: 0,
        y: 100,
        filter: "blur(20px)",
      }, {
        scrollTrigger: {
          trigger: document.body,
          start: "66.6% top",
          end: "75% top", // Become fully visible as globe reaches corner
          scrub: true,
        },
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "power2.out",
      });
      
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="min-h-[400vh] w-full flex flex-col items-center">
      {/* PHASE 1: HERO */}
      <div className="h-screen w-full flex flex-col items-center justify-center px-6 fixed top-0 pointer-events-none z-10">
        <h1 className="hero-title-mask text-[14vw] font-bold tracking-tighter leading-none text-center select-none overflow-hidden py-4 pointer-events-auto">
          <span className="block">WORLDPORT</span>
        </h1>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
      
      {/* PHASE 2: MISSION CONTROL */}
      <MissionControlSection />

      {/* PHASE 3: WORK / ABOUT SECTIONS */}
      <div className="work-about-placeholder fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-30">
        <div className="w-full max-w-[1800px] flex flex-col md:flex-row items-center justify-between px-20">
          {/* Left Column for Content */}
          <div className="w-full md:w-1/2 space-y-16 max-h-[80vh] overflow-y-auto pointer-events-auto pr-8 scrollbar-hide pt-[20vh] pb-[20vh] mask-fade-y">
            <React.Suspense fallback={<div className="text-white/20 animate-pulse font-mono text-[10px]">RETR_DATA...</div>}>
              <HomeContent />
            </React.Suspense>
          </div>
          {/* Right Column (Empty for Earth) */}
          <div className="hidden md:block md:w-1/2" />
        </div>
      </div>

    </section>
  );
}
