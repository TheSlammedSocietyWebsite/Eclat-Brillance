# Notes de déploiement — Éclat Brillance + NovaCMS

Fichier de référence rapide pour les développeurs qui reprennent le projet ou font un nouveau déploiement.

---

## Stack technique

- **Frontend** : React 18 + Vite + Tailwind CSS
- **Routing** : React Router v6
- **CMS** : NovaCMS (panel admin + API Vercel Edge Functions)
- **Auth** : JWT + Web Crypto PBKDF2
- **Storage** : GitHub (`content.json` versionné)
- **Hosting** : Vercel

---

## Architecture des Edge Functions

Les fichiers dans `site/api/` sont des **Vercel Edge Functions** (runtime `edge`).

| Fichier | Rôle |
|---|---|
| `api/login.js` | Authentification (PBKDF2 + JWT) |
| `api/logout.js` | Suppression du cookie session |
| `api/me.js` | Vérification de la session active |
| `api/save.js` | Commit de `content.json` sur GitHub |
| `api/_lib/session.js` | Gestion JWT (jose) |
| `api/_lib/github.js` | API GitHub (fetch natif) |
| `api/_lib/crypto.js` | Hash/verify PBKDF2 (Web Crypto) |

---

## Contraintes critiques des Edge Functions

### 1. Fichiers en `.js` uniquement

Vercel compile les Edge Functions avec TypeScript 5.9+ en mode **strict**. Les types implicites génèrent des erreurs de build qui font crasher les fonctions.

**Règle** : Tous les fichiers dans `api/` doivent être en `.js` (pas `.ts`).

### 2. Modules compatibles Edge uniquement

L'environnement Edge de Vercel est un **runtime V8 isolé** (pas Node.js).

| Module | Compatibilité |
|---|---|
| `jose` | ✅ Compatible Edge |
| `bcryptjs` | ❌ **Incompatible** — utilise Web Crypto API à la place |
| `crypto` (Node) | ❌ **Incompatible** — utiliser `crypto.subtle` (Web Crypto) |
| `fetch` natif | ✅ Compatible |

**L'authentification utilise `crypto.subtle.deriveBits` (PBKDF2)** au lieu de `bcryptjs`.

Voir `api/_lib/crypto.js` pour l'implémentation.

### 3. Routing dans `vercel.json`

Les regex avec **negative lookahead** ne sont pas supportées par Vercel.

**Incorrect** :
```json
{ "source": "/((?!api(/|$)).*)", "destination": "/index.html" }
```

**Correct** :
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

---

## Variables d'environnement

| Variable | Valeur | Notes |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | `pbkdf2:SALT:HASH` | Généré via `api/_lib/crypto.js` |
| `SESSION_SECRET` | base64 48 octets | `require('crypto').randomBytes(48).toString('base64')` |
| `GITHUB_TOKEN` | `github_pat_...` | Fine-grained, scope Contents read+write |
| `GITHUB_REPO_OWNER` | `TheSlammedSocietyWebsite` | Owner du repo |
| `GITHUB_REPO_NAME` | `Eclat-Brillance` | Nom du repo |
| `GITHUB_BRANCH` | `master` | Branche cible |
| `CONTENT_PATH` | `site/public/content.json` | Chemin dans le repo (pas dans le build) |

**⚠️ Important** : Renseigner pour **Production** ET **Preview**.

---

## Générer le hash du mot de passe

```bash
cd site
node -e "const { hashPassword } = require('./api/_lib/crypto.js'); hashPassword('TON_MOT_DE_PASSE').then(h => console.log(h))"
```

---

## Dépannage rapide

| Symptôme | Cause | Solution |
|---|---|---|
| "Erreur de connexion" / `server_misconfig` | `bcryptjs` ou module incompatible Edge | Vérifier que `api/login.js` utilise bien `api/_lib/crypto.js` |
| Build échoue sur Edge Functions | Fichiers `.ts` avec types implicites | Renommer en `.js` |
| "Invalid route source pattern" | Regex dans `vercel.json` | Utiliser des rewrites explicites |
| "Échec de la sauvegarde" | `GITHUB_TOKEN` invalide | Regénérer le token fine-grained |
| Le site ne se met pas à jour après save | Commit pas pushé sur la bonne branche | Vérifier `GITHUB_BRANCH` |
| "Session expirée" | Cookie invalide | Se reconnecter |

---

## URLs après déploiement

| URL | Description |
|---|---|
| `https://[project].vercel.app/` | Site public |
| `https://[project].vercel.app/admin` | Panel admin |
| `https://[project].vercel.app/admin/login` | Connexion |

---

*Dernière mise à jour : 2026-05-11*
