# Éclat Brillance — Site Vitrine + NovaCMS

Site vitrine pour Éclat Brillance, avec CMS intégré (NovaCMS) pour édition du contenu via `/admin`.

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6
- NovaCMS (panel admin + API Vercel Edge Functions)

## Structure

```
site/
├── public/
│   └── content.json       # Contenu éditable via le CMS
├── src/
│   ├── components/        # Composants du site (Hero, Contact, etc.)
│   ├── pages/
│   │   ├── Site.jsx       # Page d'accueil (toutes les sections)
│   │   ├── Login.jsx      # Page de connexion admin
│   │   └── Admin.jsx      # Éditeur de contenu CMS
│   ├── hooks/
│   │   └── useContent.jsx # Hook pour charger content.json
│   ├── lib/
│   │   ├── api.js         # Client API (login/logout/save)
│   │   └── auth-guard.jsx # Protection des routes admin
│   ├── data/
│   │   └── content.js     # Données par défaut (référence)
│   ├── admin.css          # Styles du panel admin
│   └── index.css          # Styles du site (Tailwind)
├── api/                   # Vercel Edge Functions
│   ├── login.ts
│   ├── logout.ts
│   ├── me.ts
│   ├── save.ts
│   └── _lib/
│       ├── session.ts
│       └── github.ts
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

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

| Variable | Description |
|---|---|
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe admin. **Jamais** en clair. |
| `SESSION_SECRET` | Secret aléatoire ≥32 octets pour signer le JWT. |
| `GITHUB_TOKEN` | PAT fine-grained, scope `Contents: read+write` sur ce repo uniquement. |
| `GITHUB_REPO_OWNER` | Owner du repo (ex: `npons971`). |
| `GITHUB_REPO_NAME` | Nom du repo (ex: `eclat-brillance`). |
| `GITHUB_BRANCH` | Branche cible (`main`). |
| `CONTENT_PATH` | Chemin du fichier JSON (`public/content.json`). |

### Générer le hash bcrypt

```bash
node -e "console.log(require('bcryptjs').hashSync('TON_MOT_DE_PASSE', 12))"
```

### Générer le SESSION_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## Déploiement Vercel

1. Importer le repo dans Vercel.
2. Framework Preset : **Vite** (auto-détecté).
3. Build Command / Output Directory : laisser les defaults Vite.
4. Renseigner les variables d'environnement (Production + Preview).
5. Deploy.

Vercel rebuild automatiquement à chaque push sur `main` — y compris ceux générés par `/api/save`.

## Édition du contenu

- Aller sur `https://votre-site.vercel.app/admin`
- Se connecter avec le mot de passe admin
- Modifier les champs et cliquer "Sauvegarder"
- Le `content.json` est commité sur GitHub → Vercel rebuild en ~60s

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

## Routes

- `/` — page publique du site
- `/admin/login` — connexion au CMS
- `/admin` — éditeur de contenu (protégé)
- `/api/login` · `/api/logout` · `/api/me` · `/api/save` — Edge Functions

## Performance / SEO

- Fonts Google préchargés (`preconnect`)
- HTML sémantique
- Meta description + OpenGraph en place
- `prefers-reduced-motion` respecté
- Contenu versionné dans Git (rollback possible)
