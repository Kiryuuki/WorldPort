import React from "react";
import { LucideIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

interface CaseStudyCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
  slug: string;
  isProduction?: boolean;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  icon: Icon,
  title,
  description,
  tags,
  slug,
  isProduction = true,
}) => {
  return (
    <div className="group p-6 h-full hover:bg-white/[0.02] transition-all duration-300 flex flex-col font-mono">
      <div className="flex justify-between items-start mb-6">
        <Icon className="w-4 h-4 text-accent/50 group-hover:text-accent transition-colors" />
        {isProduction && (
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-green-400" />
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">
              PRODUCTION
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-[11px] text-white/40 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[8px] font-bold px-1.5 py-0.5 bg-white/5 border border-white/5 rounded-[2px] text-white/40 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/work/${slug}`}
          className="inline-flex items-center gap-2 text-[10px] font-bold text-accent/70 hover:text-accent transition-colors"
        >
          VIEW_CASE_STUDY
          <ExternalLink className="w-2.5 h-2.5" />
        </Link>
      </div>
    </div>
  );
};

