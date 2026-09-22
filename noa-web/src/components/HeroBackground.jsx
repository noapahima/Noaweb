import { useEffect, useRef } from 'react';

const ORBS = [
  { xF: 0.15, yF: 0.25, r: 380, vx:  0.18, vy:  0.10, color: '200,140,40',  base: 0.10 },
  { xF: 0.78, yF: 0.55, r: 420, vx: -0.14, vy:  0.09, color: '160,70,20',   base: 0.09 },
  { xF: 0.50, yF: 0.85, r: 300, vx:  0.10, vy: -0.13, color: '220,170,60',  base: 0.07 },
  { xF: 0.30, yF: 0.65, r: 260, vx: -0.09, vy: -0.07, color: '180,90,30',   base: 0.08 },
  { xF: 0.65, yF: 0.20, r: 200, vx:  0.06, vy:  0.12, color: '240,200,80',  base: 0.06 },
];

export default function HeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let W, H;
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const orbs = ORBS.map(o => ({
      ...o,
      x: o.xF * window.innerWidth,
      y: o.yF * window.innerHeight,
      t: Math.random() * Math.PI * 2,
    }));

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const orb of orbs) {
        orb.t += 0.004;
        const pulse = orb.base + Math.sin(orb.t) * 0.025;

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        g.addColorStop(0,   `rgba(${orb.color},${pulse})`);
        g.addColorStop(0.4, `rgba(${orb.color},${pulse * 0.5})`);
        g.addColorStop(1,   `rgba(${orb.color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();

        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r || orb.x > W + orb.r) orb.vx *= -1;
        if (orb.y < -orb.r || orb.y > H + orb.r) orb.vy *= -1;
      }

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
