import { useEffect, useRef } from 'react';

const DPR = Math.min(window.devicePixelRatio || 1, 2);
const W = 760, H = 460;

function useCanvas(fn) {
  const ref   = useRef(null);
  const mouse = useRef({ x: W/2, y: H/2 });
  const cb    = useRef(fn); cb.current = fn;
  useEffect(() => {
    const c = ref.current; if (!c) return;
    c.width = W*DPR; c.height = H*DPR;
    c.style.width = W+'px'; c.style.height = H+'px';
    const ctx = c.getContext('2d'); ctx.scale(DPR, DPR);
    const mv = e => {
      const r = c.getBoundingClientRect();
      mouse.current = { x:(e.clientX-r.left)*(W/r.width), y:(e.clientY-r.top)*(H/r.height) };
    };
    document.addEventListener('mousemove', mv);
    let raf;
    const loop = ts => {
      const panel = c.closest('.service-content-inner');
      if (!(panel && panel.style.opacity==='0')) cb.current(ctx, ts*.001, mouse.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('mousemove', mv); };
  }, []);
  return ref;
}

function hslToRgb(h, s, l) {
  const a = s * Math.min(l, 1-l);
  const f = n => { const k=(n+h*12)%12; return l - a*Math.max(-1, Math.min(k-3, 9-k, 1)); };
  return [f(0)*255, f(8)*255, f(4)*255];
}

/* ═══════════════════════════════════════════════════════════════════
   01  CRM — PLEXUS CONSTELLATION
   52 particles drift slowly. Edges drawn between near pairs,
   opacity/weight based on distance. Mouse attracts nearest cluster.
   Highlighted node pulses on hover.
   ══════════════════════════════════════════════════════════════════ */
function CRMVisual() {
  const S = useRef(null);
  const draw = (ctx, t, m) => {
    ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.fillRect(0,0,W,H);

    if (!S.current) {
      S.current = {
        pts: Array.from({length: 52}, () => ({
          x: Math.random()*W*0.88 + W*0.06,
          y: Math.random()*H*0.88 + H*0.06,
          vx: (Math.random()-.5)*0.32,
          vy: (Math.random()-.5)*0.32,
          phase: Math.random()*Math.PI*2,
        })),
      };
    }
    const { pts } = S.current;

    for (const p of pts) {
      const dx = m.x - p.x, dy = m.y - p.y;
      const d  = Math.hypot(dx, dy);
      if (d < 110 && d > 1) { p.vx += (dx/d)*.055; p.vy += (dy/d)*.055; }
      p.vx *= .962; p.vy *= .962;
      p.x  += p.vx;  p.y  += p.vy;
      if (p.x <  10) { p.x =  10; p.vx =  Math.abs(p.vx); }
      if (p.x > W-10){ p.x = W-10; p.vx = -Math.abs(p.vx); }
      if (p.y <  10) { p.y =  10; p.vy =  Math.abs(p.vy); }
      if (p.y > H-10){ p.y = H-10; p.vy = -Math.abs(p.vy); }
    }

    const THRESH = 128;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i+1; j < pts.length; j++) {
        const dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y;
        const d  = Math.hypot(dx, dy);
        if (d < THRESH) {
          const f = 1 - d/THRESH;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(160,210,255,${f*0.38})`;
          ctx.lineWidth   = f * 1.0;
          ctx.stroke();
        }
      }
    }

    let minD = Infinity, nearest = null;
    for (const p of pts) {
      const d = Math.hypot(p.x - m.x, p.y - m.y);
      if (d < minD) { minD = d; nearest = p; }
    }

    for (const p of pts) {
      const isNearest = p === nearest && minD < 140;
      const pulse = 0.65 + 0.35 * Math.sin(t*1.4 + p.phase);
      const radius = isNearest ? 4.5 : 2.0;
      const alpha  = isNearest ? 1.0 : pulse * 0.82;

      if (isNearest) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 26);
        g.addColorStop(0, 'rgba(80,170,255,0.32)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, 26, 0, Math.PI*2); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI*2);
      ctx.fillStyle = `rgba(190,225,255,${alpha})`; ctx.fill();
    }
  };
  return <canvas ref={useCanvas(draw)} className="svc-canvas"/>;
}

/* ═══════════════════════════════════════════════════════════════════
   02  Automations — FLOW FIELD
   350 particles follow a layered-sine vector field, leaving warm
   amber trails. Mouse locally repels the flow. Sparse, flowing,
   cinematic.
   ══════════════════════════════════════════════════════════════════ */
function AutoVisual() {
  const S = useRef(null);
  const draw = (ctx, t, m) => {
    ctx.fillStyle = 'rgba(0,0,0,0.038)'; ctx.fillRect(0,0,W,H);

    if (!S.current) {
      S.current = {
        pts: Array.from({length: 340}, () => ({
          x: Math.random()*W,
          y: Math.random()*H,
          age: Math.random()*220,
          hue: 28 + Math.random()*28,
        })),
      };
    }

    const angle = (x, y, t) =>
        Math.sin(x*.0065 + t*.22) * Math.cos(y*.008  - t*.17) * Math.PI*2.8
      + Math.cos(x*.012  - t*.10) * Math.sin(y*.0055 + t*.20) * Math.PI*1.2
      + Math.sin((x-y)*.0038 + t*.07) * 2.1;

    for (const p of S.current.pts) {
      p.age++;
      let a = angle(p.x, p.y, t);
      const dx = m.x - p.x, dy = m.y - p.y;
      const md = Math.hypot(dx, dy);
      if (md < 90 && md > 1) {
        const repel = (Math.atan2(-dy, -dx));
        a += ((repel - a) * (90-md)/90) * 0.55;
      }

      const speed = 1.85;
      const px = p.x, py = p.y;
      p.x += Math.cos(a)*speed;
      p.y += Math.sin(a)*speed;

      const fadeIn = Math.min(p.age/55, 1);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `hsla(${p.hue},90%,68%,${fadeIn*0.48})`;
      ctx.lineWidth   = 1.1; ctx.stroke();

      if (p.x < -6 || p.x > W+6 || p.y < -6 || p.y > H+6 || p.age > 260) {
        p.x = Math.random()*W; p.y = Math.random()*H;
        p.age = 0; p.hue = 28 + Math.random()*28;
      }
    }
  };
  return <canvas ref={useCanvas(draw)} className="svc-canvas"/>;
}

/* ═══════════════════════════════════════════════════════════════════
   03  Web Dev — RIDGE LINES  ("Unknown Pleasures") — UNCHANGED
   ══════════════════════════════════════════════════════════════════ */
function WebVisual() {
  const draw = (ctx, t, m) => {
    ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);

    const LINES=32;
    const noise=(x,row)=>
      Math.sin(x/W*5.5 + row*.38 + t*.22)*38 +
      Math.sin(x/W*9   - row*.24 + t*.16)*22 +
      Math.sin(x/W*2.8 + row*.56 - t*.12)*48 +
      Math.cos(x/W*13  + row*.18 + t*.28)*12 +
      Math.sin(x/W*4   + row*.9  + t*.09)*16;

    for (let l=0; l<LINES; l++) {
      const baseY=H*.9 - (l/(LINES-1))*H*.78;
      const nearLine=Math.abs(m.y-baseY)<18;
      const li=l/(LINES-1);

      ctx.beginPath();
      ctx.moveTo(-2, baseY+2);
      for (let x=0; x<=W+2; x+=4) {
        const amp=Math.max(0, noise(x, l));
        ctx.lineTo(x, baseY-amp);
      }
      ctx.lineTo(W+2, baseY+2); ctx.closePath();
      ctx.fillStyle='#000'; ctx.fill();

      ctx.beginPath();
      for (let x=0; x<=W+2; x+=4) {
        const amp=Math.max(0, noise(x, l));
        x===0?ctx.moveTo(x,baseY-amp):ctx.lineTo(x,baseY-amp);
      }
      ctx.strokeStyle=nearLine
        ?'rgba(255,255,255,.95)'
        :`rgba(255,255,255,${.12+li*.55})`;
      ctx.lineWidth=nearLine?1.4:.7; ctx.stroke();
    }
  };
  return <canvas ref={useCanvas(draw)} className="svc-canvas"/>;
}

/* ═══════════════════════════════════════════════════════════════════
   04  Mobile — PENDULUM WAVE
   16 pendulums at slightly different frequencies. Their bobs trace
   a traveling wave that blooms into chaos then re-syncs. Trail of
   50 frames fades behind the live wave. Bobs tinted by phase.
   Mouse X controls playback speed.
   ══════════════════════════════════════════════════════════════════ */
function MobileVisual() {
  const S = useRef(null);
  const draw = (ctx, t, m) => {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);

    if (!S.current) S.current = { trail: [] };
    const { trail } = S.current;

    const N      = 16;
    const CYCLE  = 28;
    const BASE_N = 42;
    const AMP    = H * 0.28;
    const LEFT   = W * 0.07;
    const RIGHT  = W * 0.93;
    const SPACE  = (RIGHT - LEFT) / (N - 1);
    const speed  = 0.55 + (m.x / W) * 0.9;

    const bobs = Array.from({length: N}, (_, i) => {
      const freq = (BASE_N + i) / CYCLE;
      return {
        x: LEFT + i * SPACE,
        y: H / 2 + AMP * Math.cos(2 * Math.PI * freq * t * speed),
      };
    });

    trail.push(bobs.map(b => b.y));
    if (trail.length > 50) trail.shift();

    // fading trail lines
    for (let h = 0; h < trail.length; h++) {
      const alpha = (h / trail.length) * 0.22;
      ctx.beginPath();
      trail[h].forEach((y, i) => {
        const x = LEFT + i * SPACE;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 0.55;
      ctx.stroke();
    }

    // live wave line
    ctx.beginPath();
    bobs.forEach((b, i) => i === 0 ? ctx.moveTo(b.x, b.y) : ctx.lineTo(b.x, b.y));
    ctx.strokeStyle = 'rgba(255,255,255,0.82)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // pendulum strings (very subtle)
    const pivotY = H / 2 - AMP - 12;
    for (const b of bobs) {
      ctx.beginPath();
      ctx.moveTo(b.x, pivotY);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // bobs — tinted by position along wave
    for (let i = 0; i < bobs.length; i++) {
      const b = bobs[i];
      const norm = (b.y - (H / 2 - AMP)) / (2 * AMP);
      const hue  = 170 + norm * 130;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3.8, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},78%,74%,0.92)`;
      ctx.fill();
    }

    // pivot row
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (const b of bobs) {
      ctx.beginPath();
      ctx.arc(b.x, pivotY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  return <canvas ref={useCanvas(draw)} className="svc-canvas"/>;
}

/* ═══════════════════════════════════════════════════════════════════
   05  AI — JULIA SET  (animated)
   The complex parameter c traces a slow circle through parameter
   space, morphing the fractal continuously. Smooth (continuous)
   escape-time coloring. Electric violet → blue → cyan → gold palette.
   Mouse subtly offsets c. Rendered at 190×115 and upscaled 4×.
   ══════════════════════════════════════════════════════════════════ */
function AIVisual() {
  const S = useRef(null);
  const draw = (ctx, t, m) => {
    const GW = 190, GH = 115;

    if (!S.current) {
      const off = document.createElement('canvas');
      off.width = GW; off.height = GH;
      S.current = { off, offCtx: off.getContext('2d') };
    }
    const { off, offCtx } = S.current;

    // c orbits a path through beautiful Julia-set territory
    const angle = t * 0.18;
    const cr = 0.7885 * Math.cos(angle) + (m.x / W - 0.5) * 0.07;
    const ci = 0.7885 * Math.sin(angle) + (m.y / H - 0.5) * 0.07;

    const MAX_ITER = 80;
    const BAIL     = 16;
    const SCALE    = 3.2 / GW;
    const ASPECT   = GH / GW;
    const log2     = Math.log(2);

    const img  = offCtx.createImageData(GW, GH);
    const data = img.data;

    for (let py = 0; py < GH; py++) {
      for (let px = 0; px < GW; px++) {
        let zr = (px - GW * 0.5) * SCALE;
        let zi = (py - GH * 0.5) * SCALE * ASPECT;
        let i = 0, zr2 = 0, zi2 = 0;

        for (; i < MAX_ITER; i++) {
          zr2 = zr * zr; zi2 = zi * zi;
          if (zr2 + zi2 > BAIL) break;
          zi  = 2 * zr * zi + ci;
          zr  = zr2 - zi2 + cr;
        }

        const idx = (py * GW + px) * 4;
        if (i === MAX_ITER) {
          data[idx] = 4; data[idx+1] = 2; data[idx+2] = 18; data[idx+3] = 255;
        } else {
          const modZ   = Math.sqrt(zr2 + zi2);
          const smooth = Math.max(0, i + 1 - Math.log(Math.log(modZ)) / log2);
          const tv     = Math.min(1, smooth / MAX_ITER);

          // violet(0) → indigo → cyan → gold(1), wrap creates red-orange burst near boundary
          const hue = (0.72 + tv * 0.55) % 1;
          const [r, g, b] = hslToRgb(hue, 0.95, 0.07 + tv * 0.62);
          data[idx] = r; data[idx+1] = g; data[idx+2] = b; data[idx+3] = 255;
        }
      }
    }

    offCtx.putImageData(img, 0, 0);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(off, 0, 0, W, H);
  };
  return <canvas ref={useCanvas(draw)} className="svc-canvas"/>;
}

/* ═══════════════════════════════════════════════════════════════════
   06  Cloud — 3D TORUS WIREFRAME — UNCHANGED
   ══════════════════════════════════════════════════════════════════ */
function CloudVisual() {
  const S = useRef(null);
  const draw = (ctx, t, m) => {
    ctx.fillStyle='rgba(0,0,0,.28)'; ctx.fillRect(0,0,W,H);

    if (!S.current) S.current={ rx:0.3, ry:t*.04, vrx:0, vry:0, mx:W/2, my:H/2 };
    const s=S.current;
    s.mx+=(m.x-s.mx)*.03; s.my+=(m.y-s.my)*.03;
    s.vrx+=((s.my/H-.5)*.8-s.rx)*.03; s.vry+=((s.mx/W-.5)*.4+t*.04-s.ry)*.02;
    s.vrx*=.88; s.vry*=.88; s.rx+=s.vrx; s.ry+=s.vry;

    const cx2=W/2, cy2=H/2, R=145, r2=52, FOCI=280;
    const cosX=Math.cos(s.rx), sinX=Math.sin(s.rx);
    const cosY=Math.cos(s.ry), sinY=Math.sin(s.ry);

    const project=(x,y,z)=>{
      const x1=x*cosY-z*sinY, z1=x*sinY+z*cosY;
      const y2=y*cosX-z1*sinX, z2=y*sinX+z1*cosX;
      const sc=FOCI/(FOCI+z2+20);
      return{sx:cx2+x1*sc,sy:cy2+y2*sc,z:z2,sc};
    };

    const US=42,VS=18,pts=[];
    for(let ui=0;ui<US;ui++)for(let vi=0;vi<VS;vi++){
      const u=(ui/US)*Math.PI*2,v=(vi/VS)*Math.PI*2;
      pts.push(project((R+r2*Math.cos(v))*Math.cos(u),(R+r2*Math.cos(v))*Math.sin(u),r2*Math.sin(v)));
    }

    for(let ui=0;ui<US;ui++){
      ctx.beginPath();
      for(let vi=0;vi<VS+1;vi++){const p=pts[ui*VS+(vi%VS)];vi===0?ctx.moveTo(p.sx,p.sy):ctx.lineTo(p.sx,p.sy);}
      ctx.strokeStyle='rgba(200,220,255,.18)';ctx.lineWidth=.55;ctx.stroke();
    }
    for(let vi=0;vi<VS;vi++){
      ctx.beginPath();
      for(let ui=0;ui<US+1;ui++){const p=pts[(ui%US)*VS+vi];ui===0?ctx.moveTo(p.sx,p.sy):ctx.lineTo(p.sx,p.sy);}
      ctx.strokeStyle='rgba(200,220,255,.12)';ctx.lineWidth=.4;ctx.stroke();
    }

    pts.filter(p=>p.z>r2*.6).sort((a,b)=>b.z-a.z).slice(0,80).forEach(p=>{
      const a=(.08+(p.z-r2*.6)/(r2*.4)*.3)*p.sc;
      ctx.beginPath();ctx.arc(p.sx,p.sy,1.2,0,Math.PI*2);
      ctx.fillStyle=`rgba(220,240,255,${a})`;ctx.fill();
    });
  };
  return <canvas ref={useCanvas(draw)} className="svc-canvas"/>;
}

const VISUALS = [CRMVisual, AutoVisual, WebVisual, MobileVisual, AIVisual, CloudVisual];
export default function ServiceVisual({ index }) {
  const V = VISUALS[index] ?? (() => null);
  return <div className="svc-visual-wrap"><V /></div>;
}
