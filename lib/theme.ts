// lib/theme.ts
// ─── WORLDPORT DESIGN TOKENS ───────────────────────────────────────────────
// Single source of truth. Import from here. Never hardcode values in components.

export const color = {
  // Base
  bg:           '#010611',     // deep space — body background
  bgPanel:      'rgba(8, 10, 20, 0.82)',   // glass panel fill
  bgPanelDeep:  'rgba(4, 6, 14, 0.92)',   // drawer / modal fill
  bgRow:        'rgba(255, 255, 255, 0.00)', // row default (transparent)
  bgRowHover:   'rgba(255, 255, 255, 0.03)', // row hover state
  bgTag:        'rgba(255, 255, 255, 0.06)', // tag/badge fill

  // Borders
  borderPanel:  'rgba(255, 255, 255, 0.07)',
  borderRow:    'rgba(255, 255, 255, 0.05)',
  borderTag:    'rgba(255, 255, 255, 0.10)',
  borderDrawer: 'rgba(255, 255, 255, 0.08)',

  // Text
  textPrimary:  'rgba(255, 255, 255, 0.92)',
  textSecondary:'rgba(255, 255, 255, 0.55)',
  textMuted:    'rgba(255, 255, 255, 0.30)',
  textLabel:    'rgba(255, 255, 255, 0.40)', // section labels, meta

  // Accent
  accent:       '#6480ff',               // blue-purple, links, highlights
  accentDim:    'rgba(100, 128, 255, 0.15)',

  // Status
  ok:           '#00e676',  // success / operational
  okDim:        'rgba(0, 230, 118, 0.15)',
  err:          '#ff3355',  // error / outage
  errDim:       'rgba(255, 51, 85, 0.15)',
  wrn:          '#ffaa00',  // running / degraded / warning
  wrnDim:       'rgba(255, 170, 0, 0.15)',
  info:         '#6480ff',  // informational
  infoDim:      'rgba(100, 128, 255, 0.15)',
} as const;

export const font = {
  mono:  "'JetBrains Mono', 'Courier New', monospace",
  sans:  "'Space Grotesk', system-ui, sans-serif",
  hero:  "'Bandeins Strange', 'Space Grotesk', sans-serif", // hero h1 only
} as const;

export const size = {
  // Font scale
  label:    '9px',    // section labels, status text — UPPERCASE + tracking
  tag:      '9px',    // stack tags, badges
  meta:     '10px',   // row sub-info, timestamps
  body:     '12px',   // row titles, card body
  bodyLg:   '13px',   // about card body, longer prose
  subhead:  '15px',   // drawer titles, card headings
  heading:  '18px',   // panel sub-headings
  // Tracking
  trackLabel: '0.15em',
  trackTag:   '0.08em',
  trackMeta:  '0.10em',
} as const;

export const space = {
  panelPadH:  '16px',   // panel header horizontal padding
  panelPadV:  '14px',   // panel header vertical padding
  rowPadH:    '14px',   // row horizontal padding
  rowPadV:    '10px',   // row vertical padding
  tagPad:     '2px 6px',
  cardPad:    '20px 24px',
  drawerPad:  '24px',
  gap:        '8px',    // standard row/item gap
  gapLg:     '16px',
} as const;

export const shape = {
  panelRadius: '16px',
  cardRadius:  '12px',
  tagRadius:   '4px',
  btnRadius:   '100px',
  drawerWidth: '380px',
  panelWidth:  '320px',
} as const;

export const glass = {
  // Standard panel glass — use on all floating panels
  panel: `
    background: ${color.bgPanel};
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border: 1px solid ${color.borderPanel};
    border-radius: ${shape.panelRadius};
  `,
  // Deep glass — drawers, modals
  drawer: `
    background: ${color.bgPanelDeep};
    backdrop-filter: blur(32px) saturate(1.5);
    -webkit-backdrop-filter: blur(32px) saturate(1.5);
    border-left: 1px solid ${color.borderDrawer};
  `,
} as const;

// Tailwind class shorthands — use these in className strings
export const tw = {
  labelText:  'text-[9px] uppercase tracking-[0.15em] font-mono',
  tagText:    'text-[9px] uppercase tracking-[0.08em] font-mono',
  metaText:   'text-[10px] tracking-[0.10em] font-mono',
  bodyText:   'text-[12px] font-mono leading-[1.6]',
  bodyLgText: 'text-[13px] font-mono leading-[1.65]',
  panelGlass: 'rounded-[16px] border border-white/[0.07] backdrop-blur-xl',
  rowBase:    'px-[14px] py-[10px] border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors',
  tag:        'text-[9px] uppercase tracking-[0.08em] px-[6px] py-[2px] rounded-[4px] bg-white/[0.06] border border-white/[0.10] font-mono',
} as const;
