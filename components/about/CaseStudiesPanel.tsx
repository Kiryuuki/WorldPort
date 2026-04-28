import React, { useEffect, useRef } from "react";
import { Briefcase, Search, Play, GraduationCap, ArrowUpRight } from "lucide-react";
import { CaseStudyCard } from "./CaseStudyCard";
import { CaseStudy } from "@/lib/content";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CaseStudiesPanelProps {
  caseStudies: CaseStudy[];
}

export const CaseStudiesPanel: React.FC<CaseStudiesPanelProps> = ({ caseStudies }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;

    gsap.fromTo(panelRef.current,
      { y: 40, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: { 
          trigger: panelRef.current, 
          start: 'top 85%', 
          once: true 
        } 
      }
    );
  }, []);
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("portfolio") || t.includes("enterprise")) return Briefcase;
    if (t.includes("rag") || t.includes("research") || t.includes("search")) return Search;
    if (t.includes("youtube") || t.includes("video") || t.includes("ingestion")) return Play;
    return GraduationCap;
  };

  const displayStudies = caseStudies.length > 0 ? caseStudies : [
    {
      title: "Enterprise Portfolio Platform",
      hook: "Designed a SpaceX/NVIDIA-inspired portfolio platform with mission-control aesthetic, live data, and secure authentication.",
      stack: "n8n, React, Directus, Docker",
      slug: "enterprise-portfolio",
    },
    {
      title: "Self-Hosted RAG Research Assistant",
      hook: "Self-hosted full RAG research assistant on a homelab — private, fast, and grounded in a personal document library.",
      stack: "n8n, Qdrant, Claude API, Docker",
      slug: "rag-assistant",
    },
    {
      title: "YouTube Knowledge Ingestion Pipeline",
      hook: "Automated the conversion of YouTube videos into structured Obsidian knowledge base entries — transcript, wiki page out.",
      stack: "n8n, YouTube API, Obsidian, Python",
      slug: "youtube-ingestion",
    },
    {
      title: "AI Lead Qualification Funnel",
      hook: "Built a multi-node AI pipeline that scores, qualifies, and routes inbound leads using custom business logic.",
      stack: "n8n, Claude API, Telegram, PostgreSQL",
      slug: "lead-funnel",
    },
  ];

  return (
    <div
      ref={panelRef}
      data-lenis-prevent
      className="glass-panel flex flex-col overflow-hidden"
      style={{
        width: "100%",
        height: "55vh",
        fontFamily: "var(--font-mono)",
        background: "rgba(8, 10, 20, 0.88)",
      }}
    >
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center justify-between mb-4">
          <span className="text-accent-label">
            // 04 // CASE_STUDIES
          </span>
          <div className="flex items-center gap-2">
            <div className="status-dot ok shadow-[0_0_6px_var(--accent)]" style={{ background: 'var(--accent)' }} />
            <span className="text-accent-label" style={{ color: 'var(--accent)' }}>
              STABLE
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-meta opacity-60">
            TOTAL <span className="text-white">{displayStudies.length}</span>
          </span>
          <Link
            href="/case-studies"
            className="text-accent-label text-accent flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            VIEW_ALL <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* List */}
      <div 
        className="flex-1 grid grid-cols-[repeat(4,minmax(280px,1fr))] overflow-x-auto scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}} />
        {displayStudies.map((study: any) => (
          <div key={study.slug} className="border-r border-white/5 h-full">
            <CaseStudyCard
              icon={getIcon(study.title)}
              title={study.title}
              description={study.hook}
              tags={study.stack.split(",").map((s: string) => s.trim())}
              slug={study.slug}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
