import { useEffect, useRef } from 'react';

export default function PaintingCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const paint = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; draw(c.getContext('2d'), c.width, c.height); };
    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }, []);
  return <canvas ref={ref} style={{ position:'absolute',inset:0,width:'100%',height:'100%',display:'block',zIndex:1 }} />;
}

/* ── tiny helpers ── */
const lg = (ctx,x0,y0,x1,y1,stops) => { const g=ctx.createLinearGradient(x0,y0,x1,y1); stops.forEach(([t,c])=>g.addColorStop(t,c)); return g; };
const rg = (ctx,cx,cy,r1,r2,stops) => { const g=ctx.createRadialGradient(cx,cy,r1,cx,cy,r2); stops.forEach(([t,c])=>g.addColorStop(t,c)); return g; };

function fill(ctx, path_fn, style, alpha=1, blur=0) {
  ctx.save();
  if (blur) ctx.filter = `blur(${blur}px)`;
  ctx.globalAlpha = alpha;
  ctx.fillStyle   = style;
  ctx.beginPath(); path_fn(ctx); ctx.fill();
  ctx.filter = 'none'; ctx.restore();
}

function blob(ctx, cx, cy, rx, ry, color, alpha, seed=0, blur=0) {
  ctx.save();
  if (blur) ctx.filter = `blur(${blur}px)`;
  ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.beginPath();
  for (let i=0;i<=24;i++) {
    const a=(i/24)*Math.PI*2;
    const jx=1+Math.sin(a*3.1+seed)*0.17+Math.cos(a*5.2+seed*.7)*.08;
    const jy=1+Math.cos(a*2.8+seed*1.1)*0.15+Math.sin(a*4+seed)*.07;
    const x=cx+Math.cos(a)*rx*jx, y=cy+Math.sin(a)*ry*jy;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }
  ctx.closePath(); ctx.fill();
  ctx.filter='none'; ctx.restore();
}

function ellipse(ctx, cx,cy,rx,ry, color, alpha, blur=0, rot=0) {
  ctx.save();
  if (blur) ctx.filter=`blur(${blur}px)`;
  ctx.globalAlpha=alpha; ctx.fillStyle=color;
  ctx.beginPath(); ctx.ellipse(cx,cy,Math.max(rx,1),Math.max(ry,1),rot,0,Math.PI*2);
  ctx.fill(); ctx.filter='none'; ctx.restore();
}

/* ════════════════════════════════════════════
   MAIN
════════════════════════════════════════════ */
function draw(ctx, W, H) {

  /* ── SKY ── */
  // blue-grey gradient, lighter toward horizon center
  ctx.fillStyle = lg(ctx,0,0,0,H*.65,[
    [0,   '#2e3a4a'],
    [0.2, '#3c4d5e'],
    [0.45,'#556470'],
    [0.70,'#7a8c92'],
    [1,   '#8a9a9e'],
  ]);
  ctx.fillRect(0,0,W,H*.65);

  // warm centre glow where clouds catch light
  ctx.fillStyle = rg(ctx,W*.48,H*.06,0,W*.55,[
    [0,'rgba(195,182,152,0.22)'],[.5,'rgba(155,145,118,0.09)'],[1,'rgba(0,0,0,0)']
  ]);
  ctx.fillRect(0,0,W,H*.55);

  /* ── CLOUDS ──
     Big dramatic cumulus — center-right of sky opening  */
  const clouds = [
    // main mass centre
    {cx:.50,cy:.07,rx:.30,ry:.13,s:1, base:0.68,mid:0.78,hi:0.58,peak:0.45},
    {cx:.58,cy:.04,rx:.24,ry:.11,s:3, base:0.60,mid:0.72,hi:0.52,peak:0.40},
    {cx:.42,cy:.09,rx:.22,ry:.10,s:5, base:0.55,mid:0.68,hi:0.48,peak:0.36},
    // right clouds
    {cx:.72,cy:.08,rx:.20,ry:.09,s:7, base:0.52,mid:0.64,hi:0.44,peak:0.32},
    {cx:.82,cy:.06,rx:.16,ry:.08,s:9, base:0.48,mid:0.60,hi:0.40,peak:0.28},
    // left clouds (partially behind pines)
    {cx:.25,cy:.11,rx:.18,ry:.08,s:11,base:0.45,mid:0.55,hi:0.38,peak:0.25},
    {cx:.15,cy:.08,rx:.14,ry:.07,s:13,base:0.40,mid:0.50,hi:0.34,peak:0.22},
    // extra depth
    {cx:.62,cy:.14,rx:.18,ry:.07,s:15,base:0.40,mid:0.52,hi:0.36,peak:0.24},
    {cx:.35,cy:.14,rx:.16,ry:.06,s:17,base:0.38,mid:0.48,hi:0.32,peak:0.20},
  ];
  clouds.forEach(c => {
    const cx=c.cx*W, cy=c.cy*H, rx=c.rx*W, ry=c.ry*H;
    blob(ctx,cx,cy+ry*.35,rx*.95,ry*.6,'#52595f',c.base*.55,c.s+2,22); // deep shadow
    blob(ctx,cx,cy,       rx,    ry,   '#aba498',c.base*.62,c.s,   18); // base
    blob(ctx,cx-rx*.08,cy-ry*.22,rx*.78,ry*.68,'#cac3b0',c.mid*.58,c.s+1,14); // mid
    blob(ctx,cx+rx*.04,cy-ry*.36,rx*.55,ry*.48,'#ddd5be',c.hi*.52, c.s+3,10); // highlight
    blob(ctx,cx-rx*.02,cy-ry*.46,rx*.35,ry*.32,'#ede5cf',c.peak*.44,c.s+5,7); // peak bright
  });

  /* horizon haze */
  ctx.fillStyle=lg(ctx,0,H*.44,0,H*.68,[[0,'rgba(95,108,105,0)'],[.5,'rgba(75,88,82,0.38)'],[1,'rgba(40,50,38,0.72)']]);
  ctx.fillRect(0,H*.44,W,H*.24);

  /* ── GROUND ── */
  ctx.fillStyle=lg(ctx,0,H*.60,0,H,[[0,'#252e1a'],[.3,'#1a2010'],[.7,'#12160a'],[1,'#080a05']]);
  ctx.fillRect(0,H*.60,W,H*.40);

  /* ── DISTANT HAZY TERRAIN centre ── */
  blob(ctx,W*.45,H*.60,W*.28,H*.07,'#3a4830',0.72,21,14);
  blob(ctx,W*.55,H*.58,W*.22,H*.06,'#344228',0.65,23,12);
  blob(ctx,W*.38,H*.62,W*.18,H*.05,'#2e3c22',0.60,25,12);

  /* ── ROCKY CLIFF right-centre (behind cypresses) ── */
  fill(ctx, ctx2=>{
    ctx2.moveTo(W*.68,H*.72);
    ctx2.bezierCurveTo(W*.70,H*.38,W*.80,H*.24,W*.88,H*.26);
    ctx2.bezierCurveTo(W*.95,H*.28,W,H*.38,W,H*.48);
    ctx2.lineTo(W,H*.74); ctx2.closePath();
  }, lg(ctx,W*.72,H*.24,W*.90,H*.68,[[0,'#3c3630'],[.5,'#2c2820'],[1,'#181410']]), 0.90);

  /* darker cliff face shadow */
  fill(ctx, ctx2=>{
    ctx2.moveTo(W*.72,H*.70);
    ctx2.bezierCurveTo(W*.73,H*.42,W*.76,H*.32,W*.80,H*.30);
    ctx2.lineTo(W*.80,H*.70); ctx2.closePath();
  }, '#1a1610', 0.60);

  /* ── BACKGROUND TREES (misty, small) ── */
  // small cypress-like trees in distance
  [[.36,.56,.012,.28],[.40,.54,.010,.24],[.44,.57,.011,.26],[.50,.55,.010,.22],
   [.56,.57,.012,.25],[.60,.54,.011,.23]].forEach(([fx,fy,fw,fh],i)=>{
    drawCypress(ctx,W,H,fx,fy,fw,fh,0.65,i);
  });

  /* ── CYPRESS GROVE — RIGHT SIDE ── */
  // tall dark narrow trees, very prominent right portion
  [
    {x:.64,top:.12,w:.022,a:.97},
    {x:.68,top:.08,w:.024,a:.98},
    {x:.72,top:.10,w:.021,a:.96},
    {x:.76,top:.14,w:.020,a:.95},
    {x:.79,top:.18,w:.018,a:.93},
    {x:.83,top:.13,w:.022,a:.96},
    {x:.87,top:.17,w:.018,a:.92},
    {x:.90,top:.22,w:.016,a:.90},
  ].forEach((c,i)=>drawCypress(ctx,W,H,c.x,0.68,c.w,0.68-c.top,c.a,i+30));

  /* ── LEFT UMBRELLA PINE (dominant) ── */
  // trunk: x≈0.14, base≈0.72H, canopy top≈0.07H, canopy width≈0.34W
  drawUmbrellaPine(ctx,W,H, 0.14, 0.72, 0.34, 0.07, 0);

  /* ── SECOND UMBRELLA PINE slightly right/behind ── */
  drawUmbrellaPine(ctx,W,H, 0.30, 0.68, 0.26, 0.14, 4);

  /* ── THIRD PINE far left ── */
  drawUmbrellaPine(ctx,W,H, 0.04, 0.74, 0.22, 0.16, 8);

  /* ── LEFT FG DARK TREES / VEGETATION ── */
  drawFgLeft(ctx,W,H);

  /* ── BOTTOM DENSE BUSHES ── */
  drawBottomBushes(ctx,W,H);

  /* ── WHITE FLOWERING BUSHES bottom-right (very prominent) ── */
  drawWhiteBushes(ctx,W,H);

  /* ── VIGNETTE ── */
  // left edge dark
  ctx.fillStyle=rg(ctx,0,H*.5,0,W*.3,[[0,'rgba(3,5,2,0.75)'],[.5,'rgba(3,5,2,0.28)'],[1,'rgba(0,0,0,0)']]);
  ctx.fillRect(0,0,W*.3,H);
  // right edge dark
  ctx.fillStyle=rg(ctx,W,H*.5,0,W*.3,[[0,'rgba(3,4,2,0.60)'],[.6,'rgba(3,4,2,0.18)'],[1,'rgba(0,0,0,0)']]);
  ctx.fillRect(W*.7,0,W*.3,H);
  // bottom fade
  ctx.fillStyle=lg(ctx,0,H*.72,0,H,[[0,'rgba(3,4,2,0)'],[.4,'rgba(3,4,2,0.55)'],[1,'rgba(1,2,1,0.95)']]);
  ctx.fillRect(0,H*.72,W,H*.28);
  // top dark
  ctx.fillStyle=lg(ctx,0,0,0,H*.10,[[0,'rgba(0,0,0,0.42)'],[1,'rgba(0,0,0,0)']]);
  ctx.fillRect(0,0,W,H*.10);
}

/* ── CYPRESS ── */
function drawCypress(ctx,W,H,fx,fbase,fw,fh,alpha,seed) {
  const cx=fx*W, base=fbase*H, top=base-fh*H, hw=fw*W*.5;
  const g=lg(ctx,cx-hw,top,cx+hw,base,[[0,'#1e2c10'],[.4,'#162208'],[1,'#0e1806']]);
  fill(ctx, c=>{
    c.moveTo(cx,top);
    for(let i=1;i<=28;i++){
      const t=i/28, y=top+t*(base-top);
      const w=hw*(.1+t*.9)*(1+Math.sin(seed*1.7+i*.9)*.07);
      c.lineTo(cx+w*(i%2===0?1:-1),y);
    }
    c.lineTo(cx,base); c.closePath();
  }, g, alpha);
  // faint highlight
  fill(ctx, c=>{
    c.moveTo(cx+hw*.08,top+fh*H*.05);
    c.lineTo(cx+hw*.5,top+fh*H*.5);
    c.lineTo(cx+hw*.3,base); c.closePath();
  }, '#4a6030', alpha*.16);
}

/* ── UMBRELLA (PARASOL) PINE ── */
function drawUmbrellaPine(ctx,W,H, fx,fbase, fcanopyW,fcanopyTopY, seed) {
  const cx    = fx*W;
  const baseY = fbase*H;
  const cTopY = fcanopyTopY*H;
  const cw    = fcanopyW*W;
  const ch    = baseY-cTopY;
  const trunkH= ch*.58;
  const tw    = cw*.038;

  // trunk — slightly curved
  fill(ctx, c=>{
    c.moveTo(cx-tw,baseY);
    c.bezierCurveTo(cx-tw*.8,baseY-trunkH*.5, cx+tw*.3,baseY-trunkH*.7, cx+tw*.2,baseY-trunkH);
    c.lineTo(cx+tw*1.2,baseY-trunkH);
    c.bezierCurveTo(cx+tw*1.2,baseY-trunkH*.5, cx+tw,baseY-trunkH*.3, cx+tw,baseY);
    c.closePath();
  }, lg(ctx,cx,baseY-trunkH,cx,baseY,[[0,'#3a2810'],[1,'#1a1006']]), 0.94);

  // canopy: flat wide umbrella shape
  const capY = baseY-trunkH;
  // shadow/base of canopy
  blob(ctx, cx,capY+ch*.12, cw*.54,ch*.22, '#0e1a08', 0.90, seed+10, 6);
  // main canopy layers
  blob(ctx, cx,capY,        cw*.50,ch*.32, '#182c0c', 0.94, seed,    5);
  blob(ctx, cx-cw*.05,capY-ch*.06, cw*.46,ch*.28, '#1e3410', 0.90, seed+1, 4);
  blob(ctx, cx+cw*.02,capY-ch*.10, cw*.40,ch*.24, '#243c12', 0.86, seed+2, 4);
  blob(ctx, cx-cw*.03,capY-ch*.15, cw*.32,ch*.20, '#1a3010', 0.82, seed+3, 3);
  // light catch top edges
  blob(ctx, cx+cw*.12,capY-ch*.08, cw*.20,ch*.14, '#344e1a', 0.52, seed+5, 8);
  ellipse(ctx, cx+cw*.18,capY-ch*.14, cw*.14,ch*.10, '#3c581e', 0.38, 10);
}

/* ── LEFT FOREGROUND DARK TREES ── */
function drawFgLeft(ctx,W,H) {
  // several dark overlapping tree masses on bottom-left
  [
    {cx:.01,cy:.70,rx:.08,ry:.22,s:40},
    {cx:.06,cy:.65,rx:.07,ry:.25,s:42},
    {cx:.12,cy:.72,rx:.09,ry:.20,s:44},
    {cx:.18,cy:.74,rx:.10,ry:.18,s:46},
    {cx:.24,cy:.76,rx:.09,ry:.15,s:48},
    {cx:.00,cy:.78,rx:.07,ry:.16,s:50},
  ].forEach(b=>{
    blob(ctx,b.cx*W,b.cy*H,b.rx*W,b.ry*H,'#0c1608',0.94,b.s,5);
    blob(ctx,b.cx*W,b.cy*H-b.ry*H*.25,b.rx*W*.75,b.ry*H*.55,'#162410',0.72,b.s+1,8);
  });
  // dark undergrowth arching over bottom-left
  blob(ctx,W*.08,H*.85,W*.22,H*.12,'#0a1006',0.96,60,4);
  blob(ctx,W*.20,H*.82,W*.18,H*.10,'#0e1408',0.90,62,5);
}

/* ── BOTTOM DARK BUSHES ── */
function drawBottomBushes(ctx,W,H) {
  [
    [.00,.88,.13,.09,'#0c1208',0.97],
    [.10,.91,.11,.08,'#101608',0.95],
    [.20,.89,.10,.08,'#0e1406',0.93],
    [.30,.92,.11,.07,'#0a1206',0.91],
    [.40,.90,.09,.08,'#0e1606',0.92],
    [.50,.93,.10,.07,'#0c1406',0.90],
    [.60,.89,.10,.09,'#101808',0.93],
    [.70,.91,.11,.08,'#0e1606',0.91],
    [.82,.90,.10,.08,'#0c1408',0.94],
    [.93,.88,.10,.09,'#101808',0.95],
  ].forEach(([fx,fy,rx,ry,c,a],i)=>{
    blob(ctx,fx*W,fy*H,rx*W,ry*H,c,a,i*3,6);
    blob(ctx,fx*W,fy*H-ry*H*.3,rx*W*.7,ry*H*.5,'#1c2e12',a*.55,i*3+1,8);
  });
}

/* ── WHITE FLOWERING BUSHES bottom-right ── */
function drawWhiteBushes(ctx,W,H) {
  // These are very prominent in the reference — big cream/white masses
  const clusters = [
    {cx:.82,cy:.80,rx:.10,ry:.10,s:70},
    {cx:.90,cy:.76,rx:.09,ry:.09,s:72},
    {cx:.96,cy:.80,rx:.10,ry:.08,s:74},
    {cx:.88,cy:.84,rx:.11,ry:.07,s:76},
    {cx:.78,cy:.84,rx:.08,ry:.07,s:78},
    {cx:.94,cy:.86,rx:.09,ry:.06,s:80},
    {cx:.75,cy:.79,rx:.07,ry:.08,s:82},
  ];
  clusters.forEach(c=>{
    const cx=c.cx*W, cy=c.cy*H, rx=c.rx*W, ry=c.ry*H;
    blob(ctx,cx,cy+ry*.3,rx*.9,ry*.65,'#1e2e14',0.92,c.s+10,5); // dark green base
    blob(ctx,cx,cy,       rx,  ry,    '#b8b2a4',0.80,c.s,   16); // cream mass
    blob(ctx,cx-rx*.1,cy-ry*.18,rx*.80,ry*.70,'#cec8b8',0.72,c.s+1,11); // lighter
    blob(ctx,cx+rx*.05,cy-ry*.30,rx*.60,ry*.50,'#dedad0',0.62,c.s+2,8);  // highlight
    blob(ctx,cx-rx*.05,cy-ry*.42,rx*.40,ry*.32,'#e8e4dc',0.50,c.s+3,6);  // brightest
    blob(ctx,cx,cy+ry*.18,rx*.75,ry*.40,'#8a8880',0.35,c.s+4,10);        // bottom shadow
  });
  // connecting foliage between clusters
  blob(ctx,W*.86,H*.88,W*.18,H*.06,'#0e1a0a',0.85,85,6);
}
