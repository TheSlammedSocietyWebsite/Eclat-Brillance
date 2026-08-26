import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useContent } from '../hooks/useContent.jsx';
import '../index.css';

export default function MentionsLegales() {
  const { site } = useContent();

  useEffect(() => {
    document.title = `Mentions Légales & Confidentialité — ${site?.name || 'Éclat Brillance'}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [site]);

  return (
    <>
      <Header />
      <main className="legal-page" style={{ paddingTop: '7.5rem', paddingBottom: '5rem', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--c-muted)' }}>
            <a href="/" style={{ color: 'var(--c-accent)', textDecoration: 'none' }}>Accueil</a>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>Mentions légales</span>
          </nav>

          <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--c-line)', paddingBottom: '1.5rem' }}>
            <span className="section-kicker" style={{ marginBottom: '0.5rem' }}>Informations réglementaires</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--c-ink)', marginBottom: '0.75rem' }}>
              Mentions Légales & Confidentialité
            </h1>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.95rem' }}>
              Dernière mise à jour : 26 août 2026
            </p>
          </header>

          <div className="legal-content" style={{ lineHeight: '1.8', color: 'var(--c-text)', fontSize: '1rem' }}>
            
            {/* Section 1 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                1. Éditeur du site
              </h2>
              <p>
                Le présent site internet accessible à l’adresse{' '}
                <a href="https://www.eclatbrillance.com" style={{ color: 'var(--c-accent)', fontWeight: 500 }}>
                  https://www.eclatbrillance.com
                </a>{' '}
                est édité par :
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                <li><strong>Dénomination commerciale :</strong> {site?.name || 'Éclat Brillance'}</li>
                <li><strong>Activité :</strong> Services d'entretien et nettoyage professionnel de locaux, bureaux, copropriétés et commerces (Code NAF/APE : 81.21Z — Nettoyage courant des bâtiments)</li>
                <li><strong>Zone d'intervention :</strong> Paris et région Île-de-France</li>
                <li><strong>Téléphone :</strong> <a href={site?.telHref || 'tel:+33698613683'} style={{ color: 'var(--c-accent)' }}>{site?.tel || '06 98 61 36 83'}</a></li>
                <li><strong>Email de contact :</strong> <a href={`mailto:${site?.email || 'contact@eclatbrillance.com'}`} style={{ color: 'var(--c-accent)' }}>{site?.email || 'contact@eclatbrillance.com'}</a></li>
              </ul>
            </section>

            {/* Section 2 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                2. Directeur de la publication
              </h2>
              <p>
                Le Directeur de la publication du site est la direction de l'entreprise <strong>{site?.name || 'Éclat Brillance'}</strong>.
              </p>
            </section>

            {/* Section 3 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                3. Hébergement du site
              </h2>
              <p>
                Le site est hébergé par la société <strong>Vercel Inc.</strong> :
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                <li><strong>Raison sociale :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
                <li><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-accent)' }}>https://vercel.com</a></li>
              </ul>
            </section>

            {/* Section 4 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                4. Propriété intellectuelle
              </h2>
              <p>
                L’ensemble des contenus présents sur le site <strong>{site?.name || 'Éclat Brillance'}</strong> (textes, logos, photographies, graphismes, icônes, animations, structure générale du site) relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, transmission ou dénaturation totale ou partielle du site ou de son contenu, par quelque procédé que ce soit et sur quelque support que ce soit, sans l'autorisation écrite préalable d'Éclat Brillance est interdite et constituerait une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
              </p>
            </section>

            {/* Section 5 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                5. Données personnelles et politique de confidentialité (RGPD)
              </h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée :
              </p>
              <p>
                <strong>Collecte des données :</strong> Les données personnelles recueillies via le formulaire de contact et de devis (nom, société, adresse email, numéro de téléphone, détails de la prestation demandée) sont strictement destinées au traitement des demandes de devis et à la relation commerciale avec le prospect ou client.
              </p>
              <p>
                <strong>Conservation des données :</strong> Ces données sont conservées pour une durée maximale de 3 ans à compter du dernier contact émanant du prospect, ou pour la durée de la relation contractuelle en cas de souscription à une prestation.
              </p>
              <p>
                <strong>Destinataires :</strong> Les données collectées ne sont en aucun cas cédées, louées ou vendues à des tiers.
              </p>
              <p>
                <strong>Vos droits :</strong> Vous disposez d’un droit d’accès, de rectification, de suppression, de limitation et d'opposition au traitement de vos données. Pour exercer ces droits, vous pouvez nous contacter à tout moment par email à :{' '}
                <a href={`mailto:${site?.email || 'contact@eclatbrillance.com'}`} style={{ color: 'var(--c-accent)', fontWeight: 500 }}>
                  {site?.email || 'contact@eclatbrillance.com'}
                </a>.
              </p>
            </section>

            {/* Section 6 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                6. Cookies & Mesure d'audience
              </h2>
              <p>
                Le site utilise uniquement des cookies et traceurs techniques strictement nécessaires à son bon fonctionnement et à la sécurité de navigation, ainsi qu'une mesure anonymisée d'audience exempte de consentement conformément aux recommandations de la CNIL. Aucun cookie publicitaire tiers n'est déposé sans votre accord.
              </p>
            </section>

            {/* Section 7 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                7. Droit applicable et attribution de juridiction
              </h2>
              <p>
                Tout litige en relation avec l’utilisation du site <strong>https://www.eclatbrillance.com</strong> est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
              </p>
            </section>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--c-line)' }}>
              <a href="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>← Retour à l'accueil</span>
              </a>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
