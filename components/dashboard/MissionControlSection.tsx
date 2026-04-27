"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WorkflowPanel } from './WorkflowPanel';
import { FleetPanel } from './FleetPanel';

gsap.registerPlugin(ScrollTrigger);

export const MissionControlSection: React.FC = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    const ctx = gsap.context(() => {
      // MASTER TIMELINE: Combined for consistency in both scroll directions
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: '15% top',
          end: '60% top', // End earlier to avoid overlap with Work section (starts at 66%)
          scrub: 1,
        }
      });
      
      // 1. SLIDE IN (mapped from 15% to 30% scroll)
      // Percentage of timeline: (30 - 15) / (60 - 15) = 15 / 45 = 0.33
      masterTl.fromTo(leftRef.current, 
        { x: '-100vw', opacity: 0 }, 
        { x: 0, opacity: 1, ease: 'power2.out', duration: 0.33 }, 
        0
      );
      masterTl.fromTo(rightRef.current, 
        { x: '100vw', opacity: 0 }, 
        { x: 0, opacity: 1, ease: 'power2.out', duration: 0.33 }, 
        0
      );
      
      // 2. WAIT (Stay visible until 50% scroll)
      // Percentage of timeline: (50 - 15) / (45) = 0.77
      const fadeStartTime = 0.77;
      
      // 3. SLIDE OUT (mapped from 50% to 60% scroll)
      // Fading back to original off-screen positions
      masterTl.to(leftRef.current, {
        x: '-100vw',
        opacity: 0, 
        filter: "blur(10px)",
        ease: 'power2.in',
        duration: 1 - fadeStartTime
      }, fadeStartTime);
      
      masterTl.to(rightRef.current, {
        x: '100vw',
        opacity: 0, 
        filter: "blur(10px)",
        ease: 'power2.in',
        duration: 1 - fadeStartTime
      }, fadeStartTime);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-[40]">
      <div className="w-full max-w-[1800px] flex items-center justify-between px-20">
        <div 
          ref={leftRef} 
          className="pointer-events-auto"
          data-lenis-prevent
        >
          <WorkflowPanel />
        </div>

        <div 
          ref={rightRef} 
          className="pointer-events-auto"
          data-lenis-prevent
        >
          <FleetPanel />
        </div>
      </div>
    </div>
  );
};
