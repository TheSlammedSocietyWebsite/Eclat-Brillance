---
title: "Product Brief: NovaCMS — Admin Panel Git-Based"
status: "final"
created: "2026-04-25"
updated: "2026-04-25"
inputs:
  - "Session de découverte avec Novanns (Mary, analyste)"
  - "_bmad-output/brief-site-web.md"
  - "Veille marché : TinaCMS, Decap CMS, Keystatic, Sanity, GitHub API patterns"
---

# Product Brief : NovaCMS — Admin Panel Git-Based pour Sites Clients

## Résumé exécutif

Novanns est développeur web freelance qui livre des sites vitrines à des clients non-techniques (restaurateurs, artisans, PME). Aujourd'hui, chaque modification — changer un prix, une photo, un horaire — passe par lui. C'est du temps perdu des deux côtés et une dépendance frustrante pour le client.

**NovaCMS** est un module d'admin panel léger, réutilisable et personnalisable, à embarquer dans chaque site livré. Le client accède à une interface `/admin` intuitive pour modifier ses textes, couleurs et médias — sans jamais toucher au code. En coulisse, chaque sauvegarde génère un commit Git automatique, Vercel reconstruit le site en 30 à 60 secondes, et le client est notifié en temps réel du statut de déploiement.

Ce n'est pas un CMS générique de plus. C'est un outil sur mesure, taillé pour les clients de Novanns et son workflow de livraison — simple à utiliser, facile à adapter, zéro dépendance externe payante.

---

## Le Problème

**Côté client :** Un restaurateur veut changer ses horaires d'ouverture un dimanche soir. Il ne peut pas le faire seul. Il envoie un message à son développeur, attend une réponse, attend la modification, attend le redéploiement. Parfois quelques heures, parfois quelques jours. L'autonomie promise par un site web moderne n'existe pas vraiment.

**Côté développeur :** Novanns passe du temps sur des interventions à faible valeur (changer un texte, remplacer une image) au lieu de se concentrer sur de nouveaux projets. Ces micro-interventions s'accumulent, créent des frictions relationnelles et ne sont pas facturées à leur juste valeur.

**Le statu quo :** Les solutions CMS existantes (WordPress, Wix, Squarespace) imposent des compromis majeurs — soit trop complexes pour un utilisateur niveau 0, soit trop rigides pour un développeur qui veut contrôler l'architecture. Les solutions headless modernes (TinaCMS, Sanity) sont puissantes mais surdimensionnées et intimidantes pour des clients simples.

---

## La Solution

NovaCMS est un module embarqué directement dans chaque projet client livré par Novanns. Il se compose de :

**Une interface `/admin` ultra-simple :**
- Connexion par mot de passe unique (configuré par Novanns à la livraison)
- Éditeur de texte en ligne sur les zones définies
- Sélecteur de couleurs sur la palette CSS du site
- Gestionnaire de médias : upload vers Vercel Blob Storage avec indicateur de stockage utilisé, ou lien URL pour les vidéos
- Bouton "Annuler" pour revenir au dernier état stable (dernier commit) — **le client ne peut pas casser son site définitivement**

**Un moteur sous le capot :**
- Contenu centralisé dans un fichier `content.json` versionné dans le repo Git
- Commit automatique via l'API GitHub (Octokit) sécurisé par une Edge Function Vercel
- Rebuild automatique déclenché par Vercel au push
- Notification en temps réel du statut de déploiement dans l'interface

**Le client voit :** "Sauvegarde en cours... Votre site est mis à jour ✓" — 60 secondes plus tard.

---

## Ce qui le Différencie

| Critère | NovaCMS | Decap CMS | TinaCMS | WordPress |
|---|---|---|---|---|
| Complexité pour le client niveau 0 | ⭐ Minimale | Moyenne | Élevée | Très élevée |
| Personnalisation par le dev | ⭐ Totale | Partielle | Partielle | Limitée |
| Propriété des données | ⭐ Repo Git du client, aucun SaaS tiers | Repo Git | Cloud Tina | Hébergement mutualisé |
| Intégration workflow Git/Vercel | ⭐ Native | Partielle | Bonne | Inexistante |
| Adapté au modèle "1 client = 1 site" | ⭐ Oui | Générique | Générique | Générique |

**L'avantage décisif :** NovaCMS est conçu pour le workflow exact de Novanns — chaque instance est dédiée à un seul client, pas de multi-tenant à gérer, pas de compte SaaS à souscrire. L'UX est dictée par les besoins réels des clients, pas par un cahier des charges générique.

---

## Qui ça Sert

**Utilisateur primaire : Le client final (niveau 0)**
Artisan, restaurateur, professionnel de service. Il ouvre `/admin`, se connecte avec son mot de passe, modifie ce dont il a besoin, clique "Sauvegarder". Il reçoit une confirmation visuelle. C'est tout. Il n'a pas besoin de comprendre Git, Vercel ou JSON. Son moment "aha" : réaliser qu'il peut mettre à jour son site un dimanche soir sans dépendre de personne.

**Utilisateur secondaire : Novanns (le développeur)**
Il configure une fois le `content.json` et les zones éditables à la livraison du projet. Il peut adapter le panel aux besoins spécifiques de chaque client (zones éditables différentes selon le type de site). Son gain : zéro intervention pour les modifications courantes, clients satisfaits, valeur perçue augmentée.

---

## Critères de Succès

- **Adoption client :** Le client fait sa première modification seul en moins de 5 minutes sans assistance
- **Réduction des interventions :** 0 demande de modification de contenu courant dans les 30 jours post-livraison
- **Réutilisabilité :** Le module s'intègre dans un nouveau projet en moins de 2 heures
- **Stabilité :** Zéro corruption de `content.json` ou rollback raté sur les 10 premiers déploiements

---

## Périmètre V1

**Dans le scope :**
- Route `/admin` protégée par mot de passe (variable d'environnement Vercel, rate limiting + protection brute-force)
- Édition de texte sur les zones définies dans `content.json`
- Modification des couleurs de la palette CSS du site
- Upload d'images vers Vercel Blob Storage avec indicateur de stockage
- Intégration de vidéos par URL externe (YouTube, Vimeo)
- Commit automatique via GitHub API (Edge Function sécurisée)
- Notification de statut de déploiement en temps réel
- Option "Annuler" (rollback au dernier commit stable)
- Compatible Vue/React + Vite, déployable sur Vercel

**Distribution :**
- Template repo GitHub dédié — dupliqué pour chaque nouveau projet client
- Évolution possible : package npm privé (hors scope V1)

**Hors scope V1 :**
- Portabilité générique pour d'autres développeurs
- Gestion des erreurs de rebuild Vercel (message d'erreur avancé)
- Multi-utilisateurs / gestion de rôles
- Historique de versions visible dans le panel
- Prévisualisation avant publication
- Édition de structure de page (ajout/suppression de sections)
- Gestion des formulaires de contact
- Back-office de gestion des prestations ou des rendez-vous

---

## Approche Technique (vue haute niveau)

- **Frontend du panel :** Composant Vue ou React embarqué dans le projet client
- **Stockage du contenu :** `content.json` dans le repo Git du projet
- **API GitHub :** Octokit appelé via une Vercel Edge Function (token GitHub dédié par site, sécurisé côté serveur)
- **Médias :** Vercel Blob Storage pour les images, URL externe pour les vidéos
- **Notifications :** Polling ou Vercel webhook → indicateur de statut dans l'UI admin
- **Auth :** Mot de passe simple en variable d'environnement (pas d'OAuth pour la V1)

---

## Vision

Si NovaCMS fonctionne, chaque projet livré par Novanns inclut ce module comme standard. Il devient un argument commercial différenciant : "Votre site est livré avec un panel d'administration sur mesure — vous êtes autonome dès le premier jour."

À moyen terme (6-18 mois) : enrichir le module avec une prévisualisation en direct, un historique de modifications simplifié, une gestion de contenu plus structurée (prestations, témoignages, galeries), et une distribution en package npm privé pour une intégration encore plus rapide sur chaque nouveau projet.
