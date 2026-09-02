import MentionsLegales from '../../src/views/MentionsLegales.jsx';
import content from '../../public/content.json';

const companyName = content.legal?.companyName || content.site?.name || 'Éclat Brillance';
const title = `Mentions Légales & Confidentialité — ${companyName}`;
const description = "Mentions légales, politique de confidentialité et conditions d'utilisation du site Éclat Brillance, entreprise de nettoyage professionnel à Paris.";

export const metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: '/mentions-legales',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: '/mentions-legales',
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

export default function LegalPage() {
  return <MentionsLegales />;
}
