import { Fragment } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { hero, siteConfig } from '../data/content.js';

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export default function Hero() {
  const contentRef = useScrollReveal();
  const badgeRef = useScrollReveal();

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-content" ref={contentRef}>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.title}<br/><em>{hero.titleEm}</em></h1>
          <p className="lede">{hero.lede}</p>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-primary">{hero.primaryCta}</a>
            <a href={siteConfig.telHref} className="btn btn-ghost">
              <PhoneIcon />
              {siteConfig.tel}
            </a>
          </div>
          <div className="hero-proof">
            {hero.proof.map((item, i) => (
              <Fragment key={item}>
                <span>{item}</span>
                {i < hero.proof.length - 1 && (
                  <span className="dot" aria-hidden="true"></span>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        <aside className="hero-badge" ref={badgeRef} aria-label="Offre de bienvenue">
          <div className="badge-card">
            <span className="badge-kicker">{hero.badge.kicker}</span>
            <strong className="badge-number">
              {hero.badge.number}<span>{hero.badge.unit}</span>
            </strong>
            <span className="badge-sub">{hero.badge.sub}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
