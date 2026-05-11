# Checklist — Livraison Éclat Brillance + NovaCMS

## Pré-requis

- [ ] Node.js installé (v18+)
- [ ] Compte Vercel (gratuit sur [vercel.com](https://vercel.com))
- [ ] Compte GitHub avec le repo du projet pushé
- [ ] Compte Formspree (optionnel, pour le formulaire de devis)

---

## 1. Configuration du contenu

- [ ] Vérifier que `public/content.json` contient les **vrais textes** du client (pas les placeholders)
- [ ] Vérifier que le numéro de téléphone est correct dans `content.json` (`site.tel`, `site.telHref`)
- [ ] Vérifier que l'email est correct (`site.email`)
- [ ] Configurer Formspree (voir section 5 ci-dessous)

---

## 2. Variables d'environnement Vercel

Dans le dashboard Vercel du projet → **Settings → Environment Variables**

| Variable | Valeur | Exemple |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | Hash PBKDF2 du mot de passe admin | `pbkdf2:SALT:HASH` |
| `SESSION_SECRET` | Secret aléatoire ≥32 octets | `aB3x9...` (48 octets base64) |
| `GITHUB_TOKEN` | GitHub PAT fine-grained | `github_pat_11A...` |
| `GITHUB_REPO_OWNER` | Owner du repo GitHub | `TheSlammedSocietyWebsite` |
| `GITHUB_REPO_NAME` | Nom du repo GitHub | `Eclat-Brillance` |
| `GITHUB_BRANCH` | Branche cible | `master` |
| `CONTENT_PATH` | Chemin du fichier dans le repo | `site/public/content.json` |

**⚠️ Important** : Renseigner ces variables pour **Production** ET **Preview**.

### Générer les valeurs

```bash
# Hash PBKDF2 du mot de passe (compatible Vercel Edge)
cd site
node -e "const { hashPassword } = require('./api/_lib/crypto.js'); hashPassword('MOT_DE_PASSE').then(h => console.log(h))"

# Session secret
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### Créer le GitHub Token

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. Generate new token
3. **Repository access** : Only select repositories → choisir le repo du projet
4. **Permissions** → **Repository permissions** → **Contents** → **Read and write**
5. Générer et copier le token

---

## 3. Déploiement sur Vercel

### Première installation

```bash
# Installer Vercel CLI si ce n'est pas déjà fait
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer depuis le dossier site/
cd site
vercel
```

### Configuration du projet Vercel

Dans le dashboard Vercel :

- [ ] **Framework Preset** : Vite (auto-détecté normalement)
- [ ] **Build Command** : `vite build` (défaut)
- [ ] **Output Directory** : `dist` (défaut)
- [ ] **Install Command** : `npm install` (défaut)
- [ ] **Root Directory** : `site` (si le repo contient d'autres dossiers)

### Redeployer après une modification

```bash
cd site
vercel --prod   # Production
vercel          # Preview (staging)
```

Ou simplement push sur `main` → Vercel rebuild auto.

---

## 4. Tester le CMS avant livraison

- [ ] Aller sur `https://monsite.vercel.app/admin`
- [ ] Se connecter avec le mot de passe admin
- [ ] Modifier un champ (ex: le titre du hero)
- [ ] Cliquer **Sauvegarder**
- [ ] Vérifier que le message *"Sauvegardé — rebuild Vercel en cours (~60s)"* apparaît
- [ ] Attendre ~60 secondes et rafraîchir la page d'accueil
- [ ] Vérifier que la modification est visible sur le site public
- [ ] Vérifier sur GitHub qu'un nouveau commit a été créé sur `public/content.json`

---

## 5. Configurer le formulaire de devis (Formspree)

### Si le client veut recevoir les devis par email

1. Créer un compte sur [formspree.io](https://formspree.io)
2. Créer un nouveau formulaire → récupérer l'endpoint (ex: `https://formspree.io/f/abc123`)
3. Modifier `public/content.json` :
   ```json
   "site": {
     "formId": "abc123"
   }
   ```
4. Commit et push → Vercel rebuild

### Fallback intégré

Tant que `formId` vaut `"YOUR_FORM_ID"`, le formulaire ouvre le client mail de l'utilisateur. Aucune perte de prospect.

---

## 6. Livraison au client

### Ce qu'il faut transmettre au client

- [ ] **URL du site** : `https://monsite.vercel.app/`
- [ ] **URL du panel admin** : `https://monsite.vercel.app/admin`
- [ ] **Mot de passe admin** : (le mot de passe en clair, pas le hash)
- [ ] **Instructions rapides** :
  > "Allez sur /admin, connectez-vous avec le mot de passe, modifiez les textes, cliquez Sauvegarder. Attendez 1 minute, le site se met à jour automatiquement."

### Ce qu'il ne faut PAS transmettre

- ❌ Le hash bcrypt (`ADMIN_PASSWORD_HASH`)
- ❌ Le `SESSION_SECRET`
- ❌ Le `GITHUB_TOKEN`
- ❌ L'accès au dashboard Vercel (sauf si le client le demande explicitement)

---

## 7. Maintenance courante

### Changer le mot de passe admin

1. Générer un nouveau hash :
   ```bash
   cd site
   node -e "const { hashPassword } = require('./api/_lib/crypto.js'); hashPassword('NOUVEAU_MOT_DE_PASSE').then(h => console.log(h))"
   ```
2. Mettre à jour la variable `ADMIN_PASSWORD_HASH` sur Vercel
3. Redeployer (`vercel --prod` ou push un commit vide)

### Modifier le contenu vous-même (développeur)

Option A — Via le panel admin (comme le client)
Option B — Modifier `public/content.json` directement dans le repo et push

### Modifier le code (design, nouvelle section, etc.)

1. Modifier les fichiers React dans `src/`
2. `npm run build` en local pour vérifier
3. Commit + push sur `main`
4. Vercel rebuild auto

---

## 8. Notes importantes sur les Edge Functions

- **Format** : Les Edge Functions doivent être en `.js` (pas `.ts`). Vercel utilise TypeScript 5.9+ avec une config stricte qui fait échouer le build sur les types implicites.
- **Compatibilité** : N'utiliser que des modules compatibles Edge (`jose` ✅, `bcryptjs` ❌). L'authentification utilise **Web Crypto API** (PBKDF2) au lieu de `bcryptjs`.
- **Routing** : Le `vercel.json` ne supporte pas les regex avec negative lookahead. Utiliser des rewrites explicites :
  ```json
  {
    "rewrites": [
      { "source": "/api/:path*", "destination": "/api/:path*" },
      { "source": "/:path*", "destination": "/index.html" }
    ]
  }
  ```

---

## 9. Dépannage

| Problème | Cause probable | Solution |
|---|---|---|
| "Session expirée" sur /admin | Cookie invalide ou `SESSION_SECRET` changé | Se reconnecter |
| "Échec de la sauvegarde" | `GITHUB_TOKEN` invalide ou expiré | Regénérer le token GitHub |
| "Contenu trop volumineux" | `content.json` dépasse 900 Ko | Réduire la taille du contenu |
| Le site ne se met pas à jour après save | Vercel n'a pas rebuild | Vérifier que le commit est bien pushé sur `master` |
| `api/*` ne répond pas en local | `npm run dev` ne sert pas les Edge Functions | Utiliser `npx vercel dev` |
| Build échoue | Erreur TypeScript ou import manquant | Vérifier `npm run build` en local |
| "Erreur de connexion" / `server_misconfig` | `bcryptjs` incompatible avec l'environnement Edge | Remplacer par Web Crypto API (PBKDF2) — voir `api/_lib/crypto.js` |
| "Deployment failed" — invalid route source pattern | Regex avec negative lookahead dans `vercel.json` | Utiliser des rewrites explicites (voir section 8) |
| Build échoue sur les Edge Functions | Fichiers `.ts` avec types implicites | Renommer en `.js` et retirer les types TypeScript |

---

## Récap des URLs après déploiement

| URL | Description |
|---|---|
| `https://monsite.vercel.app/` | Site public |
| `https://monsite.vercel.app/admin` | Panel admin (protégé) |
| `https://monsite.vercel.app/admin/login` | Page de connexion |

---

*Dernière mise à jour : 2026-05-11*
