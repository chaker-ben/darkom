# Errors Log

> Erreurs connues et solutions. Vérifier ici AVANT de débugger.

## ERR-001: Next.js Hydration Mismatch
**Cause**: Différence server/client (Date, Math.random, window, localStorage)
**Fix**: `useState(false)` + `useEffect(() => setMounted(true), [])`, skeleton until mounted
**Prévention**: Jamais d'API browser dans le rendu initial. `dynamic(import, { ssr: false })`

## ERR-002: Prisma Client Not Generated
**Cause**: Code exécuté avant `prisma generate`
**Fix**: `pnpm db:generate`
**Prévention**: Ajouter `prisma generate` au script `postinstall`

## ERR-003: CORS sur appels API externes
**Cause**: Appel direct depuis le client
**Fix**: Passer par une API route Next.js
**Prévention**: Tous les appels externes via `app/api/`

## ERR-004: [MOBILE] RTL cassé avec scaleX(-1)
**Cause**: Utiliser `transform: scaleX(-1)` au niveau racine pour forcer le RTL
**Fix**: Remplacer par `I18nManager.forceRTL(true)` + restart de l'app
**Prévention**: JAMAIS de `scaleX(-1)` pour le RTL. Utiliser le RTL natif de React Native. Voir skill mobile-standards.

## ERR-005: [MOBILE] Double navigateur tabs en RTL
**Cause**: `router.replace('/(tabs)/...')` depuis un modal crée un 2ème navigateur de tabs dans un layer natif séparé
**Fix**: Utiliser `navigateToTab()` qui fait `dismissAll()` + `navigate()`
**Prévention**: Créer le helper `navigateToTab()` dès le jour 1. Documenter les règles de navigation.

## ERR-006: [MOBILE] Nombres/dates inversés en RTL
**Cause**: Les nombres apparaissent mirrorés avec l'approche `scaleX(-1)`
**Fix**: Utiliser `Intl.NumberFormat` et `Intl.DateTimeFormat` systématiquement
**Prévention**: TOUJOURS formater via `Intl` API. Téléphones en `writingDirection: 'ltr'`.

---
*Ajouter les nouvelles erreurs ci-dessous avec cause + fix + prévention.*
