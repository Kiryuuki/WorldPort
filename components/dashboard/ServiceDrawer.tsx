"use client";
// components/dashboard/ServiceDrawer.tsx
// Slide-in from LEFT — framer-motion | Uptime Kuma status: 1=UP, 0=DOWN

import React, { useEffect, useRef } from 'react';
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
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!service) return null;

  const isUp     = service.status === 1;
  const isDown   = service.status === 0;
  const statusColor = isUp ? 'var(--ok)' : isDown ? 'var(--err)' : 'var(--wrn)';
  const statusLabel = isUp ? 'OPERATIONAL' : isDown ? 'OUTAGE' : 'UNKNOWN';

  const meta = getMeta(service.name) || {
    does:     'Handles homelab infrastructure duties and ensures operational stability.',
    replaces: 'A managed cloud service or manual process.',
  };

  return (
    <AnimatePresence>
      {service && (
        <>
          {/* Removed backdrop to allow selecting other panels */}

          {/* Drawer — slides from LEFT */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-[480px] z-[1200] flex flex-col pointer-events-auto glass-drawer overflow-hidden"
            data-lenis-prevent
            style={{
              fontFamily: "var(--font-mono)",
              borderLeft: "none",
              borderRight: "1px solid var(--border-drawer)",
              boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex-1 overflow-y-auto p-12 text-white space-y-10 panel-scroll">

              {/* What it does */}
              <div className="space-y-3">
                <span className="text-accent-label flex items-center gap-2">
                  <Shield size={10} />// WHAT_IT_DOES
                </span>
                <p className="text-body-lg text-secondary leading-relaxed border-l border-white/10 pl-4">
                  {meta.does}
                </p>
              </div>

              {/* What it replaces */}
              <div className="space-y-3">
                <span className="text-accent-label flex items-center gap-2">
                  <Globe size={10} />// WHAT_IT_REPLACES
                </span>
                <p className="text-body-lg text-secondary leading-relaxed border-l border-white/10 pl-4 italic">
                  {meta.replaces}
                </p>
              </div>

              {/* Stack details */}
              <div className="space-y-4">
                <span className="text-accent-label">// STACK_DETAILS</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'PROTOCOL', value: service.type || 'HTTP' },
                    { label: 'STATUS',   value: statusLabel, color: statusColor },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="block text-label mb-1">{label}</span>
                      <span className="text-body font-bold font-mono" style={color ? { color } : {}}>
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
