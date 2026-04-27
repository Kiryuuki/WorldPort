"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Globe, Lightbulb, Layers, Crosshair } from "lucide-react";
import { AboutInfoStrip } from "./AboutInfoStrip";
import { About } from "@/lib/content";

interface AboutPanelProps {
  about: About | null;
}

// Hero text section — left ~45%, globe fills right via EarthCanvas (no change needed)
// Info strip spans full width at the bottom
// — Dash
export const AboutPanel: React.FC<AboutPanelProps> = ({ about }) => {
  const labelRef  = useRef<HTMLDivElement>(null);
  const h1Ref     = useRef<HTMLHeadingElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);
  const stripRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger: label → h1 → subtitle → cards
      gsap.fromTo(
        [labelRef.current, h1Ref.current, subRef.current],
        { opacity: 0, y: 30, filter: "blur(10px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.4,
        }
      );
      gsap.fromTo(
        stripRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 1.0 }
      );
    });
    return () => ctx.revert();
  }, []);

  const cards = [
    {
      icon: Globe,
      label: "ORIGIN",
      content: about?.bio ||
        "I'm a freelance automation developer who works at the intersection of AI, workflow engineering, and frontend design.",
    },
    {
      icon: Lightbulb,
      label: "PHILOSOPHY",
      content: about?.philosophy ||
        "Automation should feel invisible. The best systems are the ones that quietly do the work — no friction, no manual steps, just outcomes.",
    },
    {
      icon: Layers,
      label: "STACK",
      content: about?.stack ||
        "n8n, Python, Playwright, Claude/OpenAI APIs, Supabase, PostgreSQL, and HeroUI.",
    },
    {
      icon: Crosshair,
      label: "CURRENT FOCUS",
      content: about?.current_focus ||
        "Building an enterprise-grade portfolio platform with an Industrial Enterprise Architecture aesthetic — SpaceX/NVIDIA-inspired, mission-control style.",
    },
  ];

  return (
    // Full height, flex column — hero text on top, strip pinned to bottom
    <div className="flex flex-col justify-between h-full w-full">

      {/* ── Hero Text Zone ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 max-w-[45vw]">
        {/* Accent label */}
        <div ref={labelRef} className="flex items-center gap-3 opacity-0">
          <span
            className="text-[11px] uppercase tracking-[0.25em] font-bold font-mono"
            style={{ color: "rgba(100, 140, 255, 0.9)" }}
          >
            HI, I'M MARK ALDRIN ROXAS
          </span>
          {/* Live dot */}
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "rgba(100,140,255,0.9)", boxShadow: "0 0 8px rgba(100,140,255,0.8)" }}
          />
        </div>

        {/* H1 */}
        <h1
          ref={h1Ref}
          className="font-bold text-white leading-[1.02] tracking-tight opacity-0"
          style={{ fontSize: "clamp(2.4rem, 4.5vw, 5rem)" }}
        >
          I BUILD INTELLIGENT<br />
          SYSTEMS THAT RUN<br />
          THE BUSINESS.
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-[15px] leading-relaxed font-mono opacity-0"
          style={{ color: "rgba(255,255,255,0.5)", maxWidth: "38vw" }}
        >
          I'm a Lead UI/UX Engineer and Automation Architect based in the
          Philippines. I build elegant, self-running pipelines and AI-augmented
          systems using n8n, Python, Playwright, and Claude/OpenAI APIs.
        </p>
      </div>

      {/* ── Info Strip ─────────────────────────────────────────────────── */}
      <div ref={stripRef} className="opacity-0 mt-auto">
        <AboutInfoStrip cards={cards} />
      </div>

    </div>
  );
};
