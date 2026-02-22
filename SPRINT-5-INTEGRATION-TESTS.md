# Sprint 5 - Integration Tests with Supertest

**Goal:** Full HTTP-layer integration testing for all API routes  
**Framework:** Jest + Supertest  
**Scope:** Happy path + error cases + RLS enforcement + validation  
**Estimated Time:** 12-15 hours  

---

## 📋 Setup & Fixtures

### 1. Install Supertest
```bash
npm install --save-dev supertest
npm install --save-dev @types/supertest
```

### 2. Create Test Fixtures
**File:** `backend/src/__tests__/fixtures.ts`
- Auth token generation (mock JWT)
- Test user creation
- Test account setup
- Cleanup helpers

### 3. Test Database Isolation
- Use same Supabase test database (migration 009 has RLS disabled)
- Cleanup after each test: DELETE trades, accounts, users
- Parallel tests avoid conflicts

---

## 🧪 Test Suites to Create

### Section 1: Auth Middleware Tests (4-6 tests)
**File:** `backend/src/routes/__tests__/auth.test.ts`

- [ ] 1.1 Reject 401 when Authorization header missing
- [ ] 1.2 Reject 401 when token is malformed
- [ ] 1.3 Accept valid JWT token + inject user context
- [ ] 1.4 Verify req.user populated with id, email, user_metadata
- [ ] 1.5 Test token expiration (simulate expired JWT)

### Section 2: Validation Middleware Tests (5-7 tests)
**File:** `backend/src/routes/__tests__/validation.test.ts`

- [ ] 2.1 POST /trades with missing required field → 422
- [ ] 2.2 POST /trades with invalid data type → 422
- [ ] 2.3 POST /trades response includes error.details with field paths
- [ ] 2.4 POST /accounts with invalid account_type → 422
- [ ] 2.5 Query params validation: invalid date format → 400
- [ ] 2.6 Validation errors match Zod error.issues structure

### Section 3: Trade Routes Happy Path (6-8 tests)
**File:** `backend/src/routes/__tests__/trades.test.ts`

- [ ] 3.1 POST /trades: create trade → 201 + trade object with id
- [ ] 3.2 GET /trades: list trades for user's account → 200 + array
- [ ] 3.3 GET /trades with pagination (limit=10) → returns 10 trades max
- [ ] 3.4 GET /trades with date filtering (start_date, end_date) → filtered results
- [ ] 3.5 PUT /trades/:id: update exit_price → 200 + updated trade
- [ ] 3.6 DELETE /trades/:id: delete trade → 204 No Content
- [ ] 3.7 GET /trades returns only user's trades (not other users')

### Section 4: Trade Routes Error Cases (6-8 tests)
**File:** `backend/src/routes/__tests__/trades-errors.test.ts`

- [ ] 4.1 POST /trades with duplicate broker_trade_id → 409 Conflict
- [ ] 4.2 POST /trades without auth → 401 Unauthorized
- [ ] 4.3 PUT /trades/:id for account user doesn't own → 403 Forbidden
- [ ] 4.4 DELETE /trades/:id that doesn't exist → 404 Not Found
- [ ] 4.5 POST /trades with invalid account_id (FK violation) → 400
- [ ] 4.6 POST /trades with null entry_price (NOT NULL violation) → 422
- [ ] 4.7 Error responses include error code (e.g., "23505" for duplicate)

### Section 5: Account Routes Happy Path (4-6 tests)
**File:** `backend/src/routes/__tests__/accounts.test.ts`

- [ ] 5.1 POST /accounts: create account → 201 + account object
- [ ] 5.2 GET /accounts: list user's accounts → 200 + array
- [ ] 5.3 GET /accounts returns only user's accounts (RLS enforcement)
- [ ] 5.4 PUT /accounts/:id: update risk_limit_percent → 200

### Section 6: Account Routes Error Cases (4-6 tests)
**File:** `backend/src/routes/__tests__/accounts-errors.test.ts`

- [ ] 6.1 POST /accounts without auth → 401 Unauthorized
- [ ] 6.2 PUT /accounts/:id for account user doesn't own → 403 Forbidden
- [ ] 6.3 POST /accounts without required account_name → 422
- [ ] 6.4 GET /accounts returns empty array for user with no accounts

### Section 7: RLS Isolation Tests (4-6 tests)
**File:** `backend/src/routes/__tests__/rls-isolation.test.ts`

- [ ] 7.1 User A cannot GET User B's trades via /api/v1/trades?account_id=B
- [ ] 7.2 User A cannot PUT User B's trade (403 Forbidden)
- [ ] 7.3 User A cannot access User B's accounts
- [ ] 7.4 User A cannot POST trade to User B's account (403)
- [ ] 7.5 Cross-account query filters by authenticated user ID

### Section 8: Snapshot & Audit Routes (3-5 tests)
**File:** `backend/src/routes/__tests__/snapshots.test.ts`

- [ ] 8.1 GET /snapshots: list daily snapshots → 200 + array
- [ ] 8.2 GET /snapshots with date range filtering → filtered results
- [ ] 8.3 GET /audit/export: export audit trail as CSV → 200 + CSV file
- [ ] 8.4 GET /audit/export respects user isolation (only own audit)

### Section 9: Broker Routes Placeholder (1-2 tests)
**File:** `backend/src/routes/__tests__/brokers.test.ts`

- [ ] 9.1 POST /brokers/:accountId: returns 501 (not implemented) for now
- [ ] 9.2 Verify endpoint protected with auth (401 without token)

---

## 📐 Test Structure Pattern (Supertest + Jest)

```typescript
import request from 'supertest';
import app from '../../server';
import { adminClient } from '../../config/supabase';

describe('POST /api/v1/trades', () => {
  let authToken: string;
  let userId: string;
  let accountId: string;

  beforeAll(async () => {
    // Create test user + account
    userId = 'test-user-uuid';
    accountId = 'test-account-uuid';
    authToken = generateMockJWT(userId); // helper function
    
    // Setup test data
    await adminClient.from('users').insert([{ id: userId, email: 'test@example.com' }]);
    await adminClient.from('accounts').insert([{
      id: accountId,
      user_id: userId,
      account_name: 'Test Account',
      account_type: 'personal'
    }]);
  });

  afterAll(async () => {
    // Cleanup
    await adminClient.from('trades').delete().eq('account_id', accountId);
    await adminClient.from('accounts').delete().eq('id', accountId);
    await adminClient.from('users').delete().eq('id', userId);
  });

  test('1.1: Create trade with valid data → 201', async () => {
    const response = await request(app)
      .post('/api/v1/trades')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        account_id: accountId,
        broker_id: 'mt4',
        symbol: 'EURUSD',
        trade_type: 'long',
        entry_price: 1.0950,
        quantity: 1.0,
        entry_time: new Date().toISOString(),
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.pnl).toBeNull(); // not closed yet
  });

  test('1.2: Create duplicate trade → 409', async () => {
    const tradeData = {
      account_id: accountId,
      broker_id: 'mt4',
      broker_trade_id: 'unique-12345',
      symbol: 'GBPUSD',
      entry_price: 1.2500,
      quantity: 1.0,
      entry_time: new Date().toISOString(),
    };

    // First insert succeeds
    await request(app)
      .post('/api/v1/trades')
      .set('Authorization', `Bearer ${authToken}`)
      .send(tradeData)
      .expect(201);

    // Duplicate insert fails with 409
    const response = await request(app)
      .post('/api/v1/trades')
      .set('Authorization', `Bearer ${authToken}`)
      .send(tradeData);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('23505'); // UNIQUE constraint code
  });

  test('1.3: Missing required field → 422', async () => {
    const response = await request(app)
      .post('/api/v1/trades')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        account_id: accountId,
        // Missing: broker_id, symbol, entry_price, etc.
      });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.details).toBeDefined();
    expect(response.body.details[0].path).toContain('entry_price'); // shows missing field
  });

  test('1.4: No auth token → 401', async () => {
    const response = await request(app)
      .post('/api/v1/trades')
      // No Authorization header
      .send({
        account_id: accountId,
        broker_id: 'mt4',
        symbol: 'EURUSD',
        entry_price: 1.0950,
        quantity: 1.0,
        entry_time: new Date().toISOString(),
      });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });
});
```

---

## 🛠️ Helper Functions to Create

**File:** `backend/src/__tests__/helpers.ts`

```typescript
// Generate mock JWT token (with expiry 1 hour from now)
export function generateMockJWT(userId: string): string { ... }

// Create test user + account combo
export async function createTestUser(email?: string): Promise<{
  userId: string;
  accountId: string;
  authToken: string;
}> { ... }

// Cleanup helper
export async function cleanupTestData(userId: string): Promise<void> { ... }

// Assert response envelope format
export function expectApiResponse(response: any, success: boolean) { ... }
```

---

## ✅ Success Criteria

- [ ] All 40+ tests passing
- [ ] Coverage > 80% for route handlers
- [ ] RLS enforcement verified (403 Forbidden)
- [ ] Validation errors include field-level details
- [ ] Error codes match HTTP standards
- [ ] No unhandled promise rejections
- [ ] `npm test` runs in < 60 seconds
- [ ] Can run individual test file: `npm test -- trades.test.ts`

---

## 📦 Files to Create

1. `backend/src/__tests__/fixtures.ts` - Test data builders
2. `backend/src/__tests__/helpers.ts` - JWT generation, cleanup
3. `backend/src/routes/__tests__/auth.test.ts` - Auth middleware tests
4. `backend/src/routes/__tests__/validation.test.ts` - Validation middleware
5. `backend/src/routes/__tests__/trades.test.ts` - Happy path
6. `backend/src/routes/__tests__/trades-errors.test.ts` - Error cases
7. `backend/src/routes/__tests__/accounts.test.ts` - Account CRUD
8. `backend/src/routes/__tests__/accounts-errors.test.ts` - Account errors
9. `backend/src/routes/__tests__/rls-isolation.test.ts` - RLS enforcement
10. `backend/src/routes/__tests__/snapshots.test.ts` - Snapshots + audit

---

## 🚀 Implementation Strategy

### Phase 1: Setup (1-2 hours)
- Install Supertest + @types/supertest
- Create helpers.ts + fixtures.ts
- Set up test database context

### Phase 2: Auth & Validation (2-3 hours)
- Implement auth.test.ts
- Implement validation.test.ts
- Verify 401/422 error handling

### Phase 3: Trade Routes (4-6 hours)
- Implement trades.test.ts (happy path)
- Implement trades-errors.test.ts (error cases)
- Verify deduplication (409)

### Phase 4: Account Routes (3-4 hours)
- Implement accounts.test.ts + accounts-errors.test.ts
- Verify account isolation

### Phase 5: RLS & Edge Cases (2-3 hours)
- Implement rls-isolation.test.ts
- Implement snapshots.test.ts
- Manual smoke testing

---

## 📝 Notes

- **Supertest Pattern:** `request(app).METHOD(path).set(headers).send(body).expect(statusCode).end(callback)`
- **Mock JWT:** Use `jsonwebtoken.sign({ sub: userId, ... }, 'secret')` for test tokens
- **Test Isolation:** Clean up after each test to avoid data pollution
- **Parallel Execution:** Tests should not interfere (use unique IDs)
- **Context7 Alignment:** Follow Supertest + Jest best practices from official docs

---

**Next Step:** Start implementation with helpers + fixtures
