"use client";
// components/dashboard/WorkflowPanel.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WorkflowRow } from './WorkflowRow';
import { WorkflowDrawer } from './WorkflowDrawer';
import { Search, Activity } from 'lucide-react';

async function fetchExecutions(search: string) {
  const params = new URLSearchParams({ page: '1', page_size: '20' });
  if (search) params.set('workflow_name', search);
  const res = await fetch(`/api/executions?${params}`);
  if (!res.ok) throw new Error('Failed to fetch executions');
  return res.json();
}

interface WorkflowPanelProps {
  onSelect: (exec: any) => void;
}

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ onSelect }) => {
  const [search, setSearch]     = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey:        ['executions', search],
    queryFn:         () => fetchExecutions(search),
    refetchInterval: 30_000,
    staleTime:       25_000,
  });

  const executions: any[] = data?.data || [];
  const globalStats       = data?.global_stats;

  return (
    <div
      data-lenis-prevent
      className="glass-panel flex flex-col overflow-hidden"
      style={{
        width: 'var(--panel-w, 320px)',
        height: '72vh',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="panel-header">
        {/* Label + live dot */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-accent-label">
            // 02 // AUTOMATION_OPS
          </span>
          <div className="flex items-center gap-2">
            <div className="status-dot ok animate-pulse" />
            <span className="text-accent-label">LIVE</span>
          </div>
        </div>

        {/* Stats row */}
        {globalStats && (
          <div className="flex gap-4 mb-3">
            <span className="text-meta uppercase">
              TOTAL <span style={{ color: 'var(--text-primary)' }}>{globalStats.total}</span>
            </span>
            <span className="text-meta uppercase" style={{ color: 'var(--ok)' }}>
              OK <span className="font-bold">{globalStats.success}</span>
            </span>
            <span className="text-meta uppercase" style={{ color: 'var(--err)' }}>
              ERR <span className="font-bold">{globalStats.error}</span>
            </span>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="SEARCH_NODE..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-[11px] text-white font-mono tracking-wider outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────── */}
      <div className="panel-scroll flex-1">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="panel-row border-l-2 border-white/5 opacity-50">
            <div className="h-3 bg-white/5 rounded w-2/3 mb-2" />
            <div className="h-2 bg-white/5 rounded w-1/3" />
          </div>
        ))}

        {isError && (
          <div className="p-6 text-center text-err text-[11px] flex flex-col items-center gap-2">
            <Activity size={16} className="opacity-50" />
            SYNC_FAILURE: CHECK_API
          </div>
        )}

        {!isLoading && !isError && executions.length === 0 && (
          <div className="p-6 text-center text-muted text-[11px] tracking-widest">
            NO EXECUTIONS FOUND
          </div>
        )}

        {!isLoading && executions.map(exec => (
          <WorkflowRow
            key={exec.id}
            execution={exec}
            active={false}
            onClick={() => onSelect(exec)}
          />
        ))}
      </div>
    </div>
  );
};
