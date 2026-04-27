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

  const borderColor = isSuccess ? '#00ff88' : isError ? '#ff3355' : '#ffaa00';
  const statusColor = isSuccess ? '#00ff88' : isError ? '#ff3355' : '#ffaa00';
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
      className="group cursor-pointer transition-all duration-150"
      style={{
        borderLeft: `2px solid ${borderColor}`,
        backgroundColor: active ? 'rgba(255,255,255,0.06)' : 'transparent',
        padding: '10px 16px 10px 14px',
        marginBottom: '2px',
      }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.03)';
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
      }}
    >
      {/* Workflow name */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <span
          className="text-[13px] font-semibold leading-tight text-white group-hover:text-white transition-colors"
          style={{ fontFamily: 'inherit', letterSpacing: '0.01em' }}
        >
          {execution.workflow_name || 'Unknown Workflow'}
        </span>
        <span
          className="text-[10px] shrink-0 mt-0.5"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'inherit', letterSpacing: '0.08em' }}
        >
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
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: statusColor }}
          >
            {statusLabel}
          </span>
        </div>

        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>·</span>

        <span
          className="text-[10px] uppercase tracking-wider"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>DUR </span>
          {durLabel}
        </span>

        {execution.node_count != null && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>·</span>
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>NODES </span>
              {execution.node_count}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
