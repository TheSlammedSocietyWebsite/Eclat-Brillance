'use client';

import { Fragment } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';
import { useEditMode } from '../hooks/useEditMode.jsx';
import EditableText from './edit/EditableText.jsx';
import EditableArrayControls from './edit/EditableArrayControls.jsx';

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export default function Hero() {
  const contentRef = useScrollReveal();
  const badgeRef = useScrollReveal();
  const isEditMode = useEditMode();
  const { hero, site } = useContent();

  const handleLinkClick = (e) => {
    if (isEditMode) e.preventDefault();
  };

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-content" ref={contentRef}>
          <span className="eyebrow">
            <EditableText path="hero.eyebrow">{hero.eyebrow}</EditableText>
          </span>
          <h1>
            <EditableText path="hero.title" tag="span">{hero.title}</EditableText>
            <br/>
            <EditableText path="hero.titleEm" tag="em">{hero.titleEm}</EditableText>
          </h1>
          <p className="lede">
            <EditableText path="hero.lede" multiline tag="span">
              <span dangerouslySetInnerHTML={{ __html: hero.lede }} />
            </EditableText>
          </p>
          <div className="hero-ctas">
            <a href={isEditMode ? undefined : "#contact"} className="btn btn-primary" onClick={handleLinkClick}>
              <EditableText path="hero.primaryCta" tag="span">{hero.primaryCta}</EditableText>
            </a>
            <a href={isEditMode ? undefined : site.telHref} className="btn btn-ghost" onClick={handleLinkClick}>
              <PhoneIcon />
              <EditableText path="site.tel" tag="span">{site.tel}</EditableText>
            </a>
          </div>
          <div className="hero-proof">
            {hero.proof.map((item, i) => (
              <Fragment key={i}>
                <span>
                  <EditableText path={`hero.proof.${i}`} tag="span">{item}</EditableText>
                  <EditableArrayControls path="hero.proof" index={i} items={hero.proof} itemLabel="Preuve" />
                </span>
                {i < hero.proof.length - 1 && (
                  <span className="dot" aria-hidden="true"></span>
                )}
              </Fragment>
            ))}
            <EditableArrayControls path="hero.proof" itemLabel="Preuve" />
          </div>
        </div>

        <aside className="hero-badge" ref={badgeRef} aria-label="Offre de bienvenue">
          <div className="badge-card">
            <span className="badge-kicker">
              <EditableText path="hero.badge.kicker">{hero.badge.kicker}</EditableText>
            </span>
            <strong className="badge-number">
              <EditableText path="hero.badge.number" tag="span">{hero.badge.number}</EditableText>
              <EditableText path="hero.badge.unit" tag="span">{hero.badge.unit}</EditableText>
            </strong>
            <span className="badge-sub">
              <EditableText path="hero.badge.sub">{hero.badge.sub}</EditableText>
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
