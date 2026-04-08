import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { num: '50+', label: 'Projects Delivered' },
  { num: '100%', label: 'Client Satisfaction' },
  { num: '6',   label: 'Core Services' },
  { num: '24/7', label: 'Support' },
];

export default function Stats() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.stat-item'),
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <div className="stats-section" ref={sectionRef}>
      {stats.map(s => (
        <div className="stat-item" key={s.label}>
          <span className="stat-num">{s.num}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
