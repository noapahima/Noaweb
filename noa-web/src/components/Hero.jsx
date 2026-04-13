import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const dotRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.hw-n',           { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' })
      .fromTo('.hw-o',           { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.05')
      .fromTo('.hw-a',           { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.05')
      .fromTo('.hw-sub-line',    { y: '110%' }, { y: '0%', duration: 1.0, ease: 'power4.out' }, '-=0.6')
      .fromTo('.hero-sub',       { opacity: 0 }, { opacity: 0.35, duration: 0.8 }, '-=0.4')
      .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4')
      .call(() => {
        const staticDot = document.querySelector('.hw-small-dot');
        const dot = dotRef.current;
        if (!staticDot || !dot) return;

        const r      = staticDot.getBoundingClientRect();
        const startX = r.left + r.width  * 0.5;
        const startY = r.top  + r.height * 0.5;

        gsap.set(staticDot, { opacity: 0 });
        gsap.set(dot, { x: startX, y: startY, opacity: 1 });

        // ── Helpers ──────────────────────────────────────────────
        const aboutTextEl = document.querySelector('.about-text');
        // Land ball above the letters (bottom of ball touches top of text)
        const textViewY   = () =>
          aboutTextEl
            ? aboutTextEl.getBoundingClientRect().top - 28
            : window.innerHeight * 0.35;

        // Phase 1 budget (fixed)
        const B1 = window.innerWidth * 0.18;
        // Phase 2 budget calculated dynamically when phase 2 starts,
        // so the ball lands exactly when the Services title panel is centred.
        let b2Budget = window.innerWidth * 2.0; // fallback

        let b1Acc = 0, b2Acc = 0;
        let b1StartX = startX;
        let b2StartX = startX, b2StartY = 0;
        // -1 = hero ScrollTrigger in control
        //  1 = first bounce
        //  2 = second bounce (big jump to page-3 centre)
        //  3 = done
        let bouncePhase = -1;
        let lastScroll  = window.scrollY;

        // ── Scroll-driven bounce handler ─────────────────────────
        const onScroll = () => {
          const delta = window.scrollY - lastScroll;
          lastScroll  = window.scrollY;
          if (delta === 0 || bouncePhase < 1) return;

          // Phase 1 — small hop to the right
          if (bouncePhase === 1) {
            b1Acc += delta;
            const t  = Math.max(0, Math.min(1, b1Acc / B1));
            const lY = textViewY();
            gsap.set(dot, {
              x: b1StartX + window.innerWidth * 0.18 * t,
              y: lY - 180 * 4 * t * (1 - t),
            });
            if (t >= 1) {
              b2StartX = b1StartX + window.innerWidth * 0.18;
              b2StartY = textViewY();
              b2Acc    = 0;
              // Calculate exact pixels needed for title panel to reach viewport centre
              const titleEl = document.querySelector('.services-panel-title');
              if (titleEl) {
                const pr = titleEl.getBoundingClientRect();
                const distToCenter = (pr.left + pr.width / 2) - window.innerWidth / 2;
                b2Budget = Math.max(distToCenter, window.innerWidth * 0.4);
              }
              bouncePhase = 2;
            }
            if (b1Acc <= 0) bouncePhase = -1;
            return;
          }

          // Phase 2 — big arc to centre of page 3 (Services title panel)
          if (bouncePhase === 2) {
            b2Acc += delta;
            const t    = Math.max(0, Math.min(1, b2Acc / b2Budget));
            const endX = window.innerWidth  / 2;
            const endY = window.innerHeight / 2;
            const cx   = b2StartX + (endX - b2StartX) * t;
            const cy   = b2StartY + (endY - b2StartY) * t - 260 * 4 * t * (1 - t);
            gsap.set(dot, { x: cx, y: cy });
            if (t >= 1) {
              bouncePhase = 3;
              gsap.to(dot, { opacity: 0, duration: 0.6, delay: 0.4 });
            }
            if (b2Acc <= 0) { b1Acc = B1; bouncePhase = 1; }
            return;
          }

          // Phase 3 — allow rewinding
          if (bouncePhase === 3 && delta < 0) {
            gsap.killTweensOf(dot);
            gsap.set(dot, { opacity: 1 });
            b2Acc       = b2Budget;
            bouncePhase = 2;
          }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // ── Hero ScrollTrigger — fall to about-text first line ───
        ScrollTrigger.create({
          trigger: '#hero',
          start:   'top top',
          end:     'bottom top',
          scrub:   1,
          onUpdate: (self) => {
            if (bouncePhase >= 1) return; // bounce phases took over
            const p       = self.progress;
            const targetY = textViewY();
            const newY    = startY + (targetY - startY) * p;
            const color   = newY >= window.innerHeight * (1 - p) ? '#000' : '#fff';
            gsap.set(dot, { x: startX, y: newY, background: color });
          },
          onLeave: () => {
            lastScroll  = window.scrollY; // reset delta baseline
            b1StartX    = startX;
            b1Acc       = 0;
            bouncePhase = 1;
            gsap.set(dot, { background: '#000' });
          },
          onEnterBack: () => {
            bouncePhase = -1;
            gsap.killTweensOf(dot);
            gsap.set(dot, { opacity: 1, background: '#fff' });
          },
        });
      });
  }, []);

  return (
    <section className="hero" id="hero">

      {/* Traveling dot — fixed, falls from NOA dot then bounces */}
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
