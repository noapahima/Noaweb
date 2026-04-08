import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const text = "We are Noa Software Solutions — a boutique studio crafting custom technology that gives businesses an unfair advantage. From AI-powered workflows to pixel-perfect interfaces, we turn ambitious ideas into real products that scale.";

export default function About() {
  const sectionRef = useRef(null);
  const textRef    = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    el.innerHTML = text
      .split(' ')
      .map(word => `<span class="about-char-inner" style="display:inline-block;white-space:pre;">${word} </span>`)
      .join('');

    const chars = el.querySelectorAll('.about-char-inner');
    gsap.set(chars, { x: 120, opacity: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1000',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(chars, {
        x:        0,
        opacity:  1,
        ease:     'none',
        stagger:  0.006,
        duration: 0.02,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="about-section"
      id="about"
      ref={sectionRef}
      style={{ background: '#fff', color: '#111', minHeight: '130vh' }}
    >
      <p className="about-label">// About</p>
      <p className="about-text" ref={textRef} />
    </section>
  );
}
