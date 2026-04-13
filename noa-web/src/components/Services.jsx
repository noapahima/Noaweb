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

// Starting X position (as fraction of vw) for each service ball
// alternates: center → right → left → right → left → right
const BALL_FX = [0.5, 0.82, 0.18, 0.82, 0.18, 0.82];

export default function Services() {
  const wrapRef      = useRef(null);
  const trackRef     = useRef(null);
  const aboutTxtRef  = useRef(null);
  const expandRef    = useRef(null);
  const blackPanelRef= useRef(null);
  const contentRefs  = useRef([]);
  const nextDotRef   = useRef(null);

  useEffect(() => {
    // ── About text word animation ─────────────────────────────────────────
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

    const getScrollAmt = () => track.scrollWidth - window.innerWidth;
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
    const expand    = expandRef.current;
    const blackPanel= blackPanelRef.current;
    const nextDot   = nextDotRef.current;
    if (!expand || !blackPanel || !nextDot) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Scroll budget per service
    const BUDGET = vw * 1.8;
    const TOTAL  = BUDGET * services.length;

    // Phase fractions within each service budget
    const PH_EXPAND   = 0.22; // 0 → expand fully
    const PH_SHOW     = 0.78; // expand → start collapse
    const PH_COLLAPSE = 0.93; // show → fully collapsed

    // Ball starting positions (top-left of 20×20 dot)
    const ballPos = BALL_FX.map(fx => ({
      x: fx * vw - 10,
      y: vh / 2 - 10,
    }));

    // Panel dimensions when fully expanded (covers left 65%)
    const PANEL_W = vw * 0.65;
    const PANEL_H = vh;

    const updateStage = (self) => {
      const rawIdx   = self.progress * services.length;
      const idx      = Math.min(services.length - 1, Math.floor(rawIdx));
      const sp       = rawIdx - idx; // 0→1 within this service

      const pos     = ballPos[idx];
      const nextPos = idx < services.length - 1 ? ballPos[idx + 1] : null;

      // power2.inOut easing inline
      const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      // ── Expand phase ──────────────────────────────────────────────────
      if (sp < PH_EXPAND) {
        const t  = sp / PH_EXPAND;
        const et = easeInOut(t);

        gsap.set(blackPanel, {
          x:            pos.x * (1 - et),
          y:            pos.y * (1 - et),
          width:        20 + (PANEL_W - 20) * et,
          height:       20 + (PANEL_H - 20) * et,
          borderRadius: `${50 * (1 - et)}%`,
          opacity:      1,
        });

        // Fade in content near end of expand
        const contentT = Math.max(0, (et - 0.75) / 0.25);
        contentRefs.current.forEach((c, i) => {
          if (!c) return;
          c.style.opacity = i === idx ? contentT : 0;
        });
        gsap.set(nextDot, { opacity: 0 });
        return;
      }

      // ── Show phase (static — nothing moves) ───────────────────────────
      if (sp < PH_SHOW) {
        gsap.set(blackPanel, {
          x: 0, y: 0,
          width: PANEL_W, height: PANEL_H,
          borderRadius: 0, opacity: 1,
        });
        contentRefs.current.forEach((c, i) => {
          if (!c) return;
          c.style.opacity = i === idx ? 1 : 0;
        });

        // Show next dot on the right while service is open
        if (nextPos) {
          gsap.set(nextDot, { x: nextPos.x, y: nextPos.y, opacity: 1 });
        } else {
          gsap.set(nextDot, { opacity: 0 });
        }
        return;
      }

      // ── Collapse phase ────────────────────────────────────────────────
      if (sp < PH_COLLAPSE) {
        const t   = (sp - PH_SHOW) / (PH_COLLAPSE - PH_SHOW);
        const ct  = gsap.parseEase('power2.inOut')(t);
        const end = nextPos || pos; // collapse toward next ball or stay

        gsap.set(blackPanel, {
          x:            0 + end.x * ct,
          y:            0 + end.y * ct,
          width:        PANEL_W - (PANEL_W - 20) * ct,
          height:       PANEL_H - (PANEL_H - 20) * ct,
          borderRadius: `${50 * ct}%`,
          opacity:      1,
        });

        const fadeT = Math.max(0, 1 - ct / 0.3);
        contentRefs.current.forEach((c, i) => {
          if (!c) return;
          c.style.opacity = i === idx ? fadeT : 0;
        });
        gsap.set(nextDot, { opacity: 0 });
        return;
      }

      // ── Transition: ball sitting at next position ─────────────────────
      const end = nextPos || pos;
      gsap.set(blackPanel, {
        x: end.x, y: end.y,
        width: 20, height: 20,
        borderRadius: '50%', opacity: 1,
      });
      contentRefs.current.forEach(c => { if (c) c.style.opacity = 0; });
      gsap.set(nextDot, { opacity: 0 });
    };

    ScrollTrigger.create({
      trigger: expand,
      start:   'top top',
      end:     `+=${TOTAL}`,
      pin:     true,
      scrub:   1.2,
      onUpdate: updateStage,
    });

    // Init: ball at center (matching hero landing dot)
    gsap.set(blackPanel, { x: ballPos[0].x, y: ballPos[0].y, width: 20, height: 20, borderRadius: '50%', opacity: 1 });
    gsap.set(nextDot, { opacity: 0 });

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

          <div className="services-panel services-panel-title">
            <span className="services-title-dot" />
            <span className="services-eyebrow">What We Do</span>
            <h2 className="services-big-title">Services</h2>
            <span className="services-hint">↓ scroll</span>
          </div>

        </div>
      </div>

      {/* ── Service expand section ── */}
      <div ref={expandRef} className="service-expand-section">

        {/* Background: white, same look as services title panel */}
        <div className="service-expand-bg">
          <span className="services-eyebrow">What We Do</span>
          <h2 className="services-big-title">Services</h2>
        </div>

        {/* Expanding black panel */}
        <div ref={blackPanelRef} className="service-black-panel">
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

        {/* Next dot indicator (right side) */}
        <div ref={nextDotRef} className="service-next-dot" />

      </div>
    </>
  );
}
