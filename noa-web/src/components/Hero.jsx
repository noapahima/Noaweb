import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const dotRef = useRef(null);

  useEffect(() => {
    // ── Hero letter entrance ──────────────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.hw-n',            { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' })
      .fromTo('.hw-o',            { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.05')
      .fromTo('.hw-a',            { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.05')
      .fromTo('.hw-sub-line',     { y: '110%' }, { y: '0%', duration: 1.0, ease: 'power4.out' }, '-=0.6')
      .fromTo('.hero-sub',        { opacity: 0 }, { opacity: 0.35, duration: 0.8 }, '-=0.4')
      .fromTo('.hero-scroll-hint',{ opacity: 0 }, { opacity: 1,    duration: 0.6 }, '-=0.4');

    // ── Traveling ball ────────────────────────────────────────────────────
    const dot       = dotRef.current;
    const staticDot = document.querySelector('.hw-small-dot');
    if (!dot || !staticDot) return;

    const r      = staticDot.getBoundingClientRect();
    const startX = r.left + r.width  * 0.5;
    const startY = r.top  + r.height * 0.5;
    const vw     = window.innerWidth;
    const vh     = window.innerHeight;
    const heroEnd = vh;

    const finalX = vw / 2 - 10;
    const finalY = vh / 2 - 10;

    const aboutTextEl = document.querySelector('.about-text');
    const rawTop = aboutTextEl
      ? aboutTextEl.getBoundingClientRect().top
      : heroEnd + vh * 0.22;
    const textY = rawTop - heroEnd;

    gsap.set(staticDot, { opacity: 0 });
    gsap.set(dot, { x: startX, y: startY, opacity: 1, background: '#fff' });

    const B1       = vw * 0.22;
    const B2       = vw * 0.78;
    const hop1EndX = startX + vw * 0.22;

    let hasLanded = false;

    // ── Landing dot (absolute inside services title panel) ────────────────
    const landingDot = document.createElement('div');
    landingDot.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #000;
      pointer-events: none;
      z-index: 10;
      top: 0;
      left: 0;
      opacity: 0;
      transform-origin: center center;
    `;

    const serviceTitlePanel = document.querySelector('.services-panel-title');
    if (serviceTitlePanel) {
      serviceTitlePanel.style.position = 'relative';
      serviceTitlePanel.appendChild(landingDot);
    }

    const updateBall = () => {
      const s  = window.scrollY;
      const ds = s - heroEnd;

      if (s <= 0) {
        gsap.set(dot, { x: startX, y: startY, background: '#fff', opacity: 1 });
        return;
      }

      if (s < heroEnd) {
        const p    = s / heroEnd;
        const newY = startY + (textY - startY) * p;
        const bg   = newY >= (vh - s) ? '#000' : '#fff';
        gsap.set(dot, { x: startX, y: newY, background: bg, opacity: 1 });
        return;
      }

      // ── Ball landed ───────────────────────────────────────────────────
      if (ds >= B1 + B2) {
        if (!hasLanded) {
          hasLanded = true;
          if (serviceTitlePanel) {
            const panelRect = serviceTitlePanel.getBoundingClientRect();
            gsap.set(landingDot, {
              x: finalX - panelRect.left,
              y: finalY - panelRect.top,
            });
          }
          gsap.set(dot, { opacity: 0 });
          gsap.fromTo(landingDot,
            { opacity: 1, scale: 1.4 },
            { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }
          );
        }
        return;
      }

      // ── Scrolled back up past landing ─────────────────────────────────
      if (hasLanded) {
        hasLanded = false;
        gsap.set(landingDot, { opacity: 0 });
        gsap.set(dot, { x: finalX, y: finalY, background: '#000', opacity: 1 });
      }

      // Hop 1
      if (ds <= B1) {
        const t = ds / B1;
        gsap.set(dot, {
          x: startX   + (hop1EndX - startX) * t,
          y: textY    - 160 * 4 * t * (1 - t),
          background: '#000', opacity: 1,
        });
        return;
      }

      // Hop 2 → center of services title panel
      const t = (ds - B1) / B2;
      gsap.set(dot, {
        x: hop1EndX + (finalX - hop1EndX) * t,
        y: textY    + (finalY - textY)    * t - 230 * 4 * t * (1 - t),
        background: '#000', opacity: 1,
      });
    };

    window.addEventListener('scroll', updateBall, { passive: true });
    updateBall();

    return () => {
      window.removeEventListener('scroll', updateBall);
      landingDot.remove();
    };
  }, []);

  return (
    <section className="hero" id="hero">

      <div ref={dotRef} style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         20,
        height:        20,
        borderRadius:  '50%',
        background:    '#fff',
        pointerEvents: 'none',
        zIndex:        100,
        opacity:       0,
        willChange:    'transform',
      }} />

      <div className="hero-center">
        <div className="hero-noa-row">
          <div className="hero-clip"><span className="hw-letter hw-n">N</span></div>
          <div className="hero-clip"><span className="hw-letter hw-o">O</span></div>
          <div className="hero-clip"><span className="hw-letter hw-a">A</span></div>
          <span className="hw-small-dot" />
        </div>
        <div className="hero-clip hero-sub-clip">
          <span className="hw-sub-line">Software Solutions</span>
        </div>
      </div>

      <p className="hero-sub">"Turning ideas into powerful digital products"</p>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
      </div>
    </section>
  );
}
