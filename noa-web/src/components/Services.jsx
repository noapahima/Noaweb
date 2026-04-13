import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const aboutText = "We are Noa Software Solutions — a boutique studio crafting custom technology that gives businesses an unfair advantage. From AI-powered workflows to pixel-perfect interfaces, we turn ambitious ideas into real products that scale.";

const services = [
  { num: '01', name: 'Custom CRM',            desc: 'Bespoke lead management, automated pipelines, and advanced analytics tailored to your exact business needs.' },
  { num: '02', name: 'Business Automations',  desc: 'End-to-end workflow optimization using Zapier, Make, and custom API integrations to eliminate manual tasks.' },
  { num: '03', name: 'Web Development',       desc: 'High-performance, responsive websites built with React and Next.js — focusing on speed and stunning UI/UX.' },
  { num: '04', name: 'Mobile Applications',   desc: 'Premium cross-platform apps for iOS and Android using React Native and Flutter.' },
  { num: '05', name: 'AI Integration',        desc: 'Smart agents, LLM-based workflows, and custom chatbots that boost your team\'s productivity.' },
  { num: '06', name: 'Cloud & Infrastructure',desc: 'Scalable cloud architecture on AWS/GCP, DevOps pipelines, and security-first deployments.' },
];

export default function Services() {
  const wrapRef     = useRef(null);
  const trackRef    = useRef(null);
  const aboutTxtRef = useRef(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const el = aboutTxtRef.current;
    if (el) {
      el.innerHTML = aboutText
        .split(' ')
        .map(w => `<span class="about-word" style="display:inline-block;white-space:pre;color:#111;">${w} </span>`)
        .join('');
      gsap.set(el.querySelectorAll('.about-word'), { x: 300, opacity: 0 });
      ScrollTrigger.create({
        trigger: wrap, start: 'top 80%', once: true,
        onEnter: () => gsap.to(el.querySelectorAll('.about-word'), {
          x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.03,
        }),
      });
    }

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

        <div className="services-panel services-panel-white" id="about">
          <p className="about-label">// About</p>
          <p className="about-text" ref={aboutTxtRef} />
        </div>

        <div className="services-panel services-panel-title">
          <span className="services-eyebrow">What We Do</span>
          <h2 className="services-big-title">Services</h2>
          <span className="services-hint">→ scroll</span>
        </div>

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
