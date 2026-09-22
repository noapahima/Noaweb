import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactReveal() {
  const wrapRef = useRef(null);
  const dotRef  = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const dot  = dotRef.current;
    if (!wrap || !dot) return;

    gsap.set(dot, { width: 20, height: 20, borderRadius: '50%' });

    const tl = gsap.timeline({ paused: true });
    tl.to(dot, {
      width:        '58vw',
      height:       '64vh',
      borderRadius: '3px',
      ease:         'power2.inOut',
      duration:     1,
    });

    const st = ScrollTrigger.create({
      trigger: wrap,
      start:   'top top',
      end:     '+=100%',
      pin:     true,
      scrub:   1.2,
      animation: tl,
    });

    return () => st.kill();
  }, []);

  return (
    <div ref={wrapRef} style={{ height: '200vh', background: '#000' }}>
      <div style={{
        position: 'sticky', top: 0,
        width: '100%', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div ref={dotRef} style={{
          background:    '#fff',
          flexShrink:    0,
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}
