import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: '01',
    name: 'Custom CRM',
    desc: 'Bespoke lead management, automated pipelines, and advanced analytics tailored to your exact business needs.',
  },
  {
    num: '02',
    name: 'Business Automations',
    desc: 'End-to-end workflow optimization using Zapier, Make, and custom API integrations to eliminate manual tasks.',
  },
  {
    num: '03',
    name: 'Web Development',
    desc: 'High-performance, responsive websites built with React and Next.js — focusing on speed and stunning UI/UX.',
  },
  {
    num: '04',
    name: 'Mobile Applications',
    desc: 'Premium cross-platform apps for iOS and Android using React Native and Flutter.',
  },
  {
    num: '05',
    name: 'AI Integration',
    desc: 'Smart agents, LLM-based workflows, and custom chatbots that boost your team\'s productivity.',
  },
  {
    num: '06',
    name: 'Cloud & Infrastructure',
    desc: 'Scalable cloud architecture on AWS/GCP, DevOps pipelines, and security-first deployments.',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          delay: i * 0.05,
        }
      );
    });
  }, []);

  return (
    <section className="services-section" id="services" ref={sectionRef} style={{ background: '#000', color: '#fff' }}>
      <div className="services-header">
        <h2 className="services-title">
          What<br />We Do
        </h2>
        <span className="services-count">06 Services</span>
      </div>

      {services.map((s, i) => (
        <div
          key={s.num}
          className="service-item"
          ref={el => itemsRef.current[i] = el}
        >
          <span className="service-num">{s.num}</span>
          <span className="service-name">{s.name}</span>
          <span className="service-desc">{s.desc}</span>
          <span className="service-arrow">→</span>
        </div>
      ))}
    </section>
  );
}
