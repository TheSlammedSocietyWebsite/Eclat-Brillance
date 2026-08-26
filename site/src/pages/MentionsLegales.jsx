import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useContent } from '../hooks/useContent.jsx';
import EditableText from '../components/edit/EditableText.jsx';
import '../index.css';

export default function MentionsLegales() {
  const content = useContent();
  const site = content.site || {};
  const legal = content.legal || {};

  useEffect(() => {
    document.title = `Mentions Légales & Confidentialité — ${legal.companyName || site.name || 'Éclat Brillance'}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [legal.companyName, site.name]);

  const companyName = legal.companyName || 'Éclat Brillance – Stacy COMPAN (EI)';
  const legalStatus = legal.legalStatus || 'Entrepreneur Individuel (EI) — Régime de la micro-entreprise';
  const activity = legal.activity || "Services d'entretien et de nettoyage de copropriétés, bureaux et commerces (nettoyage sols-vitres, balayage, entretien des parties communes, lavage-désinfection et gestion des conteneurs)";
  const siren = legal.siren || '992 839 837';
  const siret = legal.siret || '992 839 837 00018';
  const rcs = legal.rcs || "Immatriculée au Registre National des Entreprises (RNE) et à la Chambre de Métiers et de l'Artisanat (CMA de Seine-Saint-Denis)";
  const ape = legal.ape || '81.21Z — Nettoyage courant des bâtiments';
  const tva = legal.tva || 'Franchise en base de TVA — TVA non applicable, art. 293 B du Code Général des Impôts (CGI)';
  const address = legal.address || '178 Avenue Henri Barbusse, 93700 Drancy, France';
  const phone = legal.phone || site.tel || '06 98 61 36 83';
  const email = legal.email || site.email || 'contact@eclatbrillance.com';
  const director = legal.director || 'Mme Stacy COMPAN';
  const hostName = legal.hostName || 'Vercel Inc.';
  const hostAddress = legal.hostAddress || '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis';
  const hostWebsite = legal.hostWebsite || 'https://vercel.com';
  const hostContact = legal.hostContact || 'privacy@vercel.com';

  return (
    <>
      <Header />
      <main className="legal-page" style={{ paddingTop: '7.5rem', paddingBottom: '5rem', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--c-muted)' }}>
            <a href="/" style={{ color: 'var(--c-accent)', textDecoration: 'none' }}>Accueil</a>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>Mentions légales & Confidentialité</span>
          </nav>

          <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--c-line)', paddingBottom: '1.5rem' }}>
            <span className="section-kicker" style={{ marginBottom: '0.5rem' }}>Informations réglementaires</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--c-ink)', marginBottom: '0.75rem' }}>
              Mentions Légales & Confidentialité
            </h1>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.95rem' }}>
              Dernière mise à jour : 26 août 2026 — En conformité avec la loi LCEN, le RGPD et le Code de la consommation.
            </p>
          </header>

          <div className="legal-content" style={{ lineHeight: '1.8', color: 'var(--c-text)', fontSize: '1rem' }}>
            
            {/* Section 1 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                1. Éditeur du site & Identification de l'entreprise
              </h2>
              <p>
                Le présent site internet accessible à l’adresse{' '}
                <a href="https://www.eclatbrillance.com" style={{ color: 'var(--c-accent)', fontWeight: 500 }}>
                  https://www.eclatbrillance.com
                </a>{' '}
                est édité et exploité par :
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>
                  <strong>Nom commercial & Dénomination : </strong>
                  <EditableText path="legal.companyName" tag="span">{companyName}</EditableText>
                </li>
                <li>
                  <strong>Forme juridique : </strong>
                  <EditableText path="legal.legalStatus" tag="span">{legalStatus}</EditableText>{' '}
                  <span style={{ fontSize: '0.85rem', color: 'var(--c-muted)' }}>(Mention obligatoire art. R.123-237 du Code de commerce)</span>
                </li>
                <li>
                  <strong>Activité principale : </strong>
                  <EditableText path="legal.activity" multiline tag="span">{activity}</EditableText>
                </li>
                <li>
                  <strong>Numéro SIREN : </strong>
                  <EditableText path="legal.siren" tag="span">{siren}</EditableText>
                </li>
                <li>
                  <strong>Numéro SIRET (établissement principal) : </strong>
                  <EditableText path="legal.siret" tag="span">{siret}</EditableText>
                </li>
                <li>
                  <strong>Immatriculation : </strong>
                  <EditableText path="legal.rcs" tag="span">{rcs}</EditableText>
                </li>
                <li>
                  <strong>Code NAF / APE : </strong>
                  <EditableText path="legal.ape" tag="span">{ape}</EditableText>
                </li>
                <li>
                  <strong>Régime de TVA : </strong>
                  <EditableText path="legal.tva" tag="span">{tva}</EditableText>
                </li>
                <li>
                  <strong>Adresse de l'établissement : </strong>
                  <EditableText path="legal.address" tag="span">{address}</EditableText>
                </li>
                <li>
                  <strong>Téléphone : </strong>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'var(--c-accent)' }}>
                    <EditableText path="legal.phone" tag="span">{phone}</EditableText>
                  </a>
                </li>
                <li>
                  <strong>Email de contact : </strong>
                  <a href={`mailto:${email}`} style={{ color: 'var(--c-accent)' }}>
                    <EditableText path="legal.email" tag="span">{email}</EditableText>
                  </a>
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                2. Directrice de la publication
              </h2>
              <p>
                La Directrice de la publication du site est :{' '}
                <strong>
                  <EditableText path="legal.director" tag="span">{director}</EditableText>
                </strong>, en sa qualité d'entrepreneure individuelle.
              </p>
            </section>

            {/* Section 3 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                3. Hébergement du site
              </h2>
              <p>
                Le site est hébergé par la société <strong><EditableText path="legal.hostName" tag="span">{hostName}</EditableText></strong> :
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>
                  <strong>Raison sociale : </strong>
                  <EditableText path="legal.hostName" tag="span">{hostName}</EditableText>
                </li>
                <li>
                  <strong>Adresse postale : </strong>
                  <EditableText path="legal.hostAddress" tag="span">{hostAddress}</EditableText>
                </li>
                <li>
                  <strong>Site web : </strong>
                  <a href={hostWebsite} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-accent)' }}>
                    <EditableText path="legal.hostWebsite" tag="span">{hostWebsite}</EditableText>
                  </a>
                </li>
                <li>
                  <strong>Contact : </strong>
                  <span>{hostContact}</span>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                4. Propriété intellectuelle
              </h2>
              <p>
                L’ensemble des éléments constitutifs du présent site (textes, marque commerciale « Éclat Brillance », logo, photographies, graphismes, icônes, arborescence et design) relève de la législation française et internationale sur le droit d'auteur, les marques et la propriété intellectuelle.
              </p>
              <p style={{ marginTop: '0.75rem' }}>
                Toute reproduction, représentation, modification, diffusion ou exploitation totale ou partielle du site ou de ses composants, sans l'autorisation écrite préalable expresse d'Éclat Brillance, est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
              </p>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--c-muted)' }}>
                Crédits photographiques : Éclat Brillance, Unsplash.
              </p>
            </section>

            {/* Section 5 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                5. Protection des données personnelles (RGPD)
              </h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD n° 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée :
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p>
                  <strong>• Responsable du traitement : </strong>
                  Mme Stacy COMPAN – Éclat Brillance (EI), 178 Avenue Henri Barbusse, 93700 Drancy.
                </p>
                <p>
                  <strong>• Finalités de la collecte : </strong>
                  Les données personnelles recueillies via le formulaire de contact et de demande de devis (nom, société, email, téléphone, détails des prestations) sont collectées exclusivement afin de répondre aux demandes d'information, d'établir des propositions de devis personnalisées et d'assurer le suivi commercial.
                </p>
                <p>
                  <strong>• Base légale : </strong>
                  Le traitement repose sur l'exécution de mesures précontractuelles prises à la demande du prospect (article 6.1.b du RGPD) ainsi que sur l'intérêt légitime de l'entreprise dans la gestion de ses relations professionnelles.
                </p>
                <p>
                  <strong>• Durée de conservation : </strong>
                  Les données des prospects sont conservées pour une durée maximale de 3 ans à compter du dernier contact émanant du prospect. En cas de contrat, les données sont conservées pendant toute la durée de la relation contractuelle, puis archivées selon les obligations légales de prescription comptable et commerciale.
                </p>
                <p>
                  <strong>• Destinataires & Sous-traitance : </strong>
                  Les données collectées sont destinées exclusivement à Éclat Brillance et ne font l'objet d'aucune cession, location ou vente à des tiers. Les formulaires sont transmis de façon sécurisée via le prestataire technique Formspree Inc., engagé dans le respect du RGPD et des mécanismes de transfert de données encadrés par l'Union Européenne.
                </p>
                <p>
                  <strong>• Vos droits : </strong>
                  Vous disposez d’un droit d’accès, de rectification, de suppression, de limitation et d'opposition au traitement de vos données, ainsi que du droit à la portabilité. Pour exercer ces droits, il vous suffit de nous adresser votre demande par email à{' '}
                  <a href={`mailto:${email}`} style={{ color: 'var(--c-accent)', fontWeight: 500 }}>
                    {email}
                  </a>{' '}
                  ou par courrier postal à l'adresse du siège social.
                </p>
                <p>
                  <strong>• Droit de réclamation : </strong>
                  Si vous estimez, après nous avoir contactés, que vos droits Informatique et Libertés ne sont pas respectés, vous avez la possibilité d’introduire une réclamation auprès de l’autorité de contrôle française, la <strong>CNIL</strong> (Commission Nationale de l’Informatique et des Libertés — 3 Place de Fontenoy, 75007 Paris — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-accent)' }}>www.cnil.fr</a>).
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                6. Cookies & Mesure d'audience
              </h2>
              <p>
                Le site utilise uniquement des traceurs techniques strictement nécessaires au fonctionnement et à la sécurité de navigation, ainsi qu'un dispositif interne de comptage d'audience strictement anonymisé, dispensé du recueil préalable de consentement conformément aux lignes directrices et recommandations de la CNIL. Aucun cookie de profilage publicitaire ou tiers n'est utilisé.
              </p>
            </section>

            {/* Section 7 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                7. Médiation de la consommation & Règlement des litiges
              </h2>
              <p>
                Conformément aux articles L.612-1 et R.616-1 du Code de la consommation, pour toute réclamation non résolue à l'amiable avec notre service client concernant une prestation fournie à un consommateur particulier, le client a le droit de recourir gratuitement à un médiateur de la consommation agréé.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                En application de l'article 14 du Règlement (UE) n°524/2013, la Commission Européenne met à disposition une plateforme de règlement en ligne des litiges accessible sur :{' '}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-accent)' }}>
                  https://ec.europa.eu/consumers/odr/
                </a>.
              </p>
            </section>

            {/* Section 8 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                8. Tarifs, devis et offres commerciales
              </h2>
              <p>
                Les demandes de devis via le site sont gratuites et sans engagement. Chaque devis personnalisé mentionne le descriptif détaillé des prestations, la fréquence d'intervention ainsi que les tarifs applicables.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                L'offre de bienvenue (−15 % sur la première prestation) est réservée à tout nouveau client pour sa première souscription à un contrat ou première intervention ponctuelle, non cumulable avec toute autre réduction.
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--c-muted)' }}>
                Avis clients : Les témoignages présentés sur le site proviennent de retours d'expérience et d'évaluations réelles collectés auprès de nos clients partenaires.
              </p>
            </section>

            {/* Section 9 */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--c-ink)', marginBottom: '1rem' }}>
                9. Droit applicable et juridiction compétente
              </h2>
              <p>
                Le présent site et ses mentions légales sont régis par le droit français. En cas de litige relatif à l’interprétation, la validité ou l’exécution des présentes, attribution exclusive de compétence est faite aux juridictions compétentes selon les règles de droit commun.
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
