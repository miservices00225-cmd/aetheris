## Contexte

Sprint 4 a livré 4 modules de routes API (trades, accounts, audit, brokers) avec middleware complet (auth, validation, error handler). L'architecture utilise:
- **Express.js** avec asyncHandler pattern (Context7)
- **Supabase** pour la base de données + RLS au niveau SQL
- **Zod** pour la validation des schémas
- **JWT** pour l'authentification

**Problème:** Zéro tests d'intégration. Les bugs RLS (isolation cross-user), les erreurs de validation, les brèches de sécurité ne sont détectés qu'en production.

**Contraintes:**
- Backend doit fonctionner avec Supabase credentials (.env.local)
- Tests doivent être rapides (<1s par test)
- Les tests ne doivent pas polluer la base de données de développement
- Doit maintenir 100% des 27 tests database existants

## Objectifs / Non-Objectifs

**Objectifs:**
- ✅ Implémenter 40-50 tests d'intégration avec Supertest + Jest
- ✅ Couvrir tous les middlewares (auth, validation) + toutes les routes
- ✅ Tester les cas d'erreur (400/403/422/500) explicitement
- ✅ Vérifier l'isolation RLS (user A ≠ user B)
- ✅ Atteindre 80%+ code coverage sur tous les routes
- ✅ Documenter les patterns de test dans TESTING.md
- ✅ Aucune régression: 27 database tests doivent encore passer

**Non-Objectifs:**
- ❌ Performance testing (load testing, benchmarks)
- ❌ Tests de brokers externes (MT4, FIX API) — mock uniquement
- ❌ Tests frontend / UI
- ❌ Tests de Phase 2+ (vocal stress, whale flows, etc.)
- ❌ E2E browser testing

## Décisions Architecturales

| Décision | Rationale | Alternative |
|----------|-----------|-------------|
| **Supertest sur app instance** | Tests rapides, pas de listen serveur, parallélisables | Express app.listen() — plus lent |
| **JWT mock secret** | Tests isolés, pas de dépendance à Supabase auth | Supabase JWT réel — plus lent, credentials exposées |
| **`__tests__/` directory** | Convention Jest standard, auto-découverte | `.test.ts` inline — moins organisé |
| **`beforeEach()` + cleanup** | Chaque test isolé, pas de side-effects | Global setup/teardown — état partagé risqué |
| **Fixtures séparées** | Builders réutilisables, code DRY | Data inline dans chaque test — répétitif |
| **80%+ coverage target** | Standard production, détecte ~90% bugs | 100% coverage — diminishing returns; >95%+ inachevable |
| **Tests erreur séparés** | Clarté d'intention, cas d'erreur explicitement vérifiés | Mélangés avec happy path — moins lisible |
| **RLS tests dédiés** | Sécurité critique isolée | Tests RLS mélangés avec routes — moins visible |

## Risques / Échanges

| Risque | Sévérité | Mitigation |
|--------|----------|-----------|
| Credentials Supabase dans test | MOYEN | `.env.local` + `.gitignore`; jamais commiter |
| Tests interfèrent entre eux | MOYEN | `afterEach()` DELETE; fixtures fraîches chaque test |
| Base de donnée polluée | MOYEN | Migration 009 (RLS disabled) avant tests; ou DB test séparée |
| JWT expiration pendant tests | BAS | 1h expiration; tests <1s chacun |
| Exécution parallèle conflits | MOYEN | `--runInBand` initialement; paralléliser après stabilité |
| Couverture < 80% | BAS | Coverage report; ajouter tests manquants |

## Plan de Migration

**Phase 1: Setup (2-3h)**
1. `npm install supertest @types/supertest --save-dev`
2. Créer `backend/src/__tests__/helpers.ts` (JWT + builders)
3. Créer `backend/src/__tests__/fixtures.ts` (mock data)

**Phase 2: Middleware (3-4h)**
1. Créer `backend/src/__tests__/middleware/auth.test.ts` (4-6 tests)
2. Créer `backend/src/__tests__/middleware/validation.test.ts` (4-6 tests)

**Phase 3-5: Routes (10-13h)**
1. Créer tests routes happypath (trades, accounts, brokers, audit)
2. Créer tests erreur cases
3. Créer tests RLS isolation
4. Créer tests snapshots

**Phase 6: Finalisation (2h)**
1. `npm run test -- --coverage`
2. Ajouter tests manquants (si <80%)
3. Créer `backend/TESTING.md`

**Rollback:** Tests seulement — zéro changement code production. Rollback = supprimer `backend/src/__tests__/` si nécessaire (mais gardez-le!).

## Questions Ouvertes

1. **Base de données test:** Utiliser migration 009 (RLS disabled) ou DB test séparée?
   - **Recommandation:** Migration 009 (compatible avec Sprint 1 existant)

2. **JWT secret de test:** `jsonwebtoken.sign()` mock ou Supabase JWT réel?
   - **Recommandation:** Mock secret (10x plus rapide, pas d'exposition credentials)

3. **Exécution parallèle:** `jest --maxWorkers=4` ou `--runInBand`?
   - **Recommandation:** `--runInBand` initialement (sériel, pas de conflits DB); paralléliser après stabilité

4. **Threshold couverture:** 80% ou 85%+?
   - **Recommandation:** 80% (target pragmatique, production-grade)
