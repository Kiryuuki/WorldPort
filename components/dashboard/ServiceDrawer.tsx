"use client";
// components/dashboard/ServiceDrawer.tsx
// Slide-in from LEFT — framer-motion | Uptime Kuma status: 1=UP, 0=DOWN

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLEET_META } from './fleetMeta';
import { X, Shield, Globe, Server } from 'lucide-react';

interface ServiceDrawerProps {
  service: any | null;
  onClose: () => void;
}

// Normalize Uptime Kuma service name for meta lookup (case-insensitive partial match)
function getMeta(name: string) {
  if (!name) return null;
  const norm = name.toLowerCase().trim();
  const exact = FLEET_META[name] || FLEET_META[norm];
  if (exact) return exact;
  // Partial match
  for (const key of Object.keys(FLEET_META)) {
    if (norm.includes(key.toLowerCase()) || key.toLowerCase().includes(norm)) {
      return FLEET_META[key];
    }
  }
  return null;
}

export const ServiceDrawer: React.FC<ServiceDrawerProps> = ({ service, onClose }) => {
  if (!service) return null;

  const isUp     = service.status === 1;
  const isDown   = service.status === 0;
  const statusColor = isUp ? '#00ff88' : isDown ? '#ff3355' : '#ffaa00';
  const statusLabel = isUp ? 'OPERATIONAL' : isDown ? 'OUTAGE' : 'UNKNOWN';

  const meta = getMeta(service.name) || {
    does:     'Handles homelab infrastructure duties and ensures operational stability.',
    replaces: 'A managed cloud service or manual process.',
  };

  return (
    <AnimatePresence>
      {service && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[190] cursor-pointer pointer-events-auto"
          />

          {/* Drawer — slides from right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[480px] z-[200] flex flex-col overflow-y-auto pointer-events-auto"
            style={{
              fontFamily:     "'JetBrains Mono', monospace",
              background:     'rgba(6,10,22,0.98)',
              backdropFilter: 'blur(32px) saturate(1.4)',
              borderLeft:     '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="p-12 text-white space-y-10">

              {/* Header */}
              <div
                style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'flex-start',
                  borderBottom:   '1px solid rgba(255,255,255,0.05)',
                  paddingBottom:  '24px'
                }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Server size={18} style={{ color: statusColor }} />
                    <h2
                      style={{
                        fontSize:      '22px',
                        fontWeight:    700,
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {service.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase">
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{service.type || 'HTTP'}</span>
                    <span style={{ color: statusColor, fontWeight: 700 }}>● {statusLabel}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-white/50 hover:text-white transition-all bg-white/5 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              {/* What it does */}
              <div className="space-y-3">
                <span className="flex items-center gap-2 text-[10px] text-accent tracking-widest font-bold uppercase opacity-60">
                  <Shield size={10} />// WHAT_IT_DOES
                </span>
                <p className="text-[13px] text-white/70 leading-relaxed border-l border-white/10 pl-4">
                  {meta.does}
                </p>
              </div>

              {/* What it replaces */}
              <div className="space-y-3">
                <span className="flex items-center gap-2 text-[10px] text-accent tracking-widest font-bold uppercase opacity-60">
                  <Globe size={10} />// WHAT_IT_REPLACES
                </span>
                <p className="text-[13px] text-white/70 leading-relaxed border-l border-white/10 pl-4 italic">
                  {meta.replaces}
                </p>
              </div>

              {/* Stack details */}
              <div className="space-y-4">
                <span className="text-[10px] text-accent tracking-widest font-bold uppercase">// STACK_DETAILS</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'PROTOCOL', value: service.type || 'HTTP' },
                    { label: 'STATUS',   value: statusLabel, color: statusColor },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="block text-[9px] text-white/30 tracking-widest uppercase mb-1">{label}</span>
                      <span className="text-xs font-bold font-mono" style={color ? { color } : {}}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
