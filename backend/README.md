# AETHERIS Backend

## Context
Node.js 22 LTS + Express 4.21 API server with Supabase PostgreSQL database.

## Quick Start
```bash
cd backend
npm install
npm run dev  # Runs on http://localhost:3001
```

## Project Structure
- `src/config/` — Supabase client initialization (admin + anon)
- `src/database/` — Database query helpers (CRUD, audit, snapshots)
- `src/routes/` — API endpoints (WIP Sprint 4)
- `src/middleware/` — Custom Express middleware
- `src/utils/` — Helper functions
- `migrations/` — SQL migrations (004 core schema + 005-010 security/RLS)

## Scripts
- `npm run dev` — Start development server (tsx watch)
- `npm run build` — Compile TypeScript
- `npm run test` — Run Jest test suite (27/27 passing ✅)
- `npm run lint` — ESLint check
- `npm run lint:fix` — Auto-fix linting issues
- `npm run format` — Prettier formatting

## Environment Variables
Required in `backend/.env.local`:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase public API key (anon)
- `SERVICE_KEY` — Supabase service role key (for backend operations)
- `DATABASE_URL` — PostgreSQL connection string
- `NODE_ENV` — `development` or `production`
- `PORT` — Server port (default: 3001)

## Database Layer (Sprint 3 - ✅ 100% Complete)

### Core Tables (15 total)
- **Auth:** users, accounts, broker_connections, prop_firm_templates
- **Trading:** trades (with deduplication), sync_logs
- **Analytics:** daily_snapshots, kpi_snapshots
- **Psychology:** emotion_logs, vocal_notes, armor_breaches, webhook_events
- **Institutional:** whale_events, oracle_scores, audit_trail, sessions

### CRUD Helpers
- `database/trades.ts` — insertTrade, detectDuplicate, selectTrades, updateTrade
- `database/accounts.ts` — createAccount, selectAccounts, updateRiskLimits
- `database/audit.ts` — queryAuditTrail, queryUserAuditTrail, exportAuditCSV
- `database/dailySnapshots.ts` — createDailySnapshot, selectSnapshots
- `database/errors.ts` — DatabaseError with constraint detection

### Test Coverage
```
✅ 27/27 tests passing (100%)
  - Section 1: Supabase client initialization
  - Section 2-5: Trade/Account/Audit/Snapshot CRUD
  - Section 6: RLS isolation (multi-user security)
  - Section 7: Deduplication (UNIQUE constraint)
  - Section 8: Error handling (FK, NOT NULL, UUIDs)
  - Section 9: Quality & type safety
```

Run tests: `npm test`

### Migrations
| File | Purpose | Status |
|------|---------|--------|
| `001_init_schema.sql` | 15 tables + audit function | ✅ Deployed |
| `002_rls_policies.sql` | Row-level security policies | ✅ Deployed |
| `003_audit_triggers.sql` | Change audit logging | ✅ Deployed |
| `004_indices.sql` | Performance indices (24 total) | ✅ Deployed |
| `005_fix_rls_public_tables.sql` | Public table security | ✅ Deployed |
| `006_create_missing_audit_trail.sql` | Audit trail schema | ✅ Deployed |
| `007_create_audit_triggers.sql` | Additional triggers | ✅ Deployed |
| `008_fix_audit_function.sql` | Audit function refinement | ✅ Deployed |
| `009_test_disable_rls.sql` | RLS disabled for testing | ✅ Deployed (test only) |
| `010_re_enable_rls_production.sql` | Re-enable RLS for prod | ⏳ Deploy before prod |

## API Endpoints (Sprint 4 - Next)
- `GET /health` — Server health check
- `POST /api/v1/trades` — Create trade (WIP)
- `GET /api/v1/trades` — List trades (WIP)
- `PUT /api/v1/trades/:id` — Update trade (WIP)

## Testing
```bash
npm run test          # Run all tests
npm run test:watch   # Watch mode
npm run test -- --testNamePattern="Trade CRUD"  # Run specific suite
```

### Test Environment Notes
- RLS disabled via migration 009 (publishable key limitation in tests)
- Service role key (`SERVICE_KEY`) bypasses RLS in production
- Test cleanup: afterAll() removes all test data automatically

## Tech Stack
- **Runtime:** Node.js 22 LTS
- **Framework:** Express 4.21
- **Language:** TypeScript 5.7
- **Database:** Supabase PostgreSQL + Row-Level Security
- **Database Client:** @supabase/supabase-js 2.50
- **Testing:** Jest 29.7
- **Linting:** ESLint 9 + Prettier 3.3

## Sprint Status
- ✅ **Sprint 1:** Schema + migrations deployed
- ✅ **Sprint 2:** RLS/audit/dedup verified
- ✅ **Sprint 3:** Database layer + tests (27/27 passing)
- ⏳ **Sprint 4:** API routes (Express endpoints)
- ⏳ **Sprint 5+:** Frontend integration

