import { useEffect } from 'react';

const defaults = {
  title: 'Entreprise de Nettoyage de Bureaux à Paris & IDF — Éclat Brillance',
  description: 'Société de nettoyage professionnel à Paris et en Île-de-France. Entretien de bureaux, immeubles et commerces. Devis gratuit et personnalisé sous 24h.',
  canonical: 'https://www.eclatbrillance.com/',
  ogImage: 'https://www.eclatbrillance.com/og-eclat-brillance.png',
};

export function useSEO({ title, description, canonical, noindex } = {}) {
  useEffect(() => {
    // Title
    const finalTitle = title || defaults.title;
    document.title = finalTitle;

    // Meta description
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', description || defaults.description);

    // Canonical
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.setAttribute('href', canonical || defaults.canonical);

    // OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', finalTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || defaults.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical || defaults.canonical);

    // Twitter
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', finalTitle);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description || defaults.description);

    // Robots
    const robotsEl = document.querySelector('meta[name="robots"]');
    if (robotsEl) {
      robotsEl.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = defaults.title;
      if (descEl) descEl.setAttribute('content', defaults.description);
      if (canonicalEl) canonicalEl.setAttribute('href', defaults.canonical);
      if (robotsEl) robotsEl.setAttribute('content', 'index, follow');
      if (ogTitle) ogTitle.setAttribute('content', defaults.title);
      if (ogDesc) ogDesc.setAttribute('content', defaults.description);
      if (ogUrl) ogUrl.setAttribute('content', defaults.canonical);
      if (twTitle) twTitle.setAttribute('content', defaults.title);
      if (twDesc) twDesc.setAttribute('content', defaults.description);
    };
  }, [title, description, canonical, noindex]);
}
