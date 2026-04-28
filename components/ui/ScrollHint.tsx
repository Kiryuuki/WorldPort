// components/ui/ScrollHint.tsx
'use client';
import { useEffect, useState } from 'react';

export function ScrollHint() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const fn = () => { if (window.scrollY > 100) setHidden(true); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{
      position: 'absolute', bottom: '32px', left: '50%',
      transform: 'translateX(-50%)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', gap: '8px',
      opacity: hidden ? 0 : 1, transition: 'opacity 0.4s ease',
      pointerEvents: 'none', zIndex: 10,
    }}>
      <span style={{
        fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.35)',
      }}>SCROLL</span>
      <div style={{
        width: '1px', height: '40px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)',
        animation: 'scrollPulse 1.8s ease-in-out infinite',
      }} />
    </div>
  );
}
