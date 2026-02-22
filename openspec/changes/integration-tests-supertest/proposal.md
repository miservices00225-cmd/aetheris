## Pourquoi

Sprint 4 a livré toutes les routes API (Express.js + Supabase). Or, sans tests d'intégration, nous n'avons aucune vérification que:
- Les routes répondent correctement (200/201/400/403/500)
- Les middlewares (auth, validation) fonctionnent isolément ET ensemble
- L'isolation RLS (Row Level Security) fonctionne réellement (user A ne voit pas les données de user B)
- Les erreurs sont mappées correctement vers les codes HTTP

**Problème:** Le code existe mais n'est pas vérifié. Les bugs RLS ou les brèches de sécurité ne seraient découverts qu'en production.

**Opportunité:** Écrire 40-50 tests d'intégration avec Supertest + Jest (Context7 best practices) = fiabilité de niveau production, couverture 80%+, et prévention d'anomalies avant déploiement.

## Modifications

- **Nouveau:** Suite de tests d'intégration complète (40-50 tests)
  - Middleware tests (auth + validation)
  - Route tests (happy path + error cases)
  - Security tests (RLS isolation cross-user)
  - Snapshot tests (KPI calculation, heatmap data)
  
- **Modifié:** `package.json` — ajouter `supertest` + `@types/supertest` en dev dependencies

- **Nouveau:** `backend/TESTING.md` — documentation des conventions de test, helpers, patterns

## Capacités

### Nouvelles Capacités
- `integration-test-middleware`: Tests des middlewares auth et validation (JWT parsing, error format)
- `integration-test-routes`: Tests complets des routes API (POST/GET/PATCH avec assertions)
- `integration-test-rls-security`: Tests d'isolation multi-utilisateur (vérifier que RLS fonctionne)
- `integration-test-snapshots`: Tests des snapshots et KPI calculation (heatmap, daily aggregation)

### Capacités Modifiées
- `backend-api-routes`: Aucun changement à la spécification (les routes existantes restent identiques); tests seulement

## Impact

- **Code:** Tests ajoutés dans `backend/src/__tests__/` (architecture Jest standard)
- **Dependencies:** Supertest + @types/supertest (dev dependencies seulement)
- **CI/CD:** `npm run test` exécutera 27 database tests + 40-50 integration tests = 67+ tests
- **Couverture:** Cible 80%+ sur toutes les routes
- **Pas de breaking changes:** Les routes API restent 100% compatibles
