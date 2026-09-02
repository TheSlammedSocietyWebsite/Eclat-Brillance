'use client';

import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';
import { useEditMode } from '../hooks/useEditMode.jsx';
import EditableText from './edit/EditableText.jsx';

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export default function CtaBanner() {
  const ref = useScrollReveal();
  const isEditMode = useEditMode();
  const { site, ctaBanner } = useContent();

  const handleLinkClick = (e) => {
    if (isEditMode) e.preventDefault();
  };

  return (
    <section className="cta-banner" ref={ref}>
      <div className="container cta-banner-inner">
        <h2>
          <EditableText path="ctaBanner.title" tag="span">{ctaBanner.title}</EditableText>
        </h2>
        <p>
          <EditableText path="ctaBanner.body" multiline tag="span">{ctaBanner.body}</EditableText>
        </p>
        <div className="cta-banner-actions">
          <a href={isEditMode ? undefined : "#contact"} className="btn btn-primary" onClick={handleLinkClick}>
            <EditableText path="ctaBanner.primaryCta" tag="span">{ctaBanner.primaryCta}</EditableText>
          </a>
          <a href={isEditMode ? undefined : site.telHref} className="btn btn-ghost" onClick={handleLinkClick}>
            <PhoneIcon />
            <EditableText path="site.tel" tag="span">{site.tel}</EditableText>
          </a>
        </div>
      </div>
    </section>
  );
}
