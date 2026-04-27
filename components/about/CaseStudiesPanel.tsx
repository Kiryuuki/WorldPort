import React from "react";
import { Briefcase, Search, Play, GraduationCap, ArrowUpRight } from "lucide-react";
import { CaseStudyCard } from "./CaseStudyCard";
import { CaseStudy } from "@/lib/content";
import Link from "next/link";

interface CaseStudiesPanelProps {
  caseStudies: CaseStudy[];
}

export const CaseStudiesPanel: React.FC<CaseStudiesPanelProps> = ({ caseStudies }) => {
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
      data-lenis-prevent
      className="flex flex-col overflow-hidden"
      style={{
        width: "100%",
        height: "55vh",
        fontFamily: "'JetBrains Mono', monospace",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(24px) saturate(1.4)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
      }}
    >
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] tracking-[0.15em] font-bold text-white/40 uppercase">
            // 04 // CASE_STUDIES
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#648cff]" />
            <span className="text-[9px] tracking-[0.15em] font-bold text-accent uppercase">
              STABLE
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">
            TOTAL <span className="text-white/70">{displayStudies.length}</span>
          </span>
          <Link
            href="/work"
            className="text-[9px] font-bold text-accent uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            VIEW_ALL <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 flex flex-row overflow-x-auto scrollbar-hide">
        {displayStudies.map((study: any) => (
          <div key={study.slug} className="min-w-[350px] border-r border-white/5 h-full">
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
