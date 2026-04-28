// components/nav/WordmarkLogo.tsx
import Link from 'next/link';

export function WordmarkLogo() {
  return (
    <Link href="/" style={{
      position: 'fixed',
      top: '20px',
      left: '24px',
      zIndex: 30,
      fontFamily: 'var(--font-hero)',
      fontSize: '18px',
      color: 'rgba(255,255,255,0.92)',
      textDecoration: 'none',
      letterSpacing: '-0.02em',
    }}>
      WP.
    </Link>
  );
}
