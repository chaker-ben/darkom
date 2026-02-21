# DARKOM — Specs Techniques AIDD Pro
> SuperApp Immobilier + Services à Domicile — Tunisie & MENA
> Stack : Next.js 15 · React Native Expo · Supabase · TypeScript Strict

---

## 0. Contexte Projet

| Clé | Valeur |
|-----|--------|
| Nom | DARKOM (دارك — "Ta maison") |
| Domaine | darkom.com (+ darkom.tn redirect) |
| Marché principal | Tunisie → MENA (Algérie, Maroc, Arabie Saoudite) |
| Langues | Français · Arabe (RTL) · Anglais |
| Plateformes | Web (Next.js) · iOS · Android (Expo) |
| Modèle revenus | Abonnement mensuel pros (49/99 DT) |
| Budget bootstrap | 0–5k DT — stack 100% free tier au départ |
| Monorepo | Turborepo |

---

## 1. Architecture Monorepo

```
darkom/
├── apps/
│   ├── web/                    # Next.js 15 — Landing + Backoffice + PWA
│   └── mobile/                 # Expo SDK 52 — iOS & Android
├── packages/
│   ├── ui/                     # Composants partagés (web + mobile)
│   ├── db/                     # Types Supabase générés + queries
│   ├── i18n/                   # Traductions fr/ar/en + config RTL
│   ├── config/                 # ESLint, TypeScript, Tailwind config
│   └── utils/                  # Helpers partagés
├── supabase/
│   ├── migrations/             # SQL migrations versionnées
│   ├── seed.sql                # Données de test
│   └── functions/              # Edge Functions Deno
├── .claude/                    # AIDD Pro config
│   ├── CLAUDE.md               # Instructions agents
│   ├── commands/               # Slash commands
│   └── agents/                 # Agents spécialisés
├── turbo.json
└── package.json
```

---

## 2. Stack Technique Détaillé

### 2.1 Frontend Web — `apps/web`

```typescript
// Versions exactes
{
  "next": "15.x",
  "react": "19.x",
  "typescript": "5.5+",
  "tailwindcss": "4.x",
  "@tanstack/react-query": "5.x",
  "zustand": "5.x",
  "next-intl": "3.x",          // i18n FR/AR/EN + RTL
  "framer-motion": "11.x",     // Animations
  "mapbox-gl": "3.x",          // Cartes interactives
  "@radix-ui/react-*": "latest", // Composants accessibles
  "react-hook-form": "7.x",
  "zod": "3.x",
  "lucide-react": "latest"
}
```

### 2.2 Mobile — `apps/mobile`

```typescript
{
  "expo": "~52.x",
  "expo-router": "~4.x",       // File-based routing
  "react-native": "0.76.x",
  "nativewind": "4.x",         // Tailwind pour React Native
  "expo-localization": "latest", // Détection langue système
  "i18next": "23.x",
  "react-native-maps": "latest",
  "expo-notifications": "latest",
  "expo-image": "latest",       // Images optimisées
  "react-native-reanimated": "3.x",
  "moti": "latest"              // Animations déclaratives
}
```

### 2.3 Backend — Supabase

```sql
-- Auth : email / téléphone tunisien / Google OAuth
-- Storage : images annonces (Cloudinary CDN preferred)
-- Realtime : notifications, messages
-- Edge Functions : vérification annonces, webhooks paiement
```

### 2.4 Services externes

| Service | Usage | Tier gratuit |
|---------|-------|-------------|
| Supabase | BDD + Auth + Storage + Realtime | 500MB DB, 1GB storage |
| Vercel | Deploy web | 100GB bandwidth |
| Cloudinary | Images optimisées + CDN | 25GB |
| Expo EAS | Build iOS/Android | Limité |
| Konnect | Paiement Tunisie (Flouci) | 0 setup fee |
| Resend | Emails transactionnels | 3000/mois |
| Mapbox | Cartes + géocodage | 50k tiles/mois |

---

## 3. Base de Données — Schéma Supabase

### 3.1 Tables principales

```sql
-- USERS
create table profiles (
  id uuid references auth.users primary key,
  role text check (role in ('user', 'pro', 'admin')) default 'user',
  full_name text,
  phone text,
  avatar_url text,
  preferred_lang text check (preferred_lang in ('fr', 'ar', 'en')) default 'fr',
  verified boolean default false,
  created_at timestamptz default now()
);

-- ANNONCES IMMOBILIÈRES
create table listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  type text check (type in ('sale', 'rent')),
  category text check (category in ('apartment', 'house', 'land', 'commercial', 'office')),
  
  -- Titres multilingues
  title_fr text not null,
  title_ar text,
  title_en text,
  description_fr text,
  description_ar text,
  description_en text,
  
  price numeric not null,
  price_currency text default 'TND',
  surface numeric,
  rooms integer,
  bathrooms integer,
  floor integer,
  
  -- Localisation
  governorate text not null,   -- Wilaya/Gouvernorat
  city text not null,
  address text,
  lat numeric,
  lng numeric,
  
  images text[] default '{}',  -- URLs Cloudinary
  video_url text,
  tour_360_url text,
  
  status text check (status in ('draft', 'pending', 'verified', 'rejected', 'sold')) default 'pending',
  featured boolean default false,
  views_count integer default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PROFESSIONNELS (artisans + agences)
create table pros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  business_name_fr text not null,
  business_name_ar text,
  category text not null,       -- 'plumber', 'electrician', 'painter', 'agency', etc.
  bio_fr text,
  bio_ar text,
  phone text not null,
  whatsapp text,
  
  -- Zone de service
  governorates text[] default '{}',
  
  -- Abonnement
  plan text check (plan in ('free', 'pro', 'premium')) default 'free',
  plan_expires_at timestamptz,
  
  rating numeric(3,2) default 0,
  reviews_count integer default 0,
  verified boolean default false,
  logo_url text,
  cover_url text,
  
  created_at timestamptz default now()
);

-- AVIS
create table reviews (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id),
  pro_id uuid references pros(id),
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique(author_id, pro_id)
);

-- FAVORIS
create table favorites (
  user_id uuid references profiles(id),
  listing_id uuid references listings(id),
  primary key (user_id, listing_id),
  created_at timestamptz default now()
);

-- MESSAGES (contact propriétaire/pro)
create table messages (
  id uuid primary key default gen_random_uuid(),
  from_id uuid references profiles(id),
  to_id uuid references profiles(id),
  listing_id uuid references listings(id),
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ABONNEMENTS
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  pro_id uuid references pros(id),
  plan text check (plan in ('pro', 'premium')),
  amount numeric,
  currency text default 'TND',
  status text check (status in ('active', 'cancelled', 'expired')),
  konnect_payment_id text,
  starts_at timestamptz default now(),
  expires_at timestamptz
);
```

### 3.2 RLS Policies (Row Level Security)

```sql
-- Listings : lecture publique, écriture propriétaire uniquement
alter table listings enable row level security;
create policy "Public read" on listings for select using (status = 'verified');
create policy "Owner write" on listings for all using (auth.uid() = user_id);
create policy "Admin all" on listings for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
```

---

## 4. Internationalisation (i18n)

### 4.1 Structure des traductions

```
packages/i18n/
├── locales/
│   ├── fr/
│   │   ├── common.json
│   │   ├── listings.json
│   │   ├── pros.json
│   │   └── auth.json
│   ├── ar/
│   │   ├── common.json      # Arabe standard + dialecte tunisien
│   │   ├── listings.json
│   │   ├── pros.json
│   │   └── auth.json
│   └── en/
│       └── *.json
├── config.ts
└── rtl.ts                   # Helpers RTL
```

### 4.2 Configuration next-intl (Web)

```typescript
// packages/i18n/config.ts
export const locales = ['fr', 'ar', 'en'] as const;
export const defaultLocale = 'fr';
export type Locale = typeof locales[number];

export const rtlLocales: Locale[] = ['ar'];
export const isRTL = (locale: Locale) => rtlLocales.includes(locale);

// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./packages/i18n/config.ts');
export default withNextIntl({ /* config */ });
```

### 4.3 RTL sur Mobile (React Native)

```typescript
// packages/i18n/rtl.ts
import { I18nManager } from 'react-native';
import { isRTL } from './config';

export const applyRTL = (locale: Locale) => {
  const shouldBeRTL = isRTL(locale);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    // Reloadez l'app après ce changement
  }
};

// NativeWind + RTL : utiliser start/end au lieu de left/right
// Exemple : ms-4 (margin-start) au lieu de ml-4 (margin-left)
```

### 4.4 Textes arabes dans la BDD

```typescript
// Helper pour récupérer le bon champ selon la langue
export function getLocalizedField<T extends Record<string, any>>(
  obj: T,
  field: string,
  locale: Locale
): string {
  return obj[`${field}_${locale}`] 
    ?? obj[`${field}_fr`]   // fallback français
    ?? obj[`${field}_ar`]   // fallback arabe
    ?? obj[`${field}_en`]   // fallback anglais
    ?? '';
}

// Usage : getLocalizedField(listing, 'title', 'ar') → listing.title_ar
```

---

## 5. Architecture Next.js (Web)

### 5.1 Structure `apps/web`

```
apps/web/
├── app/
│   ├── [locale]/              # i18n routing (fr/ar/en)
│   │   ├── layout.tsx         # RootLayout avec dir="rtl" si arabe
│   │   ├── page.tsx           # Landing page
│   │   ├── listings/
│   │   │   ├── page.tsx       # Liste annonces avec filtres
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Détail annonce
│   │   ├── pros/
│   │   │   ├── page.tsx       # Annuaire professionnels
│   │   │   └── [id]/page.tsx
│   │   ├── dashboard/         # Espace pro (protégé)
│   │   │   ├── listings/
│   │   │   ├── profile/
│   │   │   └── subscription/
│   │   └── admin/             # Backoffice (role=admin)
│   └── api/
│       ├── auth/
│       ├── listings/
│       ├── pros/
│       └── webhooks/
│           └── konnect/       # Paiements
├── components/
│   ├── listing/
│   ├── pro/
│   ├── map/
│   ├── search/
│   └── ui/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client (RSC)
│   │   └── middleware.ts      # Auth middleware
│   └── validations/           # Zod schemas
└── middleware.ts               # i18n + Auth guard
```

### 5.2 Layout RTL dynamique

```typescript
// app/[locale]/layout.tsx
import { isRTL } from '@darkom/i18n';

export default function LocaleLayout({ 
  children, 
  params: { locale } 
}: { 
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html 
      lang={locale} 
      dir={isRTL(locale as Locale) ? 'rtl' : 'ltr'}
    >
      <body className={isRTL(locale as Locale) ? 'font-arabic' : 'font-sans'}>
        {children}
      </body>
    </html>
  );
}
```

---

## 6. Architecture Expo (Mobile)

### 6.1 Structure `apps/mobile`

```
apps/mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── index.tsx          # Home / Explore
│   │   ├── listings.tsx       # Annonces
│   │   ├── pros.tsx           # Professionnels
│   │   ├── favorites.tsx      # Favoris
│   │   └── profile.tsx        # Profil
│   ├── listing/
│   │   └── [id].tsx
│   ├── pro/
│   │   └── [id].tsx
│   └── _layout.tsx            # Root layout
├── components/
├── hooks/
│   ├── useLocale.ts           # Langue + RTL
│   ├── useListings.ts
│   └── usePros.ts
└── lib/
```

### 6.2 Fonts multilingues

```typescript
// Fonts : Sora (Latin) + Noto Naskh Arabic (Arabe)
// tailwind.config.ts
theme: {
  fontFamily: {
    sans: ['Sora', 'sans-serif'],
    arabic: ['Noto Naskh Arabic', 'serif'],
  }
}
```

---

## 7. Design System & Tokens

### 7.1 Palette couleurs

```typescript
// packages/config/tokens.ts
export const colors = {
  // Brand
  primary: {
    50:  '#EEF5FF',
    100: '#D9E8FF',
    500: '#2E75B6',   // Principal
    600: '#1E5C96',
    700: '#1E3A5F',   // Foncé
    900: '#0F1F33',
  },
  // Accent chaud (Tunisie)
  accent: {
    400: '#F5A623',   // Doré
    500: '#E8920E',
    600: '#CC7A00',
  },
  // Sémantique
  success: '#16A34A',
  warning: '#D97706',
  error:   '#DC2626',
  // Neutres
  gray: { /* 50→900 */ }
};
```

### 7.2 Typographie

```css
/* Web — Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap');

/* Hiérarchie */
--font-display: 'Sora', sans-serif;      /* Titres latin */
--font-arabic: 'Noto Naskh Arabic', serif; /* Tout texte arabe */
--font-body: 'Sora', sans-serif;

/* Tailles */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

---

## 8. Composants Clés à Développer

### Phase 1 — MVP (Semaines 1–8)

| Composant | Description | Priorité |
|-----------|-------------|----------|
| `<ListingCard />` | Carte annonce avec image, prix, badges | 🔴 P0 |
| `<ListingGrid />` | Grille responsive avec infinite scroll | 🔴 P0 |
| `<SearchBar />` | Recherche avec autocomplete géo | 🔴 P0 |
| `<FilterDrawer />` | Filtres : type/prix/surface/chambre/ville | 🔴 P0 |
| `<ProCard />` | Carte artisan avec rating et badge vérifié | 🔴 P0 |
| `<MapView />` | Carte Mapbox avec clusters | 🟡 P1 |
| `<ImageGallery />` | Carousel photos full-screen | 🟡 P1 |
| `<ContactModal />` | WhatsApp / Appel / Message | 🟡 P1 |
| `<LanguageSwitcher />` | Toggle FR/AR/EN | 🟡 P1 |
| `<SubscriptionCard />` | Plans tarifaires avec CTA | 🟡 P1 |
| `<VerifiedBadge />` | Badge vérifié DARKOM | 🟢 P2 |
| `<Tour360 />` | Viewer visite virtuelle | 🟢 P2 |

---

## 9. Configuration AIDD Pro

### 9.1 `.claude/CLAUDE.md`

```markdown
# DARKOM — Instructions Claude Code

## Contexte
Application immobilier + services à domicile multilingue (FR/AR/EN).
Monorepo Turborepo avec Next.js 15 et Expo SDK 52.

## Règles absolues
- TypeScript strict: `"strict": true` — JAMAIS de `any`
- Toujours valider avec Zod côté serveur
- Toutes les queries Supabase via `packages/db`
- Composants i18n : toujours utiliser `useTranslations()` — jamais de string hardcodée
- RTL : utiliser `ms-*` / `me-*` / `ps-*` / `pe-*` jamais `ml/mr/pl/pr`
- Images : toujours `next/image` avec sizes appropriés
- Mobile : NativeWind classes uniquement — jamais de StyleSheet inline sauf animations

## Architecture décisions
- State global : Zustand (web) / Zustand (mobile)
- Data fetching : TanStack Query v5 avec Supabase
- Forms : react-hook-form + Zod
- Routing mobile : Expo Router v4 (file-based)

## Conventions nommage
- Composants : PascalCase — `ListingCard.tsx`
- Hooks : camelCase avec use prefix — `useListings.ts`
- Utils : camelCase — `formatPrice.ts`
- Types Supabase : générer via `supabase gen types typescript`
- Traductions : camelCase keys — `listing.pricePerMonth`

## Sécurité
- RLS activé sur toutes les tables Supabase
- Jamais de service_role key côté client
- Valider ownership avant update/delete
- Rate limiting sur les routes API sensibles
```

### 9.2 Slash Commands AIDD Pro

```bash
# .claude/commands/new-listing.md
Créer le composant ListingCard complet avec:
- Props typées avec interface TypeScript
- Support multilingue via getLocalizedField()
- Badge vérifié conditionnel
- Optimisation image Cloudinary
- Support RTL via ms-*/me-*
- Tests Vitest unitaires

# .claude/commands/new-page.md
Créer une page Next.js [locale]/[name] avec:
- generateMetadata multilingue
- Suspense boundaries
- Error boundary
- Loading skeleton
- Breadcrumbs i18n

# .claude/commands/new-migration.md
Créer une migration Supabase avec:
- RLS policies appropriées
- Indexes sur les colonnes filtrées
- Triggers updated_at si applicable
- Seed data de test
```

### 9.3 Agents spécialisés

```yaml
# .claude/agents/db-agent.md
Spécialiste : Supabase PostgreSQL
Responsabilités :
  - Écriture migrations SQL
  - Définition RLS policies
  - Optimisation queries (EXPLAIN ANALYZE)
  - Types TypeScript générés
Règles : Toujours activer RLS, jamais de select * en production

# .claude/agents/i18n-agent.md  
Spécialiste : Internationalisation FR/AR/EN + RTL
Responsabilités :
  - Traductions cohérentes
  - Implémentation RTL correcte
  - Fonts arabes appropriées
  - Direction-aware layouts
Règles : Jamais de string hardcodée, toujours tester les 3 langues

# .claude/agents/mobile-agent.md
Spécialiste : Expo React Native
Responsabilités :
  - Composants NativeWind
  - Navigation Expo Router
  - Notifications push
  - Performance mobile
Règles : Pas de StyleSheet inline, utiliser Reanimated pour animations
```

---

## 10. Environnement & Variables

### 10.1 `.env.local` (Web)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Server only

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Konnect (paiement Tunisie)
KONNECT_API_KEY=
KONNECT_WALLET_ID=
NEXT_PUBLIC_APP_URL=https://darkom.com

# Email
RESEND_API_KEY=
FROM_EMAIL=noreply@darkom.com
```

### 10.2 `eas.json` (Mobile)

```json
{
  "cli": { "version": ">= 10.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "EXPO_PUBLIC_ENV": "development" }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "", "ascAppId": "", "appleTeamId": "" },
      "android": { "serviceAccountKeyPath": "./google-service-account.json" }
    }
  }
}
```

---

## 11. Checklist Lancement MVP

### Semaine 1–2 : Setup
- [ ] Init monorepo Turborepo
- [ ] Config Supabase project + auth
- [ ] Config Next.js 15 + next-intl
- [ ] Config Expo + Expo Router
- [ ] Design system tokens partagés
- [ ] CI/CD GitHub Actions → Vercel

### Semaine 3–4 : Core Web
- [ ] Auth (email + téléphone)
- [ ] Listing CRUD complet
- [ ] Recherche avec filtres
- [ ] Page détail annonce
- [ ] Profil utilisateur

### Semaine 5–6 : Core Mobile
- [ ] App Expo avec mêmes features
- [ ] Notifications push
- [ ] Géolocalisation
- [ ] Upload photos

### Semaine 7–8 : Pros + Paiement
- [ ] Profils pros + avis
- [ ] Abonnements Konnect
- [ ] Dashboard pro
- [ ] Admin backoffice

### Pre-launch
- [ ] Landing page + liste d'attente
- [ ] SEO multilingue (sitemap FR/AR/EN)
- [ ] App Store Connect + Google Play Console
- [ ] RGPD / Mentions légales
- [ ] Performance audit (Lighthouse > 90)

---

## 12. Commandes de Démarrage

```bash
# Init monorepo
npx create-turbo@latest darkom
cd darkom

# Ajouter Expo app
npx create-expo-app apps/mobile --template blank-typescript

# Installer dépendances communes
pnpm add -w typescript @types/node

# Supabase local dev
supabase init
supabase start

# Dev
pnpm dev         # Web sur localhost:3000
pnpm dev:mobile  # Expo sur port 8081

# Types Supabase (après migrations)
supabase gen types typescript --local > packages/db/types.ts

# Build
pnpm build
pnpm build:mobile  # EAS Build
```

---

*DARKOM — Specs v1.0 — Codly/GS Code — Février 2026*
