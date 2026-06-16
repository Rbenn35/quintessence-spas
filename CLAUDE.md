# CLAUDE.md — Quintessence Spas

Ce fichier pilote le travail de Claude Code sur ce projet. Lis-le au début de chaque session et respecte les contraintes ci-dessous.

## Le projet

Site vitrine + e-commerce **haut de gamme** pour **Quintessence Spas**, vendeur de spas rigides premium en France. Objectif business : **maximiser les demandes de devis et visites en showroom** (lead gen), tout en permettant le paiement en ligne (acompte, accessoires) comme parcours secondaire.

Domaine : déjà réservé sur OVH (pointera vers l'hébergeur après déploiement).

## Objectifs prioritaires (dans cet ordre)

1. **Conversion** — chaque page produit doit pousser vers « Demander un devis » et « Réserver une visite ». Paiement en ligne possible mais jamais le CTA principal sur un spa rigide.
2. **SEO** — rendu serveur/statique, contenu riche, Core Web Vitals au vert, données structurées Schema.org (Product, LocalBusiness, FAQPage).
3. **Esthétique premium** — sobre, moderne, épuré. Le luxe se lit dans l'espace, la typo et la photo, pas dans la surcharge.

## Stack technique (à respecter)

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- Rendu statique (SSG) par défaut, SSR pour les pages dynamiques. **Jamais de SPA full client-side** — pénalise le SEO.
- Images via `next/image` (lazy-load, formats modernes, dimensions explicites)
- Formulaires de devis : API route Next.js + envoi email (à brancher plus tard, prévoir le hook)
- Paiement : Stripe (acompte / accessoires), à intégrer en phase 2
- Hébergement cible : Vercel ou Cloudflare Pages

NE PAS proposer de paiement, d'authentification ou d'envoi d'email sans me demander d'abord — ce sont des actions sensibles que je gère côté config.

## Structure des pages

- `/` Accueil — proposition de valeur, preuves sociales, modèles phares, CTA
- `/spas` Catalogue — filtres (nb de places, dimensions, gamme de prix), 10 à 30 modèles
- `/spas/[slug]` Fiche produit — galerie, specs, financement, CTA devis + visite
- `/guides/guide-achat-spa-rigide` Page pilier SEO
- `/guides/spa-rigide-vs-gonflable` Page pilier SEO
- `/guides/installation-entretien-spa` Page pilier SEO
- `/marque` La marque Quintessence
- `/showrooms` Localisation + prise de RDV
- `/devis` Formulaire de demande de devis (page de conversion)
- `/contact`

## Identité de marque

J'ai logo, couleurs et photos. Je les déposerai dans `/public/brand/`. **Demande-moi les valeurs hex exactes et les fichiers avant de coder le thème** — n'invente pas de palette. En attendant, utilise des variables CSS centralisées (`--color-primary`, etc.) que je remplacerai.

Direction esthétique : haut de gamme, épuré, beaucoup de respiration (whitespace), photographie en grand format, typo soignée. Pas d'effets gadget ni d'animations envahissantes. La sobriété EST le positionnement premium.

## Exigences SEO (non négociables)

- Balises `<title>` et meta description uniques par page, via le Metadata API de Next.js
- Données structurées JSON-LD : `Product` sur les fiches, `LocalBusiness` sur showrooms, `FAQPage` sur les guides
- URLs propres et lisibles en français (slugs)
- `sitemap.xml` et `robots.txt` générés
- Balises Open Graph + Twitter Card
- Hiérarchie de titres correcte (un seul `<h1>` par page)
- Contenu texte substantiel sur les pages piliers (les guides drainent le trafic)
- Alt text descriptif sur toutes les images

## Exigences conversion

- CTA visible above the fold sur chaque page
- Fiche produit : prix indicatif ou « sur devis », financement, garantie, livraison/installation
- Preuves sociales : avis clients, années d'expérience, nombre de spas installés
- Formulaire de devis court et progressif (ne pas demander 15 champs d'un coup)
- Numéro de téléphone et CTA showroom toujours accessibles
- Mobile-first : l'essentiel du trafic spa vient du mobile

## Qualité / standards

- Responsive jusqu'au mobile, focus clavier visible, `prefers-reduced-motion` respecté
- Composants réutilisables, code typé, pas de `any`
- Commits git réguliers et descriptifs
- Avant toute modif structurelle (nouvelle dépendance, changement de stack), explique-moi pourquoi

## Workflow avec moi

Je suis non-technique. Tu gères tout le code. Je gère : décisions de marque, logique commerciale, contenu, déploiement et config (OVH, Stripe, email). Explique-moi en clair ce que je dois faire de mon côté, étape par étape, sans jargon.
