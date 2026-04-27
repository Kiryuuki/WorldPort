"use client";
// components/dashboard/ServiceRow.tsx
// Uptime Kuma monitor: status 1=UP, 0=DOWN, null=unknown

import React from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface ServiceRowProps {
  service: {
    id: string;
    name: string;
    status: 1 | 0 | null;
    type: string;
    active: boolean;
  };
  onClick: () => void;
  active: boolean;
}

export const ServiceRow: React.FC<ServiceRowProps> = ({ service, onClick, active }) => {
  const isUp      = service.status === 1;
  const isDown    = service.status === 0;
  const isUnknown = service.status === null;

  const borderColor = isUp ? '#00ff88' : isDown ? '#ff3355' : '#ffaa00';
  const statusColor = isUp ? '#00ff88' : isDown ? '#ff3355' : '#ffaa00';
  const statusLabel = isUp ? 'OPERATIONAL' : isDown ? 'OUTAGE' : 'UNKNOWN';
  const StatusIcon  = isUp ? CheckCircle2 : isDown ? XCircle : HelpCircle;

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
      {/* Service name + status pulse */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <span
          className="text-[13px] font-semibold leading-tight text-white group-hover:text-white transition-colors uppercase"
          style={{ fontFamily: 'inherit', letterSpacing: '0.01em' }}
        >
          {service.name}
        </span>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: statusColor }}
          >
            {statusLabel}
          </span>
          <div
            className={`w-1.5 h-1.5 rounded-full ${!isUp ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: borderColor,
              boxShadow: `0 0 5px ${borderColor}`
            }}
          />
        </div>
      </div>

      {/* Type + metadata */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <StatusIcon size={11} style={{ color: borderColor }} />
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            {service.type || 'HTTP'}
          </span>
        </div>

        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>·</span>

        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px' }}
        >
          NODE_STABLE
        </span>
      </div>
    </div>
  );
};
