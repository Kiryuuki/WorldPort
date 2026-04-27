"use client";
// components/dashboard/FleetPanel.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ServiceRow } from './ServiceRow';
import { ServiceDrawer } from './ServiceDrawer';
import { Activity } from 'lucide-react';

async function fetchUptime() {
  const res = await fetch('/api/uptime');
  if (!res.ok) throw new Error('Uptime fetch failed');
  return res.json();
}

export const FleetPanel: React.FC = () => {
  const [selected, setSelected] = useState<any | null>(null);

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

  const dotColor    = hasOutage ? '#ff3355' : '#00ff88';
  const statusLabel = hasOutage ? 'DEGRADED' : 'NOMINAL';

  return (
    <>
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
        {/* ── Header ─────────────────────────────────────────── */}
        <div
          style={{
            padding:      '20px 20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            flexShrink:   0,
          }}
        >
          {/* Label + live dot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.15em', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              // 03 // FLEET_STATUS
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                backgroundColor: dotColor,
                boxShadow: `0 0 6px ${dotColor}`,
                animation: 'pulse 2s infinite',
              }} />
              <span style={{ fontSize: '9px', letterSpacing: '0.15em', fontWeight: 700, color: dotColor, textTransform: 'uppercase' }}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              SVCS <span style={{ color: 'rgba(255,255,255,0.7)' }}>{total}</span>
            </span>
            <span style={{ fontSize: '10px', color: 'rgba(0,255,136,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              OK <span style={{ color: '#00ff88' }}>{operational}</span>
            </span>
            {outages > 0 && (
              <span style={{ fontSize: '10px', color: 'rgba(255,51,85,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                DOWN <span style={{ color: '#ff3355' }}>{outages}</span>
              </span>
            )}
          </div>
        </div>

        {/* ── List ───────────────────────────────────────────── */}
        <div style={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>
          {isLoading && Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ padding: '10px 16px', borderLeft: '2px solid rgba(255,255,255,0.08)', marginBottom: '2px', opacity: 1 - i * 0.1 }}>
              <div style={{ height: '11px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', width: '55%', marginBottom: '6px' }} />
              <div style={{ height: '9px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', width: '35%' }} />
            </div>
          ))}

          {isError && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: '#ff3355', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ opacity: 0.5 }} />
              FLEET_OFFLINE: CHECK_KUMA
            </div>
          )}

          {!isLoading && !isError && services.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '11px', letterSpacing: '0.1em' }}>
              NO FLEET DATA
            </div>
          )}

          {!isLoading && services.map(service => (
            <ServiceRow
              key={service.id}
              service={service}
              active={selected?.id === service.id}
              onClick={() => setSelected(service)}
            />
          ))}
        </div>
      </div>

      <ServiceDrawer service={selected} onClose={() => setSelected(null)} />
    </>
  );
};
