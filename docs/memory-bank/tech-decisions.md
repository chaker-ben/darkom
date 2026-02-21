# Technical Decisions (ADR)

> Ne jamais supprimer un ADR — marquer Superseded si remplacé.

## ADR-001: Next.js 15 App Router
**Date**: 2026-02-21 | **Status**: Accepted
- Server Components par défaut, streaming, layouts, performance
- App Router pour le routing i18n via `[locale]`
- Turbopack pour le dev server
- Alternative rejetée: Pages Router (moins performant, legacy)

## ADR-002: Tailwind CSS 4 + @theme directive
**Date**: 2026-02-21 | **Status**: Accepted
- CSS-in-CSS avec @theme pour les design tokens
- PostCSS via @tailwindcss/postcss
- Support RTL natif avec logical properties (ms-*, me-*, ps-*, pe-*)
- Alternative rejetée: CSS Modules (dev plus lent, pas de RTL facile)

## ADR-003: PostgreSQL + Prisma ORM
**Date**: 2026-02-21 | **Status**: Accepted
- PostgreSQL pour la base de données relationnelle
- Prisma comme ORM type-safe avec migrations et schema déclaratif
- Auto-génération de types TypeScript via `prisma generate`
- Alternative rejetée: Supabase (vendor lock-in, on préfère le contrôle direct)
- Alternative rejetée: Drizzle (écosystème moins mature)

## ADR-003b: Clerk pour l'authentification
**Date**: 2026-02-21 | **Status**: Accepted
- Auth-as-a-service complet : email, téléphone, Google OAuth, MFA
- Free tier généreux, intégration native Next.js
- Composants pré-construits (SignIn, SignUp, UserButton)
- Webhooks pour sync avec la base PostgreSQL (profiles)
- Alternative rejetée: NextAuth.js (plus de setup, moins de features out-of-box)
- Alternative rejetée: Supabase Auth (vendor lock-in)

## ADR-004: Zod pour toute validation
**Date**: 2026-02-21 | **Status**: Accepted
- Inférence TypeScript automatique
- Même schéma client/serveur
- Intégration native avec react-hook-form via @hookform/resolvers
- Alternative rejetée: Yup (support TS plus faible)

## ADR-005: Vitest pour les tests
**Date**: 2026-02-21 | **Status**: Accepted
- Rapide, ESM natif, API compatible Jest
- Coverage v8 avec seuil 80%
- Alternative rejetée: Jest (lent, problèmes ESM)

## ADR-006: Turborepo + pnpm workspaces
**Date**: 2026-02-21 | **Status**: Accepted
- Monorepo avec packages partagés (@darkom/config, @darkom/db, @darkom/i18n, etc.)
- Cache distant Turborepo pour CI/CD
- pnpm pour la gestion des dépendances (rapide, strict)
- Alternative rejetée: Nx (plus complexe pour ce cas d'usage)

## ADR-007: next-intl pour l'internationalisation web
**Date**: 2026-02-21 | **Status**: Accepted
- Intégration native avec Next.js App Router
- Routing i18n via middleware + [locale]
- Support ICU Message Format
- Alternative rejetée: next-i18next (Pages Router only)

## ADR-008: Zustand + TanStack Query pour le state management
**Date**: 2026-02-21 | **Status**: Accepted
- Zustand : state global léger (UI, auth, preferences)
- TanStack Query v5 : server state (listings, pros, cache, pagination)
- Alternative rejetée: Redux Toolkit (trop verbeux pour ce cas)

## ADR-009: Konnect pour les paiements
**Date**: 2026-02-21 | **Status**: Accepted
- Seul provider supportant les paiements en Tunisie (Flouci, carte bancaire locale)
- 0 setup fee, intégration webhook
- Alternative rejetée: Stripe (pas disponible en Tunisie)

## ADR-010: Cloudinary pour les images
**Date**: 2026-02-21 | **Status**: Accepted
- Transformation à la volée (resize, crop, format)
- CDN mondial, free tier 25GB
- Intégration avec next/image
- Alternative rejetée: S3 direct (pas de transformation à la volée)

---
*Ajouter les nouveaux ADR ci-dessous.*
