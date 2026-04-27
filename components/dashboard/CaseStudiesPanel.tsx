"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CaseStudyRow } from './CaseStudyRow';
import { Briefcase } from 'lucide-react';

async function fetchCaseStudies() {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('Failed to fetch content');
  const data = await res.json();
  return data.caseStudies || [];
}

export const CaseStudiesPanel: React.FC = () => {
  const { data: caseStudies = [], isLoading, isError } = useQuery({
    queryKey: ['case_studies'],
    queryFn: fetchCaseStudies,
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
            // 04 // CASE_STUDIES
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: '#648cff',
              boxShadow: '0 0 6px #648cff',
            }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.15em', fontWeight: 700, color: '#648cff', textTransform: 'uppercase' }}>STABLE</span>
          </div>
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          TOTAL <span style={{ color: 'rgba(255,255,255,0.7)' }}>{caseStudies.length}</span>
        </div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ padding: '12px 16px', borderLeft: '2px solid rgba(255,255,255,0.08)', marginBottom: '2px', opacity: 1 - i * 0.2 }}>
            <div style={{ height: '11px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', width: '75%', marginBottom: '8px' }} />
            <div style={{ height: '9px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', width: '45%' }} />
          </div>
        ))}

        {isError && (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: '#ff3355', fontSize: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={16} style={{ opacity: 0.5 }} />
            FETCH_ERROR: CHECK_CMS
          </div>
        )}

        {!isLoading && !isError && caseStudies.length === 0 && (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '0.1em' }}>
            NO_CASE_STUDIES_FOUND
          </div>
        )}

        {!isLoading && caseStudies.map((cs: any) => (
          <CaseStudyRow key={cs.id} caseStudy={cs} />
        ))}
      </div>
    </div>
  );
};
