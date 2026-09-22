import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LINKS = [
  { href: '#hero',     label: 'Home'     },
  { href: '#about',    label: 'About'    },
  { href: '#services', label: 'Services' },
  { href: '#contact',  label: 'Contact'  },
];

const R_OUTER = 72;
const R_INNER = 52;
const R_TEXT  = 88;
const TICKS   = 48;
const CX = 110;
const CY = 110;
const SIZE = 220;

export default function HeroDial() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    gsap.to(outerRef.current, { rotation: 360, duration: 40, ease: 'none', repeat: -1, transformOrigin: `${CX}px ${CY}px` });
    gsap.to(innerRef.current, { rotation: -360, duration: 28, ease: 'none', repeat: -1, transformOrigin: `${CX}px ${CY}px` });
  }, []);

  const ticks = Array.from({ length: TICKS }, (_, i) => {
    const angle = (i / TICKS) * Math.PI * 2;
    const isMajor = i % 6 === 0;
    const rIn  = isMajor ? R_INNER - 8 : R_INNER + 4;
    const rOut = R_OUTER;
    return {
      x1: CX + Math.cos(angle) * rIn,
      y1: CY + Math.sin(angle) * rIn,
      x2: CX + Math.cos(angle) * rOut,
      y2: CY + Math.sin(angle) * rOut,
      opacity: isMajor ? 0.55 : 0.2,
      strokeWidth: isMajor ? 0.8 : 0.5,
    };
  });

  const innerTicks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    return {
      x1: CX + Math.cos(angle) * 18,
      y1: CY + Math.sin(angle) * 18,
      x2: CX + Math.cos(angle) * 38,
      y2: CY + Math.sin(angle) * 38,
    };
  });

  return (
    <div style={{
      position: 'absolute',
      left: '3vw',
      bottom: '2.5rem',
      zIndex: 4,
      display: 'flex',
      alignItems: 'center',
      gap: '1.4rem',
      pointerEvents: 'all',
    }}>
      {/* Dial SVG */}
      <svg width={SIZE} height={SIZE} style={{ overflow: 'visible', flexShrink: 0 }}>
        {/* Outer ring */}
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        {/* Mid ring */}
        <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        {/* Center dot */}
        <circle cx={CX} cy={CY} r={2.5} fill="rgba(255,255,255,0.5)" />
        {/* Inner ring */}
        <circle cx={CX} cy={CY} r={42} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

        {/* Outer rotating ticks */}
        <g ref={outerRef}>
          {ticks.map((t, i) => (
            <line key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="rgba(255,255,255,1)"
              strokeWidth={t.strokeWidth}
              opacity={t.opacity}
            />
          ))}
        </g>

        {/* Inner counter-rotating spokes */}
        <g ref={innerRef}>
          {innerTicks.map((t, i) => (
            <line key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Cross hairs */}
        <line x1={CX} y1={CY - R_OUTER - 8} x2={CX} y2={CY + R_OUTER + 8} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1={CX - R_OUTER - 8} y1={CY} x2={CX + R_OUTER + 8} y2={CY} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </svg>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.68rem',
            fontWeight: 400,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#fff',
            opacity: 0.55,
            textDecoration: 'none',
            transition: 'opacity 0.3s',
          }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.55}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
