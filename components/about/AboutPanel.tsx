"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Globe, Lightbulb, Layers, Crosshair } from "lucide-react";
import { AboutInfoStrip } from "./AboutInfoStrip";
import { useUI } from "@/components/UIContext";
import { ArrowRight } from "lucide-react";
import { About } from "@/lib/content";

interface AboutPanelProps {
  about: About | null;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({ about }) => {
  const { setContactOpen } = useUI();
  const labelRef  = useRef<HTMLDivElement>(null);
  const h1Ref     = useRef<HTMLHeadingElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);
  const btnRef    = useRef<HTMLButtonElement>(null);
  const stripRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger: label → h1 → subtitle → button → cards
      gsap.fromTo(
        [labelRef.current, h1Ref.current, subRef.current, btnRef.current],
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
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 1.2 }
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
          <span className="text-accent-label font-bold text-[11px]">
            HI, I'M MARK ALDRIN ROXAS
          </span>
          {/* Live dot */}
          <span className="status-dot ok animate-pulse" />
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
          style={{ color: "rgba(255, 255, 255, 0.72)", maxWidth: "38vw" }}
        >
          I'm a Lead UI/UX Engineer and Automation Architect based in the
          Philippines. I build elegant, self-running pipelines and AI-augmented
          systems using n8n, Python, Playwright, and Claude/OpenAI APIs.
        </p>

        {/* Let's Connect Button */}
        <button
          ref={btnRef}
          onClick={() => setContactOpen(true)}
          className="group flex items-center gap-4 bg-accent text-[#010611] px-8 py-4 rounded-xl font-bold tracking-[0.15em] text-xs w-fit opacity-0 hover:bg-white transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(100,128,255,0.2)]"
        >
          LET'S_CONNECT
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ── Info Strip ─────────────────────────────────────────────────── */}
      <div ref={stripRef} className="opacity-0 mt-auto">
        <AboutInfoStrip cards={cards} />
      </div>

    </div>
  );
};
