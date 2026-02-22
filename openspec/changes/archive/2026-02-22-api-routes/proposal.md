## Why

Sprint 3 completed the **database layer** (CRUD helpers, RLS, deduplication) with 27/27 tests passing. Sprint 4 builds the **API gateway layer** that wraps these helpers in Express.js REST endpoints. This enables the frontend to interact with the trading journal without direct database access, enforcing authentication, validation, and error handling at the API boundary. This is critical for security (CORS, rate-limiting), compliance (audit trail integration), and UX (standardized error responses).

## What Changes

- **New**: 8+ Express.js API routes for trades, accounts, snapshots, audit, and broker sync
- **New**: Middleware for JWT auth, error handling, request/response logging
- **New**: Input validation schemas (Zod or joi) for all POST/PUT endpoints
- **New**: Standardized JSON response format (success/error envelopes)
- **Modified**: Database helpers now integrated with API response handlers
- **Modified**: Error handling elevated from DatabaseError to HTTP status codes (400, 403, 404, 500)

Breaking changes: None (new API, not replacing existing)

## Capabilities

### New Capabilities

- `trade-crud-api`: POST/GET/PUT/DELETE /api/v1/trades endpoints with deduplication, validation, and audit logging
- `account-crud-api`: POST/GET/PUT /api/v1/accounts endpoints with user isolation (RLS enforcement at API layer)
- `snapshot-query-api`: GET /api/v1/snapshots with date filtering for heatmap + metrics dashboard
- `broker-sync-api`: POST /api/v1/broker-sync/:accountId to trigger import, track dedup/error counts
- `audit-export-api`: GET /api/v1/audit/export with CSV generation and access control
- `auth-middleware`: JWT verification, user context injection, role-based endpoint access
- `error-handling-middleware`: Centralized error catching, constraint detection, HTTP response mapping
- `request-validation`: Input schema validation (trades, accounts, date ranges, enums)

### Modified Capabilities

- `database-error-handling`: Errors now wrapped in HTTP responses (not just DatabaseError throws)
- `audit-trail`: API requests logged alongside SQL audit triggers for compliance

## Impact

**Code**:
- `backend/src/routes/` — 5 new route modules (trades.ts, accounts.ts, snapshots.ts, brokers.ts, audit.ts)
- `backend/src/middleware/` — auth.ts, errorHandler.ts, validation.ts
- `backend/src/utils/responses.ts` — standardized response envelopes

**APIs**:
- Frontend will use `GET/POST/PUT /api/v1/*` instead of direct Supabase calls
- Removes need for Supabase client in frontend (reduces bundle size, improves security)

**Dependencies**:
- Possibly add joi or zod for validation (lightweight, no breaking changes)

**Testing**:
- Existing database tests remain (unit layer)
- New integration tests for API endpoints (test request/response, status codes, error cases)
