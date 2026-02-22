## Context

**Current State:** Sprint 1 & 2 completed database schema (15 tables), RLS policies, audit triggers, and indices on Supabase. Database layer is fully operational but backend application layer is missing - no Node.js client, no CRUD helpers, no type safety.

**Stakeholders:** 
- Backend developers (will use CRUD helpers in API routes)
- QA/Testing (will run Jest tests)
- Compliance team (will access audit trail via helpers)

**Constraints:**
- Must use @supabase/supabase-js client library (official SDK)
- Must enforce RLS at client layer (automatic via JWT)
- Must not break existing migrations or data
- Credentials must load from .env.local (development) and environment vars (production)

---

## Goals / Non-Goals

**Goals:**
- ✅ Initialize Supabase client with admin (service role) + anon (public) key support
- ✅ Provide strongly-typed CRUD helpers (trades, accounts, audit, snapshots) with explicit return types
- ✅ Implement deduplication detection and conflict resolution (IGNORE/OVERWRITE)
- ✅ Write 20+ Jest tests covering CRUD, RLS, dedup, error handling
- ✅ All functions typed in TypeScript strict mode (no `any`)
- ✅ All functions have explicit error handling with custom error class
- ✅ All tests passing with `npm run test` (exit code 0)

**Non-Goals:**
- ❌ Do NOT implement API routes (POST /trades, etc) - that's Sprint 4
- ❌ Do NOT implement KPI calculation logic (Expectancy, Sharpe, etc) - future phase
- ❌ Do NOT implement voice analysis or Aether Armor logic - Phase 2+
- ❌ Do NOT modify database schema (use as-is from Sprint 1)

---

## Decisions

### Decision 1: Service Role + Anon Client Pattern

**Choice:** Export both admin client (service role) and anon client (JWT-based).

**Rationale:**
- **Admin client** needed for backend-only operations (migrations, audit queries, credential management)
- **Anon client** needed for frontend/mobile clients and to test RLS enforcement
- Separating them prevents accidental privilege escalation (using admin when anon would suffice)

**Alternatives Considered:**
- Single admin client for all operations → Risk: frontend could access privileged functions
- Single anon client only → Blocker: cannot run admin operations without service role

---

### Decision 2: Typed Helpers with Promise<T> Return Types

**Choice:** All database helpers return typed Promises (e.g., `Promise<Trade>`, `Promise<Trade[]>`, `Promise<void>`).

**Rationale:**
- TypeScript strict mode enforces type safety
- Makes API contracts explicit
- Enables IDE autocomplete for downstream API routes
- Easier error handling with typed error classes

**Example:**
```typescript
async function insertTrade(accountId: string, trade: TradeInput): Promise<Trade> {
  // implementation
}

async function selectTrades(accountId: string): Promise<Trade[]> {
  // implementation
}
```

**Alternatives Considered:**
- Using `any` for flexibility → Risk: loses type safety, bugs at runtime
- Generic `<T>` types only → Risk: caller confusion about what T is for each function

---

### Decision 3: Deduplication via UNIQUE Constraint + Application Logic

**Choice:** Enforce UNIQUE(broker_id, broker_trade_id, account_id) at DB layer; application layer provides detectDuplicate() and conflictResolve() helpers.

**Rationale:**
- Database constraint prevents data corruption even if application logic fails
- Application helpers allow graceful handling (log duplicate, attempt recovery)
- IGNORE/OVERWRITE strategies configurable per sync operation

**Alternatives Considered:**
- Application-only dedup (no DB constraint) → Risk: race conditions, duplicates can slip through
- Trigger-based auto-overwrite → Risk: loses old value history, cannot implement IGNORE strategy

---

### Decision 4: Single Custom Error Class

**Choice:** Create `DatabaseError` class extending Error for all DB operation failures.

**Rationale:**
- Consistent error handling across all helpers
- Can include error context (operation, table, record_id)
- Tests can assert on specific error types
- Upstream API routes can translate to HTTP status codes

**Structure:**
```typescript
class DatabaseError extends Error {
  constructor(
    message: string,
    readonly operation: string,
    readonly table: string,
    readonly recordId?: string
  ) {
    super(message);
  }
}
```

---

### Decision 5: Separate Helper Modules by Domain

**Choice:** Create separate modules: trades.ts, accounts.ts, audit.ts, dailySnapshots.ts.

**Rationale:**
- Each module has clear responsibility (separation of concerns)
- Easier to test (can import single module)
- Easier to maintain (changes to trades don't affect accounts)
- Scalable as more domains added (brokerConnections.ts, emotionLogs.ts, etc)

**Alternatives Considered:**
- Single monolithic database.ts file → Risk: 500+ line file is hard to navigate
- Function namespaces (db.trades.insert()) → Risk: nesting adds complexity

---

### Decision 6: Jest Test Structure with Setup/Teardown

**Choice:** Single test file (database.test.ts) with beforeAll(setup), beforeEach(cleanup), afterAll(cleanup).

**Rationale:**
- Setup creates test users/accounts once (efficient)
- Cleanup after each test prevents cross-test pollution
- Final cleanup ensures database is clean for next test run
- Keeps all tests in one place (easy to run with `npm test -- database`)

**Test Categories:**
- Connection tests (2)
- Trade CRUD tests (6)
- Account CRUD tests (4)
- Audit tests (3)
- RLS tests (3)
- Error handling tests (2)
- Total: 20+ tests

---

## Risks / Trade-offs

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **RLS misconfiguration in tests** | MEDIUM | Tests use service role (bypasses RLS) for setup; use anon client for RLS-specific tests |
| **Test data contamination** | MEDIUM | Cleanup after each test; use unique IDs per test run; audit trail for debugging |
| **Rate limiting on Supabase free tier** | LOW | Tests mock heavy loads; production has rate limits, so tests must account for this |
| **Credentials leak in .env.local** | MEDIUM | .env.local in .gitignore; rotate keys if leaked; use SERVICE_KEY only in backend |
| **Performance degradation with audit logging** | LOW | Audit triggers have <5% overhead; monitor if trade insert rate >10K/day |

---

## Migration Plan

### Deployment Steps:
1. Commit Supabase client + CRUD helpers to backend/src/
2. Commit Jest tests to backend/src/__tests__/
3. Run `npm install` to ensure @supabase/supabase-js is installed
4. Run `npm run test` to verify all tests pass
5. Deploy backend with new modules (no API routes yet, so no breaking changes)
6. Verify Supabase connectivity via health check endpoint

### Rollback Strategy:
- If issues occur, revert to previous commit before client initialization
- No database migrations needed (schema already exists from Sprint 1)
- No data loss risk (only adding application code, not touching schema)

---

## Open Questions

1. **KPI Pre-computation:** Should daily snapshot KPI calculation happen at UTC midnight (cron), on-demand (query), or async (queue)? **→ Phase 4 decision**
2. **Which 10 main KPIs for daily_snapshots?** Full spec says 200+ KPIs possible, but snapshot table only has 10 columns. Which ones are priority? **→ Stakeholder input needed**
3. **Test database isolation:** Should tests use separate Supabase project or same project with cleanup? **→ Assume same project with cleanup for MVP**
4. **Error retry logic:** If Supabase times out, should helpers retry automatically or fail fast? **→ Fail fast for now; implement circuit breaker in Phase 4**

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│           backend/src/config/supabase.ts            │
│  (Admin Client + Anon Client initialization)        │
└──┬────────────────────────────────────────────┬─────┘
   │                                             │
   ├─ SERVICE_KEY (admin)                       ├─ ANON_KEY (user)
   │                                             │
   v                                             v
┌─────────────────────┐                 ┌─────────────────┐
│ Admin Operations    │                 │ User Operations │
│ (Migrations, Audit) │                 │ (RLS enforced)  │
└─────────────────────┘                 └─────────────────┘
         │                                       │
         v                                       v
┌──────────────────────────────────────────────────────────────┐
│           backend/src/database/*.ts (Helpers)               │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────┐ ┌──────────┐  │
│  │  trades.ts  │ │  accounts.ts │ │ audit.ts│ │snapshot.ts  │  │
│  └─────────────┘ └──────────────┘ └─────────┘ └──────────┘  │
└──────────────────────────────────────────────────────────────┘
         │                 ╱                 ╱
         └────────────────────────────────┘
                      │
                      v
         ┌──────────────────────┐
         │ backend/src/__tests__│
         │  /database.test.ts   │
         │ (20+ Jest tests)     │
         └──────────────────────┘
```

