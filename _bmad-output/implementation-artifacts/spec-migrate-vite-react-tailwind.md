---
title: 'Migrer le site statique vers Vite/React + Tailwind (CMS-ready)'
type: 'refactor'
created: '2026-04-26'
status: 'done'
context: []
baseline_commit: '6a11a441b07e5ea653024d5f2d9c680b677ad41c'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le site Éclat Brillance est un HTML/CSS/JS vanilla monolithique — tout le contenu éditorial est hardcodé dans `index.html`, rendant impossible toute intégration d'un CMS custom futur.

**Approach:** Scaffolder un projet Vite + React + Tailwind dans `site/`, décomposer la page en composants React props-driven, et extraire tout le contenu éditorial dans `src/data/content.js` — seul point d'entrée que le CMS viendra lire/écrire.

## Boundaries & Constraints

**Always:**
- Parité visuelle stricte avec le site statique (couleurs, typographie, layout, animations reveal)
- Tout le texte éditorial passe par `src/data/content.js` — aucun string hardcodé dans les composants
- Tailwind config inclut les tokens brand (couleurs, fonts) — pas de `styles.css` résiduel dans le build
- Google Fonts (Cormorant Garamond + Inter) chargées via `<link>` dans `index.html`
- Formspree + fallback mailto conservés à l'identique, portés en React
- IntersectionObserver scroll-reveal porté en custom hook `useScrollReveal`

**Ask First:**
- Si une lib UI tierce (framer-motion, headlessui…) semble nécessaire pour un comportement — demander avant d'ajouter la dépendance

**Never:**
- Modifier le contenu textuel ou la structure visuelle des sections
- Ajouter React Router (site one-page)
- Ajouter un state manager global (Redux, Zustand…)
- Garder `css/styles.css` ou `js/main.js` dans le build final

</frozen-after-approval>

## Code Map

- `site/index.html` -- shell HTML Vite (remplace le statique)
- `site/package.json` -- react 18, react-dom, vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer
- `site/vite.config.js` -- plugin React
- `site/tailwind.config.js` -- tokens brand : couleurs, fontFamily (serif/sans)
- `site/postcss.config.js` -- tailwindcss + autoprefixer
- `site/src/main.jsx` -- ReactDOM.createRoot entry point
- `site/src/App.jsx` -- composition des sections
- `site/src/index.css` -- directives Tailwind (@tailwind base/components/utilities) + reset global minimal
- `site/src/data/content.js` -- SSOT éditorial : siteConfig, hero, apropos, prestations[], atouts[], contact
- `site/src/hooks/useScrollReveal.js` -- IntersectionObserver (threshold 0.12, rootMargin -40px), renvoie une ref
- `site/src/components/Header.jsx` -- sticky header, scroll-shadow (useEffect), menu mobile (useState)
- `site/src/components/Hero.jsx` -- eyebrow, h1, lede, 2 CTAs, badge −15%, scroll-reveal
- `site/src/components/Apropos.jsx` -- copy + highlights list + figure cards déco, scroll-reveal
- `site/src/components/Prestations.jsx` -- grille 6 service-cards, SVG icons inline, scroll-reveal
- `site/src/components/Atouts.jsx` -- grille 4 atouts numérotés 01–04, scroll-reveal
- `site/src/components/Contact.jsx` -- formulaire devis, Formspree fetch + fallback mailto, honeypot, états loading/success/error
- `site/src/components/Footer.jsx` -- 3 colonnes + footer-bottom, année via `new Date().getFullYear()`
- `site/css/` + `site/js/` -- SUPPRIMÉS (logique absorbée par les composants React + Tailwind)

## Tasks & Acceptance

**Execution:**
- [x] `site/package.json` -- Créer avec deps react 18, react-dom, vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer -- base du projet Vite
- [x] `site/vite.config.js` -- Config minimale avec plugin React
- [x] `site/tailwind.config.js` -- Déclarer content glob `./src/**/*.{js,jsx}`, étendre theme : colors (bg, ink, ink-soft, text, muted, line, accent, accent-soft, gold), fontFamily (serif Cormorant Garamond, sans Inter), borderRadius, boxShadow custom
- [x] `site/postcss.config.js` -- tailwindcss + autoprefixer
- [x] `site/index.html` -- meta charset/viewport/description/OG, preconnect Google Fonts + link Cormorant Garamond+Inter, `<div id="root">`, `<script type="module" src="/src/main.jsx">`
- [x] `site/src/index.css` -- `@tailwind base/components/utilities`, reset `html { scroll-behavior: smooth }`, classes utilitaires reveal/is-visible pour les animations
- [x] `site/src/data/content.js` -- Extraire fidèlement depuis `index.html` : siteConfig (name, tel, email, formId), nav links, hero (eyebrow, title, lede, ctas, proof items, badge), apropos (title, body, highlights[]), prestations[] (icon svgPath, title, body), atouts[] (num, title, body), contact (title, body, directLinks[], prestationOptions[]), footer
- [x] `site/src/hooks/useScrollReveal.js` -- Hook prenant un `ref`, observe via IntersectionObserver, ajoute la classe `is-visible` à l'intersection, désobserve ensuite
- [x] `site/src/components/Header.jsx` -- Sticky, `isScrolled` state sur window.scroll, `isOpen` state pour burger, nav links depuis content, classe `nav-cta` sur "Devis gratuit"
- [x] `site/src/components/Hero.jsx` -- Layout hero-inner (content + badge), données depuis content.hero, bouton tel avec SVG phone icon, badge card −15%
- [x] `site/src/components/Apropos.jsx` -- Deux colonnes : copy (kicker, h2, p, ul highlights) + figure (deux div déco), reveal via hook
- [x] `site/src/components/Prestations.jsx` -- section-head + service-grid 6 cards, chaque card : icon SVG inline, h3, p depuis content.prestations[], reveal via hook
- [x] `site/src/components/Atouts.jsx` -- section-head + atouts-grid 4 items, num span + h3 + p depuis content.atouts[], fond ink (section sombre), reveal
- [x] `site/src/components/Contact.jsx` -- Deux colonnes : copy (kicker, h2, p, contact-direct links, note −15%) + formulaire (champs identiques au statique, logique Formspree/mailto, honeypot, états btn loading), données depuis content.contact
- [x] `site/src/components/Footer.jsx` -- footer-inner 3 colonnes + footer-bottom avec année dynamique
- [x] `site/src/App.jsx` -- Importer Header, Hero, Apropos, Prestations, Atouts, Contact, Footer ; les composer dans `<main>` avec `<header>` et `<footer>`
- [x] `site/src/main.jsx` -- `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`
- [x] `site/css/` + `site/js/` -- Supprimer les deux dossiers (absorbés par la stack React/Tailwind)

**Acceptance Criteria:**
- Given `npm install && npm run dev` dans `site/`, when localhost:5173 charge, then les 7 sections s'affichent à l'identique du site statique (visuellement)
- Given viewport < 768px, when la page charge, then le burger menu est visible, cliquable, et ferme la nav au clic sur un lien
- Given le scroll dépasse 8px, when l'utilisateur scrolle, then le header reçoit l'ombre (`is-scrolled`)
- Given un élément hors viewport, when il entre dans le viewport, then il s'anime en fade-in (classe `is-visible`)
- Given formulaire soumis sans Formspree configuré (`YOUR_FORM_ID`), when envoi, then le fallback mailto s'ouvre avec les champs pré-remplis
- Given `npm run build` dans `site/`, when la commande se termine, then `dist/` est généré sans erreur TypeScript/lint

## Design Notes

**`content.js` comme SSOT CMS-ready :**
```js
export const siteConfig = { name: 'Éclat Brillance', tel: '+33698613683', email: 'contact@eclatbrillance.com', formId: 'YOUR_FORM_ID' };
export const prestations = [{ icon: '<svg...>', title: 'Entretien de bureaux', body: '...' }, ...];
```
Le CMS custom remplacera plus tard ce fichier par un `fetch()` vers son API — aucune refonte de composants nécessaire.

**Tailwind + parité visuelle :**
Les classes utilitaires Tailwind couvrent tout sauf deux cas : l'animation reveal (`reveal`/`is-visible`) et le `section-kicker::before` (pseudo-élément déco). Ces deux patterns restent dans `index.css` via `@layer components`.

## Spec Change Log

### Loop 1 — 2026-04-26

**Triggering finding:** R3 (acceptance auditor) — strings éditoriaux hardcodés dans Prestations, Atouts, Footer, Contact et Hero CTA, violation directe du boundary "all editorial text → content.js". Patches associés : `lang="fr"` absent de index.html (R1), fragment sans key dans Hero hero-proof (R1+R2), footer split broken (R2), .gitignore absent (R3).

**Amended:** `src/data/content.js` étendu pour couvrir TOUS les exports éditoriaux (prestationsSection, atoutsSection, footer complet, contact avec labels/placeholder/messages, hero.primaryCta). Composants mis à jour pour importer depuis content.js. Bugs patchés : lang="fr", fragment keys, footer split, .gitignore.

**Known-bad state:** Strings hardcodés dans JSX → CMS ne peut pas les lire/écrire sans toucher le code.

**KEEP:** Config files, index.css complet en @layer, useScrollReveal, Header, Apropos, ServiceCard/AtoutItem structure, dangerouslySetInnerHTML SVG, Formspree/mailto logic — tous corrects.

## Verification

**Commands:**
- `cd site && npm install` -- expected: exit 0, node_modules créé
- `cd site && npm run dev` -- expected: serveur Vite sur localhost:5173
- `cd site && npm run build` -- expected: `dist/` généré, 0 erreurs

## Suggested Review Order

**CMS Data Contract**

- SSOT éditorial complet : CMS futur remplace ce fichier par un `fetch()` API
  [`content.js:1`](../../site/src/data/content.js#L1)

- Tokens brand (couleurs, fonts) : parité visuelle garantie par config
  [`tailwind.config.js:1`](../../site/tailwind.config.js#L1)

**Architecture des composants**

- Composition root — toutes les sections assemblées ici
  [`App.jsx:1`](../../site/src/App.jsx#L1)

- ServiceCard individuel avec useScrollReveal ; données depuis prestationsSection + prestations[]
  [`Prestations.jsx:4`](../../site/src/components/Prestations.jsx#L4)

- AtoutItem pattern ; kicker/titre depuis atoutsSection
  [`Atouts.jsx:4`](../../site/src/components/Atouts.jsx#L4)

- Logique Formspree/mailto ; tous les labels/messages depuis content.contact
  [`Contact.jsx:1`](../../site/src/components/Contact.jsx#L1)

- Fragment key fix sur hero-proof map ; primaryCta depuis content
  [`Hero.jsx:28`](../../site/src/components/Hero.jsx#L28)

- Footer : headings/legal depuis content, split générique description
  [`Footer.jsx:1`](../../site/src/components/Footer.jsx#L1)

**Interactivité**

- IntersectionObserver encapsulé en hook React, cleanup sur unmount
  [`useScrollReveal.js:1`](../../site/src/hooks/useScrollReveal.js#L1)

- isScrolled + isOpen state ; nav depuis content.nav
  [`Header.jsx:1`](../../site/src/components/Header.jsx#L1)

**Styles**

- CSS intégral en `@layer components` avec `theme()` ; reveal/kicker::before conservés
  [`index.css:1`](../../site/src/index.css#L1)

**Infrastructure**

- `lang="fr"`, Vite entry point, Google Fonts preconnect
  [`index.html:1`](../../site/index.html#L1)

- node_modules et dist exclus du repo
  [`.gitignore:1`](../../.gitignore#L1)
