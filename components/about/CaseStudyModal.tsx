"use client";

import React, { useEffect } from "react";
import { useUI } from "@/components/UIContext";
import { getCaseStudy } from "@/lib/content";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X } from "lucide-react";
import gsap from "gsap";

const MOCK_POSTS: Record<string, any> = {
  "enterprise-portfolio": {
    title: "Enterprise Portfolio Platform",
    hook: "Designed a SpaceX/NVIDIA-inspired portfolio platform with mission-control aesthetic, live data, and secure authentication.",
    stack: "n8n, React, Directus, Docker",
    body: "## Overview\nThis project was designed to showcase high-end technical capabilities with a cinematic flair. \n\n### Challenges\n- Real-time data synchronization\n- Glassmorphism at scale\n- Performance optimization for 3D backgrounds\n\n### Solution\nImplementing a robust GSAP-driven animation system and a persistent Three.js globe.",
  },
  "rag-assistant": {
    title: "Self-Hosted RAG Research Assistant",
    hook: "Self-hosted full RAG research assistant on a homelab — private, fast, and grounded in a personal document library.",
    stack: "n8n, Qdrant, Claude API, Docker",
    body: "## Overview\nA private alternative to cloud-based AI assistants, focusing on data sovereignty and speed.",
  },
  "youtube-ingestion": {
    title: "YouTube Knowledge Ingestion Pipeline",
    hook: "Automated the conversion of YouTube videos into structured Obsidian knowledge base entries.",
    stack: "n8n, YouTube API, Obsidian, Python",
    body: "## Overview\nStreamlining knowledge management by automating the extraction of transcripts and metadata.",
  },
  "lead-funnel": {
    title: "AI Lead Qualification Funnel",
    hook: "Built a multi-node AI pipeline that scores, qualifies, and routes inbound leads using custom business logic.",
    stack: "n8n, Claude API, Telegram, PostgreSQL",
    body: "## Overview\nReducing manual overhead by 90% through intelligent lead scoring and automated routing.",
  }
};

export function CaseStudyModal() {
  const { activeCaseStudySlug, setActiveCaseStudySlug } = useUI();
  const modalRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const { data: post, isLoading } = useQuery({
    queryKey: ['case_study', activeCaseStudySlug],
    queryFn: async () => {
      if (!activeCaseStudySlug) return null;
      let data = await getCaseStudy(activeCaseStudySlug);
      if (!data && MOCK_POSTS[activeCaseStudySlug]) {
        data = { ...MOCK_POSTS[activeCaseStudySlug], slug: activeCaseStudySlug };
      }
      return data ?? null;
    },
    enabled: !!activeCaseStudySlug,
  });

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCaseStudySlug(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveCaseStudySlug]);

  // Handle Entrance Animation
  useEffect(() => {
    if (activeCaseStudySlug && modalRef.current && contentRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(contentRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 });
      // Lock body scroll
      document.body.style.overflow = "hidden";
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      // Unlock body scroll
      document.body.style.overflow = "";
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    return () => { 
      document.body.style.overflow = ""; 
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [activeCaseStudySlug]);

  if (!activeCaseStudySlug) return null;

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, { 
        opacity: 0, 
        duration: 0.3, 
        ease: "power2.in",
        onComplete: () => setActiveCaseStudySlug(null)
      });
    } else {
      setActiveCaseStudySlug(null);
    }
  };

  const stack = post && typeof post.stack === 'string' ? post.stack.split(',').map((s: string) => s.trim()) : [];
  const readTime = "5 MIN READ"; // Mocked

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-[500] flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto"
      style={{
        background: 'rgba(1, 6, 17, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={handleClose}
      data-lenis-prevent="true"
    >
      <div 
        ref={contentRef}
        className="w-full max-w-4xl relative glass-panel rounded-[32px] md:rounded-[40px] border-white/10 p-8 md:p-16 my-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 p-3 rounded-full hover:bg-white/5 transition-colors text-white/50 hover:text-white"
          aria-label="Close Case Study"
        >
          <X className="w-6 h-6" />
        </button>

        {isLoading || !post ? (
          <div className="h-[50vh] flex items-center justify-center">
            <span className="text-secondary font-mono text-sm tracking-widest uppercase animate-pulse">Loading_Data...</span>
          </div>
        ) : (
          <>
            <header className="space-y-6 mb-12 pr-12">
              <div className="flex flex-wrap gap-3">
                {stack.map((s: string) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tighter leading-tight text-white uppercase font-sans">
                {post.title}
              </h1>
              <div className="h-[1px] w-24 bg-accent/50 mb-8" />
              <p className="text-base md:text-lg lg:text-xl text-secondary italic font-medium leading-relaxed font-sans">
                "{post.hook}"
              </p>
            </header>

            <div className="prose prose-invert prose-lg max-w-none 
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-headings:uppercase prose-headings:font-sans
              prose-p:text-secondary prose-p:leading-relaxed prose-p:text-body-lg prose-p:font-sans
              prose-strong:text-white prose-strong:font-bold
              prose-ul:list-disc prose-li:text-secondary
              prose-hr:border-white/10
              space-y-12
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.body}
              </ReactMarkdown>
            </div>

            <footer className="mt-24 md:mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between gap-8 font-mono">
              <div className="space-y-2">
                <p className="text-accent-label opacity-30 text-[10px] tracking-widest">WRITTEN_BY</p>
                <p className="text-sm font-bold text-white uppercase">Aldrin Roxas</p>
              </div>
              <div className="space-y-2">
                <p className="text-accent-label opacity-30 text-[10px] tracking-widest">READING_TIME</p>
                <p className="text-sm font-bold text-white uppercase">{readTime}</p>
              </div>
              <div className="space-y-2">
                <p className="text-accent-label opacity-30 text-[10px] tracking-widest">SHARE_SIGNAL</p>
                <div className="flex gap-4 text-accent-label text-accent">
                  <button className="text-sm hover:text-white transition-colors uppercase font-bold">COPY_LINK</button>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
