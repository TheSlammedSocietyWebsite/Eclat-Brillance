import { useEffect, useRef, useState, useCallback } from 'react';

import { Link } from 'react-router-dom';
import bundledContent from '../../public/content.json';
import Site from '../pages/Site.jsx';
import TextEditor from '../components/TextEditor';
import ColorEditor from '../components/ColorEditor';
import { DraftContentProvider } from '../hooks/useContent.jsx';
import { EditModeProvider } from '../hooks/useEditMode.jsx';
import { DraftActionsProvider } from '../hooks/useDraftActions.jsx';
import { fetchContent, save, rollback } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import '../admin.css';

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
/*  Field definitions                                                  */
/* ------------------------------------------------------------------ */

const COLOR_FIELDS = [
  { path: 'theme.bg', label: 'Fond principal' },
  { path: 'theme.bgAlt', label: 'Fond secondaire' },
  { path: 'theme.ink', label: 'Encre principale' },
  { path: 'theme.inkSoft', label: 'Encre adoucie' },
  { path: 'theme.text', label: 'Texte' },
  { path: 'theme.muted', label: 'Texte atténué' },
  { path: 'theme.line', label: 'Lignes / bordures' },
  { path: 'theme.accent', label: 'Accent' },
  { path: 'theme.accentSoft', label: 'Accent léger' },
  { path: 'theme.gold', label: 'Or' },
];

const META_FIELDS = [
  { path: 'site.name', label: 'Nom du site' },
  { path: 'site.tagline', label: 'Slogan' },
  { path: 'site.tel', label: 'Téléphone' },
  { path: 'site.telHref', label: 'Téléphone (lien href)' },
  { path: 'site.email', label: 'Email' },
  { path: 'site.formId', label: 'ID Formulaire (Formspree)' },
];

/* ------------------------------------------------------------------ */
/*  Main AdminEdit component                                           */
/* ------------------------------------------------------------------ */

export default function AdminEdit() {
  const [content, setContent] = useState(bundledContent);
  const [initialContent, setInitialContent] = useState(bundledContent);
  const [state, setState] = useState('idle');
  const [errorMsg, setErrorMsg] = useState(null);
  const [deployState, setDeployState] = useState('idle');
  const [rollbackState, setRollbackState] = useState('idle');
  const { logoutAndRedirect } = useAuth();
  const [previewContainer, setPreviewContainer] = useState(null);
  const previewRef = useCallback((node) => {
    if (node) setPreviewContainer(node);
  }, []);

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

  const handleContentChange = useCallback((path, value) => {
    setContent((c) => setDeep(c, path, value));
  }, []);

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

  return (
    <div className="admin-edit-layout">
      {/* Sidebar */}
      <aside className="admin-edit-sidebar">
        <div className="admin-edit-sidebar-inner">
          <div className="admin-edit-sidebar-header">
            <h1>NovaCMS</h1>
            <span className="admin-edit-badge">Édition visuelle</span>
          </div>

          <div className="admin-edit-actions">
            <Link to="/admin" className="btn-secondary btn-sm">
              ← Retour admin
            </Link>
            <a href="/" target="_blank" rel="noreferrer" className="btn-view-site btn-sm">
              Voir le site
            </a>
            <button type="button" className="btn-logout btn-sm" onClick={onLogout}>
              Déconnexion
            </button>
          </div>

          {dirty && (
            <div className="admin-edit-dirty">
              <span className="dirty-badge">Modifications non sauvegardées</span>
            </div>
          )}

          <div className="admin-edit-section">
            <h3>Actions</h3>
            <div className="admin-edit-actions-row">
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={onSave}
                disabled={state === 'saving' || !dirty}
              >
                {state === 'saving' ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={onRollback}
                disabled={rollbackState === 'rolling'}
              >
                {rollbackState === 'rolling'
                  ? 'Retour…'
                  : 'Annuler dernier changement'}
              </button>
            </div>

            {state === 'saved' && deployState === 'idle' && (
              <span className="success">Sauvegardé — rebuild en cours (~60s).</span>
            )}
            {deployState === 'checking' && (
              <span className="success">Vérification du déploiement…</span>
            )}
            {deployState === 'deployed' && (
              <span className="success">En ligne !</span>
            )}
            {rollbackState === 'rolled' && (
              <span className="success">Retour à la version précédente effectué.</span>
            )}
            {rollbackState === 'error' && (
              <span className="error">Échec du retour en arrière.</span>
            )}
            {state === 'error' && errorMsg && (
              <span className="error">{errorMsg}</span>
            )}
          </div>

          <div className="admin-edit-section">
            <h3>Thème</h3>
            {COLOR_FIELDS.map((f) => (
              <ColorEditor
                key={f.path}
                label={f.label}
                value={getDeep(content, f.path)}
                onChange={(v) => handleContentChange(f.path, v)}
              />
            ))}
          </div>

          <div className="admin-edit-section">
            <h3>Métadonnées</h3>
            {META_FIELDS.map((f) => (
              <TextEditor
                key={f.path}
                label={f.label}
                value={getDeep(content, f.path)}
                onChange={(v) => handleContentChange(f.path, v)}
              />
            ))}
          </div>

          {'video' in content && (
            <div className="admin-edit-section">
              <h3>Vidéo</h3>
              <TextEditor
                label="URL YouTube ou Vimeo"
                value={typeof content.video === 'string' ? content.video : ''}
                onChange={(v) =>
                  handleContentChange('video', v || null)
                }
              />
            </div>
          )}
        </div>
      </aside>

      {/* Preview */}
      <main className="admin-edit-preview" ref={previewRef}>
        <DraftContentProvider content={content} targetElement={previewContainer}>
          <DraftActionsProvider onChange={handleContentChange}>
            <EditModeProvider value={true}>
              <div className="admin-edit-preview-inner">
                <Site />
              </div>
            </EditModeProvider>
          </DraftActionsProvider>
        </DraftContentProvider>
      </main>
    </div>
  );
}
