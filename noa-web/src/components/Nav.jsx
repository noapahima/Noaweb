import { useState } from 'react';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        {/* Center: links */}
        <ul className="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Right: menu button */}
        <button className="nav-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span className={`nav-menu-icon ${menuOpen ? 'open' : ''}`}>
            <span /><span /><span />
          </span>
          <span className="nav-menu-label">Menu</span>
        </button>
      </nav>

      {/* Full screen menu overlay */}
      <div className={`nav-overlay ${menuOpen ? 'active' : ''}`}>
        <ul className="nav-overlay-links">
          <li><a href="#hero"     onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a href="#about"    onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
          <li><a href="#contact"  onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </>
  );
}
