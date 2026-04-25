# Éclat Brillance — Site Vitrine

Site vitrine statique (HTML/CSS/JS vanilla). Zéro build, déployable partout.

## Structure

```
site/
├── index.html       # Page unique
├── css/styles.css   # Styles
├── js/main.js       # Interactions + formulaire
└── assets/          # Logo, images (à ajouter)
```

## Lancer en local

Ouvre `index.html` directement dans le navigateur, ou sers le dossier :

```bash
cd site
python3 -m http.server 8000
# → http://localhost:8000
```

## Configurer le formulaire de devis

Le formulaire fonctionne avec [Formspree](https://formspree.io) (gratuit jusqu'à 50 envois/mois).

1. Créer un compte sur formspree.io avec `contact@eclatbrillance.com`
2. Créer un nouveau form → récupérer l'endpoint (ex : `https://formspree.io/f/abc123`)
3. Remplacer dans `index.html` :
   ```html
   <form ... action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   par l'endpoint réel.

**Fallback intégré** : tant que l'endpoint n'est pas configuré, le formulaire ouvre le client mail de l'utilisateur avec les champs pré-remplis. Aucune perte de prospect.

## Déploiement

**Option rapide (gratuit) : Netlify, Vercel, Cloudflare Pages**
- Drag & drop du dossier `site/` sur l'UI → live en 30 sec
- Ou via Git : connecter le repo, aucun build command

**Option classique : OVH, Hostinger, O2Switch**
- Upload du contenu de `site/` via FTP dans le dossier `www/` ou `public_html/`

## Domaine

Acheter `eclatbrillance.fr` ou `.com` chez OVH / Gandi / Namecheap, puis configurer le DNS vers l'hébergeur.

## À personnaliser avant mise en ligne

- [ ] Remplacer le logo SVG par le vrai logo (extrait du flyer) — dans `index.html` `<span class="brand-mark">`
- [ ] Ajouter de vraies photos dans `assets/` et remplacer les URLs Unsplash dans `css/styles.css` (`.figure-card-1`, `.figure-card-2`)
- [ ] Configurer Formspree (voir ci-dessus)
- [ ] Ajouter la page "Mentions légales" (lien en footer actuellement vide)
- [ ] Renseigner `og:image` dans `<head>` pour le partage réseaux sociaux

## Performance / SEO

- Fonts Google préchargés (`preconnect`)
- HTML sémantique (h1/h2/h3, `<main>`, `<section>`, `<article>`)
- Meta description + OpenGraph en place
- `prefers-reduced-motion` respecté
- Images optimisables via `loading="lazy"` (à ajouter si ajout d'images supplémentaires)

## Évolutions futures (hors scope V1)

Le code est prêt pour accueillir sans refonte :
- Pages secondaires (blog, mentions légales) — dupliquer `index.html` et adapter
- Témoignages clients → section facile à insérer entre Atouts et Contact
- Calendly ou autre outil de RDV → intégration iframe dans la section Contact
- Avis Google → widget intégrable

---

Stack ultra-légère, cohérente avec le brief : pro, rapide, maintenable.
