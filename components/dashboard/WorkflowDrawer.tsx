"use client";
// components/dashboard/WorkflowDrawer.tsx
// Slide-in from RIGHT — framer-motion
// Parses workflow_data.nodes for step graph
// Fetches full execution_data on open (heavy JSON, lazy load)

import React, { useEffect, useState } from 'react';
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

  // Lazy-fetch full execution_data when drawer opens
  useEffect(() => {
    if (!execution?.id) { setFullExec(null); return; }
    setLoading(true);
    fetch(`/api/executions/${execution.id}`)
      .then(r => r.json())
      .then(d => { setFullExec(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [execution?.id]);

  if (!execution) return null;

  const meta = WORKFLOW_META[execution.workflow_name] || {
    does:   'Executes a multi-step automation process connecting APIs, data sources, and messaging channels.',
    solves: 'Eliminates manual operational tasks to reclaim time and build leverage.',
  };

  const isSuccess = execution.status === 'success';
  const isError   = execution.status === 'error';
  const statusColor = isSuccess ? '#00ff88' : isError ? '#ff3355' : '#ffaa00';

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[190] cursor-pointer"
          />

          {/* Drawer — slides from left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-[480px] z-[200] flex flex-col overflow-y-auto"
            style={{
              fontFamily:     "'JetBrains Mono', monospace",
              background:     'rgba(6,10,22,0.98)',
              backdropFilter: 'blur(32px) saturate(1.4)',
              borderRight:    '1px solid rgba(255,255,255,0.07)',
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
                  <h2
                    style={{
                      fontSize:      '22px',
                      fontWeight:    700,
                      letterSpacing: '-0.02em',
                      marginBottom:  '8px'
                    }}
                  >
                    {execution.workflow_name}
                  </h2>
                  <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase">
                    <span style={{ color: statusColor, fontWeight: 700 }}>● {execution.status}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>ID // {execution.execution_id?.slice(0, 8)}</span>
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
                <span className="text-[10px] text-accent tracking-widest font-bold uppercase opacity-60">
                  // WHAT_THIS_WORKFLOW_DOES
                </span>
                <p className="text-[13px] text-white/70 leading-relaxed border-l border-white/10 pl-4">
                  {meta.does}
                </p>
              </div>

              {/* What it solves */}
              <div className="space-y-3">
                <span className="text-[10px] text-accent tracking-widest font-bold uppercase opacity-60">
                  // WHAT_IT_SOLVES
                </span>
                <p className="text-[13px] text-white/70 leading-relaxed border-l border-white/10 pl-4 italic">
                  {meta.solves}
                </p>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 border-y border-white/10 py-4 text-xs">
                {[
                  { label: 'STARTED',  value: timeAgo,                          icon: <Clock size={10} /> },
                  { label: 'LATENCY',  value: `${execution.duration_ms || 0}ms`,icon: <Zap size={10} /> },
                  { label: 'NODES',    value: String(execution.node_count || nodes.length || '?'), icon: <Activity size={10} /> },
                  { label: 'MODE',     value: (execution.mode || 'trigger').toUpperCase(), icon: null },
                ].map(({ label, value, icon }) => (
                  <div key={label}>
                    <span className="flex items-center gap-1 text-[10px] text-white/30 tracking-widest uppercase mb-1">
                      {icon}{label}
                    </span>
                    <span className="text-white/80 font-mono">{value}</span>
                  </div>
                ))}
              </div>

              {/* Execution process graph */}
              <div className="space-y-4">
                <span className="text-[10px] text-accent tracking-widest font-bold uppercase">
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
                  <div className="flex items-center gap-2 text-white/30 text-xs border border-white/5 p-3 rounded">
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
                      const nodeColor  = isNodeErr ? '#ff3355' : isNodeOk ? '#00ff88' : '#ffffff40';

                      return (
                        <div key={i} className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-1.5 rounded-full z-10 shrink-0">
                              {isNodeErr
                                ? <XCircle size={12} color="#ff3355" />
                                : <CheckCircle2 size={12} color={nodeColor} />
                              }
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs text-white/80 uppercase truncate font-bold">
                                {node.name}
                              </span>
                              <span className="text-[10px] text-white/30 truncate">
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
                  <div className="text-[11px] text-[#ff3355] bg-[#ff3355]/5 border border-[#ff3355]/20 p-3 rounded-lg font-mono leading-relaxed">
                    <span className="text-[10px] text-[#ff3355]/60 block mb-1 uppercase tracking-widest">Error</span>
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
