const words = [
  'CRM', null, 'Automation', null, 'Web Dev', null,
  'Mobile Apps', null, 'AI', null, 'Cloud', null,
  'CRM', null, 'Automation', null, 'Web Dev', null,
  'Mobile Apps', null, 'AI', null, 'Cloud', null,
];

export default function Marquee() {
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {[...words, ...words].map((w, i) =>
          w === null
            ? <div key={i} className="marquee-item"><span /></div>
            : <div key={i} className="marquee-item">{w}</div>
        )}
      </div>
    </div>
  );
}
