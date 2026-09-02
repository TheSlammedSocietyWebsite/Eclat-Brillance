import { useSEO } from '../hooks/useSEO.jsx';

export default function NotFound() {
  useSEO({
    title: 'Page introuvable — Éclat Brillance',
    description: 'La page que vous recherchez n\'existe pas. Retournez à l\'accueil d\'Éclat Brillance, entreprise de nettoyage professionnel à Paris.',
    noindex: true,
  });

  return (
    <main style={{ textAlign: 'center', padding: '4rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: '#1f2937' }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>Page introuvable</p>
      <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#2563eb', textDecoration: 'none' }}>
        Retour à l'accueil
      </a>
    </main>
  );
}
