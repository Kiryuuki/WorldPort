"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CharacterRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export const CharacterReveal: React.FC<CharacterRevealProps> = ({ text, className, delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars = containerRef.current?.querySelectorAll(".char");
    if (!chars) return;

    gsap.from(chars, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
      },
      opacity: 0,
      y: 10,
      rotateX: -90,
      stagger: 0.02,
      duration: 0.6,
      delay,
      ease: "power2.out",
    });
  }, [delay]);

  return (
    <div ref={containerRef} className={`${className} flex flex-wrap`}>
      {text.split("").map((char, i) => (
        <span 
          key={i} 
          className="char inline-block whitespace-pre"
          style={{ perspective: "1000px" }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default CharacterReveal;
