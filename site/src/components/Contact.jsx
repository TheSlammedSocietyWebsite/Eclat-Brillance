'use client';

import { useState, useRef, useId } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';
import { useEditMode } from '../hooks/useEditMode.jsx';
import EditableText from './edit/EditableText.jsx';
import EditableArrayControls from './edit/EditableArrayControls.jsx';

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Contact() {
  const copyRef = useScrollReveal();
  const formScrollRef = useScrollReveal();
  const formEl = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', type: null });
  const statusId = useId();
  const { contact, site, hero } = useContent();
  const isEditMode = useEditMode();

  const { formLabels, formPlaceholder, formSelectDefault, submitLabel, submitLoading, statusMessages, prestationOptions } = contact;

  const action = `https://formspree.io/f/${site.formId}`;
  const useFormspree = site.formId && site.formId !== 'YOUR_FORM_ID';

  const handleSubmit = async (e) => {
    if (isEditMode) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const form = formEl.current;

    const gotcha = form.querySelector('[name="_gotcha"]');
    if (gotcha && gotcha.value) return;

    if (!form.checkValidity()) {
      setStatus({ msg: statusMessages.validationError, type: 'error' });
      form.reportValidity();
      return;
    }

    setLoading(true);
    setStatus({ msg: '', type: null });

    if (!useFormspree) {
      const fd = new FormData(form);
      const subject = encodeURIComponent(`Demande de devis — ${fd.get('prestation') || 'Prestation'}`);
      const body = encodeURIComponent(
        `Nom : ${fd.get('nom') || ''}\n` +
        `Société : ${fd.get('societe') || ''}\n` +
        `Email : ${fd.get('email') || ''}\n` +
        `Téléphone : ${fd.get('telephone') || ''}\n` +
        `Prestation : ${fd.get('prestation') || ''}\n\n` +
        `${fd.get('message') || ''}`
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setLoading(false);
      setStatus({ msg: statusMessages.mailtoSuccess, type: 'success' });
      return;
    }

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        form.reset();
        setStatus({ msg: statusMessages.formspreeSuccess, type: 'success' });
        // Track lead submission
        fetch('/api/track?type=lead', { method: 'POST', credentials: 'include' }).catch(() => {});
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = (data.errors && data.errors.map(x => x.message).join(' ')) || statusMessages.formspreeError;
        setStatus({ msg, type: 'error' });
      }
    } catch {
      setStatus({ msg: statusMessages.networkError, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container contact-inner">
        <div className="contact-copy" ref={copyRef}>
          <span className="section-kicker">
            <EditableText path="contact.kicker">{contact.kicker}</EditableText>
          </span>
          <h2>
            <EditableText path="contact.title" tag="span">{contact.title}</EditableText>
          </h2>
          <p>
            <EditableText path="contact.body" multiline tag="span">{contact.body}</EditableText>
          </p>
          <ul className="contact-direct">
            <li>
              <PhoneIcon />
              <a href={site.telHref}>
                <EditableText path="site.tel" tag="span">{site.tel}</EditableText>
              </a>
            </li>
            <li>
              <MailIcon />
              <a href={`mailto:${site.email}`}>
                <EditableText path="site.email" tag="span">{site.email}</EditableText>
              </a>
            </li>
          </ul>
          <div className="contact-proof" aria-label="Garanties">
            {hero.proof.map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckIcon />
                <EditableText path={`hero.proof.${i}`} tag="span">{item}</EditableText>
              </span>
            ))}
          </div>
          <p className="contact-note">
            <EditableText path="contact.notePrefix" tag="span">{contact.notePrefix}</EditableText>{' '}
            <strong>
              <EditableText path="contact.note" tag="span">{contact.note}</EditableText>
            </strong>
          </p>
        </div>

        <form
          className={`contact-form${isEditMode ? ' is-editing' : ''}`}
          id="devis-form"
          ref={(el) => { formEl.current = el; formScrollRef.current = el; }}
          action={action}
          method="POST"
          noValidate
          onSubmit={handleSubmit}
          aria-describedby={status.msg ? statusId : undefined}
        >
          <div className="form-row">
            <label>
              <span>
                <EditableText path="contact.formLabels.nom" tag="span">{formLabels.nom}</EditableText>
                <em aria-hidden="true">*</em>
              </span>
              <input type="text" name="nom" required autoComplete="name" aria-required="true" tabIndex={isEditMode ? -1 : 0} />
            </label>
            <label>
              <span>
                <EditableText path="contact.formLabels.societe" tag="span">{formLabels.societe}</EditableText>
              </span>
              <input type="text" name="societe" autoComplete="organization" tabIndex={isEditMode ? -1 : 0} />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span>
                <EditableText path="contact.formLabels.email" tag="span">{formLabels.email}</EditableText>
                <em aria-hidden="true">*</em>
              </span>
              <input type="email" name="email" required autoComplete="email" aria-required="true" tabIndex={isEditMode ? -1 : 0} />
            </label>
            <label>
              <span>
                <EditableText path="contact.formLabels.tel" tag="span">{formLabels.tel}</EditableText>
                <em aria-hidden="true">*</em>
              </span>
              <input type="tel" name="telephone" required autoComplete="tel" aria-required="true" tabIndex={isEditMode ? -1 : 0} />
            </label>
          </div>
          <label>
            <span>
              <EditableText path="contact.formLabels.prestation" tag="span">{formLabels.prestation}</EditableText>
              <em aria-hidden="true">*</em>
            </span>
            <select name="prestation" required aria-required="true" tabIndex={isEditMode ? -1 : 0}>
              <option value="">{formSelectDefault}</option>
              {prestationOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>
              <EditableText path="contact.formLabels.message" tag="span">{formLabels.message}</EditableText>
            </span>
            <textarea name="message" rows="5" placeholder={formPlaceholder} tabIndex={isEditMode ? -1 : 0}></textarea>
          </label>

          <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />

          <button type="submit" className={`btn btn-primary btn-block${loading ? ' is-loading' : ''}`} disabled={loading || isEditMode} tabIndex={isEditMode ? -1 : 0}>
            <span className="btn-label">
              <EditableText path="contact.submitLabel" tag="span">{submitLabel}</EditableText>
            </span>
            <span className="btn-loading" aria-hidden="true">
              <EditableText path="contact.submitLoading" tag="span">{submitLoading}</EditableText>
            </span>
          </button>

          <p className="form-privacy-note" style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginTop: '0.75rem', lineHeight: '1.45' }}>
            En soumettant ce formulaire, vous acceptez qu'Éclat Brillance traite vos données pour l'établissement de votre devis et la gestion de la relation commerciale. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression via notre page{' '}
            <a href="/mentions-legales" style={{ color: 'var(--c-accent)', textDecoration: 'underline' }}>
              mentions légales & confidentialité
            </a>.
          </p>

          {status.msg && (
            <p id={statusId} className={`form-status${status.type ? ` is-${status.type}` : ''}`} role="status" aria-live="polite">
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
