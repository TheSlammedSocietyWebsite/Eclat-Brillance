import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import bundledContent from '../../public/content.json';
import { fetchContent, rollback, fetchStats, changePassword } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import FormspreeSetup from '../components/FormspreeSetup.jsx';
import '../admin.css';

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, sub, muted }) {
  return (
    <div className={`dash-card ${muted ? 'dash-card-muted' : ''}`}>
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
  const [stats, setStats] = useState(null);
  const [rollbackState, setRollbackState] = useState('idle');
  const { logoutAndRedirect } = useAuth();
  const mountedRef = useRef(true);

  /* Password change state */
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdState, setPwdState] = useState('idle');
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchContent()
      .then((latest) => {
        if (!cancelled && latest) setContent(latest);
      })
      .catch(() => {});
    fetchStats()
      .then((data) => {
        if (!cancelled) setStats(data);
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

  async function onChangePassword(e) {
    e.preventDefault();
    setPwdError('');

    if (pwdNew.length < 8) {
      setPwdError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (pwdNew !== pwdConfirm) {
      setPwdError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    setPwdState('loading');
    const res = await changePassword(pwdCurrent, pwdNew);
    if (!mountedRef.current) return;

    if (res.ok) {
      setPwdState('success');
      setPwdCurrent('');
      setPwdNew('');
      setPwdConfirm('');
      setTimeout(() => {
        if (mountedRef.current) setPwdState('idle');
      }, 4000);
    } else {
      setPwdState('error');
      if (res.error === 'invalid_credentials') {
        setPwdError('Mot de passe actuel incorrect.');
      } else if (res.error === 'password_too_short') {
        setPwdError(`Le mot de passe doit contenir au moins ${res.min} caractères.`);
      } else if (res.error === 'redis_unavailable') {
        setPwdError('Le service de stockage est indisponible. Réessayez plus tard.');
      } else {
        setPwdError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  }

  const siteInfo = [
    { label: 'Nom du site', value: content.site?.name || '—' },
    { label: 'Slogan', value: content.site?.tagline || '—' },
    { label: 'Téléphone', value: content.site?.tel || '—' },
    { label: 'Email', value: content.site?.email || '—' },
  ];

  const visitsValue = stats?.visits != null ? stats.visits.toLocaleString() : '—';
  const visitsSub = stats?.visits != null ? 'Visites uniques' : 'Chargement…';

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
          <h2>Analytics</h2>
          <div className="dash-stats-grid">
            <StatCard
              label="Visites"
              value={visitsValue}
              sub={visitsSub}
            />
            <StatCard
              label="Devis reçus"
              value={stats?.leads ?? 0}
              sub={stats?.leadsNote ?? 'À venir'}
              muted
            />
            <StatCard
              label="Pages vues / mois"
              value="—"
              sub="À venir"
              muted
            />
            <StatCard
              label="Taux de conversion"
              value="—"
              sub="À venir"
              muted
            />
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

          <FormspreeSetup content={content} onUpdate={setContent} />
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

        <section className="dash-section">
          <h2>Sécurité</h2>
          <form onSubmit={onChangePassword} className="dash-password-form">
            <div className="dash-password-field">
              <label htmlFor="pwd-current">Mot de passe actuel</label>
              <input
                id="pwd-current"
                type="password"
                value={pwdCurrent}
                onChange={(e) => setPwdCurrent(e.target.value)}
                required
                disabled={pwdState === 'loading'}
              />
            </div>
            <div className="dash-password-field">
              <label htmlFor="pwd-new">Nouveau mot de passe</label>
              <input
                id="pwd-new"
                type="password"
                value={pwdNew}
                onChange={(e) => setPwdNew(e.target.value)}
                required
                disabled={pwdState === 'loading'}
              />
            </div>
            <div className="dash-password-field">
              <label htmlFor="pwd-confirm">Confirmer le nouveau mot de passe</label>
              <input
                id="pwd-confirm"
                type="password"
                value={pwdConfirm}
                onChange={(e) => setPwdConfirm(e.target.value)}
                required
                disabled={pwdState === 'loading'}
              />
            </div>
            <div className="dash-password-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={pwdState === 'loading'}
              >
                {pwdState === 'loading' ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
              </button>
              {pwdState === 'success' && (
                <span className="success">Mot de passe mis à jour avec succès.</span>
              )}
              {pwdState === 'error' && (
                <span className="error">{pwdError}</span>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
