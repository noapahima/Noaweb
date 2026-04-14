import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const aboutText = "We are Noa Software Solutions — a boutique studio crafting custom technology that gives businesses an unfair advantage. From AI-powered workflows to pixel-perfect interfaces, we turn ambitious ideas into real products that scale.";

const services = [
  { num: '01', name: 'Custom CRM',             desc: 'Bespoke lead management, automated pipelines, and advanced analytics tailored to your exact business needs.' },
  { num: '02', name: 'Business Automations',   desc: 'End-to-end workflow optimization using Zapier, Make, and custom API integrations to eliminate manual tasks.' },
  { num: '03', name: 'Web Development',        desc: 'High-performance, responsive websites built with React and Next.js — focusing on speed and stunning UI/UX.' },
  { num: '04', name: 'Mobile Applications',    desc: 'Premium cross-platform apps for iOS and Android using React Native and Flutter.' },
  { num: '05', name: 'AI Integration',         desc: "Smart agents, LLM-based workflows, and custom chatbots that boost your team's productivity." },
  { num: '06', name: 'Cloud & Infrastructure', desc: 'Scalable cloud architecture on AWS/GCP, DevOps pipelines, and security-first deployments.' },
];

export default function Services() {
  const wrapRef     = useRef(null);
  const trackRef    = useRef(null);
  const aboutTxtRef = useRef(null);
  const panelRef    = useRef(null);
  const contentRefs = useRef([]);
  const dot0Ref     = useRef(null);
  const dot1Ref     = useRef(null);
  const dot2Ref     = useRef(null);

  useEffect(() => {
    // ── About text animation ──────────────────────────────────────────
    const el = aboutTxtRef.current;
    if (el) {
      el.innerHTML = aboutText
        .split(' ')
        .map(w => `<span class="about-word" style="display:inline-block;white-space:pre;color:#111;">${w} </span>`)
        .join('');
      gsap.set(el.querySelectorAll('.about-word'), { x: 300, opacity: 0 });
      ScrollTrigger.create({
        trigger: wrapRef.current, start: 'top 80%', once: true,
        onEnter: () => gsap.to(el.querySelectorAll('.about-word'), {
          x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.03,
        }),
      });
    }

    const wrap  = wrapRef.current;
    const track = trackRef.current;
    const panel = panelRef.current;
    const dots  = [dot0Ref.current, dot1Ref.current, dot2Ref.current];
    if (!wrap || !track || !panel || dots.some(d => !d)) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const eIO  = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const lerp = (a, b, t) => a + (b - a) * t;

    // Positions
    const START_X = vw / 2 - 10;     // hero ball center
    const LEFT_X  = vw * 0.20 - 10;
    const RIGHT_X = vw * 0.85 - 10;
    const BY      = vh / 2 - 10;

    // Panel clip-path from LEFT_X
    const PANEL_W = vw * 0.75;
    const PANEL_H = vh;
    const OX  = LEFT_X + 10;
    const OY  = BY + 10;
    const maxR = Math.sqrt(
      Math.pow(Math.max(OX, PANEL_W - OX), 2) +
      Math.pow(Math.max(OY, PANEL_H - OY), 2)
    ) + 20;
    const clip = r => `circle(${r}px at ${OX}px ${OY}px)`;

    // Dot role helpers (rotate through 3 dots)
    const leftDot  = i => dots[i % 3];
    const rightDot = i => dots[(i + 1) % 3];
    const newDot   = i => dots[(i + 2) % 3];

    // Scroll budgets
    const SCROLL_AMT = track.scrollWidth - vw;
    const S0_SLIDE   = vw * 0.7;   // initial slide (service 0 only)
    const S_EXPAND   = vw * 0.8;
    const S_SHOW     = vw * 1.2;
    const S_CLOSE    = vw * 0.8;
    const S_EXIT     = vw * 0.7;   // transition between services
    const SVC_BUDGET = S_EXPAND + S_SHOW + S_CLOSE + S_EXIT; // per service (with exit)
    const TOTAL = SCROLL_AMT + S0_SLIDE
      + services.length * (S_EXPAND + S_SHOW + S_CLOSE)
      + (services.length - 1) * S_EXIT;

    // Initial state — all dots hidden, panel closed
    gsap.set(dots[0], { x: START_X,      y: BY, opacity: 0 });
    gsap.set(dots[1], { x: vw + 60,      y: BY, opacity: 0 });
    gsap.set(dots[2], { x: vw + 120,     y: BY, opacity: 0 });
    gsap.set(panel, { clipPath: clip(0) });
    contentRefs.current.forEach(c => c && (c.style.opacity = '0'));

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start:   'top top',
        end:     () => `+=${TOTAL}`,
        pin:     true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scrub:   1,
        onUpdate(self) {
          const scrolled = self.progress * TOTAL;

          // ── Phase 1: horizontal scroll ──────────────────────────────
          gsap.set(track, { x: -Math.min(SCROLL_AMT, scrolled) });

          if (scrolled <= SCROLL_AMT) {
            dots.forEach(d => gsap.set(d, { opacity: 0 }));
            gsap.set(panel, { clipPath: clip(0) });
            contentRefs.current.forEach(c => c && (c.style.opacity = '0'));
            return;
          }

          // Hide hero landing dot
          const landingDot = document.getElementById('hero-landing-dot');
          if (landingDot) landingDot.style.opacity = '0';

          const afterScroll = scrolled - SCROLL_AMT;

          // ── Phase 2: initial slide (service 0 setup) ─────────────────
          if (afterScroll < S0_SLIDE) {
            const t = eIO(afterScroll / S0_SLIDE);
            gsap.set(dots[0], { x: lerp(START_X, LEFT_X, t),  y: BY, opacity: 1 });
            gsap.set(dots[1], { x: lerp(vw + 60, RIGHT_X, t), y: BY, opacity: t });
            gsap.set(dots[2], { opacity: 0 });
            gsap.set(panel, { clipPath: clip(0) });
            contentRefs.current.forEach(c => c && (c.style.opacity = '0'));
            return;
          }

          // ── Phases 3+: service cycles ─────────────────────────────────
          const afterInitSlide = afterScroll - S0_SLIDE;

          // Which service are we on?
          const idx = Math.min(services.length - 1, Math.floor(afterInitSlide / SVC_BUDGET));
          const sp  = afterInitSlide - idx * SVC_BUDGET; // 0→SVC_BUDGET within service

          const ld = leftDot(idx);
          const rd = rightDot(idx);
          const nd = newDot(idx);

          // Only current service content visible
          contentRefs.current.forEach((c, i) => c && (c.style.opacity = i === idx ? '' : '0'));

          // ── EXPAND ───────────────────────────────────────────────────
          if (sp < S_EXPAND) {
            const t = eIO(sp / S_EXPAND);
            gsap.set(ld, { x: LEFT_X,  y: BY, opacity: 0 });
            gsap.set(rd, { x: RIGHT_X, y: BY, opacity: 1 });
            gsap.set(nd, { opacity: 0 });
            gsap.set(panel, { clipPath: clip(lerp(0, maxR, t)) });
            if (contentRefs.current[idx])
              contentRefs.current[idx].style.opacity = String(Math.max(0, (t - 0.6) / 0.4));
            return;
          }

          // ── SHOW ─────────────────────────────────────────────────────
          if (sp < S_EXPAND + S_SHOW) {
            gsap.set(ld, { opacity: 0 });
            gsap.set(rd, { x: RIGHT_X, y: BY, opacity: 1 });
            gsap.set(nd, { opacity: 0 });
            gsap.set(panel, { clipPath: clip(maxR) });
            if (contentRefs.current[idx]) contentRefs.current[idx].style.opacity = '1';
            return;
          }

          // ── CLOSE ────────────────────────────────────────────────────
          if (sp < S_EXPAND + S_SHOW + S_CLOSE) {
            const t = eIO((sp - S_EXPAND - S_SHOW) / S_CLOSE);
            gsap.set(ld, { x: LEFT_X,  y: BY, opacity: 0 });
            gsap.set(rd, { x: RIGHT_X, y: BY, opacity: 1 });
            gsap.set(nd, { opacity: 0 });
            gsap.set(panel, { clipPath: clip(lerp(maxR, 0, t)) });
            if (contentRefs.current[idx])
              contentRefs.current[idx].style.opacity = String(Math.max(0, 1 - t / 0.4));
            return;
          }

          // ── EXIT SLIDE (not for last service) ────────────────────────
          gsap.set(panel, { clipPath: clip(0) });
          if (contentRefs.current[idx]) contentRefs.current[idx].style.opacity = '0';

          if (idx < services.length - 1) {
            const t = eIO((sp - S_EXPAND - S_SHOW - S_CLOSE) / S_EXIT);
            gsap.set(ld, { x: lerp(LEFT_X,  -50,    t), y: BY, opacity: lerp(1, 0, t) });
            gsap.set(rd, { x: lerp(RIGHT_X, LEFT_X, t), y: BY, opacity: 1 });
            gsap.set(nd, { x: lerp(vw + 60, RIGHT_X, t), y: BY, opacity: t });
          } else {
            // Last service done — show left dot reappear at LEFT_X
            gsap.set(ld, { x: LEFT_X,  y: BY, opacity: 1 });
            gsap.set(rd, { x: RIGHT_X, y: BY, opacity: 1 });
            gsap.set(nd, { opacity: 0 });
          }
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div className="services-wrap" id="services" ref={wrapRef}>

      {/* Horizontal track */}
      <div className="services-track" ref={trackRef}>
        <div className="services-panel services-panel-white" id="about">
          <p className="about-label">// About</p>
          <p className="about-text" ref={aboutTxtRef} />
        </div>
        <div className="services-panel services-panel-title">
          <span className="services-eyebrow">What We Do</span>
          <h2 className="services-big-title">Services</h2>
          <span className="services-hint">↓ scroll</span>
        </div>
      </div>

      {/* Expanding panel with all service content */}
      <div ref={panelRef} className="service-black-panel">
        {services.map((s, i) => (
          <div
            key={s.num}
            ref={el => contentRefs.current[i] = el}
            className="service-content-inner"
            style={{ opacity: 0 }}
          >
            <span className="sc-num">{s.num}</span>
            <h3 className="sc-name">{s.name}</h3>
            <p className="sc-desc">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Three rotating dots */}
      <div ref={dot0Ref} className="service-dot" />
      <div ref={dot1Ref} className="service-dot" />
      <div ref={dot2Ref} className="service-dot" />

    </div>
  );
}
