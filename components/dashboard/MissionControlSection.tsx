"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WorkflowPanel } from './WorkflowPanel';
import { FleetPanel } from './FleetPanel';

gsap.registerPlugin(ScrollTrigger);

interface MissionControlSectionProps {
  onSelectWorkflow: (exec: any) => void;
  onSelectService: (service: any) => void;
}

export const MissionControlSection: React.FC<MissionControlSectionProps> = ({ onSelectWorkflow, onSelectService }) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set([leftRef.current, rightRef.current], { autoAlpha: 0 });

      // MASTER TIMELINE: Combined for consistency in both scroll directions
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: 'body',
          start: '15% top',
          end: '60% top', 
          scrub: 1,
        }
      });
      
      // 1. SLIDE IN (mapped from 15% to 30% scroll)
      masterTl.fromTo(leftRef.current, 
        { x: '-100vw', autoAlpha: 0 }, 
        { x: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.33 }, 
        0
      );
      masterTl.fromTo(rightRef.current, 
        { x: '100vw', autoAlpha: 0 }, 
        { x: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.33 }, 
        0
      );
      
      // 2. WAIT (Stay visible until 50% scroll)
      const fadeStartTime = 0.77;
      
      // 3. SLIDE OUT (mapped from 50% to 60% scroll)
      masterTl.to(leftRef.current, {
        x: '-100vw',
        autoAlpha: 0, 
        filter: "blur(10px)",
        ease: 'power2.in',
        duration: 1 - fadeStartTime
      }, fadeStartTime);
      
      masterTl.to(rightRef.current, {
        x: '100vw',
        autoAlpha: 0, 
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
          <WorkflowPanel onSelect={onSelectWorkflow} />
        </div>

        <div 
          ref={rightRef} 
          className="pointer-events-auto"
          data-lenis-prevent
        >
          <FleetPanel onSelect={onSelectService} />
        </div>
      </div>
    </div>
  );
};
