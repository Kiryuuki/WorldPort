"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const FloatingPills: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation
      gsap.to(".pill", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });

      // Entrance
      gsap.from(".pill", {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: 1.5,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-10 left-10 right-10 flex justify-between items-end pointer-events-none z-[2000]">
      <div className="pill pointer-events-auto p-1 glass rounded-full flex items-center gap-4 pr-6 group">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold">
          !
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase opacity-50 group-hover:opacity-100 transition-opacity">
          Don't press
        </span>
      </div>

      <a 
        href="mailto:hello@worldport.space" 
        className="pill pointer-events-auto p-1 glass rounded-full flex items-center gap-4 pr-6 group"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold group-hover:bg-accent transition-colors">
          @
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase opacity-50 group-hover:opacity-100 transition-opacity">
          Let's talk
        </span>
      </a>
    </div>
  );
};

export default FloatingPills;
