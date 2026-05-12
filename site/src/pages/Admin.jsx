import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import bundledContent from '../../public/content.json';
import { fetchContent, rollback } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import '../admin.css';

/* ------------------------------------------------------------------ */
/*  Utils                                                              */
/* ------------------------------------------------------------------ */

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function countDeepStrings(obj) {
  let count = 0;
  function walk(v) {
    if (typeof v === 'string') count += v.length;
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  }
  walk(obj);
  return count;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, sub }) {
  return (
    <div className="dash-card">
      <div className="dash-card-value">{value}</div>
      <div className="dash-card-label">{label}</div>
      {sub && <div className="dash-card-sub">{sub}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Admin component                                               */
/* ------------------------------------------------------------------ */

export default function Admin() {
  const [content, setContent] = useState(bundledContent);
  const [rollbackState, setRollbackState] = useState('idle');
  const { logoutAndRedirect } = useAuth();
  const mountedRef = useRef(true);

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
    };
  }, []);

  async function onRollback() {
    if (!window.confirm('Revenir à la version précédente ?')) return;
    setRollbackState('rolling');
    const res = await rollback();
    if (!mountedRef.current) return;
    if (res.ok) {
      setRollbackState('rolled');
      const latest = await fetchContent();
      if (latest) setContent(latest);
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

  const stats = [
    { label: 'Prestations', value: content.prestations?.length ?? 0 },
    { label: 'Témoignages', value: content.testimonials?.length ?? 0 },
    { label: 'Atouts', value: content.atouts?.length ?? 0 },
    { label: 'Liens nav', value: content.nav?.length ?? 0 },
    { label: 'Images uploadées', value: content.media?.length ?? 0 },
    { label: 'Options devis', value: content.contact?.prestationOptions?.length ?? 0 },
  ];

  const jsonSize = formatBytes(new Blob([JSON.stringify(content)]).size);
  const textChars = countDeepStrings(content).toLocaleString();

  const siteInfo = [
    { label: 'Nom du site', value: content.site?.name || '—' },
    { label: 'Slogan', value: content.site?.tagline || '—' },
    { label: 'Téléphone', value: content.site?.tel || '—' },
    { label: 'Email', value: content.site?.email || '—' },
  ];

  const checks = [
    { label: 'Nom du site renseigné', ok: !!content.site?.name },
    { label: 'Téléphone renseigné', ok: !!content.site?.tel },
    { label: 'Email renseigné', ok: !!content.site?.email },
    { label: 'Image À propos principale', ok: !!content.images?.apropos1 },
    { label: 'Image À propos secondaire', ok: !!content.images?.apropos2 },
    { label: 'Formulaire Formspree configuré', ok: content.site?.formId && content.site.formId !== 'YOUR_FORM_ID' },
  ];

  return (
    <div className="admin-page dash-layout">
      <header className="dash-header">
        <div className="dash-header-left">
          <h1>NovaCMS</h1>
          <span className="dash-badge">Dashboard</span>
        </div>
        <div className="dash-header-right">
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

      <main className="dash-main">
        <section className="dash-section">
          <h2>Vue d'ensemble</h2>
          <div className="dash-stats-grid">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} />
            ))}
            <StatCard label="Taille JSON" value={jsonSize} />
            <StatCard label="Caractères" value={textChars} />
          </div>
        </section>

        <div className="dash-columns">
          <section className="dash-section dash-col">
            <h2>Informations du site</h2>
            <div className="dash-info-list">
              {siteInfo.map((info) => (
                <div key={info.label} className="dash-info-row">
                  <span className="dash-info-label">{info.label}</span>
                  <span className="dash-info-value">{info.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="dash-section dash-col">
            <h2>Checklist contenu</h2>
            <div className="dash-checklist">
              {checks.map((c, i) => (
                <div key={i} className={`dash-check-item ${c.ok ? 'ok' : 'ko'}`}>
                  <span className="dash-check-dot" />
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="dash-section">
          <h2>Actions rapides</h2>
          <div className="dash-actions">
            <Link to="/admin/edit" className="btn-primary">
              Ouvrir l'édition visuelle
            </Link>
            <button
              type="button"
              className="btn-secondary"
              onClick={onRollback}
              disabled={rollbackState === 'rolling'}
            >
              {rollbackState === 'rolling' ? 'Retour en arrière…' : 'Annuler dernier changement'}
            </button>
            {rollbackState === 'rolled' && (
              <span className="success">Retour à la version précédente effectué.</span>
            )}
            {rollbackState === 'error' && (
              <span className="error">Échec du retour en arrière.</span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
