import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
gsap.registerPlugin(ScrollTrigger);
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Services from './components/Services';
import ContactReveal from './components/ContactReveal';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Always check if white-background section is behind the nav
    let prev = false;
    let rafId;
    const tick = () => {
      const el = document.querySelector('.services-wrap');
      let isLight = false;
      if (el) {
        const r = el.getBoundingClientRect();
        // services-wrap is white — check if it overlaps nav zone (top 80px)
        if (r.top < 80 && r.bottom > 80) {
          // Check if we're in the white phase: track hasn't fully scrolled yet
          const track = document.querySelector('.services-track');
          if (track) {
            const tx = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
            const maxScroll = track.scrollWidth - window.innerWidth;
            isLight = tx > -maxScroll; // still in horizontal scroll (white phase)
          } else {
            isLight = true;
          }
        }
      }
      if (isLight !== prev) {
        prev = isLight;
        document.body.classList.toggle('bg-light', isLight);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => lenis.destroy();
  }, [loaded]);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <div className="noise" />
      <Cursor />
      <Hero />
      <Services />
      <ContactReveal />
      <Contact />
      <Footer />
    </>
  );
}
