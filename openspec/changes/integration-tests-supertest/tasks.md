## 1. Setup & Dependencies

- [ ] 1.1 Install `npm install supertest @types/supertest --save-dev`
- [ ] 1.2 Create backend/src/__tests__/ directory structure
- [ ] 1.3 Create backend/src/__tests__/helpers.ts with JWT generator (jsonwebtoken.sign mock)
- [ ] 1.4 Create backend/src/__tests__/fixtures.ts with user/account/broker builders
- [ ] 1.5 Create cleanup helper in fixtures for DELETE after each test

## 2. Middleware Tests

- [ ] 2.1 Create backend/src/__tests__/middleware/auth.test.ts
- [ ] 2.2 Write auth test: valid JWT token passes through (req.user.id set)
- [ ] 2.3 Write auth test: expired JWT returns 401
- [ ] 2.4 Write auth test: missing Authorization header returns 401
- [ ] 2.5 Write auth test: malformed bearer format returns 401
- [ ] 2.6 Create backend/src/__tests__/middleware/validation.test.ts
- [ ] 2.7 Write validation test: valid payload passes (next called)
- [ ] 2.8 Write validation test: invalid schema returns 422 with details array
- [ ] 2.9 Write validation test: error details include field paths for form mapping

## 3. Trade Routes - Happy Path

- [ ] 3.1 Create backend/src/__tests__/routes/trades.test.ts
- [ ] 3.2 Write test: POST /trades creates trade (returns 201 with id, created_at)
- [ ] 3.3 Write test: GET /trades lists trades for user (pagination, max 50)
- [ ] 3.4 Write test: GET /trades?start_date=X&end_date=Y filters by date
- [ ] 3.5 Write test: GET /trades?account_id=X filters by account
- [ ] 3.6 Write test: Trade response includes all required fields (price, quantity, fees, etc.)

## 4. Trade Routes - Error Cases

- [ ] 4.1 Write test: POST /trades missing required field returns 422
- [ ] 4.2 Write test: POST /trades duplicate broker_trade_id returns 409
- [ ] 4.3 Write test: POST /trades invalid schema returns 422 with details
- [ ] 4.4 Write test: POST /trades missing account_id returns 422
- [ ] 4.5 Write test: GET /trades invalid date format returns 400
- [ ] 4.6 Write test: GET /trades expired JWT returns 401
- [ ] 4.7 Write test: POST /trades constraint violation returns appropriate status

## 5. Account Routes

- [ ] 5.1 Create backend/src/__tests__/routes/accounts.test.ts
- [ ] 5.2 Write test: GET /accounts lists user's accounts (returns array)
- [ ] 5.3 Write test: GET /accounts/:id returns single account (returns object)
- [ ] 5.4 Write test: PATCH /accounts/:id updates own account (returns 200, updated fields)
- [ ] 5.5 Write test: PATCH /accounts/:id with invalid type returns 422
- [ ] 5.6 Write test: Account includes all fields (account_id, user_id, type, created_at)
- [ ] 5.7 Write test: GET /accounts missing JWT returns 401
- [ ] 5.8 Write test: PATCH /accounts/:id update leverage limit

## 6. Broker Routes

- [ ] 6.1 Create backend/src/__tests__/routes/brokers.test.ts
- [ ] 6.2 Write test: GET /brokers lists connections (returns array of broker_connections)
- [ ] 6.3 Write test: POST /brokers creates sync job (returns 201 with sync_id)
- [ ] 6.4 Write test: GET /brokers/:id returns broker details
- [ ] 6.5 Write test: POST /brokers invalid credentials returns 400
- [ ] 6.6 Write test: Broker response includes account_id, broker_type, last_sync_at

## 7. Audit Routes

- [ ] 7.1 Create backend/src/__tests__/routes/audit.test.ts
- [ ] 7.2 Write test: GET /audit lists audit trail (returns paginated array)
- [ ] 7.3 Write test: GET /audit?start_date=X&end_date=Y filters by date range
- [ ] 7.4 Write test: GET /audit returns only user's audit records (RLS enforced)
- [ ] 7.5 Write test: Audit record includes user_id, action, created_at, old_value, new_value
- [ ] 7.6 Write test: GET /audit?user_id=<other-user> returns 403 or filtered

## 8. RLS & Security Tests

- [ ] 8.1 Create backend/src/__tests__/security/rls-isolation.test.ts
- [ ] 8.2 Write test: User A GET /trades returns only User A's trades (not User B's)
- [ ] 8.3 Write test: User A cannot PATCH /accounts/<user-b-account> (returns 403)
- [ ] 8.4 Write test: User A GET /accounts?account_id=<user-b-account> returns 403 or empty
- [ ] 8.5 Write test: User A GET /audit?user_id=<user-b> returns 403 or filtered
- [ ] 8.6 Write test: Risk aggregation includes only owned accounts (not org-wide)
- [ ] 8.7 Write test: Tampered JWT user_id rejected by Supabase RLS policies

## 9. Snapshots & KPI Tests

- [ ] 9.1 Create backend/src/__tests__/routes/snapshots.test.ts
- [ ] 9.2 Write test: POST /snapshots creates daily snapshot (returns 201)
- [ ] 9.3 Write test: GET /snapshots returns snapshots in descending date order
- [ ] 9.4 Write test: Snapshot includes date, account_id, pnl, win_count, loss_count
- [ ] 9.5 Write test: Win Rate KPI calculated correctly (wins / total)
- [ ] 9.6 Write test: Profit Factor calculated correctly (gross_profit / gross_loss)
- [ ] 9.7 Write test: Expectancy calculated correctly ((win% × avg_win) − (loss% × avg_loss))
- [ ] 9.8 Write test: Heatmap data colors P/L (emerald=positive, crimson=negative, slate=zero)
- [ ] 9.9 Write test: Heatmap includes 7×5 grid structure

## 10. Coverage & Documentation

- [ ] 10.1 Run `npm run test -- --coverage` and check all routes
- [ ] 10.2 Identify coverage gaps (<80% routes)
- [ ] 10.3 Add missing edge case tests (error paths, boundary conditions)
- [ ] 10.4 Verify 27 database tests still passing (no regressions)
- [ ] 10.5 Create backend/TESTING.md with test conventions, helper examples, how to run
- [ ] 10.6 Document Jest commands: `npm run test`, `npm run test -- --coverage`, `npm run test -- --watch`
- [ ] 10.7 Manual smoke test: `npm run dev` + curl tests on running server
- [ ] 10.8 Verify JWT expiration, RLS enforcement, error responses manually

---

**Total Tasks:** 62
**Target:** All tests passing, 80%+ coverage, zero regressions on database tests
