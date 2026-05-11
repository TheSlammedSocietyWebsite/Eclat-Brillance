# Éclat Brillance — Site Vitrine + NovaCMS

Site vitrine pour Éclat Brillance (entretien de bureaux et locaux professionnels), avec CMS intégré (NovaCMS) pour édition complète du contenu via `/admin`.

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router v6 |
| Auth | JWT (jose) + PBKDF2 (Web Crypto API) |
| API | Vercel Edge Functions (runtime: 'edge') |
| Stockage | GitHub (`content.json` + médias dans `public/media/`) |
| Analytics | @vercel/analytics |

## Structure

```
site/
├── public/
│   ├── content.json              # Contenu éditable (commité par l'API)
│   └── media/                    # Images uploadées via le CMS
├── api/                          # Vercel Edge Functions (.js uniquement)
│   ├── login.js                  # POST /api/login — vérifie PBKDF2, crée JWT
│   ├── logout.js                 # POST /api/logout — efface le cookie
│   ├── me.js                     # GET /api/me — vérifie la session
│   ├── save.js                   # POST /api/save — commit content.json
│   ├── rollback.js               # POST /api/rollback — revert dernier commit
│   ├── media.js                  # POST /api/media — upload image base64 → GitHub
│   └── _lib/
│       ├── crypto.js             # PBKDF2 via Web Crypto API
│       ├── session.js            # JWT sign/verify + cookie builder
│       ├── github.js             # getFileSha / putFile sur l'API GitHub
│       └── ratelimit.js          # Rate limiting par IP
├── src/
│   ├── components/               # Sections du site + éditeurs CMS
│   │   ├── Hero.jsx
│   │   ├── Apropos.jsx           # Images remplaçables (apropos1 / apropos2)
│   │   ├── Prestations.jsx
│   │   ├── Atouts.jsx
│   │   ├── Testimonials.jsx
│   │   ├── CtaBanner.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── TextEditor.jsx        # Champ texte/ligne ou multiligne
│   │   ├── ColorEditor.jsx       # Sélecteur couleur + input hex
│   │   └── MediaUploader.jsx     # Drop zone + upload base64
│   ├── pages/
│   │   ├── Site.jsx              # Page publique (toutes les sections)
│   │   ├── Login.jsx             # Page de connexion
│   │   └── Admin.jsx             # Éditeur CMS complet
│   ├── hooks/
│   │   ├── useContent.jsx        # Contexte content.json + injection CSS vars
│   │   └── useAuth.jsx           # Contexte auth (isAuthenticated, logout)
│   ├── lib/
│   │   ├── api.js                # Client API (fetch wrappers)
│   │   └── auth-guard.jsx        # Protection des routes admin
│   ├── admin.css                 # Styles du panel admin
│   └── index.css                 # Styles du site (Tailwind + custom)
├── index.html
├── tailwind.config.js            # Theme Tailwind avec variables CSS
├── vite.config.js
└── vercel.json                   # Rewrites: /api/* → Edge Functions
```

**Important** : Les Edge Functions doivent être en `.js` (pas `.ts`). Vercel TypeScript 5.9+ est trop strict pour les types implicites des Edge Functions.

## Lancer en local

### Prévisualisation du site (frontend uniquement)

```bash
cd site
npm install
npm run dev
# → http://localhost:5173
```

**Note** : `npm run dev` ne sert que le frontend. Les routes `/api/*` ne fonctionneront pas.

### Développement complet (frontend + API)

```bash
cd site
npm install
npx vercel dev
# → http://localhost:3000 (ou le port indiqué par Vercel)
```

`vercel dev` sert à la fois Vite (`/`, `/admin`) et les Edge Functions (`/api/*`).

## Configuration du CMS

1. Copier `.env.example` vers `.env.local` :
   ```bash
   cp .env.example .env.local
   ```

2. Renseigner les variables :

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `ADMIN_PASSWORD_HASH` | Oui | Hash PBKDF2 du mot de passe admin. **Jamais** en clair. |
| `SESSION_SECRET` | Oui | Secret aléatoire ≥32 octets pour signer le JWT. |
| `GITHUB_TOKEN` | Oui | PAT fine-grained, scope `Contents: read+write` sur ce repo uniquement. |
| `GITHUB_REPO_OWNER` | Oui | Owner du repo (ex: `TheSlammedSocietyWebsite`). |
| `GITHUB_REPO_NAME` | Oui | Nom du repo (ex: `Eclat-Brillance`). |
| `GITHUB_BRANCH` | Non | Branche cible (`master`). Défaut: `main`. |
| `CONTENT_PATH` | Oui | Chemin du fichier JSON (`site/public/content.json`). |

### Générer le hash du mot de passe (PBKDF2)

```bash
cd site
node -e "const { hashPassword } = require('./api/_lib/crypto.js'); hashPassword('TON_MOT_DE_PASSE').then(h => console.log(h))"
```

### Générer le SESSION_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## Déploiement Vercel

1. Importer le repo dans Vercel.
2. Framework Preset : **Vite** (auto-détecté).
3. Build Command / Output Directory : laisser les defaults Vite.
4. **Root Directory** : `site` (si le repo contient d'autres dossiers).
5. Renseigner les variables d'environnement (Production + Preview).
6. Deploy.

Vercel rebuild automatiquement à chaque push sur `master` — y compris ceux générés par `/api/save`.

## Fonctionnalités du CMS

### Édition de contenu texte
- Tous les champs texte du site sont éditables dans `/admin`
- Champs ligne simple ou multiligne
- Validation côté client avant sauvegarde

### Édition des couleurs du thème
- Palette complète éditable via sélecteur couleur + input hex
- 10 variables CSS injectées dynamiquement (`--c-bg`, `--c-ink`, `--c-accent`, etc.)
- Tailwind utilise ces variables CSS via `theme('colors.bg')`
- Les couleurs doivent être au format hexadécimal `#RRGGBB`

### Gestion des images
- **Slots d'images** : `images.apropos1` et `images.apropos2` (section À propos)
- Upload par drag & drop ou clic
- Stockage sur GitHub dans `public/media/`
- Prévisualisation en grand format dans l'admin
- Boutons "Remplacer" et "Supprimer" clairement visibles
- Limites : max 1.5 Mo, formats JPEG/PNG/WebP/GIF

### Vidéo (optionnel)
- Champ conditionnel — n'apparaît que si la clé `"video"` existe dans `content.json`
- Pour activer : ajouter `"video": ""` dans le JSON

### Sauvegarde et rollback
- **Sauvegarder** : commit `content.json` sur GitHub → rebuild Vercel automatique
- **Polling de déploiement** : l'admin vérifie toutes les 10s que le contenu est en ligne (timeout 5 min)
- **Rollback** : bouton "Annuler dernier changement" pour revenir à la version précédente
- **Dirty tracking** : alerte avant fermeture de page si modifications non sauvegardées

### Sécurité
- Authentification par JWT + PBKDF2 (Web Crypto API)
- Cookie HttpOnly + SameSite=Strict
- Rate limiting par IP sur les endpoints sensibles
- Durée de session : 8 heures

## Routes

- `/` — page publique du site
- `/admin/login` — connexion au CMS
- `/admin` — éditeur de contenu (protégé)
- `/api/login` · `/api/logout` · `/api/me` · `/api/save` · `/api/rollback` · `/api/media` — Edge Functions

## Schéma content.json

```json
{
  "theme": { "bg", "bgAlt", "ink", "inkSoft", "text", "muted", "line", "accent", "accentSoft", "gold" },
  "images": { "apropos1", "apropos2" },
  "video": "URL (optionnel)",
  "site": { "name", "tagline", "tel", "telHref", "email", "formId" },
  "nav": [ { "label", "href", "cta" } ],
  "hero": { "eyebrow", "title", "titleEm", "lede", "primaryCta", "proof": [], "badge": {} },
  "apropos": { "kicker", "title", "body", "highlights": [] },
  "prestationsSection": { "kicker", "title", "lead" },
  "prestations": [ { "title", "body", "iconPaths" } ],
  "atoutsSection": { "kicker", "title" },
  "atouts": [ { "num", "title", "body" } ],
  "testimonialsSection": { "kicker", "title" },
  "testimonials": [ { "quote", "author", "role" } ],
  "ctaBanner": { "title", "body", "primaryCta", "secondaryCta" },
  "contact": { "kicker", "title", "body", "notePrefix", "note", "formLabels", "formPlaceholder", "formSelectDefault", "submitLabel", "submitLoading", "statusMessages", "prestationOptions" },
  "footer": { "description", "contactHeading", "infoHeading", "infoLines", "devisLabel", "legal", "mentions" },
  "media": [ "URLs des images uploadées" ]
}
```

## Configurer le formulaire de devis

Le formulaire fonctionne avec [Formspree](https://formspree.io) (gratuit jusqu'à 50 envois/mois).

1. Créer un compte sur formspree.io avec `contact@eclatbrillance.com`
2. Créer un nouveau form → récupérer l'endpoint (ex : `https://formspree.io/f/abc123`)
3. Modifier dans `public/content.json` :
   ```json
   "site": {
     "formId": "abc123"
   }
   ```

**Fallback intégré** : tant que l'endpoint n'est pas configuré, le formulaire ouvre le client mail de l'utilisateur avec les champs pré-remplis. Aucune perte de prospect.

## Performance / SEO

- Fonts Google préchargés (`preconnect`)
- HTML sémantique
- Meta description + OpenGraph en place
- `prefers-reduced-motion` respecté
- Contenu versionné dans Git (rollback possible)
- Analytics Vercel intégré

## Dépannage courant

| Problème | Cause | Solution |
|----------|-------|----------|
| "Erreur de connexion" / `server_misconfig` | Module incompatible Edge (ex: `bcryptjs`) | Utiliser Web Crypto API native (voir `api/_lib/crypto.js`) |
| Build échoue sur Edge Functions | Fichiers `.ts` avec types implicites | Renommer en `.js` |
| Image uploadée invisible sur le site | Dégradé CSS trop opaque | Réduire l'opacité du gradient (ex: `0.8` → `0.45`) |
| Admin ne détecte pas le déploiement | Cache navigateur | Le polling utilise `?t=${Date.now()}` |
| "Modifications externes détectées" | Conflit GitHub | Recharger la page et réessayer |
| Cookie non transmis | SameSite ou Secure | Vérifier HTTPS en prod, SameSite=Strict |
