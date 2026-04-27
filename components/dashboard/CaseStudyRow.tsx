"use client";
import React from 'react';
import Link from 'next/link';
import { ExternalLink, Clock } from 'lucide-react';

interface CaseStudyRowProps {
  caseStudy: {
    id: string;
    slug: string;
    title: string;
    hook: string;
    stack: string;
    date_created: string;
  };
}

export const CaseStudyRow: React.FC<CaseStudyRowProps> = ({ caseStudy }) => {
  return (
    <Link 
      href={`/work/${caseStudy.slug}`}
      className="group block transition-all duration-150"
      style={{
        borderLeft: '2px solid rgba(100, 140, 255, 0.4)',
        padding: '12px 16px 12px 14px',
        marginBottom: '2px',
        textDecoration: 'none'
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-[13px] font-bold leading-tight text-white group-hover:text-accent transition-colors">
          {caseStudy.title}
        </span>
        <ExternalLink size={10} className="text-white/20 group-hover:text-white/40 mt-0.5" />
      </div>
      
      <p className="text-[11px] text-white/50 leading-relaxed mb-3 line-clamp-2">
        {caseStudy.hook}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {caseStudy.stack?.split(',').map((tool: string) => (
          <span 
            key={tool.trim()} 
            className="text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.5 bg-white/5 rounded-[4px] text-white/30 border border-white/5"
          >
            {tool.trim()}
          </span>
        ))}
      </div>
    </Link>
  );
};
