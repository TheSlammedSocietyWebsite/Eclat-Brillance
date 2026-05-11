import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { atouts, atoutsSection } from '../data/content.js';

function AtoutItem({ num, title, body }) {
  const ref = useScrollReveal();
  return (
    <div className="atout" ref={ref}>
      <span className="atout-num">{num}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export default function Atouts() {
  const headRef = useScrollReveal();

  return (
    <section className="atouts" id="atouts">
      <div className="container">
        <header className="section-head section-head-light" ref={headRef}>
          <span className="section-kicker">{atoutsSection.kicker}</span>
          <h2>{atoutsSection.title}</h2>
        </header>
        <div className="atouts-grid">
          {atouts.map(a => (
            <AtoutItem key={a.num} {...a} />
          ))}
        </div>
      </div>
    </section>
  );
}
