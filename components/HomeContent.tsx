"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function HomeContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("HomeContent fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white/20 animate-pulse font-mono text-[10px]">RETR_DATA...</div>;
  if (!data) return null;

  const { caseStudies, about } = data;

  return (
    <>
      {/* WORK SECTION */}
      <section className="reveal-text space-y-10 w-full font-mono">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">
            // 04 // CASE_STUDIES
          </span>
          <div className="h-[1px] flex-grow bg-white/5"></div>
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight text-white mb-8 uppercase">I BUILD LEVERAGE.</h2>
        
        {!caseStudies || caseStudies.length === 0 ? (
           <p className="text-white/20 italic text-xs tracking-wider">NO_DATA_AVAILABLE</p>
        ) : (
          <div className="grid gap-4 mt-8">
            {caseStudies.map((cs: any) => (
              <Link 
                key={cs.id} 
                href={`/work/${cs.slug}`}
                className="group block transition-all duration-200"
                style={{
                  background:     'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(24px) saturate(1.4)',
                  border:         '1px solid rgba(255,255,255,0.07)',
                  borderRadius:   '16px',
                  padding:        '24px',
                  fontFamily:     "'JetBrains Mono', monospace"
                }}
              >
                <div className="flex flex-col space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[15px] font-bold text-white group-hover:text-white transition-colors leading-tight">
                      {cs.title}
                    </h3>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Read</span>
                  </div>
                  
                  <p className="text-[13px] text-white/60 leading-relaxed font-medium">
                    {cs.hook}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {cs.stack?.split(',').map((tool: string) => (
                      <span 
                        key={tool.trim()} 
                        className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-white/5 rounded text-white/40 border border-white/5 transition-colors group-hover:border-white/10"
                      >
                        {tool.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ABOUT SECTION */}
      {about && (
        <section className="reveal-text space-y-16 w-full pt-24 font-mono">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">
                // 05 // WHO_I_AM
              </span>
              <div className="h-[1px] flex-grow bg-white/5"></div>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6 uppercase">ORIGIN</h2>
            <div className="text-[14px] text-white/70 leading-relaxed max-w-none border-l border-white/10 pl-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {about.whoiam_section || about.bio || "Data not available."}
              </ReactMarkdown>
            </div>
          </div>

          {about.philosophy && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-6 uppercase">PHILOSOPHY</h2>
              <div className="text-[14px] text-white/70 leading-relaxed max-w-none border-l border-white/10 pl-5">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.philosophy}</ReactMarkdown>
              </div>
            </div>
          )}

          {about.current_focus && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-6 uppercase">CURRENT FOCUS</h2>
              <div className="text-[14px] text-white/70 leading-relaxed max-w-none border-l border-white/10 pl-5">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.current_focus}</ReactMarkdown>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
