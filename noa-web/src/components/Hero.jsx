import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const dotRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.hw-n',             { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' })
      .fromTo('.hw-o',             { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.05')
      .fromTo('.hw-a',             { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.05')
      .fromTo('.hw-sub-line',      { y: '110%' }, { y: '0%', duration: 1.0, ease: 'power4.out' }, '-=0.6')
      .fromTo('.hero-sub',         { opacity: 0 }, { opacity: 0.35, duration: 0.8 }, '-=0.4')
      .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1,    duration: 0.6 }, '-=0.4')
      .call(() => {
        // After animation: set up the falling dot
        const staticDot = document.querySelector('.hw-small-dot');
        const travelDot = dotRef.current;
        if (!staticDot || !travelDot) return;

        const r = staticDot.getBoundingClientRect();
        const startX = r.left + r.width * 0.5;
        const startY = r.top  + r.height * 0.5;
        const endY   = Math.max(startY + window.innerHeight * 0.6, window.innerHeight * 0.9);

        // Hide static dot — traveling dot takes over
        gsap.set(staticDot, { opacity: 0 });
        gsap.set(travelDot, { x: startX, y: startY, opacity: 1 });

        // Scrub fall as hero scrolls away
        ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const p    = self.progress;
            const newY = startY + (endY - startY) * p;
            const whitePanelTop = window.innerHeight * (1 - p);
            const color = newY >= whitePanelTop ? '#000' : '#fff';
            gsap.set(travelDot, { x: startX, y: newY, background: color });
          },
          onLeave: () => {
            gsap.set(travelDot, { background: '#000' });
          },
          onEnterBack: () => {
            gsap.set(travelDot, { background: '#fff' });
          },
        });
      });
  }, []);

  return (
    <section className="hero" id="hero">

      {/* Traveling dot — fixed, falls from NOA dot position */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 20, height: 20, borderRadius: '50%',
        background: '#fff', pointerEvents: 'none',
        zIndex: 100, opacity: 0,
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
