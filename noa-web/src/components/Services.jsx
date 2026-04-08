import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { num: '01', name: 'Custom CRM',            desc: 'Bespoke lead management, automated pipelines, and advanced analytics tailored to your exact business needs.' },
  { num: '02', name: 'Business Automations',  desc: 'End-to-end workflow optimization using Zapier, Make, and custom API integrations to eliminate manual tasks.' },
  { num: '03', name: 'Web Development',       desc: 'High-performance, responsive websites built with React and Next.js — focusing on speed and stunning UI/UX.' },
  { num: '04', name: 'Mobile Applications',   desc: 'Premium cross-platform apps for iOS and Android using React Native and Flutter.' },
  { num: '05', name: 'AI Integration',        desc: 'Smart agents, LLM-based workflows, and custom chatbots that boost your team\'s productivity.' },
  { num: '06', name: 'Cloud & Infrastructure',desc: 'Scalable cloud architecture on AWS/GCP, DevOps pipelines, and security-first deployments.' },
];

export default function Services() {
  const wrapRef  = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    // Total horizontal distance to scroll
    const getScrollAmt = () => track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getScrollAmt(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${getScrollAmt()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div className="services-wrap" id="services" ref={wrapRef}>
      <div className="services-track" ref={trackRef}>

        {/* First panel — title */}
        <div className="services-panel services-panel-title">
          <span className="services-eyebrow">What We Do</span>
          <h2 className="services-big-title">Services</h2>
          <span className="services-hint">→ scroll</span>
        </div>

        {/* One panel per service */}
        {services.map((s) => (
          <div className="services-panel services-panel-item" key={s.num}>
            <span className="sp-num">{s.num}</span>
            <h3 className="sp-name">{s.name}</h3>
            <p className="sp-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
