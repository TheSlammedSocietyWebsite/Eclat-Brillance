import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';

export default function Apropos() {
  const copyRef = useScrollReveal();
  const figureRef = useScrollReveal();
  const { apropos, images } = useContent();

  const img1 = images?.apropos1 || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80';
  const img2 = images?.apropos2 || 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&q=80';

  return (
    <section className="apropos" id="apropos">
      <div className="container apropos-inner">
        <div className="apropos-copy" ref={copyRef}>
          <span className="section-kicker">{apropos.kicker}</span>
          <h2>{apropos.title}</h2>
          <p>{apropos.body}</p>
          <ul className="apropos-highlights">
            {apropos.highlights.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="apropos-figure" ref={figureRef} aria-hidden="true">
          <div
            className="figure-card figure-card-1"
            style={{ backgroundImage: `linear-gradient(135deg, rgba(26,43,74,0.8), rgba(26,43,74,0.3)), url("${img1}")` }}
          />
          <div
            className="figure-card figure-card-2"
            style={{ backgroundImage: `linear-gradient(135deg, rgba(107,143,113,0.25), rgba(248,248,246,0.1)), url("${img2}")` }}
          />
        </div>
      </div>
    </section>
  );
}
