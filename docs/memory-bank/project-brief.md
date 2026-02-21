# Project Brief — DARKOM

## Description
DARKOM (دارك — "Ta maison") est une SuperApp combinant immobilier et services à domicile pour le marché tunisien et MENA. Elle permet de chercher des biens immobiliers vérifiés (vente/location) et de contacter des artisans certifiés (plombiers, électriciens, peintres, etc.).

## Marché
- **Principal** : Tunisie (24 gouvernorats)
- **Expansion** : Algérie, Maroc, Arabie Saoudite
- **Modèle** : Abonnement mensuel pros (Starter gratuit / Pro 49 DT / Premium 99 DT)

## Stack
- **Frontend Web** : Next.js 15 (App Router), React 19, TypeScript 5.7 strict, Tailwind CSS 4
- **Frontend Mobile** : React Native, Expo SDK 52, NativeWind 4 (à venir)
- **Backend** : PostgreSQL + Prisma ORM, Next.js API Routes
- **Auth** : Clerk (email + téléphone + Google OAuth)
- **State** : Zustand + TanStack Query v5
- **i18n** : next-intl (web) / i18next (mobile) — FR, AR (RTL), EN
- **Paiement** : Konnect (Flouci)
- **Images** : Cloudinary CDN
- **Cartes** : Mapbox GL
- **Email** : Resend
- **Monorepo** : pnpm workspaces + Turborepo

## Design System
- **Couleurs** : Primary `#1B4F8A` / Accent `#F5A623` / Success `#16A34A`
- **Typo** : Sora (latin) + Noto Naskh Arabic (arabe)
- **Style** : Moderne professionnel, cards arrondies 16px, ombres douces
- **Dark mode** : Prévu (CSS variables)

## Langues
- Français (défaut)
- Arabe — RTL avec CSS logical properties
- Anglais

## Links
- **Domaine** : darkom.com (+ darkom.tn redirect)
- **Repo** : GitHub (privé)
- **Staging** : Vercel (à configurer)
- **Specs** : docs/specs/DARKOM-SPECS.md
- **Design** : docs/specs/DARKOM-Design.html
