# Services externes — Éclat Brillance + NovaCMS

> Référence des services tiers utilisés par le projet et leur configuration.

---

## 1. Formspree — Formulaire de devis

**Rôle** : Réception des demandes de devis depuis le formulaire de contact.

**URL** : https://formspree.io

**Plan** : Gratuit (50 soumissions/mois)

### Configuration

1. Le client crée un compte sur Formspree avec son email (les leads lui appartiennent)
2. Crée un "New Form" → récupère l'endpoint (ex: `https://formspree.io/f/xyz123`)
3. Dans le dashboard NovaCMS (`/admin`) :
   - Clique sur **"Formulaire de devis"**
   - Colle l'ID (`xyz123`) dans le champ
   - Clique **"Connecter"**

### Fallback

Tant que `formId` vaut `"YOUR_FORM_ID"`, le formulaire ouvre le client mail de l'utilisateur (`mailto:`). Aucun lead n'est perdu.

### Variables liées

| Variable | Localisation | Description |
|----------|-------------|-------------|
| `site.formId` | `content.json` | ID Formspree (ex: `xlgzyyel`) |

---

## 2. Upstash Redis — Compteur de visites

**Rôle** : Compteur de visites uniques affiché dans le dashboard admin.

**URL** : https://upstash.com

**Plan** : Gratuit (10 000 requêtes/jour)

### Pourquoi Redis (et pas Git) ?

| Critère | Git commits | Upstash Redis |
|---------|-------------|---------------|
| Commits par visite | 1 | 0 |
| Pollution git | Élevée | Aucune |
| Performance | Lente (API GitHub) | ~50ms |
| Persistance après redeploy | Oui | Oui |

### Configuration

1. Créer un compte sur [upstash.com](https://upstash.com)
2. Créer une base de données → choisir la région (Frankfurt pour la France)
3. Copier les credentials :
   - **REST URL** : `https://[nom]-[region].upstash.io`
   - **REST Token** : `AYPdASQgM...`

4. Dans le dashboard Vercel → **Settings → Environment Variables** :

| Variable | Valeur |
|----------|--------|
| `UPSTASH_REDIS_REST_URL` | `https://votre-url.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | `votre-token-secret` |

**⚠️ Important** : Renseigner pour **Production** ET **Preview**.

### Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/track` | Incrémente le compteur (`INCR visits`) |
| GET | `/api/stats` | Récupère le compteur (`GET visits`) |

### Désactivation

Si les variables Redis ne sont pas configurées, le dashboard affiche `—` (tiret) pour les visites. Le site fonctionne normalement.

---

## 3. GitHub — Stockage CMS

**Rôle** : Stockage versionné du contenu (`content.json`) et des médias uploadés.

**Type de token** : Personal Access Token fine-grained

### Permissions requises

| Scope | Permission |
|-------|-----------|
| Repository access | Only select repositories |
| Contents | Read and write |

### Fichiers stockés

| Fichier | Chemin | Description |
|---------|--------|-------------|
| `content.json` | `site/public/content.json` | Contenu éditable du site |
| `stats.json` | `site/public/stats.json` | Compteur de visites (obsolète, remplacé par Redis) |
| Médias | `site/public/media/` | Images uploadées via le CMS |

---

## 4. Vercel — Hosting & Edge Functions

**Rôle** : Déploiement, hosting, Edge Functions.

**URL** : https://vercel.com

### Framework preset

| Setting | Valeur |
|---------|--------|
| Framework Preset | Vite |
| Build Command | `vite build` |
| Output Directory | `dist` |
| Root Directory | `site` (si le repo contient d'autres dossiers) |

### Edge Functions

Tous les fichiers dans `site/api/*.js` sont des Edge Functions (runtime V8 isolé).

| Endpoint | Auth | Description |
|----------|------|-------------|
| `/api/login` | Non | Authentification PBKDF2 + JWT |
| `/api/logout` | Oui | Suppression session |
| `/api/me` | Oui (cookie) | Vérification session |
| `/api/save` | Oui | Commit `content.json` sur GitHub |
| `/api/rollback` | Oui | Revert dernier commit |
| `/api/media` | Oui | Upload image base64 → GitHub |
| `/api/track` | Non | Incrémente compteur Redis |
| `/api/stats` | Non | Récupère stats (Redis) |

---

## 5. Google Fonts — Typographie

**Polices utilisées** :

| Police | Rôle | Poids |
|--------|------|-------|
| Cormorant Garamond | Titres (serif) | 400, 500, 600, 700 |
| Inter | Corps de texte (sans-serif) | 300, 400, 500, 600, 700 |

**URL** : `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap`

**Optimisation** : `preconnect` déjà configuré dans `index.html`.

---

## 6. @vercel/analytics — Analytics basiques

**Rôle** : Analytics de base (pages vues, etc.) intégrées à Vercel.

**Installation** : Déjà intégrée dans `main.jsx` via `<Analytics />`.

**Dashboard** : Disponible dans le panel Vercel du projet.

---

## Récapitulatif des variables d'environnement

| Variable | Service | Obligatoire |
|----------|---------|-------------|
| `ADMIN_PASSWORD_HASH` | Auth interne | ✅ Oui |
| `SESSION_SECRET` | Auth interne | ✅ Oui |
| `GITHUB_TOKEN` | GitHub API | ✅ Oui |
| `GITHUB_REPO_OWNER` | GitHub API | ✅ Oui |
| `GITHUB_REPO_NAME` | GitHub API | ✅ Oui |
| `GITHUB_BRANCH` | GitHub API | ❌ Non (défaut: `main`) |
| `CONTENT_PATH` | GitHub API | ✅ Oui |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis | ❌ Non (recommandé) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis | ❌ Non (recommandé) |

---

## Checklist onboarding client

- [ ] Créer compte Formspree → copier l'ID
- [ ] Se connecter à `/admin` → configurer Formspree
- [ ] Créer compte Upstash → copier URL + Token
- [ ] Ajouter variables Upstash sur Vercel
- [ ] Vérifier que le compteur de visites fonctionne dans le dashboard

---

*Dernière mise à jour : 2026-05-16*
