# NovaCMS — Guide Agent

Documentation technique pour les agents de maintenance et évolution du CMS intégré à Éclat Brillance.

---

## Architecture

### Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router v6 |
| Auth | JWT (jose) + PBKDF2 (Web Crypto API) |
| API | Vercel Edge Functions (runtime: 'edge') |
| Stockage | GitHub (content.json + médias dans `public/media/`) |
| Analytics | @vercel/analytics |

### Règles critiques

1. **Edge Functions en `.js` uniquement** — Vercel TypeScript 5.9+ est trop strict pour les types implicites des Edge Functions. Tous les fichiers dans `api/` doivent rester en `.js`.
2. **Pas de `bcryptjs` côté Edge** — Le module n'est pas compatible Edge Runtime. L'authentification utilise Web Crypto API native (`crypto.subtle.deriveBits` avec PBKDF2). Voir `api/_lib/crypto.js`.
3. **Cookies HttpOnly + SameSite=Strict** — Le token JWT est stocké dans un cookie HttpOnly avec `SameSite=Strict`. Pas de localStorage.
4. **Polling de déploiement** — Après sauvegarde, l'admin vérifie toutes les 10s que le `content.json` distant correspond au contenu sauvegardé. Timeout après 5 minutes.

---

## Structure du projet

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
│   │   ├── Apropos.jsx           # Utilise images.apropos1 / apropos2
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

---

## Schéma content.json

```json
{
  "theme": {
    "bg": "#F8F8F6",
    "bgAlt": "#FFFFFF",
    "ink": "#1A2B4A",
    "inkSoft": "#2C3E5E",
    "text": "#2C2C2C",
    "muted": "#6B6F76",
    "line": "#E6E3DE",
    "accent": "#6B8F71",
    "accentSoft": "#EAF0EC",
    "gold": "#B8935A"
  },
  "images": {
    "apropos1": "URL de l'image principale (À propos)",
    "apropos2": "URL de l'image secondaire (À propos)"
  },
  "video": "URL YouTube/Vimeo (optionnel, apparaît si présent)",
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

### Champs conditionnels

- **`video`** — N'apparaît dans l'admin que si la clé existe dans `content.json`. Pour l'activer, ajouter `"video": ""` dans le JSON.
- **`images.apropos1` / `images.apropos2`** — Toujours présents. Si vide, le site utilise des images Unsplash par défaut.

---

## Système de thème (CSS Variables)

### Mapping theme → CSS variables

| Clé JSON | Variable CSS |
|----------|-------------|
| `theme.bg` | `--c-bg` |
| `theme.bgAlt` | `--c-bg-alt` |
| `theme.ink` | `--c-ink` |
| `theme.inkSoft` | `--c-ink-soft` |
| `theme.text` | `--c-text` |
| `theme.muted` | `--c-muted` |
| `theme.line` | `--c-line` |
| `theme.accent` | `--c-accent` |
| `theme.accentSoft` | `--c-accent-soft` |
| `theme.gold` | `--c-gold` |

### Injection

1. Au chargement initial, `useContent.jsx` lit `bundledContent.theme` et applique les variables sur `:root`.
2. Après fetch du `content.json` distant (cache-bust), les variables sont ré-appliquées.
3. `tailwind.config.js` utilise ces variables CSS pour les couleurs Tailwind (`theme('colors.bg')`, etc.).

### Contraintes

- Les couleurs doivent être au format hexadécimal (`#RRGGBB`) pour que le `<input type="color">` fonctionne.
- Les dégradés dans les composants (ex: `Apropos.jsx`) utilisent `rgba()` avec opacité réduite pour ne pas masquer les images.

---

## Upload de médias

### Flux

1. L'admin sélectionne ou drop une image.
2. `MediaUploader.jsx` lit le fichier via `FileReader.readAsDataURL()`.
3. Le base64 est envoyé à `POST /api/media`.
4. L'API décode le base64, vérifie la taille (max 2MB base64 / ~1.5MB raw), valide le format (JPEG, PNG, WebP, GIF).
5. L'image est commitée sur GitHub dans `public/media/<filename>`.
6. L'API retourne l'URL raw GitHub : `https://raw.githubusercontent.com/.../public/media/<filename>`.
7. L'URL est stockée dans `content.json` (ex: `images.apropos1`).

### Limites

- **Taille max** : 1.5 Mo raw (~2 Mo base64)
- **Formats** : JPEG, PNG, WebP, GIF
- **Stockage** : GitHub (pas de CDN externe)

---

## Authentification

### Hash PBKDF2

```bash
node -e "const { hashPassword } = require('./api/_lib/crypto.js'); hashPassword('MOT_DE_PASSE').then(h => console.log(h))"
```

### Session JWT

- **Durée** : 8 heures
- **Cookie** : `HttpOnly; SameSite=Strict; Secure` (en prod)
- **Vérification** : `jose.jwtVerify()` avec tolérance d'horloge de 30s

### Protection des routes

- `AuthProvider` vérifie `/api/me` au montage.
- `useAuth` expose `isAuthenticated`, `isLoading`, `checkAuth`, `logoutAndRedirect`.
- L'admin redirige vers `/admin/login` si non authentifié.

---

## API Endpoints

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/login` | Non | Vérifie PBKDF2, crée cookie JWT |
| POST | `/api/logout` | Oui | Efface le cookie |
| GET | `/api/me` | Oui (cookie) | Vérifie la session |
| POST | `/api/save` | Oui | Commit `content.json` sur GitHub |
| POST | `/api/rollback` | Oui | Revert le dernier commit |
| POST | `/api/media` | Oui | Upload image base64 → GitHub |

### Codes d'erreur API

| Code | Signification |
|------|--------------|
| `unauthorized` | Session invalide ou expirée |
| `github_unavailable` | API GitHub indisponible (retry) |
| `github_error` | Conflit de modification externe |
| `too_large` | Contenu ou fichier trop volumineux |
| `empty_content` | Tentative de sauvegarder du contenu vide |
| `network` | Erreur réseau |

---

## Déploiement continu

1. Push sur `master` → Vercel rebuild automatiquement.
2. Sauvegarde CMS → `api/save.js` commit `content.json` sur `master` → Vercel rebuild.
3. Polling de déploiement : l'admin vérifie toutes les 10s que le `content.json` distant correspond au contenu sauvegardé. Timeout après 5 minutes.

---

## Variables d'environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `ADMIN_PASSWORD_HASH` | Oui | Hash PBKDF2 du mot de passe |
| `SESSION_SECRET` | Oui | Secret ≥32 octets pour JWT |
| `GITHUB_TOKEN` | Oui | PAT fine-grained (scope Contents: read+write) |
| `GITHUB_REPO_OWNER` | Oui | Owner du repo |
| `GITHUB_REPO_NAME` | Oui | Nom du repo |
| `GITHUB_BRANCH` | Non | Branche cible (défaut: `main`) |
| `CONTENT_PATH` | Oui | Chemin du fichier JSON (ex: `site/public/content.json`) |

---

## Conventions de code

### Composants

- Un composant = un fichier dans `src/components/`
- Nom en PascalCase, export default
- Les composants d'édition (`TextEditor`, `ColorEditor`, `MediaUploader`) sont réutilisables et stateless

### Hooks

- `useContent()` — accède au contexte content.json
- `useAuth()` — accède au contexte auth (doit être dans `<AuthProvider>`)

### Styles

- Site : `index.css` + Tailwind (`theme('colors.xxx')`)
- Admin : `admin.css` (styles spécifiques au panel CMS)
- Pas de CSS-in-JS, pas de styled-components

### Edge Functions

- Toujours `.js`
- Exporter `config = { runtime: 'edge' }`
- Utiliser `safeFetch()` avec timeout et credentials
- Retourner `{ ok, error }` pour les erreurs

---

## Dépannage

| Problème | Cause | Solution |
|----------|-------|----------|
| "Erreur de connexion" / `server_misconfig` | Module incompatible Edge | Utiliser Web Crypto API native |
| Build échoue sur Edge Functions | Fichiers `.ts` | Renommer en `.js` |
| Image uploadée invisible sur le site | Dégradé CSS trop opaque | Réduire l'opacité du gradient (ex: `0.8` → `0.45`) |
| Admin ne détecte pas le déploiement | Cache navigateur | Le polling utilise `?t=${Date.now()}` |
| "Modifications externes détectées" | Conflit GitHub | Recharger la page et réessayer |
| Cookie non transmis | SameSite ou Secure | Vérifier HTTPS en prod, SameSite=Strict |

---

## Checklist avant modification

- [ ] Edge Functions restent en `.js`
- [ ] Pas de module npm incompatible Edge (bcryptjs, fs, etc.)
- [ ] Les couleurs du thème sont en hexadécimal (`#RRGGBB`)
- [ ] Les URLs d'images utilisent des URLs absolues (raw GitHub ou CDN)
- [ ] Le `content.json` reste valide JSON après modification
- [ ] Tester le build local (`npm run build`) avant commit
