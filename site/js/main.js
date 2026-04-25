(() => {
  'use strict';

  const doc = document;

  // Année footer
  const yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header : ombre au scroll
  const header = doc.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const navToggle = doc.querySelector('.nav-toggle');
  const nav = doc.getElementById('primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu');
      });
    });
  }

  // Apparition progressive
  const revealables = doc.querySelectorAll('.section-head, .service-card, .atout, .apropos-copy, .apropos-figure, .contact-copy, .contact-form, .hero-content, .hero-badge');
  revealables.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('is-visible'));
  }

  // Formulaire de devis
  const form = doc.getElementById('devis-form');
  if (!form) return;

  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  const setStatus = (message, type) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    if (type) statusEl.classList.add(`is-${type}`);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot
    const gotcha = form.querySelector('[name="_gotcha"]');
    if (gotcha && gotcha.value) return;

    if (!form.checkValidity()) {
      setStatus('Merci de compléter les champs obligatoires.', 'error');
      form.reportValidity();
      return;
    }

    const action = form.getAttribute('action') || '';
    const useFormspree = action && !action.includes('YOUR_FORM_ID');

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    setStatus('', null);

    if (!useFormspree) {
      // Fallback : mailto si Formspree pas configuré
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
      window.location.href = `mailto:contact@eclatbrillance.com?subject=${subject}&body=${body}`;
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      setStatus('Votre client mail va s\'ouvrir pour finaliser l\'envoi.', 'success');
      return;
    }

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        setStatus('Merci ! Votre demande a bien été envoyée. Nous revenons vers vous sous 24 h.', 'success');
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = (data.errors && data.errors.map(x => x.message).join(' ')) ||
                    'Une erreur est survenue. Merci de réessayer ou de nous appeler directement.';
        setStatus(msg, 'error');
      }
    } catch (err) {
      setStatus('Connexion impossible. Merci de nous contacter par téléphone ou email.', 'error');
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
})();
