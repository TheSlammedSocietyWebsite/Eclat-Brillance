import HomeClient from './home-client.jsx';
import TrackVisit from './track-visit.jsx';
import {
  siteJsonLd,
  serializeJsonLd,
} from '../src/data/structured-data.js';
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  SITE_NAME,
} from '../src/data/site-config.js';

export const metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: '/',
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/og-eclat-brillance.png'],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        id="site-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
      />
      <TrackVisit />
      <HomeClient />
    </>
  );
}
