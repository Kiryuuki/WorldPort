"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CharacterReveal } from "@/components/ui/CharacterReveal";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.fromTo(section, {
          filter: "blur(20px)",
          opacity: 0,
          y: 50,
        }, {
          scrollTrigger: {
            trigger: section,
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
        gsap.to(section, {
          scrollTrigger: {
            trigger: section,
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-40 pb-20 px-6">
      <div className="max-w-3xl mx-auto space-y-32">
        {/* Hero */}
        <section className="reveal-section">
          <span className="text-[10px] uppercase tracking-widest font-bold text-accent">The Full Story</span>
          <CharacterReveal 
            text="I BUILD SIGNAL FROM NOISE." 
            className="text-6xl font-bold mt-4 tracking-tighter"
          />
          <p className="text-2xl text-white/55 mt-8 leading-relaxed">
            I'm Aldrin Roxas, a solo operator and automation architect based in Pasig City, PH. 
            I spend my days (and nights) building systems that solve real problems.
          </p>
        </section>

        {/* Origin */}
        <section className="space-y-8 reveal-section">
          <h2 className="text-3xl font-bold">Origin</h2>
          <div className="space-y-6 text-lg text-white/70 leading-relaxed">
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
        <section className="space-y-8 reveal-section">
          <h2 className="text-3xl font-bold">Philosophy</h2>
          <div className="grid md:grid-cols-2 gap-12 text-white/70">
            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">Solo Operator</h3>
              <p>
                I work alone by choice. It allows for deep focus, rapid iteration, and absolute 
                accountability. When you work with me, you work with *me*.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">Async-First</h3>
              <p>
                Meetings are usually a sign of a broken process. I prioritize asynchronous 
                communication, documentation, and clear project scopes.
              </p>
            </div>
          </div>
        </section>

        {/* Tools I Trust */}
        <section className="space-y-8 reveal-section">
          <h2 className="text-3xl font-bold">Tools I Trust</h2>
          <div className="flex flex-wrap gap-4">
            {["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Three.js", "n8n", "Claude API", "Supabase", "PostgreSQL", "Docker", "GitHub Actions"].map((tool) => (
              <span key={tool} className="px-4 py-2 glass rounded-full text-sm font-medium text-white/70">
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* Honest Section */}
        <section className="p-12 glass rounded-[20px] space-y-6 reveal-section">
          <h2 className="text-3xl font-bold">What I'm Not</h2>
          <ul className="space-y-4 text-lg text-white/70 list-disc list-inside">
            <li>I am not a "digital marketing agency." I am a builder.</li>
            <li>I don't do "consulting" that doesn't end in an implementation.</li>
            <li>I don't follow trends. I follow results.</li>
            <li>I don't build generic solutions. I build bespoke leverage.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
