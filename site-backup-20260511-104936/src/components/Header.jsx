import { useState, useEffect } from 'react';
import { siteConfig, nav } from '../data/content.js';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeNav = () => setIsOpen(false);

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`} id="top">
      <div className="header-inner">
        <a href="#top" className="brand" aria-label="Éclat Brillance — accueil">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4 C14 14, 8 20, 8 26 a12 12 0 0 0 24 0 C32 20, 26 14, 20 4 Z" fill="currentColor"/>
              <path d="M20 12 l1.6 4.4 L26 18 l-4.4 1.6 L20 24 l-1.6-4.4 L14 18 l4.4-1.6 Z" fill="#F8F8F6"/>
            </svg>
          </span>
          <span className="brand-text">
            <span className="brand-name">{siteConfig.name}</span>
            <span className="brand-tag">{siteConfig.tagline}</span>
          </span>
        </a>

        <button
          className="nav-toggle"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={String(isOpen)}
          aria-controls="primary-nav"
          onClick={() => setIsOpen(o => !o)}
        >
          <span></span><span></span><span></span>
        </button>

        <nav
          className={`primary-nav${isOpen ? ' is-open' : ''}`}
          id="primary-nav"
          aria-label="Navigation principale"
        >
          {nav.map(({ label, href, cta }) => (
            <a key={href} href={href} className={cta ? 'nav-cta' : undefined} onClick={closeNav}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
