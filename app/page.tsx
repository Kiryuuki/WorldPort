"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

      // Scroll-linked fade out
      gsap.to(".hero-title-mask, .hero-subtitle, .hero-ctas", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "50% top",
          scrub: true,
        },
        opacity: 0,
        y: -50,
        ease: "none",
      });

      gsap.from(".scroll-indicator", {
        opacity: 0,
        duration: 1,
        delay: 1.5,
      });

      // Section Reveals with Dynamic Blur
      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
        gsap.fromTo(el, {
          filter: "blur(20px)",
          opacity: 0,
          y: 50,
        }, {
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 50%",
            scrub: true,
          },
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          ease: "none",
        });

        // Fade out blur as it leaves center
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 40%",
            end: "top top",
            scrub: true,
          },
          filter: "blur(20px)",
          opacity: 0,
          y: -50,
          ease: "none",
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="min-h-[200vh] w-full flex flex-col items-center">
      <div className="h-screen w-full flex flex-col items-center justify-center px-6">
        <h1 className="hero-title-mask text-[14vw] font-bold tracking-tighter leading-none text-center select-none overflow-hidden py-4">
          <span className="block">WORLDPORT</span>
        </h1>
        <p className="hero-subtitle mt-4 text-[10px] uppercase tracking-[0.4em] text-white/40 max-w-xl text-center font-bold">
          One person · Floating in space · Building signal from noise
        </p>
        <div className="hero-ctas mt-16 flex items-center gap-6">
          <Link href="/work" className="px-10 py-4 glass rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-background transition-all">
            See my work
          </Link>
          <Link href="/about" className="px-10 py-4 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-all">
            Read my story
          </Link>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
      
      <div ref={whoAmIRef} id="about-section" className="min-h-[300vh] w-full pt-40 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row">
          {/* Left Column for Content */}
          <div className="w-full md:w-1/2 space-y-32">
            {/* Origin */}
            <section className="reveal-text space-y-8">
              <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Origin</span>
              <h2 className="text-4xl font-bold mt-2">I BUILD SIGNAL FROM NOISE.</h2>
              <div className="space-y-6 text-xl text-white/70 leading-relaxed font-medium">
                <p>
                  I didn't start with a degree in computer science. I started with a frustration. 
                  A frustration with manual, repetitive tasks that stole time from creative work.
                </p>
                <p>
                  The first automation I ever built was a simple script to organize my files. 
                  It wasn't elegant, but it worked. And in that moment, I realized that I could build 
                  leverage. One person could suddenly do the work of ten.
                </p>
              </div>
            </section>

            {/* Philosophy */}
            <section className="reveal-text space-y-8">
              <h2 className="text-3xl font-bold">PHILOSOPHY</h2>
              <div className="grid gap-12 text-white/70">
                <div className="space-y-4">
                  <h3 className="text-white font-bold uppercase tracking-widest text-xs">Solo Operator</h3>
                  <p className="text-lg">
                    I work alone by choice. It allows for deep focus, rapid iteration, and absolute 
                    accountability. When you work with me, you work with *me*.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-white font-bold uppercase tracking-widest text-xs">Async-First</h3>
                  <p className="text-lg">
                    Meetings are usually a sign of a broken process. I prioritize asynchronous 
                    communication, documentation, and clear project scopes.
                  </p>
                </div>
              </div>
            </section>

            {/* Tools I Trust */}
            <section className="reveal-text space-y-8">
              <h2 className="text-3xl font-bold">TOOLS I TRUST</h2>
              <div className="flex flex-wrap gap-4">
                {["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Three.js", "n8n", "Claude API", "Supabase", "PostgreSQL", "Docker", "GitHub Actions"].map((tool) => (
                  <span key={tool} className="px-4 py-2 glass rounded-full text-sm font-medium text-white/70">
                    {tool}
                  </span>
                ))}
              </div>
            </section>

            {/* What I'm Not */}
            <section className="reveal-text p-12 glass rounded-[20px] space-y-6">
              <h2 className="text-3xl font-bold text-accent">WHAT I'M NOT</h2>
              <ul className="space-y-4 text-lg text-white/70 list-none font-medium italic">
                <li>· Not a "digital marketing agency." I am a builder.</li>
                <li>· Don't do "consulting" that doesn't end in implementation.</li>
                <li>· Don't follow trends. I follow results.</li>
                <li>· Don't build generic solutions. I build bespoke leverage.</li>
              </ul>
            </section>
          </div>

          {/* Right Column (Empty for Earth) */}
          <div className="hidden md:block md:w-1/2" />
        </div>
      </div>
    </section>
  );
}
