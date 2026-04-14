import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 80 },
      {
        opacity: 1, y: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
      }
    );
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.sendForm(
        'service_azuu2aa',
        'template_aw96e9y',
        formRef.current,
        'SfnGnRTujuun0G0v8'
      );
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-header">
        <h2 className="contact-title" ref={titleRef}>
          Let's<br />Work
        </h2>
      </div>

      {status === 'done' ? (
        <p className="form-success">
          Message received - we'll be in touch shortly.
        </p>
      ) : (
        <form
          className="contact-form"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="form-field">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              name="name"
              type="text"
              placeholder="Your name"
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-field full-width">
            <label className="form-label">Message</label>
            <textarea
              className="form-input"
              name="message"
              placeholder="Tell us about your project..."
              required
            />
          </div>
          <div className="full-width">
            <button
              className="submit-btn"
              type="submit"
              disabled={status === 'sending'}
            >
              <span>
                {status === 'sending' ? 'Sending...' : status === 'error' ? 'Try Again' : 'Send Message'}
              </span>
              <span>{status === 'sending' ? '...' : '→'}</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
