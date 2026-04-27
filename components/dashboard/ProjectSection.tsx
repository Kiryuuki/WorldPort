"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuery } from '@tanstack/react-query';
import { AboutPanel } from '../about/AboutPanel';
import { CaseStudiesPanel } from '../about/CaseStudiesPanel';
import { FooterPanel } from '../about/FooterPanel';

gsap.registerPlugin(ScrollTrigger);

async function fetchContent() {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('Failed to fetch content');
  return await res.json();
}

export const ProjectSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['home_content'],
    queryFn: fetchContent,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(containerRef.current, { 
        autoAlpha: 0, 
        y: 40,
        filter: 'blur(10px)'
      });

      // Show section when scroll reaches Phase 3
      ScrollTrigger.create({
        trigger: 'body',
        start: '65% top', // Start right as MissionControl finishes
        end: '95% top',
        onEnter: () => {
          gsap.to(containerRef.current, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out'
          });
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, {
            autoAlpha: 0,
            y: 40,
            filter: 'blur(10px)',
            duration: 0.8,
            ease: 'power3.in'
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-[50] pointer-events-none"
      style={{ visibility: 'hidden' }} // Controlled by GSAP autoAlpha
    >
      <div className="w-full h-full flex flex-col justify-end pb-12 pointer-events-none">
        {/* Case Studies Area */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pointer-events-none mb-8">
          <div className="w-full pointer-events-auto">
            <CaseStudiesPanel caseStudies={data?.caseStudies || []} />
          </div>
        </div>

        {/* Full-Width Footer */}
        <div className="w-full px-6 md:px-12 pointer-events-auto">
          <FooterPanel />
        </div>
      </div>
    </div>
  );
};

