import MentionsLegales from '../../src/views/MentionsLegales.jsx';
import {
  legalPageJsonLd,
  serializeJsonLd,
} from '../../src/data/structured-data.js';
import {
  LEGAL_DESCRIPTION,
  LEGAL_TITLE,
  SITE_NAME,
} from '../../src/data/site-config.js';

export const metadata = {
  title: { absolute: LEGAL_TITLE },
  description: LEGAL_DESCRIPTION,
  alternates: {
    canonical: '/mentions-legales',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: LEGAL_TITLE,
    description: LEGAL_DESCRIPTION,
    url: '/mentions-legales',
    siteName: SITE_NAME,
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/og-eclat-brillance.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Éclat Brillance — Entreprise de nettoyage à Paris et Île-de-France',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: LEGAL_TITLE,
    description: LEGAL_DESCRIPTION,
    images: ['/og-eclat-brillance.png'],
  },
};

export default function LegalPage() {
  return (
    <>
      <script
        id="legal-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(legalPageJsonLd) }}
      />
      <MentionsLegales />
    </>
  );
}
