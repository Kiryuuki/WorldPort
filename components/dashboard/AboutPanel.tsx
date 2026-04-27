"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User } from 'lucide-react';

async function fetchAbout() {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('Failed to fetch content');
  const data = await res.json();
  return data.about || null;
}

export const AboutPanel: React.FC = () => {
  const { data: about, isLoading, isError } = useQuery({
    queryKey: ['about_content'],
    queryFn: fetchAbout,
  });

  return (
    <div
      data-lenis-prevent
      style={{
        width:          '340px',
        height:         '72vh',
        display:        'flex',
        flexDirection:  'column',
        fontFamily:     "'JetBrains Mono', monospace",
        background:     'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        border:         '1px solid rgba(255,255,255,0.07)',
        borderRadius:   '16px',
        overflow:       'hidden',
      }}
    >
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
            // 05 // ABOUT_ME
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: '#648cff',
              boxShadow: '0 0 6px #648cff',
            }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', fontWeight: 700, color: '#648cff', textTransform: 'uppercase' }}>RETR_SUCCESS</span>
          </div>
        </div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '20px', scrollbarWidth: 'none' }} className="scrollbar-hide">
        {isLoading && (
          <div className="space-y-4">
            <div style={{ height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', width: '90%' }} />
            <div style={{ height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', width: '80%' }} />
            <div style={{ height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', width: '85%' }} />
          </div>
        )}

        {isError && (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#ff3355', fontSize: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <User size={16} style={{ opacity: 0.5 }} />
            ABOUT_FETCH_FAILURE
          </div>
        )}

        {!isLoading && !isError && about && (
          <div className="space-y-10">
            <section className="space-y-4">
              <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">ORIGIN</h3>
              <div className="text-[12px] text-white/70 leading-relaxed prose prose-invert prose-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {about.whoiam_section || about.bio || "NO_DATA"}
                </ReactMarkdown>
              </div>
            </section>

            {about.philosophy && (
              <section className="space-y-4">
                <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">PHILOSOPHY</h3>
                <div className="text-[12px] text-white/70 leading-relaxed prose prose-invert prose-xs">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.philosophy}</ReactMarkdown>
                </div>
              </section>
            )}

            {about.current_focus && (
              <section className="space-y-4">
                <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">CURRENT FOCUS</h3>
                <div className="text-[12px] text-white/70 leading-relaxed prose prose-invert prose-xs">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.current_focus}</ReactMarkdown>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
