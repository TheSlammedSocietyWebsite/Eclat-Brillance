import '../src/index.css';
import '../src/admin.css';
import Providers from './providers.jsx';

const siteUrl = 'https://www.eclatbrillance.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Éclat Brillance',
  title: {
    default: 'Éclat Brillance',
    template: '%s — Éclat Brillance',
  },
  description: 'Entreprise de nettoyage professionnel à Paris et en Île-de-France.',
  icons: {
    icon: [{ url: '/logo.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    siteName: 'Éclat Brillance',
    locale: 'fr_FR',
    type: 'website',
  },
  other: {
    'geo.region': 'FR-IDF',
    'geo.placename': 'Paris',
  },
};

export const viewport = {
  themeColor: '#1A2B4A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/cormorant-garamond-600-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/cormorant-garamond-400-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
