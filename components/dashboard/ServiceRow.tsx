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

  const borderColor = isUp ? 'var(--ok)' : isDown ? 'var(--err)' : 'var(--wrn)';
  const statusLabel = isUp ? 'OPERATIONAL' : isDown ? 'OUTAGE' : 'UNKNOWN';
  const StatusIcon  = isUp ? CheckCircle2 : isDown ? XCircle : HelpCircle;

  return (
    <div
      onClick={onClick}
      className={`panel-row group cursor-pointer ${active ? 'bg-white/[0.06]' : ''}`}
      style={{
        borderLeft: `2px solid ${borderColor}`,
      }}
    >
      {/* Service name + status pulse */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-body font-semibold text-white group-hover:text-accent transition-colors uppercase">
          {service.name}
        </span>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <span
            className="text-[9px] font-bold tracking-[0.15em] uppercase"
            style={{ color: borderColor }}
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
          <span className="text-meta uppercase">
            {service.type || 'HTTP'}
          </span>
        </div>

        <span className="text-muted/20 text-[10px]">·</span>

        <span className="text-accent-label !text-[8px]">
          NODE_STABLE
        </span>
      </div>
    </div>
  );
};
