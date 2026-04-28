"use client";
// components/dashboard/FleetPanel.tsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ServiceRow } from './ServiceRow';
import { Activity } from 'lucide-react';

async function fetchUptime() {
  const res = await fetch('/api/uptime');
  if (!res.ok) throw new Error('Uptime fetch failed');
  return res.json();
}

interface FleetPanelProps {
  onSelect: (service: any) => void;
}

export const FleetPanel: React.FC<FleetPanelProps> = ({ onSelect }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey:        ['uptime'],
    queryFn:         fetchUptime,
    refetchInterval: 30_000,
    staleTime:       25_000,
  });

  const services: any[] = data?.monitors || [];
  const total       = services.length;
  const operational = services.filter(m => m.status === 1).length;
  const outages     = services.filter(m => m.status === 0).length;
  const hasOutage   = outages > 0;

  const statusColor    = hasOutage ? 'var(--err)' : 'var(--ok)';
  const statusLabel = hasOutage ? 'DEGRADED' : 'NOMINAL';

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
            // 03 // FLEET_STATUS
          </span>
          <div className="flex items-center gap-2">
            <div 
              className={`status-dot ${hasOutage ? 'err' : 'ok'} animate-pulse`} 
              style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
            />
            <span className="text-accent-label" style={{ color: statusColor }}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4">
          <span className="text-meta uppercase">
            SVCS <span style={{ color: 'var(--text-primary)' }}>{total}</span>
          </span>
          <span className="text-meta uppercase" style={{ color: 'var(--ok)' }}>
            OK <span className="font-bold">{operational}</span>
          </span>
          {outages > 0 && (
            <span className="text-meta uppercase" style={{ color: 'var(--err)' }}>
              DOWN <span className="font-bold">{outages}</span>
            </span>
          )}
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────── */}
      <div className="panel-scroll flex-1">
        {isLoading && Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="panel-row border-l-2 border-white/5 opacity-50">
            <div className="h-3 bg-white/5 rounded w-1/2 mb-2" />
            <div className="h-2 bg-white/5 rounded w-1/4" />
          </div>
        ))}

        {isError && (
          <div className="p-6 text-center text-err text-[11px] flex flex-col items-center gap-2">
            <Activity size={16} className="opacity-50" />
            FLEET_OFFLINE: CHECK_KUMA
          </div>
        )}

        {!isLoading && !isError && services.length === 0 && (
          <div className="p-6 text-center text-muted text-[11px] tracking-widest">
            NO FLEET DATA
          </div>
        )}

        {!isLoading && services.map(service => (
          <ServiceRow
            key={service.id}
            service={service}
            active={false}
            onClick={() => onSelect(service)}
          />
        ))}
      </div>
    </div>
  );
};
