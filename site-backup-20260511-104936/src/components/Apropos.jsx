import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { apropos } from '../data/content.js';

export default function Apropos() {
  const copyRef = useScrollReveal();
  const figureRef = useScrollReveal();

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
          <div className="figure-card figure-card-1"></div>
          <div className="figure-card figure-card-2"></div>
        </div>
      </div>
    </section>
  );
}
