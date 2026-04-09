import { useEffect } from 'react';
import { gsap } from 'gsap';
import SmokeBackground from './SmokeBackground';

export default function Hero() {
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.hw-n',             { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' })
      .fromTo('.hw-o',             { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.05')
      .fromTo('.hw-a',             { y: '110%' }, { y: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.05')
      .fromTo('.hw-sub-line',      { y: '110%' }, { y: '0%', duration: 1.0, ease: 'power4.out' }, '-=0.6')
      .fromTo('.hero-sub',         { opacity: 0 }, { opacity: 0.35, duration: 0.8 }, '-=0.4')
      .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1,    duration: 0.6 }, '-=0.4');
  }, []);

  return (
    <section className="hero" id="hero">
      <SmokeBackground smokeColor="#888888" />

      <div className="hero-center">
        <div className="hero-noa-row">
          <div className="hero-clip"><span className="hw-letter hw-n">N</span></div>
          <div className="hero-clip"><span className="hw-letter hw-o">O</span></div>
          <div className="hero-clip"><span className="hw-letter hw-a">A</span></div>
          {/* Small dot — positioned inline next to A, same baseline */}
          <span className="hw-small-dot" />
        </div>

        <div className="hero-clip hero-sub-clip">
          <span className="hw-sub-line">Software Solutions</span>
        </div>
      </div>

      <p className="hero-sub">"Turning ideas into powerful digital products"</p>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
      </div>
    </section>
  );
}
