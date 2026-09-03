# Audit SEO — Éclat Brillance

Date de l'audit : 3 septembre 2026
Site : https://www.eclatbrillance.com/
Périmètre de ce lot : audit et corrections non visuelles. Les changements de contenu ou d'interface sont listés séparément et restent soumis à validation.

## Conclusion

Le site n'était pas bloqué techniquement : la page d'accueil répondait en `200`, son contenu était présent dans le HTML initial, la canonical était correcte, le domaine sans `www` redirigeait vers `www`, et `robots.txt` ainsi que le sitemap étaient accessibles.

La faible visibilité s'explique surtout par trois facteurs :

1. le site et sa version Next.js indexable ont été mis en production le 2 septembre 2026, soit la veille de l'audit ;
2. aucune page du domaine n'est encore ressortie lors des recherches publiques de contrôle ; seule Google Search Console permettra de confirmer l'état exact de l'index Google ;
3. le site ne possède qu'une seule URL commerciale. Les résultats concurrents sont occupés par des domaines plus anciens, plus cités, et souvent dotés de pages dédiées à chaque service ou zone.

Il n'existe donc pas de correction technique magique garantissant un classement immédiat. Le socle technique est maintenant propre ; les prochains gains importants viendront de l'indexation effective, de la fiche Google Business Profile, de contenus commerciaux dédiés et de signaux d'autorité locaux.

## Contrôles effectués

### Production observée avant ce lot

| Contrôle | Résultat |
|---|---|
| Accueil | `200`, HTML complet rendu côté serveur |
| Domaine sans `www` | redirection permanente vers `https://www.eclatbrillance.com/` |
| HTTP | redirection permanente vers HTTPS |
| Canonical accueil | `https://www.eclatbrillance.com` |
| `robots.txt` | accessible et sitemap déclaré |
| `sitemap.xml` | accessible, accueil et mentions légales présents |
| Vérification Search Console | fichier Google accessible en `200` |
| Ancienne route `/mentions` | redirection permanente vers `/mentions-legales` |
| URL inexistante | vrai statut `404` et balise `noindex` |
| Titres | un seul `h1` sur l'accueil, hiérarchie `h2`/`h3` cohérente |
| Images publiques | attributs `alt` présents sur les images de contenu |

### Version locale corrigée

| Contrôle | Résultat |
|---|---|
| Build Next.js | réussi |
| Contrôle TypeScript | réussi |
| Accueil | `200`, `index, follow`, aucune directive `noindex` HTTP |
| Canonical | présente dans le HTML initial |
| Données structurées | JSON valide ; `LocalBusiness`, `WebSite`, `WebPage`, 7 services |
| Mentions légales | `200`, canonical propre, `WebPage` et fil d'Ariane JSON-LD |
| Login et administration | `noindex` dans le HTML et dans `X-Robots-Tag` |
| Ressources techniques | `content.json`, `stats.json`, fichier Google et `/api/*` en `X-Robots-Tag: noindex` |
| Previews Vercel | `noindex` global hors environnement Production |
| Sitemap | URLs canoniques et date de modification significative au 3 septembre 2026 |
| CSS public | environ 56 Ko avant, 30,8 Ko après (CSS admin sorti de la page publique) |
| Fontes préchargées | 6 balises dupliquées avant, 2 ressources critiques uniques après |
| Authentification publique | suppression de l'appel inutile à `/api/me` sur l'accueil |

Le test PageSpeed distant n'a pas pu être relevé pendant l'audit, l'API publique ayant retourné une limite de quota. Il faudra le relancer sur la production une fois ce lot déployé.

## Corrections appliquées

### Métadonnées

- titre d'accueil raccourci à 52 caractères et centré sur la requête principale : `Nettoyage de bureaux à Paris & IDF | Éclat Brillance` ;
- description réécrite à 145 caractères pour préciser les services et le devis sous 24 h ;
- titre et description des mentions légales raccourcis ;
- nom, URL, titres et descriptions centralisés pour éviter les incohérences entre balises et JSON-LD ;
- informations d'éditeur et catégorie de site ajoutées.

### Données structurées et entité locale

- remplacement du type inexistant `CleaningService` par le type standard `LocalBusiness` ;
- ajout des entités `WebSite`, `WebPage`, `ImageObject`, catalogue d'offres et points de contact ;
- ajout des identifiants SIREN et SIRET, de la date de création et du profil LinkedIn public ;
- coordonnées géographiques corrigées à partir de l'API officielle française des entreprises ;
- retrait des horaires et moyens de paiement non affichés sur la page afin que le balisage ne contienne pas d'affirmations invisibles ou non véifiées ;
- retrait du balisage `FAQPage` : Google a cessé d'afficher les résultats enrichis FAQ le 7 mai 2026 et a retiré cette documentation en juin 2026. Les FAQ visibles restent dans le HTML.

### Indexation et exploration

- suppression du conflit qui bloquait `/login` et `/admin` dans `robots.txt` tout en leur appliquant `noindex` : les robots peuvent maintenant lire la directive `noindex` ;
- ajout de `X-Robots-Tag` sur les pages privées, APIs et fichiers techniques ;
- ajout d'un `noindex` global pour tous les déploiements Vercel Preview afin d'éviter les copies indexables ;
- nettoyage du sitemap : retrait de `priority` et `changefreq`, ignorés par Google, et mise à jour fiable de `lastmod`.

### Performance utile au SEO

- CSS d'administration chargé uniquement sur `/login` et `/admin` ;
- authentification chargée uniquement sur ces mêmes routes ;
- préchargement de fontes dédupliqué et limité aux deux fontes critiques ;
- en-tête `X-Powered-By` désactivé.

## Actions externes prioritaires

Ces actions ne peuvent pas être réalisées dans le code du site.

1. Dans Google Search Console, confirmer la propriété `https://www.eclatbrillance.com/` ou créer une propriété Domaine via DNS.
2. Envoyer `https://www.eclatbrillance.com/sitemap.xml` dans le rapport Sitemaps.
3. Inspecter l'URL de l'accueil, lancer le test en direct, puis demander l'indexation.
4. Contrôler après quelques jours les rapports Pages, Sitemaps et Exploration. L'indexation n'est jamais garantie et peut prendre plusieurs jours.
5. Créer ou revendiquer la fiche Google Business Profile et y saisir exactement le même nom, téléphone, adresse et site.
6. Ajouter le site sur le profil LinkedIn et, si d'autres profils officiels existent, fournir leurs URL pour les relier au JSON-LD.
7. Obtenir progressivement de vrais avis Google et quelques liens locaux ou professionnels pertinents : partenaires, fournisseurs, réseaux d'entreprises, chambres consulaires et annuaires sélectifs.
8. Mesurer chaque semaine impressions, requêtes, pages indexées, clics et demandes de devis. Ne pas juger le positionnement au bout de 24 ou 48 heures.

## Phase visible proposée — en attente de validation

Ces changements modifieraient les pages ou leur apparence et n'ont pas été appliqués.

### Priorité 1 : pages de services

Créer d'abord trois pages réellement utiles, reliées aux cartes existantes :

- nettoyage de bureaux à Paris et en Île-de-France ;
- nettoyage de copropriétés et parties communes ;
- nettoyage de fin de chantier et remise en état.

Chaque page doit expliquer le protocole, les surfaces traitées, la fréquence, les contraintes horaires, la zone, le déroulé du devis et les preuves réelles disponibles. Les concurrents visibles sur ces requêtes disposent très souvent d'une URL dédiée.

### Priorité 2 : confiance locale

- afficher l'adresse, le SIRET et la zone d'intervention dans le pied de page ;
- ajouter un lien vers la future fiche Google Business Profile ;
- remplacer ou compléter les témoignages anonymisés par des preuves vérifiables lorsque les clients l'autorisent ;
- publier de vraies photos d'interventions, avec des fichiers locaux, des noms descriptifs et des dimensions optimisées ;
- présenter un ou deux cas clients concrets : type de local, problème, protocole, fréquence et résultat.

### Priorité 3 : zones géographiques

Commencer par une page locale forte pour Drancy / Seine-Saint-Denis, puis éventuellement Paris. Ne pas générer huit pages départementales quasi identiques : ce type de pages satellites apporte peu de valeur et peut être considéré comme du contenu de faible qualité.

### Navigation et maillage

- transformer les cartes de prestations en liens vers les pages dédiées ;
- ajouter des accès visibles aux zones et aux questions fréquentes ;
- relier les pages de services entre elles seulement lorsque le lien aide le visiteur.

## Sources de référence

- Google Search Central — exigences techniques : https://developers.google.com/search/docs/essentials/technical
- Google Search Central — créer et envoyer un sitemap : https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central — `noindex` : https://developers.google.com/search/docs/crawling-indexing/block-indexing
- Google Search Central — données structurées LocalBusiness : https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google Search Central — établir les informations d'une entreprise : https://developers.google.com/search/docs/appearance/establish-business-details
- Google Search Central — retrait des résultats enrichis FAQ : https://developers.google.com/search/updates
- Schema.org — LocalBusiness : https://schema.org/LocalBusiness
- API officielle de recherche d'entreprises : https://recherche-entreprises.api.gouv.fr/search?q=992839837
