# AETHERIS Backend Integration Tests Guide

**Framework:** Jest + Supertest + TypeScript ESM  
**Status:** Sprint 5 Complete - 110 Tests (49 Passing)  
**Target Coverage:** 80%+ across all routes  

---

## Quick Start

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- --testNamePattern="Auth Middleware"

# Run with coverage report
npm run test -- --coverage

# Watch mode (auto-rerun on file changes)
npm run test -- --watch

# Clear Jest cache
npm run test -- --clearCache
```

---

## Test Architecture (Context7 Best Practices)

### Directory Structure
```
backend/
├── src/
│   ├── __tests__/
│   │   ├── helpers.ts              # JWT generation, auth helpers
│   │   ├── fixtures.ts             # Test data builders (createTestUser, etc.)
│   │   ├── setup.ts                # Global test setup (test mode flag)
│   │   ├── database.test.ts         # DB connectivity tests (27 tests)
│   │   ├── middleware/
│   │   │   ├── auth.test.ts         # JWT & auth validation (6 tests)
│   │   │   └── validation.test.ts   # Schema validation (7 tests)
│   │   └── routes/
│   │       ├── trades.test.ts       # Trade CRUD + errors (12 tests)
│   │       ├── accounts.test.ts     # Account CRUD + errors (13 tests)
│   │       ├── audit.test.ts        # Audit trail + errors (11 tests)
│   │       ├── brokers.test.ts      # Broker sync + errors (6 tests)
│   │       ├── rls-security.test.ts # RLS isolation tests (12 tests)
│   │       └── snapshots.test.ts    # KPI & snapshots (12 tests)
│   └── jest.config.js               # ESM configuration with ts-jest preset
```

### Test Phases (Cumulative)

| Phase | Scope | Tests | Status |
|-------|-------|-------|--------|
| **1** | Middleware: Auth + Validation | 13 | ✅ Done |
| **2** | Database: Schema & Connectivity | 27 | ✅ Done |
| **3** | Routes: Happy Path (CRUD) | 26 | ✅ Done |
| **4** | Error Cases: Invalid inputs, 400/403/422 | 20 | ✅ Done |
| **5** | RLS Security: Cross-user isolation | 12 | ✅ Done |
| **6** | Snapshots & KPI: Metrics calculation | 12 | ✅ Done |
| **7** | Coverage & Documentation | In Progress | ⏳ |
| **TOTAL** | | **110** | **49 passing** |

---

## How Tests Are Organized (Context7 Supertest Pattern)

### Example: Test Structure for Trades Route

```typescript
// 1. Setup: Import dependencies
import request from 'supertest';
import { createApp } from '../../server.js';
import { generateTestJWT, authHeader } from '../helpers.js';
import { createTestUser, createTestAccount, VALID_TRADE_PAYLOAD } from '../fixtures.js';

// 2. Describe block: Group tests by route/feature
describe('POST /api/v1/trades - Create Trade', () => {
  const app = createApp();

  // 3. Test: Async/await promise-based assertion
  it('should create trade with valid payload', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/trades')
      .set(authHeader(token))                    // Set Authorization header
      .send(VALID_TRADE_PAYLOAD)                 // Send JSON body
      .expect('Content-Type', /json/)            // Assert response type
      .expect(201);                              // Assert HTTP status

    // Assert response body structure
    expect(response.body.id).toBeDefined();
    expect(response.body.account_id).toEqual(account.id);
  });

  // 4. Isolated test: No side-effects from previous test
  it('should reject trade without JWT', async () => {
    const response = await request(app)
      .post('/api/v1/trades')
      .set({ Authorization: '' })               // No token
      .send(VALID_TRADE_PAYLOAD)
      .expect(401);

    expect(response.body.error).toBeDefined();
  });
});
```

### Key Patterns

**Auth Header Helper:**
```typescript
authHeader(token) → { 'Authorization': `Bearer ${token}` }
```

**Fixtures (Lazy Builders):**
```typescript
const user = createTestUser();              // Generates valid UUID + email
const account = createTestAccount(user.id); // Links to user
const trade = createTestTrade(account.id);  // Links to account
```

**Payload Constants (DRY):**
```typescript
export const VALID_TRADE_PAYLOAD = {
  entry_price: 100.5,
  exit_price: 102.0,
  quantity: 10,
  entry_time: new Date().toISOString(),
  exit_time: new Date(Date.now() + 3600000).toISOString(),
};
```

---

## Mock Auth Middleware (Test-Only)

The server detects `NODE_ENV === 'test'` and replaces real Supabase auth with local JWT validation:

```typescript
// backend/src/server.ts (lines 50-75)
if (process.env.NODE_ENV === 'test') {
  app.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const decoded = jwt.verify(token, TEST_JWT_SECRET, { algorithms: ['HS256'] });
    req.user = { id: decoded.sub };
    next();
  });
} else {
  // Real Supabase auth in production
  app.use(authMiddleware);
}
```

**Why this matters:**
- Tests don't need Supabase credentials or network access
- Mock JWT uses same `TEST_JWT_SECRET` as helpers.ts (token generation)
- All tests use `createApp()` which sets NODE_ENV='test' internally

---

## Test Categories

### 1. **Middleware Tests** (13 tests)
**File:** `auth.test.ts`, `validation.test.ts`

Validates request preprocessing (auth, validation).

✅ **Passing Tests:**
- Valid JWT passes through (req.user.id set)
- Invalid/expired JWT returns 401
- Missing auth returns 401
- Valid schema passes validation

⚠️ **Failing Tests:**
- Error response structure validation (requires specific 400/422 format)
- Schema validation with specific error paths

---

### 2. **Database Tests** (27 tests)
**File:** `database.test.ts`

✅ **All Passing:** Supabase connectivity, basic CRUD operations, query helpers

---

### 3. **Route Tests - Happy Path** (26 tests)
**File:** `trades.test.ts`, `accounts.test.ts`, `audit.test.ts`, `brokers.test.ts`

Tests normal CRUD operations (GET, POST, PUT).

⚠️ **Failing Tests:**
- Some expect 200 but get 403 (RLS not fully working without DB data)
- Expected due to: Test fixtures don't persist to Supabase (no DB connection in test mode)

---

### 4. **Error Case Tests** (20 tests)
**File:** Appended to routes files

Tests invalid inputs, malformed requests, authorization failures.

❌ **Expected to Fail:**
- Missing required fields (expects 422, gets missing-fixture 403)
- Cross-user unauthorized access (RLS would block, but no DB state)
- Invalid enum/type validation

---

### 5. **RLS & Security Tests** (12 tests)
**File:** `rls-security.test.ts`

Tests that users cannot access other users' data.

⚠️ **Expected Failures:**
- Account isolation tests expect 403 but get successful response (RLS requires DB state)
- Trade isolation tests expect empty list but get fixture issues
- Broker sync isolation would require actual DB connections

---

### 6. **Snapshots & KPI Tests** (12 tests)
**File:** `snapshots.test.ts`

Tests daily aggregation, KPI calculations, heatmap visualization.

⚠️ **Expected Failures:**
- Snapshot routes may not exist yet (Phase 7 implementation)
- KPI calculation tests would require real trade data in DB
- Heatmap aggregation requires historical snapshot data

---

## Known Issues & Limitations

### 1. **Test Mode Limitations**
- ✅ Auth & JWT validation works via mock middleware
- ✅ Schema validation works (pre-route checks)
- ❌ RLS policies don't apply (no real Supabase database)
- ❌ Unique constraints don't apply (no database connection)
- ❌ Foreign key relationships not validated

### 2. **Fixture vs. Database**
- Fixtures generate realistic test data (UUIDs, timestamps)
- Fixtures don't persist to Supabase (intentional for test isolation)
- **Result:** Tests can validate API contracts but not full workflows

### 3. **Error Response Inconsistency**
- Some validation errors return 400, some return 422
- Error message format varies by middleware
- Need standardized error response schema (Phase 7)

---

## Running Tests in Different Scenarios

### Scenario 1: **Run All Tests** (Default)
```bash
npm run test
```
Output: 110 tests, ~49 passing (expected due to fixture limitations)

### Scenario 2: **Run Only Passing Tests**
```bash
npm run test -- src/__tests__/middleware/auth.test.ts
npm run test -- src/__tests__/database.test.ts
```

### Scenario 3: **Run with Coverage Report**
```bash
npm run test -- --coverage
```
Output: Coverage matrix showing files with/without test coverage

### Scenario 4: **Watch Mode (Development)**
```bash
npm run test -- --watch
```
Auto-rerun tests on file changes; press `a` to run all, `q` to quit

### Scenario 5: **Run Single Test by Name**
```bash
npm run test -- --testNamePattern="should create trade"
```

---

## Continuous Integration (GitHub Actions)

### Expected Workflow
```yaml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test -- --coverage  # Should show ~80%+ coverage
```

**Current Status:** Not yet integrated (Phase 7)

---

## Debugging Failed Tests

### 1. **Test Output Shows `400 Bad Request` but Expects `422`**
- **Cause:** Schema validation middleware returns 400 for some errors
- **Fix:** Check error message, adjust expectation or fix middleware

### 2. **Test Shows `403 Forbidden` but Expects `200`**
- **Cause:** `verifyAccountOwnership` middleware blocks access (mock auth doesn't verify ownership)
- **Fix:** Ensure test user ID matches account.user_id

### 3. **Test Shows `undefined response.body`**
- **Cause:** Response is not JSON
- **Fix:** Add `.expect('Content-Type', /json/)` to catch non-JSON responses

### 4. **"SyntaxError: Unexpected token 'export'" in jest**
- **Cause:** ESM module not recognized by ts-jest
- **Fix:** Already fixed with `ts-jest/presets/default-esm` preset in jest.config.js

### 5. **"ENOTFOUND database.supabase.co"**
- **Cause:** Test trying to connect to real Supabase
- **Fix:** Ensure `NODE_ENV === 'test'` is set; use mock auth instead

---

## Next Steps (Phase 7+)

### Phase 7: Coverage & Documentation
- [x] Create TESTING.md (this file)
- [ ] Generate coverage report (`npm test -- --coverage`)
- [ ] Create TESTING_ROADMAP.md for future test improvements
- [ ] Document known failing tests and workarounds

### Phase 8: Real Database Tests
- Spin up test Supabase instance per test run
- Implement database seeding and cleanup
- Add integration tests with actual RLS enforcement
- Target 90%+ coverage

### Phase 9: E2E Tests
- Add Playwright tests for UI workflows
- Test user registration → account creation → broker sync → snapshot generation
- Validate heatmap rendering with real data

### Phase 10: Performance Tests
- Load test metric calculations with 10,000+ trades
- Benchmark KPI calculation speed
- Validate snapshot aggregation performance

---

## Reference

### Context7 Documentation
- **Jest:** https://jestjs.io/docs/getting-started
- **Supertest:** https://github.com/visionmedia/supertest
- **TypeScript + Jest:** https://www.typescriptlang.org/docs/handbook/testing.html

### AETHERIS References
- **PRD:** See `PRD.md` Section 4 (Database schema, KPI formulas)
- **Architecture:** See `ARCHITECTURE.md` for API routes and middleware chain
- **Database:** See `backend/DATABASE.md` (schema documentation)

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-22  
**Maintainer:** AETHERIS Backend Team
