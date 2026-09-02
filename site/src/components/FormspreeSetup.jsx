'use client';

import { useState, useCallback } from 'react';
import { save } from '../lib/api';

const FORMSPREE_URL = 'https://formspree.io';

function extractFormId(input) {
  const trimmed = input.trim();
  const match = trimmed.match(/formspree\.io\/f\/([a-zA-Z0-9]+)/i);
  return match ? match[1] : trimmed;
}

function isValidFormId(id) {
  return id.length >= 6 && /^[a-zA-Z0-9]+$/.test(id);
}

export default function FormspreeSetup({ content, onUpdate }) {
  const currentFormId = content.site?.formId || 'YOUR_FORM_ID';
  const isConfigured = currentFormId !== 'YOUR_FORM_ID' && currentFormId.length > 0;

  const [isOpen, setIsOpen] = useState(false);
  const [formIdInput, setFormIdInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | success | error
  const [saveError, setSaveError] = useState('');

  const handleConnect = useCallback(async () => {
    const id = extractFormId(formIdInput);
    if (!isValidFormId(id)) {
      setSaveStatus('error');
      setSaveError('L\'ID doit contenir au moins 6 caractères alphanumériques.');
      return;
    }

    setSaveStatus('saving');
    setSaveError('');

    const updatedContent = {
      ...content,
      site: { ...content.site, formId: id },
    };

    const res = await save(updatedContent);
    if (res.ok) {
      setSaveStatus('success');
      onUpdate(updatedContent);
      setTimeout(() => {
        setIsOpen(false);
        setFormIdInput('');
        setSaveStatus('idle');
      }, 2000);
    } else {
      setSaveStatus('error');
      setSaveError(
        res.error === 'network'
          ? 'Erreur réseau. Vérifiez votre connexion et réessayez.'
          : 'Erreur lors de la sauvegarde. Réessayez.'
      );
    }
  }, [formIdInput, content, onUpdate]);

  const handleDisconnect = useCallback(async () => {
    if (!window.confirm('Déconnecter Formspree ? Les devis reviendront au mode email.')) return;

    setSaveStatus('saving');
    setSaveError('');

    const updatedContent = {
      ...content,
      site: { ...content.site, formId: 'YOUR_FORM_ID' },
    };

    const res = await save(updatedContent);
    if (res.ok) {
      setSaveStatus('success');
      onUpdate(updatedContent);
      setTimeout(() => {
        setIsOpen(false);
        setFormIdInput('');
        setSaveStatus('idle');
      }, 1500);
    } else {
      setSaveStatus('error');
      setSaveError('Erreur lors de la déconnexion. Réessayez.');
    }
  }, [content, onUpdate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConnect();
    }
  };

  // ── Configured, collapsed ──
  if (isConfigured && !isOpen) {
    return (
      <div className="dash-col">
        <h2>Formulaire de devis</h2>
        <div className="formspree-status configured">
          <div className="formspree-status-icon">✓</div>
          <div className="formspree-status-text">
            <strong>Connecté à Formspree</strong>
            <span>Les devis arrivent dans votre boîte mail.</span>
          </div>
        </div>
        <div className="formspree-id-display">
          <span className="formspree-id-label">ID :</span>
          <code className="formspree-id-value">{currentFormId.slice(0, 4)}…{currentFormId.slice(-4)}</code>
        </div>
        <div className="formspree-actions">
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => setIsOpen(true)}
          >
            Modifier
          </button>
          <button
            type="button"
            className="btn-remove btn-sm"
            onClick={handleDisconnect}
          >
            Déconnecter
          </button>
        </div>
      </div>
    );
  }

  // ── Not configured, collapsed ──
  if (!isConfigured && !isOpen) {
    return (
      <div className="dash-col">
        <h2>Formulaire de devis</h2>
        <div className="formspree-status unconfigured">
          <div className="formspree-status-icon">⚠</div>
          <div className="formspree-status-text">
            <strong>Non configuré</strong>
            <span>Les devis sont envoyés par email (mode fallback).</span>
          </div>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsOpen(true)}
        >
          Connecter Formspree
        </button>
      </div>
    );
  }

  // ── Expanded setup flow ──
  return (
    <div className="dash-col formspree-setup-open">
      <h2>Connecter Formspree</h2>

      <div className="formspree-guide">
        <div className="formspree-step">
          <span className="formspree-step-num">1</span>
          <div className="formspree-step-body">
            <strong>Créez un compte</strong>
            <span>
              Allez sur{' '}
              <a href={FORMSPREE_URL} target="_blank" rel="noopener noreferrer">
                formspree.io
              </a>{' '}
              et inscrivez-vous (gratuit, 50 soumissions/mois).
            </span>
          </div>
        </div>

        <div className="formspree-step">
          <span className="formspree-step-num">2</span>
          <div className="formspree-step-body">
            <strong>Créez un formulaire</strong>
            <span>Cliquez sur « New Form », puis copiez l'ID affiché dans l'URL (ex: <code>https://formspree.io/f/xyz123</code>).</span>
          </div>
        </div>

        <div className="formspree-step">
          <span className="formspree-step-num">3</span>
          <div className="formspree-step-body">
            <strong>Collez l'ID ici</strong>
            <div className="formspree-input-wrap">
              <input
                type="text"
                value={formIdInput}
                onChange={(e) => setFormIdInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="xyz123abc ou https://formspree.io/f/xyz123abc"
                disabled={saveStatus === 'saving'}
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>

      {saveStatus === 'error' && saveError && (
        <p className="formspree-error">{saveError}</p>
      )}

      {saveStatus === 'success' && (
        <p className="formspree-success">
          {isConfigured ? 'Formspree mis à jour avec succès.' : 'Formspree connecté avec succès.'}
        </p>
      )}

      <div className="formspree-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={handleConnect}
          disabled={saveStatus === 'saving' || !formIdInput.trim()}
        >
          {saveStatus === 'saving' ? 'Connexion…' : isConfigured ? 'Mettre à jour' : 'Connecter'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setIsOpen(false);
            setFormIdInput('');
            setSaveStatus('idle');
            setSaveError('');
          }}
          disabled={saveStatus === 'saving'}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
