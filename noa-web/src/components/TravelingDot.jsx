import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function TravelingDot() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;

    const init = () => {
      const heroDotEl   = document.querySelector('.hw-dot');
      const aboutTextEl = document.querySelector('.about-text');
      const aboutEl     = document.querySelector('#about');
      if (!heroDotEl || !aboutTextEl || !aboutEl) return;

      gsap.set(heroDotEl, { opacity: 0 });

      // Starting viewport position
      const r      = heroDotEl.getBoundingClientRect();
      const fixedX = r.left + r.width * 0.3;

      // Track in VIEWPORT Y (not page Y)
      let viewY      = r.top + r.height * 0.75;
      let lastScroll = window.scrollY;

      // Bounce budgets
      const B1 = 160, B2 = 320, B3 = 180;
      let b1Acc = 0, b2Acc = 0, b3Acc = 0;
      let b1StartX = fixedX, b2StartX = fixedX, b3StartX = fixedX;
      let phase = 0; // 0=falling 1=b1 2=b2 3=b3 4=done

      // Text top in viewport — recalculated every frame
      const textViewY = () => aboutTextEl.getBoundingClientRect().top + 8;
      const aboutViewY = () => aboutEl.getBoundingClientRect().top;

      const show = (x, y) => {
        gsap.killTweensOf(dot);
        gsap.set(dot, {
          x, y,
          opacity: 1,
          backgroundColor: y >= aboutViewY() ? '#000' : '#fff',
        });
      };

      const onScroll = () => {
        const delta = window.scrollY - lastScroll;
        lastScroll  = window.scrollY;
        if (delta === 0) return;

        if (phase === 0) {
          // Fall DOWN in viewport at 50% of scroll speed
          viewY += delta * 0.5;
          show(fixedX, viewY);

          if (delta > 0 && viewY >= textViewY()) {
            viewY    = textViewY();
            phase    = 1;
            b1Acc    = 0;
            b1StartX = fixedX;
          }
          // going back up past hero
          if (delta < 0 && viewY < -20) {
            gsap.set(dot, { opacity: 0 });
          } else {
            gsap.set(dot, { opacity: 1 });
          }
          return;
        }

        if (phase === 1) {
          b1Acc += delta;
          const t  = Math.max(0, Math.min(1, b1Acc / B1));
          const lY = textViewY();
          show(b1StartX + window.innerWidth * 0.35 * t, lY - 70 * 4 * t * (1 - t));
          if (t >= 1) { phase = 2; b2Acc = 0; b2StartX = b1StartX + window.innerWidth * 0.35; }
          if (b1Acc <= 0) { phase = 0; viewY = textViewY(); }
          return;
        }

        if (phase === 2) {
          b2Acc += delta;
          const t  = Math.max(0, Math.min(1, b2Acc / B2));
          const lY = textViewY();
          show(b2StartX + window.innerWidth * 0.28 * t, lY - 55 * 4 * t * (1 - t));
          if (t >= 1) { phase = 3; b3Acc = 0; b3StartX = b2StartX + window.innerWidth * 0.28; }
          if (b2Acc <= 0) { phase = 1; b1Acc = B1; }
          return;
        }

        if (phase === 3) {
          // Check if all words are visible yet
          const words = aboutTextEl.querySelectorAll('.about-char-inner');
          const lastWord = words[words.length - 1];
          const wordsAllIn = lastWord
            ? parseFloat(getComputedStyle(lastWord).opacity) > 0.9
            : true;

          // Only advance if words are all in
          if (delta > 0 && !wordsAllIn) {
            // hold at current position
            return;
          }

          b3Acc += delta;
          const t  = Math.max(0, Math.min(1, b3Acc / B3));
          const lY = textViewY();
          show(b3StartX + window.innerWidth * 0.65 * t, lY - 40 * 4 * t * (1 - t));
          if (t >= 1) { phase = 4; gsap.to(dot, { opacity: 0, duration: 0.3 }); }
          if (b3Acc <= 0) { phase = 2; b2Acc = B2; }
          return;
        }

        if (phase === 4 && delta < 0) {
          gsap.killTweensOf(dot);
          gsap.set(dot, { opacity: 1 });
          phase = 3;
          b3Acc = B3;
        }
      };

      gsap.set(dot, { x: fixedX, y: viewY, opacity: 1, backgroundColor: '#fff' });
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    };

    const timer = setTimeout(init, 2100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         16,
        height:        16,
        borderRadius:  '50%',
        background:    '#fff',
        zIndex:        50,
        pointerEvents: 'none',
        willChange:    'transform',
        opacity:       0,
      }}
    />
  );
}
