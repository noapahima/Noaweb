import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Loader({ onComplete }) {
  const overlayRef = useRef(null);
  const ballRef    = useRef(null);
  const countRef   = useRef(null);
  const revealRef  = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ball    = ballRef.current;
    const counter = countRef.current;
    const overlay = overlayRef.current;
    const reveal  = revealRef.current;

    // Bounce while loading
    const bounce = gsap.to(ball, {
      y: -26,
      duration: 0.36,
      ease: 'power2.out',
      yoyo: true,
      repeat: -1,
    });

    const obj = { val: 0 };
    gsap.to(obj, {
      val: 100,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate() { setCount(Math.round(obj.val)); },
      onComplete() {
        bounce.kill();
        gsap.set(ball, { y: 0 });

        // Compute scale: reveal circle is 20px, needs to cover full diagonal
        const diag = Math.hypot(window.innerWidth, window.innerHeight);
        const targetScale = (diag / 10) * 1.1; // 10 = radius of 20px circle

        gsap.timeline()
          .to(counter, { opacity: 0, duration: 0.15 })
          .to(ball,    { opacity: 0, duration: 0.15 }, '-=0.1')
          // Black reveal circle expands from center
          .set(reveal, { opacity: 1 })
          .to(reveal, {
            scale: targetScale,
            duration: 1.5,
            ease: 'power3.inOut',
          })
          .to(overlay, {
            opacity: 0,
            duration: 0.3,
            ease: 'none',
            onComplete() {
              overlay.style.display = 'none';
              onComplete();
            },
          });
      },
    });
  }, [onComplete]);

  return (
    <div ref={overlayRef} style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
    }}>
      {/* Bouncing ball */}
      <div ref={ballRef} style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#000',
        flexShrink: 0,
        zIndex: 2,
        position: 'relative',
      }} />

      {/* Counter */}
      <span ref={countRef} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 400,
        letterSpacing: '0.25em',
        color: 'rgba(0,0,0,0.35)',
        fontVariantNumeric: 'tabular-nums',
        position: 'relative',
        zIndex: 2,
      }}>
        {String(count).padStart(3, '0')}
      </span>

      {/* Black circle that expands from center to cover screen */}
      <div ref={revealRef} style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: 20,
        height: 20,
        marginTop: -10,
        marginLeft: -10,
        borderRadius: '50%',
        background: '#000',
        transformOrigin: 'center center',
        transform: 'scale(1)',
        opacity: 0,
        zIndex: 3,
      }} />
    </div>
  );
}
