import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const themeBlack = () => getComputedStyle(document.documentElement).getPropertyValue('--black').trim() || '#000';
const themeWhite = () => getComputedStyle(document.documentElement).getPropertyValue('--white').trim() || '#fff';

const NAV_LINKS = [
  { href: '#hero',     label: 'Home'     },
  { href: '#about',    label: 'About'    },
  { href: '#services', label: 'Services' },
  { href: '#contact',  label: 'Contact'  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 * i },
  }),
};

export default function Hero() {
  const dotRef      = useRef(null);
  const figLeftRef  = useRef(null);
  const figRightRef = useRef(null);
  const noaRef      = useRef(null);

  /* ── Traveling ball ── */
  useEffect(() => {
    const dot       = dotRef.current;
    const staticDot = document.querySelector('.hw-small-dot');
    if (!dot || !staticDot) return;

    const r = staticDot.getBoundingClientRect();
    const startX = r.left + r.width * 0.5;
    const startY = r.top  + r.height * 0.5;
    const vw = window.innerWidth, vh = window.innerHeight;
    const heroEnd = vh;
    const finalX = vw / 2 - 10, finalY = vh / 2 - 10;

    const aboutTextEl = document.querySelector('.about-text');
    const rawTop = aboutTextEl ? aboutTextEl.getBoundingClientRect().top : heroEnd + vh * 0.22;
    const textY = rawTop - heroEnd;

    gsap.set(staticDot, { opacity: 0 });
    gsap.set(dot, { x: startX, y: startY, opacity: 1, background: themeWhite() });

    const B1 = vw * 0.22, B2 = vw * 0.78;
    const hop1EndX = startX + vw * 0.22;
    let hasLanded = false;

    const landingDot = document.createElement('div');
    landingDot.id = 'hero-landing-dot';
    landingDot.style.cssText = `position:fixed;width:20px;height:20px;border-radius:50%;background:${themeBlack()};pointer-events:none;z-index:200;top:0;left:0;opacity:0;transform-origin:center center;`;
    document.body.appendChild(landingDot);

    const updateBall = () => {
      const s = window.scrollY, ds = s - heroEnd;
      if (s <= 0) { gsap.set(dot, { x: startX, y: startY, background: themeWhite(), opacity: 1 }); return; }
      if (s < heroEnd) {
        const p2 = s / heroEnd, newY = startY + (textY - startY) * p2;
        gsap.set(dot, { x: startX, y: newY, background: newY >= (vh - s) ? themeBlack() : themeWhite(), opacity: 1 });
        return;
      }
      if (ds >= B1 + B2) {
        if (!hasLanded) {
          hasLanded = true;
          gsap.set(landingDot, { x: finalX, y: finalY });
          gsap.set(dot, { opacity: 0 });
          gsap.fromTo(landingDot, { opacity: 1, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' });
        }
        return;
      }
      if (hasLanded) { hasLanded = false; gsap.set(landingDot, { opacity: 0 }); gsap.set(dot, { x: finalX, y: finalY, background: themeBlack(), opacity: 1 }); }
      if (ds <= B1) {
        const t2 = ds / B1;
        gsap.set(dot, { x: startX + (hop1EndX - startX) * t2, y: textY - 160 * 4 * t2 * (1 - t2), background: themeBlack(), opacity: 1 });
        return;
      }
      const t3 = (ds - B1) / B2;
      gsap.set(dot, { x: hop1EndX + (finalX - hop1EndX) * t3, y: textY + (finalY - textY) * t3 - 230 * 4 * t3 * (1 - t3), background: themeBlack(), opacity: 1 });
    };
    window.addEventListener('scroll', updateBall, { passive: true });
    updateBall();
    return () => { window.removeEventListener('scroll', updateBall); landingDot.remove(); };
  }, []);

  /* ── Figures: entrance + float ── */
  useEffect(() => {
    const figL = figLeftRef.current;
    const figR = figRightRef.current;
    if (!figL || !figR) return;

    gsap.set(figL, { x: 0, y: 50, opacity: 0 });
    gsap.set(figR, { x: 0, y: 50, opacity: 0 });

    gsap.timeline({ delay: 0.5 })
      .to(figL, { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out' })
      .to(figR, { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }, '-=1.3');

    gsap.to(figL, { y: -18, duration: 4.0, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.2 });
    gsap.to(figR, { y: -13, duration: 4.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6 });
  }, []);

  /* ── Mouse parallax ── */
  useEffect(() => {
    const onMove = (e) => {
      const xR = e.clientX / window.innerWidth  - 0.5;
      const yR = e.clientY / window.innerHeight - 0.5;
      gsap.to(noaRef.current, { x: xR * 10, y: yR * 8, duration: 1.8, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-inner">

        {/* Renaissance frame */}
        <div className="hero-frame" />


        <div className="hero-vignette" />

        {/* Traveling ball */}
        <div ref={dotRef} style={{
          position: 'fixed', top: 0, left: 0,
          width: 20, height: 20, borderRadius: '50%',
          background: themeWhite(), pointerEvents: 'none',
          zIndex: 100, opacity: 0, willChange: 'transform',
        }} />

        {/* NOA text */}
        <div ref={noaRef} className="hero-noa-blend">
          <motion.div className="hero-noa-row" initial="hidden" animate="show">
            {['N', 'O', 'A'].map((letter, i) => (
              <motion.span key={letter} className="hw-letter" custom={i} variants={fadeUp}>
                {letter}
              </motion.span>
            ))}
            <span className="hw-small-dot" />
          </motion.div>
          <motion.div
            className="hero-sub-clip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
          >
            <span className="hw-sub-line">Software Solutions</span>
          </motion.div>
        </div>

        {/* Left-side nav */}
        <motion.nav className="hero-side-nav" initial="hidden" animate="show">
          {NAV_LINKS.map((l, i) => (
            <motion.a key={l.href} href={l.href} custom={i + 4} variants={fadeUp}>
              {l.label}
            </motion.a>
          ))}
        </motion.nav>

        {/* Scroll hint */}
        <motion.div
          className="hero-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="scroll-line" />
        </motion.div>

      </div>
    </section>
  );
}
