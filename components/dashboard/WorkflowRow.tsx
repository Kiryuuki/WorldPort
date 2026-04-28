"use client";
// components/dashboard/WorkflowRow.tsx

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';

interface WorkflowRowProps {
  execution: {
    id: string;
    execution_id: string;
    workflow_id: string;
    workflow_name: string;
    status: string;
    started_at: string | null;
    duration_ms: number | null;
    mode: string | null;
    node_count: number | null;
    error_message: string | null;
  };
  onClick: () => void;
  active: boolean;
}

export const WorkflowRow: React.FC<WorkflowRowProps> = ({ execution, onClick, active }) => {
  const s = (execution.status || '').toLowerCase();

  const isSuccess = s === 'success';
  const isError   = ['error', 'failed'].includes(s);
  const isRunning = ['running', 'waiting'].includes(s);

  const borderColor = isSuccess ? 'var(--ok)' : isError ? 'var(--err)' : 'var(--wrn)';
  const statusLabel = isSuccess ? 'SUCCESS' : isError ? 'ERROR' : isRunning ? 'RUNNING' : s.toUpperCase();

  const timeAgo = execution.started_at
    ? formatDistanceToNow(new Date(execution.started_at), { addSuffix: false })
        .replace('about ', '')
        .replace(' minutes', 'm').replace(' minute', 'm')
        .replace(' hours', 'h').replace(' hour', 'h')
        .replace(' days', 'd').replace(' day', 'd')
    : '--';

  const durLabel = execution.duration_ms != null
    ? `${(execution.duration_ms / 1000).toFixed(1)}s`
    : '--';

  return (
    <div
      onClick={onClick}
      className={`panel-row group cursor-pointer ${active ? 'bg-white/[0.06]' : ''}`}
      style={{
        borderLeft: `2px solid ${borderColor}`,
      }}
    >
      {/* Workflow name */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-body font-semibold text-white group-hover:text-accent transition-colors uppercase">
          {execution.workflow_name || 'Unknown Workflow'}
        </span>
        <span className="text-meta uppercase text-muted">
          {timeAgo}
        </span>
      </div>

      {/* Status + duration */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {isSuccess && <CheckCircle2 size={11} style={{ color: borderColor }} />}
          {isError   && <XCircle      size={11} style={{ color: borderColor }} />}
          {isRunning && <Loader2      size={11} style={{ color: borderColor }} className="animate-spin" />}
          <span
            className="text-[9px] font-bold tracking-[0.15em] uppercase"
            style={{ color: borderColor }}
          >
            {statusLabel}
          </span>
        </div>

        <span className="text-muted/20 text-[10px]">·</span>

        <span className="text-meta uppercase">
          <span className="opacity-40">DUR </span>
          {durLabel}
        </span>

        {execution.node_count != null && (
          <>
            <span className="text-muted/20 text-[10px]">·</span>
            <span className="text-meta uppercase">
              <span className="opacity-40">NODES </span>
              {execution.node_count}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
