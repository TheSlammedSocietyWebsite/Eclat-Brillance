import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'site', label: 'Site & Nav' },
  { id: 'hero', label: 'Hero' },
  { id: 'apropos', label: 'À propos' },
  { id: 'prestations', label: 'Prestations' },
  { id: 'atouts', label: 'Atouts' },
  { id: 'testimonials', label: 'Témoignages' },
  { id: 'ctaBanner', label: 'Bannière CTA' },
  { id: 'contact', label: 'Contact' },
  { id: 'footer', label: 'Footer' },
  { id: 'theme', label: 'Thème' },
  { id: 'images', label: 'Images' },
  { id: 'video', label: 'Vidéo' },
];

export default function AdminNav({ activeId, onNavigate, dirty }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sectionElements = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
      if (!sectionElements.length) return;
      const scrollPos = window.scrollY + 120;
      let current = SECTIONS[0].id;
      for (const el of sectionElements) {
        if (el.offsetTop <= scrollPos) {
          current = el.id;
        }
      }
      onNavigate(current, false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onNavigate]);

  return (
    <>
      <button
        type="button"
        className="admin-nav-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Menu sections"
      >
        <span>☰</span> Sections
        {dirty && <span className="nav-dirty-dot" />}
      </button>
      <nav className={`admin-nav ${mobileOpen ? 'open' : ''}`} aria-label="Sections">
        <div className="admin-nav-inner">
          <div className="admin-nav-title">Sections</div>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={activeId === s.id ? 'active' : ''}
                  onClick={() => {
                    onNavigate(s.id, true);
                    setMobileOpen(false);
                  }}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
