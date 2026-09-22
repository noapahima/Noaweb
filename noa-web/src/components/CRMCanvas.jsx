import { useEffect, useRef } from 'react';

const STAGES = ['LEADS', 'QUALIFY', 'DEMO', 'PROPOSAL', 'CLOSED'];
const COLORS  = [
  [80,  160, 255],
  [80,  220, 200],
  [160, 120, 255],
  [255, 170,  80],
  [80,  255, 140],
];

export default function CRMCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    let W, H;
    let deals = [];
    let closedPops = [];
    let totalRev = 0;
    let displayRev = 0;
    let lastSpawn = -10;

    const init = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    init();
    window.addEventListener('resize', init);

    const stageX = i => W * (0.10 + i * 0.21);
    const midY   = () => H * 0.48;

    const spawnDeal = () => {
      const val = 5 + Math.floor(Math.random() * 46);
      deals.push({
        x: -24, y: midY() + (Math.random() - 0.5) * H * 0.15,
        stage: 0, prog: 0,
        val, r: 9 + val * 0.22,
        spd: 0.22 + Math.random() * 0.28,
        phase: Math.random() * Math.PI * 2,
        trail: [],
        alpha: 0, counted: false,
      });
    };

    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, W, H);

      // ── Grid lines (faint) ────────────────────────────────────────────
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += W / 8) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }

      // ── Stage columns ─────────────────────────────────────────────────
      const my = midY();
      STAGES.forEach((name, i) => {
        const x = stageX(i);
        const [r, g, b] = COLORS[i];
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + i * 1.1);

        // Column glow
        const cGrd = ctx.createLinearGradient(x, my - H * 0.32, x, my + H * 0.32);
        cGrd.addColorStop(0,   `rgba(${r},${g},${b},0)`);
        cGrd.addColorStop(0.5, `rgba(${r},${g},${b},${0.08 + 0.04 * pulse})`);
        cGrd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = cGrd;
        ctx.fillRect(x - 36, my - H * 0.32, 72, H * 0.64);

        // Vertical spine
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.18 + 0.12 * pulse})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, my - H * 0.28);
        ctx.lineTo(x, my + H * 0.28);
        ctx.stroke();

        // Top cap dot
        const capR = 5 + 3 * pulse;
        const capGrd = ctx.createRadialGradient(x, my - H * 0.28, 0, x, my - H * 0.28, capR * 2.5);
        capGrd.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
        capGrd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = capGrd;
        ctx.beginPath();
        ctx.arc(x, my - H * 0.28, capR * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${r},${g},${b},1)`;
        ctx.beginPath();
        ctx.arc(x, my - H * 0.28, capR, 0, Math.PI * 2);
        ctx.fill();

        // Deal count in column
        const cnt = deals.filter(d => Math.floor(d.prog) === i).length;
        ctx.fillStyle = `rgba(${r},${g},${b},0.65)`;
        ctx.font = `bold ${Math.max(10, W * 0.013)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cnt > 0 ? cnt : '', x, my - H * 0.28);

        // Stage label
        ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
        ctx.font = `${Math.max(8, W * 0.011)}px Inter, sans-serif`;
        ctx.letterSpacing = '0.15em';
        ctx.fillText(name, x, my + H * 0.33);
        ctx.letterSpacing = '0';
      });

      // ── Connecting dashes + flowing sparks ───────────────────────────
      for (let i = 0; i < STAGES.length - 1; i++) {
        const x1 = stageX(i), x2 = stageX(i + 1);
        const [r, g, b] = COLORS[i];

        ctx.strokeStyle = `rgba(${r},${g},${b},0.12)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.moveTo(x1 + 18, my);
        ctx.lineTo(x2 - 18, my);
        ctx.stroke();
        ctx.setLineDash([]);

        // Two sparks per segment
        for (let s = 0; s < 2; s++) {
          const fp  = ((t * 0.55 + i * 0.4 + s * 0.5) % 1);
          const fx  = x1 + 18 + (x2 - x1 - 36) * fp;
          const sz  = 2 + Math.sin(t * 3 + s) * 0.8;
          const sGrd = ctx.createRadialGradient(fx, my, 0, fx, my, sz * 3);
          sGrd.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
          sGrd.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = sGrd;
          ctx.beginPath();
          ctx.arc(fx, my, sz * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Spawn deals ──────────────────────────────────────────────────
      if (t - lastSpawn > 0.7 + Math.random() * 0.6) {
        spawnDeal();
        lastSpawn = t;
      }

      // ── Update + draw deals ──────────────────────────────────────────
      deals.forEach(d => {
        d.alpha = Math.min(1, d.alpha + 0.06);

        const si  = Math.min(Math.floor(d.prog), STAGES.length - 1);
        const tx  = d.prog >= STAGES.length ? W + 60 : stageX(si);
        const ty  = my + Math.sin(t * 1.1 + d.phase) * 18;
        const dx  = tx - d.x, dy = ty - d.y;
        const dst = Math.sqrt(dx * dx + dy * dy);

        if (dst < 12) {
          if (d.prog < STAGES.length - 1) {
            d.prog += d.spd * 0.014;
          } else {
            d.prog += d.spd * 0.009;
            if (d.prog >= STAGES.length && !d.counted) {
              d.counted = true;
              totalRev += d.val;
              closedPops.push({ x: tx, y: ty, val: d.val, life: 1 });
            }
          }
        } else {
          d.x += (dx / dst) * d.spd * 2.2;
          d.y += (dy / dst) * d.spd * 1.4;
        }

        // Trail
        d.trail.push({ x: d.x, y: d.y });
        if (d.trail.length > 16) d.trail.shift();

        const [r, g, b] = COLORS[Math.min(si, COLORS.length - 1)];

        d.trail.forEach((pt, ti) => {
          const ta = (ti / d.trail.length) * 0.35 * d.alpha;
          ctx.fillStyle = `rgba(${r},${g},${b},${ta})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, d.r * 0.45 * (ti / d.trail.length), 0, Math.PI * 2);
          ctx.fill();
        });

        // Outer glow
        const gl = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3);
        gl.addColorStop(0, `rgba(${r},${g},${b},${0.3 * d.alpha})`);
        gl.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = gl;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Deal circle
        const ci = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.4, 0, d.x, d.y, d.r);
        ci.addColorStop(0, `rgba(${r},${g},${b},${d.alpha})`);
        ci.addColorStop(1, `rgba(${r},${g},${b},${0.35 * d.alpha})`);
        ctx.fillStyle = ci;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

        // Value label inside circle
        if (d.r > 10 && d.alpha > 0.5) {
          ctx.fillStyle = `rgba(0,0,0,${0.85 * d.alpha})`;
          ctx.font = `bold ${Math.max(7, d.r * 0.52)}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`$${d.val}k`, d.x, d.y);
        }
      });

      // Remove deals off-screen
      deals = deals.filter(d => d.x < W + 80 && d.prog < 5.6);

      // ── Closed pops (value floats up) ────────────────────────────────
      closedPops.forEach(p => {
        p.life -= 0.018;
        p.y -= 1.2;
        ctx.fillStyle = `rgba(80,255,140,${p.life})`;
        ctx.font = `bold ${Math.max(11, W * 0.015)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`+$${p.val}k`, p.x, p.y);
      });
      closedPops = closedPops.filter(p => p.life > 0);

      // ── Revenue counter (top-right) ──────────────────────────────────
      displayRev += (totalRev - displayRev) * 0.04;
      const [rr, rg, rb] = COLORS[4];
      const revLabel = `$${Math.floor(displayRev).toLocaleString()}k`;
      const rx = W * 0.90, ry = H * 0.12;

      // Card
      ctx.fillStyle = `rgba(${rr},${rg},${rb},0.08)`;
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},0.25)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(rx - 70, ry - 28, 140, 56, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `rgba(${rr},${rg},${rb},0.6)`;
      ctx.font = `${Math.max(8, W * 0.01)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TOTAL PIPELINE', rx, ry - 10);

      ctx.fillStyle = `rgba(${rr},${rg},${rb},1)`;
      ctx.font = `bold ${Math.max(14, W * 0.022)}px Inter, sans-serif`;
      ctx.fillText(revLabel, rx, ry + 12);

      // ── Active deals badge (top-left) ────────────────────────────────
      const [ar, ag, ab] = COLORS[0];
      const ac = W * 0.10, ay = H * 0.12;
      ctx.fillStyle = `rgba(${ar},${ag},${ab},0.08)`;
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.25)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(ac - 60, ay - 28, 120, 56, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `rgba(${ar},${ag},${ab},0.6)`;
      ctx.font = `${Math.max(8, W * 0.01)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ACTIVE DEALS', ac, ay - 10);

      ctx.fillStyle = `rgba(${ar},${ag},${ab},1)`;
      ctx.font = `bold ${Math.max(14, W * 0.022)}px Inter, sans-serif`;
      ctx.fillText(deals.length, ac, ay + 12);

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <div className="crm-vis">
      <canvas ref={canvasRef} className="crm-canvas" />
    </div>
  );
}
