"use client";
// components/dashboard/WorkflowDrawer.tsx
// Slide-in from RIGHT — framer-motion
// Parses workflow_data.nodes for step graph
// Fetches full execution_data on open (heavy JSON, lazy load)

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORKFLOW_META } from './workflowMeta';
import { CheckCircle2, XCircle, Clock, Activity, X, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowDrawerProps {
  execution: any | null;
  onClose: () => void;
}

// Resolve node execution status from runData
function getNodeStatus(nodeName: string, runData: Record<string, any>): 'success' | 'error' | 'skipped' {
  if (!runData) return 'skipped';
  const nodeRun = runData[nodeName];
  if (!nodeRun) return 'skipped';
  const status = nodeRun[0]?.executionStatus || '';
  if (status === 'error') return 'error';
  if (status === 'success') return 'success';
  return 'success'; // ran = success unless explicitly error
}

export const WorkflowDrawer: React.FC<WorkflowDrawerProps> = ({ execution, onClose }) => {
  const [fullExec, setFullExec] = useState<any | null>(null);
  const [loading,  setLoading]  = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lazy-fetch full execution_data when drawer opens
  useEffect(() => {
    if (!execution?.id) { setFullExec(null); return; }
    setLoading(true);
    fetch(`/api/executions/${execution.id}`)
      .then(r => r.json())
      .then(d => { setFullExec(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [execution?.id]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!execution) return null;

  const meta = WORKFLOW_META[execution.workflow_name] || {
    does:   'Executes a multi-step automation process connecting APIs, data sources, and messaging channels.',
    solves: 'Eliminates manual operational tasks to reclaim time and build leverage.',
  };

  const isSuccess = execution.status === 'success';
  const isError   = execution.status === 'error';
  const statusColor = isSuccess ? 'var(--ok)' : isError ? 'var(--err)' : 'var(--wrn)';

  // Parse nodes from the lightweight workflow_data (always available)
  let nodes: any[] = [];
  try {
    const wd = typeof execution.workflow_data === 'string'
      ? JSON.parse(execution.workflow_data)
      : execution.workflow_data;
    nodes = wd?.nodes || [];
  } catch (_) {}

  // Parse runData from fullExec (lazy loaded)
  let runData: Record<string, any> = {};
  try {
    const ed = typeof fullExec?.execution_data === 'string'
      ? JSON.parse(fullExec.execution_data)
      : fullExec?.execution_data;
    runData = ed?.runData || {};
  } catch (_) {}

  const timeAgo = execution.started_at
    ? formatDistanceToNow(new Date(execution.started_at), { addSuffix: true })
    : '--';

  return (
    <AnimatePresence>
      {execution && (
        <>
          {/* Removed backdrop to allow selecting other panels */}
          
          {/* Drawer — slides from RIGHT */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[480px] z-[1200] flex flex-col pointer-events-auto glass-drawer overflow-hidden"
            data-lenis-prevent
            style={{
              fontFamily: "var(--font-mono)",
              borderRight: "none",
              borderLeft: "1px solid var(--border-drawer)",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex-1 overflow-y-auto p-12 text-white space-y-10 panel-scroll">

              {/* What it does */}
              <div className="space-y-3">
                <span className="text-accent-label">
                  // WHAT_THIS_WORKFLOW_DOES
                </span>
                <p className="text-body-lg text-secondary leading-relaxed border-l border-white/10 pl-4">
                  {meta.does}
                </p>
              </div>

              {/* What it solves */}
              <div className="space-y-3">
                <span className="text-accent-label">
                  // WHAT_IT_SOLVES
                </span>
                <p className="text-body-lg text-secondary leading-relaxed border-l border-white/10 pl-4 italic">
                  {meta.solves}
                </p>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 border-y border-white/10 py-4">
                {[
                  { label: 'STARTED',  value: timeAgo,                          icon: <Clock size={10} /> },
                  { label: 'LATENCY',  value: `${execution.duration_ms || 0}ms`,icon: <Zap size={10} /> },
                  { label: 'NODES',    value: String(execution.node_count || nodes.length || '?'), icon: <Activity size={10} /> },
                  { label: 'MODE',     value: (execution.mode || 'trigger').toUpperCase(), icon: null },
                ].map(({ label, value, icon }) => (
                  <div key={label}>
                    <span className="flex items-center gap-1 text-label mb-1">
                      {icon}{label}
                    </span>
                    <span className="text-body text-white/80 font-mono">{value}</span>
                  </div>
                ))}
              </div>

              {/* Execution process graph */}
              <div className="space-y-4">
                <span className="text-accent-label">
                  // EXECUTION_PROCESS
                </span>

                {loading && (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
                    ))}
                  </div>
                )}

                {!loading && nodes.length === 0 && (
                  <div className="flex items-center gap-2 text-muted text-xs border border-white/5 p-3 rounded">
                    <Activity size={14} />
                    Node graph unavailable
                  </div>
                )}

                {!loading && nodes.length > 0 && (
                  <div className="pl-1">
                    {nodes.map((node, i) => {
                      const nodeStatus = getNodeStatus(node.name, runData);
                      const isNodeErr  = nodeStatus === 'error';
                      const isNodeOk   = nodeStatus === 'success';
                      const nodeColor  = isNodeErr ? 'var(--err)' : isNodeOk ? 'var(--ok)' : 'rgba(255,255,255,0.2)';

                      return (
                        <div key={i} className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-1.5 rounded-full z-10 shrink-0">
                              {isNodeErr
                                ? <XCircle size={12} color="var(--err)" />
                                : <CheckCircle2 size={12} color={isNodeOk ? 'var(--ok)' : 'var(--text-muted)'} />
                              }
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs text-white/80 uppercase truncate font-bold">
                                {node.name}
                              </span>
                              <span className="text-meta truncate">
                                {node.type?.split('.').pop()?.replace(/([a-z])([A-Z])/g,'$1 $2')}
                              </span>
                            </div>
                          </div>
                          {i < nodes.length - 1 && (
                            <div className="h-5 w-px bg-white/10 ml-[11px] my-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isError && execution.error_message && (
                  <div className="text-meta text-err bg-err/5 border border-err/20 p-3 rounded-lg font-mono leading-relaxed">
                    <span className="text-[10px] text-err opacity-60 block mb-1 uppercase tracking-widest">Error</span>
                    {execution.error_message.slice(0, 200)}
                    {execution.error_message.length > 200 && '...'}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
