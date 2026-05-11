import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bundledContent from '../../public/content.json';
import TextEditor from '../components/TextEditor';
import { fetchContent, logout, save } from '../lib/api';
import '../admin.css';

const FIELDS = [
  // Site config
  { path: 'site.name', label: 'Nom du site' },
  { path: 'site.tagline', label: 'Slogan' },
  { path: 'site.tel', label: 'Téléphone' },
  { path: 'site.email', label: 'Email' },
  // Hero
  { path: 'hero.eyebrow', label: 'Hero — Surtitre' },
  { path: 'hero.title', label: 'Hero — Titre (ligne 1)' },
  { path: 'hero.titleEm', label: 'Hero — Titre (ligne 2, italique)' },
  { path: 'hero.lede', label: 'Hero — Description', multiline: true },
  { path: 'hero.primaryCta', label: 'Hero — Bouton CTA' },
  { path: 'hero.proof.0', label: 'Hero — Preuve 1' },
  { path: 'hero.proof.1', label: 'Hero — Preuve 2' },
  { path: 'hero.proof.2', label: 'Hero — Preuve 3' },
  { path: 'hero.badge.kicker', label: 'Hero Badge — Surtitre' },
  { path: 'hero.badge.number', label: 'Hero Badge — Nombre' },
  { path: 'hero.badge.unit', label: 'Hero Badge — Unité' },
  { path: 'hero.badge.sub', label: 'Hero Badge — Sous-titre' },
  // À propos
  { path: 'apropos.kicker', label: 'À propos — Surtitre' },
  { path: 'apropos.title', label: 'À propos — Titre' },
  { path: 'apropos.body', label: 'À propos — Corps', multiline: true },
  { path: 'apropos.highlights.0', label: 'À propos — Atout 1' },
  { path: 'apropos.highlights.1', label: 'À propos — Atout 2' },
  { path: 'apropos.highlights.2', label: 'À propos — Atout 3' },
  // Prestations section
  { path: 'prestationsSection.kicker', label: 'Prestations — Surtitre' },
  { path: 'prestationsSection.title', label: 'Prestations — Titre' },
  { path: 'prestationsSection.lead', label: 'Prestations — Introduction', multiline: true },
  // Atouts section
  { path: 'atoutsSection.kicker', label: 'Atouts — Surtitre' },
  { path: 'atoutsSection.title', label: 'Atouts — Titre' },
  // Témoignages section
  { path: 'testimonialsSection.kicker', label: 'Témoignages — Surtitre' },
  { path: 'testimonialsSection.title', label: 'Témoignages — Titre' },
  // CTA Banner
  { path: 'ctaBanner.title', label: 'Bannière CTA — Titre' },
  { path: 'ctaBanner.body', label: 'Bannière CTA — Corps', multiline: true },
  { path: 'ctaBanner.primaryCta', label: 'Bannière CTA — Bouton principal' },
  { path: 'ctaBanner.secondaryCta', label: 'Bannière CTA — Bouton secondaire' },
  // Contact
  { path: 'contact.kicker', label: 'Contact — Surtitre' },
  { path: 'contact.title', label: 'Contact — Titre' },
  { path: 'contact.body', label: 'Contact — Corps', multiline: true },
  { path: 'contact.notePrefix', label: 'Contact — Préfixe note' },
  { path: 'contact.note', label: 'Contact — Note' },
  { path: 'contact.submitLabel', label: 'Contact — Label bouton' },
  // Footer
  { path: 'footer.description', label: 'Footer — Description', multiline: true },
  { path: 'footer.contactHeading', label: 'Footer — Titre contact' },
  { path: 'footer.infoHeading', label: 'Footer — Titre infos' },
  { path: 'footer.infoLines.0', label: 'Footer — Info 1' },
  { path: 'footer.infoLines.1', label: 'Footer — Info 2' },
  { path: 'footer.devisLabel', label: 'Footer — Label devis' },
  { path: 'footer.legal', label: 'Footer — Mention légale' },
  { path: 'footer.mentions', label: 'Footer — Mentions légales' },
];

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

export default function Admin() {
  const [content, setContent] = useState(bundledContent);
  const [state, setState] = useState('idle');
  const [errorMsg, setErrorMsg] = useState(null);
  const nav = useNavigate();

  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const savedTimerRef = useRef(null);
  const navTimerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchContent()
      .then((latest) => {
        if (!cancelled && latest) setContent(latest);
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
    };
  }, []);

  async function onSave() {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setState('saving');
    setErrorMsg(null);

    const res = await save(content);

    if (!mountedRef.current) {
      inFlightRef.current = false;
      return;
    }

    if (res.ok) {
      setState('saved');
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
          if (mountedRef.current) nav('/admin/login', { replace: true });
        }, 1500);
      }
    }
    inFlightRef.current = false;
  }

  async function onLogout() {
    await logout();
    if (mountedRef.current) nav('/admin/login', { replace: true });
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <h1>NovaCMS — Édition</h1>
        <button type="button" onClick={onLogout}>Déconnexion</button>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void onSave();
        }}
      >
        {FIELDS.map((f) => (
          <TextEditor
            key={f.path}
            label={f.label}
            value={getDeep(content, f.path)}
            onChange={(v) => setContent((c) => setDeep(c, f.path, v))}
            multiline={f.multiline}
          />
        ))}
        <div className="actions">
          <button type="submit" disabled={state === 'saving'}>
            {state === 'saving' ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
          {state === 'saved' && (
            <span className="success">Sauvegardé — rebuild Vercel en cours (~60s).</span>
          )}
          {state === 'error' && errorMsg && <span className="error">{errorMsg}</span>}
        </div>
      </form>
    </main>
  );
}
