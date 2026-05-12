import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import bundledContent from '../../public/content.json';
import TextEditor from '../components/TextEditor';
import ColorEditor from '../components/ColorEditor';
import MediaUploader from '../components/MediaUploader';
import AdminNav from '../components/AdminNav';
import ArrayEditor from '../components/ArrayEditor';
import StringListEditor from '../components/StringListEditor';
import { fetchContent, save, rollback } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import '../admin.css';

/* ------------------------------------------------------------------ */
/*  Field definitions                                                  */
/* ------------------------------------------------------------------ */

const FIELDS = [
  // Site
  { path: 'site.name', label: 'Nom du site', section: 'site' },
  { path: 'site.tagline', label: 'Slogan', section: 'site' },
  { path: 'site.tel', label: 'Téléphone', section: 'site' },
  { path: 'site.telHref', label: 'Téléphone (lien href)', section: 'site' },
  { path: 'site.email', label: 'Email', section: 'site' },
  { path: 'site.formId', label: 'ID Formulaire (Formspree)', section: 'site' },
  // Hero
  { path: 'hero.eyebrow', label: 'Surtitre', section: 'hero' },
  { path: 'hero.title', label: 'Titre (ligne 1)', section: 'hero' },
  { path: 'hero.titleEm', label: 'Titre (ligne 2, italique)', section: 'hero' },
  { path: 'hero.lede', label: 'Description', multiline: true, section: 'hero' },
  { path: 'hero.primaryCta', label: 'Bouton CTA', section: 'hero' },
  { path: 'hero.badge.kicker', label: 'Badge — Surtitre', section: 'hero' },
  { path: 'hero.badge.number', label: 'Badge — Nombre', section: 'hero' },
  { path: 'hero.badge.unit', label: 'Badge — Unité', section: 'hero' },
  { path: 'hero.badge.sub', label: 'Badge — Sous-titre', section: 'hero' },
  // À propos
  { path: 'apropos.kicker', label: 'Surtitre', section: 'apropos' },
  { path: 'apropos.title', label: 'Titre', section: 'apropos' },
  { path: 'apropos.body', label: 'Corps', multiline: true, section: 'apropos' },
  // Prestations section
  { path: 'prestationsSection.kicker', label: 'Surtitre', section: 'prestations' },
  { path: 'prestationsSection.title', label: 'Titre', section: 'prestations' },
  { path: 'prestationsSection.lead', label: 'Introduction', multiline: true, section: 'prestations' },
  // Atouts section
  { path: 'atoutsSection.kicker', label: 'Surtitre', section: 'atouts' },
  { path: 'atoutsSection.title', label: 'Titre', section: 'atouts' },
  // Témoignages section
  { path: 'testimonialsSection.kicker', label: 'Surtitre', section: 'testimonials' },
  { path: 'testimonialsSection.title', label: 'Titre', section: 'testimonials' },
  // CTA Banner
  { path: 'ctaBanner.title', label: 'Titre', section: 'ctaBanner' },
  { path: 'ctaBanner.body', label: 'Corps', multiline: true, section: 'ctaBanner' },
  { path: 'ctaBanner.primaryCta', label: 'Bouton principal', section: 'ctaBanner' },
  { path: 'ctaBanner.secondaryCta', label: 'Bouton secondaire', section: 'ctaBanner' },
  // Contact
  { path: 'contact.kicker', label: 'Surtitre', section: 'contact' },
  { path: 'contact.title', label: 'Titre', section: 'contact' },
  { path: 'contact.body', label: 'Corps', multiline: true, section: 'contact' },
  { path: 'contact.notePrefix', label: 'Préfixe note', section: 'contact' },
  { path: 'contact.note', label: 'Note', section: 'contact' },
  { path: 'contact.formPlaceholder', label: 'Placeholder message', section: 'contact' },
  { path: 'contact.formSelectDefault', label: 'Défaut select', section: 'contact' },
  { path: 'contact.submitLabel', label: 'Label bouton envoi', section: 'contact' },
  { path: 'contact.submitLoading', label: 'Label envoi en cours', section: 'contact' },
  // Contact form labels
  { path: 'contact.formLabels.nom', label: 'Form — Label Nom', section: 'contact' },
  { path: 'contact.formLabels.societe', label: 'Form — Label Société', section: 'contact' },
  { path: 'contact.formLabels.email', label: 'Form — Label Email', section: 'contact' },
  { path: 'contact.formLabels.tel', label: 'Form — Label Téléphone', section: 'contact' },
  { path: 'contact.formLabels.prestation', label: 'Form — Label Prestation', section: 'contact' },
  { path: 'contact.formLabels.message', label: 'Form — Label Message', section: 'contact' },
  // Contact status messages
  { path: 'contact.statusMessages.validationError', label: 'Form — Erreur validation', section: 'contact' },
  { path: 'contact.statusMessages.mailtoSuccess', label: 'Form — Succès mailto', multiline: true, section: 'contact' },
  { path: 'contact.statusMessages.formspreeSuccess', label: 'Form — Succès envoi', multiline: true, section: 'contact' },
  { path: 'contact.statusMessages.formspreeError', label: 'Form — Erreur envoi', multiline: true, section: 'contact' },
  { path: 'contact.statusMessages.networkError', label: 'Form — Erreur réseau', multiline: true, section: 'contact' },
  // Footer
  { path: 'footer.description', label: 'Description', multiline: true, section: 'footer' },
  { path: 'footer.contactHeading', label: 'Titre contact', section: 'footer' },
  { path: 'footer.infoHeading', label: 'Titre infos', section: 'footer' },
  { path: 'footer.devisLabel', label: 'Label devis', section: 'footer' },
  { path: 'footer.legal', label: 'Mention légale', section: 'footer' },
  { path: 'footer.mentions', label: 'Mentions légales', section: 'footer' },
];

const COLOR_FIELDS = [
  { path: 'theme.bg', label: 'Fond principal', section: 'theme' },
  { path: 'theme.bgAlt', label: 'Fond secondaire', section: 'theme' },
  { path: 'theme.ink', label: 'Encre principale', section: 'theme' },
  { path: 'theme.inkSoft', label: 'Encre adoucie', section: 'theme' },
  { path: 'theme.text', label: 'Texte', section: 'theme' },
  { path: 'theme.muted', label: 'Texte atténué', section: 'theme' },
  { path: 'theme.line', label: 'Lignes / bordures', section: 'theme' },
  { path: 'theme.accent', label: 'Accent', section: 'theme' },
  { path: 'theme.accentSoft', label: 'Accent léger', section: 'theme' },
  { path: 'theme.gold', label: 'Or', section: 'theme' },
];

const IMAGE_SLOTS = [
  { path: 'images.apropos1', label: 'Image À propos — Principale', section: 'images' },
  { path: 'images.apropos2', label: 'Image À propos — Secondaire', section: 'images' },
];

const ARRAY_FIELDS = [
  {
    path: 'nav',
    label: 'Navigation',
    section: 'site',
    itemLabel: 'Lien',
    fields: [
      { path: 'label', label: 'Label' },
      { path: 'href', label: 'Lien (href)' },
      { path: 'cta', label: 'Style CTA', type: 'checkbox' },
    ],
  },
  {
    path: 'prestations',
    label: 'Prestations',
    section: 'prestations',
    itemLabel: 'Prestation',
    fields: [
      { path: 'title', label: 'Titre' },
      { path: 'body', label: 'Description', multiline: true },
      { path: 'iconPaths', label: 'Icônes SVG', multiline: true },
    ],
  },
  {
    path: 'atouts',
    label: 'Atouts',
    section: 'atouts',
    itemLabel: 'Atout',
    fields: [
      { path: 'num', label: 'Numéro' },
      { path: 'title', label: 'Titre' },
      { path: 'body', label: 'Description', multiline: true },
    ],
  },
  {
    path: 'testimonials',
    label: 'Témoignages',
    section: 'testimonials',
    itemLabel: 'Témoignage',
    fields: [
      { path: 'quote', label: 'Citation', multiline: true },
      { path: 'author', label: 'Auteur' },
      { path: 'role', label: 'Rôle' },
    ],
  },
];

const STRING_LIST_FIELDS = [
  { path: 'hero.proof', label: 'Preuves Hero', section: 'hero', itemLabel: 'Preuve' },
  { path: 'apropos.highlights', label: 'Atouts À propos', section: 'apropos', itemLabel: 'Atout' },
  { path: 'contact.prestationOptions', label: 'Options de prestation', section: 'contact', itemLabel: 'Option' },
  { path: 'footer.infoLines', label: "Lignes d'info Footer", section: 'footer', itemLabel: 'Ligne' },
];

const DEFAULT_IMAGES = {
  'images.apropos1': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'images.apropos2': 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&q=80',
};

/* ------------------------------------------------------------------ */
/*  Utils                                                              */
/* ------------------------------------------------------------------ */

function getDeep(obj, path) {
  const value = path.split('.').reduce((acc, key) => {
    if (acc != null && typeof acc === 'object') {
      if (Array.isArray(acc)) {
        const idx = Number(key);
        return !Number.isNaN(idx) ? acc[idx] : undefined;
      }
      return key in acc ? acc[key] : undefined;
    }
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : '';
}

function setDeep(obj, path, value) {
  const keys = path.split('.');
  const result = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = result;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = keys[i];
    const idx = Number(k);
    if (!Number.isNaN(idx) && Array.isArray(cur)) {
      const child = cur[idx];
      const next = child && typeof child === 'object' && !Array.isArray(child)
        ? { ...child }
        : {};
      cur[idx] = next;
      cur = next;
    } else {
      const child = cur[k];
      const next = child && typeof child === 'object' && !Array.isArray(child)
        ? { ...child }
        : Array.isArray(child) ? [...child] : {};
      cur[k] = next;
      cur = next;
    }
  }
  const lastKey = keys[keys.length - 1];
  const lastIdx = Number(lastKey);
  if (!Number.isNaN(lastIdx) && Array.isArray(cur)) {
    cur[lastIdx] = value;
  } else {
    cur[lastKey] = value;
  }
  return result;
}

function messageForError(code) {
  switch (code) {
    case 'unauthorized':
      return 'Session expirée — reconnectez-vous.';
    case 'github_unavailable':
      return 'Échec de la sauvegarde, réessayez dans un instant.';
    case 'github_error':
      return 'Modifications externes détectées, rechargez la page.';
    case 'too_large':
      return 'Contenu trop volumineux.';
    case 'empty_content':
      return 'Le contenu ne peut pas être vide.';
    case 'network':
      return 'Connexion réseau perdue, réessayez.';
    default:
      return 'Erreur inconnue lors de la sauvegarde.';
  }
}

function isContentEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/* ------------------------------------------------------------------ */
/*  Section component                                                  */
/* ------------------------------------------------------------------ */

function Section({ id, title, children }) {
  return (
    <section id={id} className="admin-section">
      <div className="section-header">
        <h2>{title}</h2>
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Admin component                                               */
/* ------------------------------------------------------------------ */

export default function Admin() {
  const [content, setContent] = useState(bundledContent);
  const [initialContent, setInitialContent] = useState(bundledContent);
  const [state, setState] = useState('idle');
  const [errorMsg, setErrorMsg] = useState(null);
  const [deployState, setDeployState] = useState('idle');
  const [rollbackState, setRollbackState] = useState('idle');
  const [activeSection, setActiveSection] = useState('site');
  const { logoutAndRedirect } = useAuth();

  const dirty = !isContentEqual(content, initialContent);

  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const savedTimerRef = useRef(null);
  const navTimerRef = useRef(null);
  const deployPollRef = useRef(null);
  const deployTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchContent()
      .then((latest) => {
        if (!cancelled && latest) {
          setContent(latest);
          setInitialContent(latest);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      if (deployPollRef.current) clearInterval(deployPollRef.current);
      if (deployTimeoutRef.current) clearTimeout(deployTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  function handleNavigate(sectionId, scroll = true) {
    setActiveSection(sectionId);
    if (scroll) {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  function startDeployPolling(savedContent) {
    if (deployPollRef.current) clearInterval(deployPollRef.current);
    if (deployTimeoutRef.current) clearTimeout(deployTimeoutRef.current);
    setDeployState('checking');

    const check = async () => {
      const latest = await fetchContent();
      if (!mountedRef.current) return;
      if (latest && isContentEqual(latest, savedContent)) {
        setDeployState('deployed');
        if (deployPollRef.current) clearInterval(deployPollRef.current);
        if (deployTimeoutRef.current) clearTimeout(deployTimeoutRef.current);
      }
    };

    check();
    deployPollRef.current = setInterval(check, 10_000);
    deployTimeoutRef.current = setTimeout(() => {
      if (deployPollRef.current) clearInterval(deployPollRef.current);
      if (mountedRef.current) setDeployState('idle');
    }, 300_000);
  }

  async function onSave() {
    if (inFlightRef.current || !dirty) return;
    inFlightRef.current = true;
    setState('saving');
    setErrorMsg(null);
    setDeployState('idle');

    const res = await save(content);

    if (!mountedRef.current) {
      inFlightRef.current = false;
      return;
    }

    if (res.ok) {
      setState('saved');
      setInitialContent(content);
      startDeployPolling(content);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => {
        if (mountedRef.current) setState((s) => (s === 'saved' ? 'idle' : s));
      }, 4000);
    } else {
      setState('error');
      setErrorMsg(messageForError(res.error));
      if (res.error === 'unauthorized') {
        if (navTimerRef.current) clearTimeout(navTimerRef.current);
        navTimerRef.current = setTimeout(() => {
          if (mountedRef.current) logoutAndRedirect();
        }, 1500);
      }
    }
    inFlightRef.current = false;
  }

  async function onRollback() {
    if (!window.confirm('Revenir à la version précédente ? Les modifications non sauvegardées seront perdues.')) return;
    setRollbackState('rolling');
    const res = await rollback();
    if (!mountedRef.current) return;
    if (res.ok) {
      setRollbackState('rolled');
      const latest = await fetchContent();
      if (latest) {
        setContent(latest);
        setInitialContent(latest);
      }
      setTimeout(() => {
        if (mountedRef.current) setRollbackState('idle');
      }, 4000);
    } else {
      setRollbackState('error');
      setTimeout(() => {
        if (mountedRef.current) setRollbackState('idle');
      }, 4000);
    }
  }

  async function onLogout() {
    await logoutAndRedirect();
  }

  /* ---------------------------------------------------------------- */
  /*  Section helpers                                                  */
  /* ---------------------------------------------------------------- */

  const fieldsFor = (sectionId) =>
    FIELDS.filter((f) => f.section === sectionId).map((f) => (
      <TextEditor
        key={f.path}
        label={f.label}
        value={getDeep(content, f.path)}
        onChange={(v) => setContent((c) => setDeep(c, f.path, v))}
        multiline={f.multiline}
        rows={f.rows}
        showCount={f.multiline}
      />
    ));

  const colorsFor = (sectionId) =>
    COLOR_FIELDS.filter((f) => f.section === sectionId).map((f) => (
      <ColorEditor
        key={f.path}
        label={f.label}
        value={getDeep(content, f.path)}
        onChange={(v) => setContent((c) => setDeep(c, f.path, v))}
      />
    ));

  const arraysFor = (sectionId) =>
    ARRAY_FIELDS.filter((f) => f.section === sectionId).map((f) => {
      const items = f.path.split('.').reduce((acc, k) => {
        if (acc == null) return [];
        const idx = Number(k);
        return !Number.isNaN(idx) && Array.isArray(acc) ? acc[idx] : acc[k];
      }, content);
      return (
        <ArrayEditor
          key={f.path}
          label={f.label}
          items={Array.isArray(items) ? items : []}
          onChange={(next) =>
            setContent((c) => {
              const keys = f.path.split('.');
              const result = { ...c };
              let cur = result;
              for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                const idx = Number(k);
                if (!Number.isNaN(idx) && Array.isArray(cur)) {
                  cur[idx] = { ...cur[idx] };
                  cur = cur[idx];
                } else {
                  cur[k] = { ...cur[k] };
                  cur = cur[k];
                }
              }
              cur[keys[keys.length - 1]] = next;
              return result;
            })
          }
          fields={f.fields}
          itemLabel={f.itemLabel}
        />
      );
    });

  const stringListsFor = (sectionId) =>
    STRING_LIST_FIELDS.filter((f) => f.section === sectionId).map((f) => {
      const items = f.path.split('.').reduce((acc, k) => {
        if (acc == null) return [];
        const idx = Number(k);
        return !Number.isNaN(idx) && Array.isArray(acc) ? acc[idx] : acc[k];
      }, content);
      return (
        <StringListEditor
          key={f.path}
          label={f.label}
          items={Array.isArray(items) ? items : []}
          onChange={(next) =>
            setContent((c) => {
              const keys = f.path.split('.');
              const result = { ...c };
              let cur = result;
              for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                const idx = Number(k);
                if (!Number.isNaN(idx) && Array.isArray(cur)) {
                  cur[idx] = { ...cur[idx] };
                  cur = cur[idx];
                } else {
                  cur[k] = { ...cur[k] };
                  cur = cur[k];
                }
              }
              cur[keys[keys.length - 1]] = next;
              return result;
            })
          }
          itemLabel={f.itemLabel}
        />
      );
    });

  const imageSlotsFor = (sectionId) =>
    IMAGE_SLOTS.filter((f) => f.section === sectionId).map((slot) => {
      const currentUrl = getDeep(content, slot.path);
      const previewUrl = currentUrl || DEFAULT_IMAGES[slot.path];
      return (
        <div key={slot.path} className="image-slot">
          <span className="image-slot-label">{slot.label}</span>
          <div className="image-slot-preview">
            <img src={previewUrl} alt="" />
          </div>
          <div className="image-slot-actions">
            <MediaUploader
              asButton
              buttonLabel="Remplacer l'image"
              onUpload={(url) =>
                setContent((c) => setDeep(c, slot.path, url))
              }
            />
            <button
              type="button"
              className="btn-remove"
              onClick={() =>
                setContent((c) => setDeep(c, slot.path, ''))
              }
            >
              Supprimer
            </button>
          </div>
        </div>
      );
    });

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="admin-layout">
      <AdminNav activeId={activeSection} onNavigate={handleNavigate} dirty={dirty} />

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1>NovaCMS</h1>
            {dirty && (
              <span className="dirty-badge">Modifications non sauvegardées</span>
            )}
          </div>
          <div className="admin-header-right">
            <Link to="/admin/edit" className="btn-view-site">
              Édition visuelle
            </Link>
            <a href="/" target="_blank" rel="noreferrer" className="btn-view-site">
              Voir le site
            </a>
            <button type="button" className="btn-logout" onClick={onLogout}>
              Déconnexion
            </button>
          </div>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSave();
          }}
        >
          <Section id="site" title="Site & Navigation">
            {fieldsFor('site')}
            {arraysFor('site')}
          </Section>

          <Section id="hero" title="Hero">
            {fieldsFor('hero')}
            {stringListsFor('hero')}
          </Section>

          <Section id="apropos" title="À propos">
            {fieldsFor('apropos')}
            {stringListsFor('apropos')}
          </Section>

          <Section id="prestations" title="Prestations">
            {fieldsFor('prestations')}
            {arraysFor('prestations')}
          </Section>

          <Section id="atouts" title="Atouts">
            {fieldsFor('atouts')}
            {arraysFor('atouts')}
          </Section>

          <Section id="testimonials" title="Témoignages">
            {fieldsFor('testimonials')}
            {arraysFor('testimonials')}
          </Section>

          <Section id="ctaBanner" title="Bannière CTA">
            {fieldsFor('ctaBanner')}
          </Section>

          <Section id="contact" title="Contact">
            {fieldsFor('contact')}
            {stringListsFor('contact')}
          </Section>

          <Section id="footer" title="Footer">
            {fieldsFor('footer')}
            {stringListsFor('footer')}
          </Section>

          <Section id="theme" title="Thème">
            {colorsFor('theme')}
          </Section>

          <Section id="images" title="Images">
            {imageSlotsFor('images')}
          </Section>

          {'video' in content && (
            <Section id="video" title="Vidéo">
              <TextEditor
                label="URL YouTube ou Vimeo"
                value={typeof content.video === 'string' ? content.video : ''}
                onChange={(v) =>
                  setContent((c) => ({ ...c, video: v || null }))
                }
              />
            </Section>
          )}

          <div className="admin-actions-bar">
            <button
              type="submit"
              className="btn-primary"
              disabled={state === 'saving' || !dirty}
            >
              {state === 'saving' ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onRollback}
              disabled={rollbackState === 'rolling'}
            >
              {rollbackState === 'rolling'
                ? 'Retour en arrière…'
                : 'Annuler dernier changement'}
            </button>

            {state === 'saved' && deployState === 'idle' && (
              <span className="success">
                Sauvegardé — rebuild Vercel en cours (~60s).
              </span>
            )}
            {deployState === 'checking' && (
              <span className="success">Vérification du déploiement…</span>
            )}
            {deployState === 'deployed' && (
              <span className="success">En ligne !</span>
            )}
            {rollbackState === 'rolled' && (
              <span className="success">
                Retour à la version précédente effectué.
              </span>
            )}
            {rollbackState === 'error' && (
              <span className="error">Échec du retour en arrière.</span>
            )}
            {state === 'error' && errorMsg && (
              <span className="error">{errorMsg}</span>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
