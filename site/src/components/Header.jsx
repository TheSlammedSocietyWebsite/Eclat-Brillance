import { useState, useEffect } from 'react';
import { useContent } from '../hooks/useContent.jsx';
import EditableText from './edit/EditableText.jsx';
import EditableArrayControls from './edit/EditableArrayControls.jsx';

const NAV_FIELDS = [
  { path: 'label', label: 'Label' },
  { path: 'href', label: 'Lien (href)' },
  { path: 'cta', label: 'Style CTA', type: 'checkbox' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const content = useContent();
  const { site, nav } = content;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeNav = () => setIsOpen(false);

  const handleLogoClick = (e) => {
    e.preventDefault();
    closeNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
      <div className="header-inner">
        <a href="#top" onClick={handleLogoClick} className="brand" aria-label={`${site.name} — accueil`}>
          <span className="brand-mark" aria-hidden="true">
            <img src="/logo.svg" alt="Éclat Brillance — Entreprise de nettoyage" className="brand-logo-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </span>
          <span className="brand-text">
            <span className="brand-name">
              <EditableText path="site.name" tag="span">{site.name}</EditableText>
            </span>
            <span className="brand-tag">
              <EditableText path="site.tagline" tag="span">{site.tagline}</EditableText>
            </span>
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
          {nav.map(({ label, href, cta }, i) => (
            <a key={i} href={href} className={cta ? 'nav-cta' : undefined} onClick={closeNav} style={{ position: 'relative' }}>
              <EditableText path={`nav.${i}.label`} tag="span">{label}</EditableText>
              <EditableArrayControls path="nav" index={i} items={nav} itemLabel="Lien" fields={NAV_FIELDS} />
            </a>
          ))}
          <EditableArrayControls path="nav" itemLabel="Lien" fields={NAV_FIELDS} />
        </nav>
      </div>
    </header>
  );
}
