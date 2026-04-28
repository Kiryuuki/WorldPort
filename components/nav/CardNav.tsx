// components/nav/CardNav.tsx
// Adapted from reactbits.dev/components/card-nav
// Floating pill nav — replaces GlassNav
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '#hero',      label: 'HOME' },
  { href: '#dashboard', label: 'DASHBOARD' },
  { href: '#projects',  label: 'CASE STUDIES' },
];

export function CardNav() {
  const pathname = usePathname();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 8px',
        background: 'rgba(8, 10, 20, 0.85)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '100px',
      }}
    >
      {NAV_LINKS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <a
            key={href}
            href={href}
            onClick={(e) => handleScroll(e, href)}
            style={{
              padding: '7px 16px',
              borderRadius: '100px',
              fontSize: '10px',
              letterSpacing: '0.12em',
              fontFamily: 'var(--font-mono)',
              fontWeight: 400,
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
              background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
              color: 'rgba(255,255,255,0.92)',
              opacity: active ? 1 : 0.45,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
            className="hover:opacity-100"
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}
