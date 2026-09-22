import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Curl noise helpers
function hash(n) { return Math.sin(n) * 43758.5453; }
function noise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix     + iy     * 57.0);
  const b = hash(ix + 1 + iy     * 57.0);
  const c = hash(ix     + (iy+1) * 57.0);
  const d = hash(ix + 1 + (iy+1) * 57.0);
  return a + (b-a)*ux + (c-a)*uy + (d-b+a-c)*ux*uy;
}
function curl(x, y, t) {
  const e = 0.06;
  const n1 = noise(x, y + e + t);
  const n2 = noise(x, y - e + t);
  const n3 = noise(x + e, y + t);
  const n4 = noise(x - e, y + t);
  return { vx: (n1 - n2) / (2 * e), vy: -(n3 - n4) / (2 * e) };
}

export default function ShowreelSection() {
  const canvasRef  = useRef(null);
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf, t = 0;
    let W, H;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, px: -9999, py: -9999 };

    const N = 2200;
    let pts = [];

    const resize = () => {
      canvas.width  = W = canvas.offsetWidth;
      canvas.height = H = canvas.offsetHeight;
      pts = [];
      for (let i = 0; i < N; i++) {
        pts.push({
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: 0, vy: 0,
          life: Math.random(),
          speed: 0.6 + Math.random() * 1.0,
          size:  0.6 + Math.random() * 1.2,
          hue:   Math.random() < 0.15 ? 200 + Math.random() * 40 : 0,
          sat:   Math.random() < 0.15 ? 80 : 0,
        });
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.vx = e.clientX - r.left - mouse.px;
      mouse.vy = e.clientY - r.top  - mouse.py;
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x  = e.clientX - r.left;
      mouse.y  = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMove);

    // Offscreen for persistent trails
    const trail = document.createElement('canvas');
    const tCtx  = trail.getContext('2d');
    const syncTrail = () => {
      trail.width = W; trail.height = H;
    };
    syncTrail();
    window.addEventListener('resize', syncTrail);

    const draw = () => {
      t += 0.0035;

      // Fade trail canvas
      tCtx.fillStyle = 'rgba(0,0,0,0.035)';
      tCtx.fillRect(0, 0, W, H);

      pts.forEach(p => {
        // Curl field
        const scale = 0.0022;
        const { vx: cx, vy: cy } = curl(p.x * scale, p.y * scale, t * 0.6);

        // Mouse influence
        const mdx  = p.x - mouse.x;
        const mdy  = p.y - mouse.y;
        const md   = Math.sqrt(mdx*mdx + mdy*mdy) + 1;
        const MR   = 180;
        const mf   = md < MR ? (1 - md/MR) ** 2 * 3.5 : 0;
        const mvx  = mf * (mdx/md + mouse.vx * 0.012);
        const mvy  = mf * (mdy/md + mouse.vy * 0.012);

        p.vx = p.vx * 0.92 + (cx * p.speed + mvx) * 0.08;
        p.vy = p.vy * 0.92 + (cy * p.speed + mvy) * 0.08;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0)  p.x += W;
        if (p.x > W)  p.x -= W;
        if (p.y < 0)  p.y += H;
        if (p.y > H)  p.y -= H;

        // Speed-based brightness
        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        const alpha = Math.min(0.06 + speed * 0.06 + mf * 0.3, 0.85);
        const sz    = p.size * (1 + speed * 0.3 + mf * 1.5);

        if (p.hue > 0) {
          tCtx.fillStyle = `hsla(${p.hue},${p.sat}%,80%,${alpha})`;
        } else {
          tCtx.fillStyle = `rgba(255,255,255,${alpha})`;
        }
        tCtx.beginPath();
        tCtx.arc(p.x, p.y, Math.max(0.2, sz), 0, Math.PI * 2);
        tCtx.fill();
      });

      // Occasional glitch scanline
      if (Math.random() < 0.012) {
        const gy = Math.random() * H;
        const gh = 1 + Math.random() * 3;
        tCtx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.05})`;
        tCtx.fillRect(0, gy, W, gh);
      }

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(trail, 0, 0);

      raf = requestAnimationFrame(draw);
    };
    draw();

    // Scroll text reveal
    if (titleRef.current) {
      gsap.fromTo(titleRef.current.querySelectorAll('.sr-line'),
        { y: '110%', skewY: 6 },
        { y: '0%', skewY: 0, duration: 1.3, ease: 'power4.out', stagger: 0.14,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
      gsap.fromTo(titleRef.current.querySelectorAll('.sr-fade'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.07, delay: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', syncTrail);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <section ref={sectionRef} className="showreel-section">
      <canvas ref={canvasRef} className="showreel-canvas" />
      <div className="showreel-content" ref={titleRef}>
        <p className="showreel-label sr-fade">// Noa Software Solutions</p>
        <h2 className="showreel-title">
          <span className="sr-clip"><span className="sr-line">Built</span></span>
          <span className="sr-clip"><span className="sr-line">Different.</span></span>
        </h2>
        <div className="showreel-tags">
          {['AI', 'Automation', 'Web', 'Mobile', 'Cloud', 'CRM'].map(tag => (
            <span key={tag} className="showreel-tag sr-fade">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
