import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );
  }, []);

  return (
    <section className="about-section" id="about" ref={sectionRef} style={{ background: '#fff', color: '#111' }}>
      <p className="about-label">// About</p>
      <p className="about-text" ref={textRef}>
        <em>We are </em><strong>Noa Software Solutions</strong>
        <em> — a boutique studio crafting </em>
        <strong>custom technology</strong>
        <em> that gives businesses an unfair advantage. From </em>
        <strong>AI-powered workflows</strong>
        <em> to </em>
        <strong>pixel-perfect interfaces</strong>
        <em>, we turn ambitious ideas into </em>
        <strong>real products</strong>
        <em> that scale.</em>
      </p>
    </section>
  );
}
