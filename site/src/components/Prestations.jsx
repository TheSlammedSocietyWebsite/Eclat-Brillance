import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { prestations, prestationsSection } from '../data/content.js';

function ServiceCard({ title, body, iconPaths }) {
  const ref = useScrollReveal();
  return (
    <article className="service-card" ref={ref}>
      <span className="service-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          dangerouslySetInnerHTML={{ __html: iconPaths }}
        />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

export default function Prestations() {
  const headRef = useScrollReveal();

  return (
    <section className="prestations" id="prestations">
      <div className="container">
        <header className="section-head" ref={headRef}>
          <span className="section-kicker">{prestationsSection.kicker}</span>
          <h2>{prestationsSection.title}</h2>
          <p>{prestationsSection.lead}</p>
        </header>
        <div className="service-grid">
          {prestations.map(p => (
            <ServiceCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
