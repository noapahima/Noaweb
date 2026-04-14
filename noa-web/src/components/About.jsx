import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const text = "We are Noa Software Solutions - a boutique studio crafting custom technology that gives businesses an unfair advantage. From AI-powered workflows to pixel-perfect interfaces, we turn ambitious ideas into real products that scale.";

export default function About() {
  const sectionRef = useRef(null);
  const textRef    = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    el.innerHTML = text
      .split(' ')
      .map(w => `<span class="about-word" style="display:inline-block;white-space:pre;color:#111;">${w} </span>`)
      .join('');

    const spans = Array.from(el.querySelectorAll('.about-word'));

    // Group into lines by offsetTop
    const lineMap = new Map();
    spans.forEach(s => {
      const top = s.offsetTop;
      if (!lineMap.has(top)) lineMap.set(top, []);
      lineMap.get(top).push(s);
    });
    const lines = Array.from(lineMap.values());

    lines.forEach(line => gsap.set(line, { x: 500, opacity: 0 }));

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=900',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      // Text scrub starts early — as section enters viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 100%',
          end: 'top 20%',
          scrub: 0.5,
        },
      });

      const slice = 1 / lines.length;
      lines.forEach((line, i) => {
        tl.to(line,
          { x: 0, opacity: 1, ease: 'power3.out', duration: slice },
          i * slice * 0.4
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="about-section"
      id="about"
      ref={sectionRef}
      style={{ background: '#fff', color: '#111', minHeight: '100vh' }}
    >
      <p className="about-label">// About</p>
      <p className="about-text" ref={textRef} />
    </section>
  );
}
