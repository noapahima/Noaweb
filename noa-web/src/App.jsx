import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';
import TravelingDot from './components/TravelingDot';
import CloudDivider from './components/CloudDivider';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [loaded]);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <div className="noise" />
      <Cursor />
      <div className="site-logo">Noa</div>
      <TravelingDot />
      <Nav />
      <Hero />
      <About />
      <Services />
      <Stats />
      <Contact />
      <Footer />
    </>
  );
}
