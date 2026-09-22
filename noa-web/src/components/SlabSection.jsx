import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const slabs = [
  { text: 'CUSTOM SOFTWARE',  rotate: '-5deg',  dir: -1 },
  { text: 'DIGITAL PRODUCTS', rotate:  '4deg',  dir:  1 },
  { text: 'BUILT TO SCALE',   rotate: '-3deg',  dir: -1 },
];

export default function SlabSection() {
  const sectionRef = useRef(null);
  const slabRefs   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      slabRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { x: slabs[i].dir * 80 },
          {
            x: slabs[i].dir * -80,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end:   'bottom top',
              scrub: 1.2,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="slab-section">
      <div className="slab-stack">
        {slabs.map((s, i) => (
          <div
            key={i}
            className="slab-row"
            style={{ transform: `rotate(${s.rotate})` }}
          >
            <div
              ref={el => slabRefs.current[i] = el}
              className="slab-pill"
            >
              {s.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
