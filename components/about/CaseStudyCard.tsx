import React from "react";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <div 
      className="panel-row group h-full flex flex-col cursor-pointer outline-none"
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/case-studies/${slug}`)}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/case-studies/${slug}`)}
      style={{ 
        fontFamily: 'var(--font-mono)',
        borderLeft: '2px solid rgba(100,128,255,0.3)',
        position: 'relative'
      }}
    >
      <div className="flex justify-between items-start mb-6">
        <Icon className="w-4 h-4 text-accent/50 group-hover:text-accent transition-colors" />
        <div className="flex items-center gap-3">
          {isProduction && (
            <div className="flex items-center gap-1.5">
              <div className="status-dot ok" />
              <span className="tag border-none bg-transparent p-0">PRODUCTION</span>
            </div>
          )}
          <span className="card-arrow text-[11px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-meta text-secondary leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

