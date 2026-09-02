import HomeClient from './home-client.jsx';
import TrackVisit from './track-visit.jsx';
import {
  cleaningServiceJsonLd,
  faqPageJsonLd,
  serializeJsonLd,
} from '../src/data/structured-data.js';

const title = 'Entreprise de Nettoyage de Bureaux à Paris & IDF — Éclat Brillance';
const description = 'Société de nettoyage professionnel à Paris et en Île-de-France. Entretien de bureaux, immeubles et commerces. Devis gratuit et personnalisé sous 24h.';

export const metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'Éclat Brillance',
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
    title,
    description,
    images: ['/og-eclat-brillance.png'],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        id="cleaning-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(cleaningServiceJsonLd) }}
      />
      <script
        id="faq-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqPageJsonLd) }}
      />
      <TrackVisit />
      <HomeClient />
    </>
  );
}
