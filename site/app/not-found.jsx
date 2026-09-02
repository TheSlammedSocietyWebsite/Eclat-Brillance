import NotFound from '../src/views/NotFound.jsx';

export const metadata = {
  title: { absolute: 'Page introuvable — Éclat Brillance' },
  description: "La page que vous recherchez n'existe pas. Retournez à l'accueil d'Éclat Brillance, entreprise de nettoyage professionnel à Paris.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}
