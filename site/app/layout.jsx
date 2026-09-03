import '../src/index.css';
import { preload } from 'react-dom';
import Providers from './providers.jsx';
import { SITE_NAME, SITE_URL } from '../src/data/site-config.js';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: 'Éclat Brillance | Nettoyage professionnel en Île-de-France',
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Entreprise de nettoyage professionnel à Paris et en Île-de-France.',
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'services de nettoyage professionnel',
  icons: {
    icon: [{ url: '/logo.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    siteName: SITE_NAME,
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
  preload('/fonts/inter-latin.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });
  preload('/fonts/cormorant-garamond-600-latin.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });

  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
