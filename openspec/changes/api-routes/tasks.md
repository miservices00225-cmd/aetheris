# Sprint 4 — API Routes Implementation Tasks

## 1. Project Setup & Middleware Foundation

- [ ] 1.1 Install dependencies: express, zod (validation), cors, helmet
- [ ] 1.2 Create backend/src/middleware/ directory structure
- [ ] 1.3 Implement authMiddleware: extract JWT, call Supabase auth.getUser()
- [ ] 1.4 Implement errorHandler middleware with DatabaseError mapping
- [ ] 1.5 Create utils/responses.ts for standardized response envelopes
- [ ] 1.6 Wire up middleware in main Express app (app.use order: cors → helmet → auth → routes → errorHandler)

## 2. Request Validation & Input Schemas

- [ ] 2.1 Create backend/src/schemas/ directory for Zod validation schemas
- [ ] 2.2 Create Trade creation schema (required: broker_id, symbol, entry_price, quantity, entry_time)
- [ ] 2.3 Create Trade update schema (optional: exit_price, exit_time, pnl, notes)
- [ ] 2.4 Create Account creation schema (required: account_name, account_type, broker_type)
- [ ] 2.5 Create Account update schema (optional: risk_limit_percent, max_drawdown_percent)
- [ ] 2.6 Create validation middleware: parseBody(schema) that returns 422 on validation error

## 3. Trade Routes (POST/GET/PUT/DELETE /api/v1/trades)

- [ ] 3.1 Create backend/src/routes/trades.ts route module
- [ ] 3.2 Implement POST /api/v1/trades: call detectDuplicate, insertTrade, return 201 or 409
- [ ] 3.3 Implement GET /api/v1/trades: query params (account_id, start_date, end_date, symbol), return paginated results
- [ ] 3.4 Implement PUT /api/v1/trades/:id: update exit_price/pnl/notes, verify ownership, return 200
- [ ] 3.5 Implement DELETE /api/v1/trades/:id: verify ownership, delete trade, return 204
- [ ] 3.6 Add RLS checks: verify req.user.id matches account.user_id (403 if mismatch)
- [ ] 3.7 Test duplicate detection returns existing trade ID (409)

## 4. Account Routes (POST/GET/PUT /api/v1/accounts)

- [ ] 4.1 Create backend/src/routes/accounts.ts route module
- [ ] 4.2 Implement POST /api/v1/accounts: createAccount(req.user.id, data), return 201
- [ ] 4.3 Implement GET /api/v1/accounts: selectAccounts(req.user.id), return user's accounts only
- [ ] 4.4 Implement PUT /api/v1/accounts/:id: updateRiskLimits, verify ownership, return 200
- [ ] 4.5 Verify all endpoints enforce RLS (403 if not user's account)

## 5. Snapshot & Analytics Routes

- [ ] 5.1 Create backend/src/routes/snapshots.ts route module
- [ ] 5.2 Implement GET /api/v1/snapshots: query params (account_id, start_date, end_date), return daily snapshots
- [ ] 5.3 Verify date filtering works (start_date <= snapshot_date <= end_date)
- [ ] 5.4 Create backend/src/routes/audit.ts route module
- [ ] 5.5 Implement GET /api/v1/audit/export: query params (user_id, start_date, end_date), export CSV
- [ ] 5.6 Verify audit export includes columns: table_name, record_id, operation, timestamp, old_values, new_values

## 6. Broker Sync Route

- [ ] 6.1 Create backend/src/routes/brokers.ts route module (placeholder for Sprint 5)
- [ ] 6.2 Implement POST /api/v1/broker-sync/:accountId: trigger sync job
- [ ] 6.3 Return sync status: { trades_new, trades_duplicate, trades_error, sync_timestamp }

## 7. Integration Testing

- [ ] 7.1 Create backend/src/routes/__tests__/trades.integration.test.ts
- [ ] 7.2 Test POST /api/v1/trades: valid create, duplicate detection (409), auth (401), validation (422)
- [ ] 7.3 Test GET /api/v1/trades: pagination, filtering, RLS isolation (403)
- [ ] 7.4 Test PUT /api/v1/trades/:id: update success, immutable fields, ownership check
- [ ] 7.5 Test DELETE /api/v1/trades/:id: delete success, 404 if not found
- [ ] 7.6 Create backend/src/routes/__tests__/accounts.integration.test.ts
- [ ] 7.7 Test account CRUD: create, list (user-only), update
- [ ] 7.8 Test error handling: 409 (duplicate), 403 (RLS), 422 (validation), 500 (database)
- [ ] 7.9 Test auth middleware: 401 if missing token, valid user_id injected

## 8. Documentation & Cleanup

- [ ] 8.1 Update backend/README.md with API endpoint list and examples
- [ ] 8.2 Add request/response examples to each route handler (comments)
- [ ] 8.3 Verify all 50+ endpoints documented (trade, account, snapshot, audit, broker)
- [ ] 8.4 Add CORS whitelist configuration for frontend domain
- [ ] 8.5 Run `npm run lint` and `npm run build` — no errors

## 9. API Gateway Finalization

- [ ] 9.1 Implement rate-limiting stub (return 429 in future Sprint 5)
- [ ] 9.2 Add request logging middleware: log method, path, status, duration, user_id
- [ ] 9.3 Wire up all route modules to Express app in server.ts
- [ ] 9.4 Set PORT=3001 (backend server)
- [ ] 9.5 Start server: `npm run dev` — listen on http://localhost:3001
- [ ] 9.6 Manual test: curl GET /api/v1/trades (expect 401 without auth token)

## Success Criteria

- ✅ All routes return standardized { success, data, error } envelope
- ✅ All protected routes require JWT (401 if missing)
- ✅ All mutations enforced via RLS (403 if not user's account)
- ✅ Duplicate trade detection works (409 Conflict)
- ✅ Input validation rejects invalid data (422)
- ✅ Error messages map DatabaseError to HTTP status codes
- ✅ Audit trail captures all mutations
- ✅ Integration tests pass (happy path + error cases)
- ✅ TypeScript strict mode: no errors on `npm run build`
- ✅ Backend ready for frontend integration (Sprint 5)
