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

  // expand section
  const expandRef   = useRef(null);
  const panelRef    = useRef(null);
  const dot0Ref     = useRef(null);
  const dot1Ref     = useRef(null);
  const dot2Ref     = useRef(null);
  const contentRefs = useRef([]);

  useEffect(() => {
    // ── About text animation ──────────────────────────────────────────────
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

    // ── Horizontal scroll: About + Services title (2 panels = 1×vw) ──────
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const getScrollAmt = () => Math.max(1, track.scrollWidth - window.innerWidth);
    const hCtx = gsap.context(() => {
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

    // ── Service expand section ────────────────────────────────────────────
    const expand = expandRef.current;
    const panel  = panelRef.current;
    if (!expand || !panel) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Inline power2.inOut easing
    const eIO  = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const lerp = (a, b, t) => a + (b - a) * t;

    const OPEN_X  = vw * 0.22 - 10;   // x where left ball opens
    const WAIT_X  = vw * 0.70 - 10;   // x where right ball waits
    const BY      = vh / 2 - 10;       // ball Y (matches hero landing)
    const PANEL_W = vw * 0.65;
    const PANEL_H = vh;
    const BUDGET  = vw * 3.5;          // scroll budget per service
    const TOTAL   = BUDGET * services.length;

    // 3 dot elements rotated through roles (opening / waiting / entering)
    const dots = [dot0Ref.current, dot1Ref.current, dot2Ref.current];
    const opening  = i => dots[i % 3];
    const waiting  = i => dots[(i + 1) % 3];
    const entering = i => dots[(i + 2) % 3];

    // Initial positions — dots[0] matches hero landing dot
    gsap.set(dots[0], { x: vw / 2 - 10, y: BY, opacity: 1 });
    gsap.set(dots[1], { x: vw * 0.85,   y: BY, opacity: 0 });
    gsap.set(dots[2], { x: vw + 20,     y: BY, opacity: 0 });
    // Panel is always full size, positioned at 0,0 — clip-path controls visibility
    gsap.set(panel, { x: 0, y: 0, width: PANEL_W, height: PANEL_H, borderRadius: 0, clipPath: `circle(0px at ${OPEN_X + 10}px ${BY + 10}px)`, opacity: 1 });
    contentRefs.current.forEach(c => c && (c.style.opacity = '0'));

    // Max radius to cover full panel from any ball position
    const maxR = Math.sqrt(PANEL_W * PANEL_W + PANEL_H * PANEL_H);

    ScrollTrigger.create({
      trigger: expand,
      start:   'top top',
      end:     `+=${TOTAL}`,
      pin:     true,
      scrub:   1.2,
      onUpdate(self) {
        const raw = self.progress * services.length;
        const idx = Math.min(services.length - 1, Math.floor(raw));
        const sp  = raw - idx; // 0→1 within current service

        const op = opening(idx);
        const wa = waiting(idx);
        const en = entering(idx);

        const isFirst = idx === 0;

        // Phase breakpoints
        const PH_SLIDE = isFirst ? 0.12 : 0;
        const PH_EXP   = PH_SLIDE + 0.18;
        const PH_SHOW  = PH_EXP   + 0.44;  // longer open time
        const PH_CLOSE = PH_SHOW  + 0.16;
        // EXIT: PH_CLOSE → 1.0

        // Reset content
        contentRefs.current.forEach((c, i) => c && (c.style.opacity = i === idx ? '' : '0'));

        // clip-path origin = center of opening dot
        const ox = OPEN_X + 10;
        const oy = BY + 10;
        const clip = r => `circle(${r}px at ${ox}px ${oy}px)`;

        // ── SLIDE (service 0 only) ──────────────────────────────────────
        if (isFirst && sp < PH_SLIDE) {
          const t = eIO(sp / PH_SLIDE);
          gsap.set(op, { x: lerp(vw / 2 - 10, OPEN_X, t), y: BY, opacity: 1 });
          gsap.set(wa, { x: lerp(vw * 0.85, WAIT_X, t), y: BY, opacity: t });
          gsap.set(en, { opacity: 0 });
          gsap.set(panel, { clipPath: clip(0) });
          if (contentRefs.current[idx]) contentRefs.current[idx].style.opacity = '0';
          return;
        }

        // ── EXPAND: circle grows from dot to cover full panel ────────────
        if (sp < PH_EXP) {
          const t = eIO((sp - PH_SLIDE) / 0.28);
          gsap.set(en, { x: vw + 20, y: BY, opacity: 0 });
          gsap.set(op, { opacity: 0 });
          gsap.set(wa, { x: WAIT_X, y: BY, opacity: 1 });
          gsap.set(panel, { clipPath: clip(lerp(10, maxR, t)) });
          const ct = Math.max(0, (t - 0.72) / 0.28);
          if (contentRefs.current[idx]) contentRefs.current[idx].style.opacity = ct;
          return;
        }

        // ── SHOW ────────────────────────────────────────────────────────
        if (sp < PH_SHOW) {
          gsap.set(en, { opacity: 0 });
          gsap.set(op, { opacity: 0 });
          gsap.set(wa, { x: WAIT_X, y: BY, opacity: 1 });
          gsap.set(panel, { clipPath: clip(maxR) });
          if (contentRefs.current[idx]) contentRefs.current[idx].style.opacity = '1';
          return;
        }

        // ── CLOSE: circle shrinks back to dot ───────────────────────────
        if (sp < PH_CLOSE) {
          const t = eIO((sp - PH_SHOW) / 0.22);
          gsap.set(en, { opacity: 0 });
          gsap.set(op, { opacity: 0 });
          gsap.set(wa, { x: WAIT_X, y: BY, opacity: 1 });
          gsap.set(panel, { clipPath: clip(lerp(maxR, 10, t)) });
          const ct = Math.max(0, 1 - t / 0.3);
          if (contentRefs.current[idx]) contentRefs.current[idx].style.opacity = ct;
          return;
        }

        // ── EXIT / SLIDE ─────────────────────────────────────────────────
        const t = eIO((sp - PH_CLOSE) / (1 - PH_CLOSE));
        const hasNext = idx < services.length - 1;

        gsap.set(panel, { clipPath: clip(0) });
        gsap.set(op, { x: lerp(OPEN_X, -40, t), y: BY, opacity: 1 });
        gsap.set(wa, { x: lerp(WAIT_X, OPEN_X, t), y: BY, opacity: 1 });
        if (hasNext) {
          gsap.set(en, { x: lerp(vw + 20, WAIT_X, t), y: BY, opacity: t });
        } else {
          gsap.set(en, { opacity: 0 });
        }
        if (contentRefs.current[idx]) contentRefs.current[idx].style.opacity = '0';
      },
    });

    return () => hCtx.revert();
  }, []);

  return (
    <>
      {/* ── Horizontal scroll: About + Services title ── */}
      <div className="services-wrap" id="services" ref={wrapRef}>
        <div className="services-track" ref={trackRef}>

          <div className="services-panel services-panel-white" id="about">
            <p className="about-label">// About</p>
            <p className="about-text" ref={aboutTxtRef} />
          </div>

        </div>
      </div>

      {/* ── Service expand section (6 balls) ── */}
      <div ref={expandRef} className="service-expand-section">

        {/* Static title — bottom right, never moves */}
        <div className="service-expand-title">
          <span className="services-eyebrow">What We Do</span>
          <h2 className="services-big-title">Services</h2>
        </div>

        {/* Expanding black panel */}
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

    </>
  );
}
