import { useState } from 'react';

const themes = [
  { id: 'default', label: 'Default', bg: '#000',    fg: '#fff' },
  { id: 'blue',    label: 'Red',     bg: '#8b0000', fg: '#fff' },
  { id: 'nature',  label: 'Navy',    bg: '#0a1628', fg: '#fff' },
];

export default function ThemeSwitcher() {
  const [active, setActive] = useState('default');

  const apply = (id) => {
    setActive(id);
    if (id === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', id);
    }
  };

  return (
    <div className="theme-switcher">
      {themes.map(t => (
        <button
          key={t.id}
          className={`theme-btn ${active === t.id ? 'active' : ''}`}
          style={{ background: t.bg, borderColor: t.fg }}
          onClick={() => apply(t.id)}
          aria-label={t.label}
          title={t.label}
        />
      ))}
    </div>
  );
}
