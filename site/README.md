# Éclat Brillance — Site vitrine et NovaCMS

Site vitrine d’Éclat Brillance avec CMS intégré. L’application utilise Next.js App Router pour livrer le contenu public et les métadonnées SEO dans le HTML initial.

## Stack

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16, React 19, App Router |
| Styles | Tailwind CSS 3 + CSS global |
| Authentification | JWT (`jose`) + PBKDF2 (Web Crypto API) |
| API | Next.js Route Handlers, runtime Node.js |
| Stockage | GitHub (`content.json` et médias) |
| Statistiques | Upstash Redis |
| Hébergement | Vercel |

## Structure

```text
site/
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   ├── mentions-legales/page.jsx
│   ├── login/page.jsx
│   ├── admin/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   └── edit/page.jsx
│   └── api/
│       ├── _lib/
│       ├── login/route.js
│       ├── logout/route.js
│       ├── me/route.js
│       ├── save/route.js
│       ├── rollback/route.js
│       ├── media/route.js
│       ├── stats/route.js
│       ├── track/route.js
│       └── change-password/route.js
├── public/
│   ├── content.json
│   ├── fonts/
│   ├── media/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── views/
│   ├── index.css
│   └── admin.css
├── next.config.mjs
├── postcss.config.js
└── tailwind.config.js
```

## Développement local

```bash
cd site
npm install
npm run dev
```

L’application complète, y compris les Route Handlers `/api/*`, est disponible sur `http://localhost:3000`.

Commandes disponibles :

```bash
npm run dev
npm run build
npm start
```

## Variables d’environnement

Créer `site/.env.local` et renseigner les valeurs nécessaires :

| Variable | Obligatoire | Description |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | Oui | Hash PBKDF2 du mot de passe administrateur |
| `SESSION_SECRET` | Oui | Secret d’au moins 32 octets pour le JWT |
| `GITHUB_TOKEN` | Oui | Jeton GitHub avec accès `Contents: read/write` |
| `GITHUB_REPO_OWNER` | Oui | Propriétaire du dépôt |
| `GITHUB_REPO_NAME` | Oui | Nom du dépôt |
| `GITHUB_BRANCH` | Non | Branche cible, `master` par défaut dans les handlers |
| `CONTENT_PATH` | Non | Chemin du contenu, `site/public/content.json` par défaut |
| `MEDIA_PATH` | Non | Dossier média, `site/public/media` par défaut |
| `UPSTASH_REDIS_REST_URL` | Recommandé | URL REST Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Recommandé | Jeton REST Upstash Redis |

Générer un hash PBKDF2 :

```bash
node --input-type=module -e "import('./app/api/_lib/crypto.js').then(async ({ hashPassword }) => console.log(await hashPassword('MOT_DE_PASSE')))"
```

Générer un secret de session :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## Routes

| Route | Accès | Description |
|---|---|---|
| `/` | Public | Site vitrine |
| `/mentions-legales` | Public | Mentions légales et confidentialité |
| `/mentions` | Public | Redirection permanente vers `/mentions-legales` |
| `/login` | Noindex | Connexion NovaCMS |
| `/admin` | Protégé, noindex | Tableau de bord |
| `/admin/edit` | Protégé, noindex | Éditeur visuel |

Les endpoints API sont disponibles sous `/api/login`, `/api/logout`, `/api/me`, `/api/save`, `/api/rollback`, `/api/media`, `/api/stats`, `/api/track` et `/api/change-password`.

## Contenu et déploiement

Le contenu éditable se trouve dans `public/content.json`. Une sauvegarde depuis NovaCMS crée un commit GitHub, ce qui déclenche un nouveau déploiement Vercel. L’éditeur vérifie ensuite toutes les dix secondes que le contenu sauvegardé est en ligne, avec un délai maximal de cinq minutes.

Pour Vercel :

1. définir `site` comme Root Directory si le dépôt contient d’autres projets ;
2. conserver le Framework Preset Next.js et les commandes automatiques ;
3. renseigner les variables pour Production et Preview ;
4. déployer.

## SEO et sécurité

- Métadonnées, canonical, Open Graph et Twitter générés côté serveur ;
- graphe JSON-LD `LocalBusiness`, `WebSite` et `WebPage` dans le HTML de l’accueil ;
- `robots.txt` et `sitemap.xml` servis depuis `public/` ;
- pages privées et ressources techniques exclues par métadonnées robots et `X-Robots-Tag` ;
- déploiements Vercel Preview exclus de l’indexation via `X-Robots-Tag` ;
- cookie de session `HttpOnly`, `Secure` en production et `SameSite=Strict` ;
- en-têtes de sécurité configurés dans `next.config.mjs`.

## Vérification avant déploiement

```bash
npm run build
```

Vérifier ensuite la connexion, l’éditeur, la sauvegarde, le rollback et l’envoi du formulaire avec les variables de l’environnement cible.
