'use client';

import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';

function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  const ref = useScrollReveal();

  return (
    <div className="faq-item" ref={ref}>
      <button
        className={`faq-question${open ? ' is-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={String(open)}
        aria-controls={`faq-answer-${index}`}
      >
        <span>{question}</span>
        <svg
          className="faq-chevron"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={`faq-answer${open ? ' is-open' : ''}`}
        id={`faq-answer-${index}`}
        role="region"
        aria-hidden={String(!open)}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const headRef = useScrollReveal();
  const content = useContent();
  const faq = content.faq || [];

  if (faq.length === 0) return null;

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <header className="section-head" ref={headRef}>
          <span className="section-kicker">Questions fréquentes</span>
          <h2>Les réponses à vos questions sur nos prestations de nettoyage</h2>
        </header>
        <div className="faq-grid">
          {faq.map((item, i) => (
            <FaqItem key={i} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
