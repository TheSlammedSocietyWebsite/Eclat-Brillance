import { useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { contact, siteConfig } from '../data/content.js';

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

const { formLabels, formPlaceholder, formSelectDefault, submitLabel, submitLoading, statusMessages } = contact;

export default function Contact() {
  const copyRef = useScrollReveal();
  const formScrollRef = useScrollReveal();
  const formEl = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', type: null });

  const action = `https://formspree.io/f/${siteConfig.formId}`;
  const useFormspree = siteConfig.formId && siteConfig.formId !== 'YOUR_FORM_ID';

  const handleSubmit = async (e) => {
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
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
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
          <span className="section-kicker">{contact.kicker}</span>
          <h2>{contact.title}</h2>
          <p>{contact.body}</p>
          <ul className="contact-direct">
            <li>
              <PhoneIcon />
              <a href={siteConfig.telHref}>{siteConfig.tel}</a>
            </li>
            <li>
              <MailIcon />
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
          </ul>
          <p className="contact-note">
            {contact.notePrefix} <strong>{contact.note}</strong>
          </p>
        </div>

        <form
          className="contact-form"
          id="devis-form"
          ref={(el) => { formEl.current = el; formScrollRef.current = el; }}
          action={action}
          method="POST"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <label>
              <span>{formLabels.nom} <em>*</em></span>
              <input type="text" name="nom" required autoComplete="name" />
            </label>
            <label>
              <span>{formLabels.societe}</span>
              <input type="text" name="societe" autoComplete="organization" />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span>{formLabels.email} <em>*</em></span>
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <label>
              <span>{formLabels.tel} <em>*</em></span>
              <input type="tel" name="telephone" required autoComplete="tel" />
            </label>
          </div>
          <label>
            <span>{formLabels.prestation} <em>*</em></span>
            <select name="prestation" required>
              <option value="">{formSelectDefault}</option>
              {contact.prestationOptions.map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{formLabels.message}</span>
            <textarea name="message" rows="5" placeholder={formPlaceholder}></textarea>
          </label>

          <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />

          <button type="submit" className={`btn btn-primary btn-block${loading ? ' is-loading' : ''}`} disabled={loading}>
            <span className="btn-label">{submitLabel}</span>
            <span className="btn-loading" aria-hidden="true">{submitLoading}</span>
          </button>

          {status.msg && (
            <p className={`form-status${status.type ? ` is-${status.type}` : ''}`} role="status" aria-live="polite">
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
