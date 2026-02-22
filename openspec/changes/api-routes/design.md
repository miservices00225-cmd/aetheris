## Context

**Current State:**
- Sprint 3 completed the database layer: 5 CRUD helper modules (trades, accounts, audit, snapshots, errors) with 27/27 tests passing
- All database queries are typed, support RLS enforcement, and wrap errors in DatabaseError class
- No API gateway exists yet; frontend would need direct Supabase client (security anti-pattern)

**Constraints:**
- Must maintain backward compatibility with database helpers (no breaking changes)
- All API endpoints must enforce JWT auth (no public trade data)
- Error responses must match Supabase HTTP codes (400, 403, 404, 422, 500)
- Audit trail must capture all API requests (compliance requirement)

**Stakeholders:**
- Frontend team: needs consistent REST API with standardized responses
- Compliance: needs audit logging of all data mutations
- Security: JWT validation, CORS, rate-limiting foundations

## Goals / Non-Goals

**Goals:**
- Wrap all Sprint 3 database helpers in Express REST endpoints
- Enforce authentication (JWT from Supabase auth) on all endpoints
- Standardize request/response format (success/error envelopes)
- Implement input validation (Zod schemas for trades, accounts, date ranges)
- Log all API requests/responses to audit trail
- Provide clear error messages to frontend (constraint violations, FK errors, etc.)
- Prepare for Sprint 4+ features: rate-limiting, webhook callbacks, async job queues

**Non-Goals:**
- Rate-limiting (implemented after Sprint 4)
- GraphQL API (REST only)
- WebSocket support for real-time updates (future)
- Admin management endpoints (future Sprint)
- OAuth/SAML auth (JWT only)

## Decisions

### Decision 1: Middleware Order & Architecture
**Choice:** Use Express middleware stack: auth → logging → validation → route handler → error handler

**Rationale:** 
- Auth first: protect all routes, fail fast
- Logging second: capture context (user_id, path, method) before processing
- Validation third: reject invalid inputs before hitting database
- Error handler last: catch all throws, wrap in HTTP response

**Alternatives Considered:**
- Route-level middleware (duplicate code across 50+ endpoints) ❌
- Separate auth decorator pattern (decorators not idiomatic Express) ❌
- Exception filters (not needed, single error handler sufficient) ❌

### Decision 2: Error Handling Strategy
**Choice:** Catch DatabaseError in route handlers, map to HTTP status + JSON response envelope

```typescript
// Route handler
try {
  const trade = await insertTrade(accountId, data);
  res.status(201).json({ success: true, data: trade });
} catch (error) {
  if (error instanceof DatabaseError) {
    const status = error.code === '23505' ? 409 : 400; // UNIQUE → 409 Conflict
    res.status(status).json({ success: false, error: error.getDetailedMessage() });
  } else {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
```

**Rationale:**
- DatabaseError class already detects constraint type (unique, foreign key, not null)
- HTTP status codes map directly: 409=duplicate, 403=RLS violation, 422=validation, 400=bad input
- Centralized error handler avoids try/catch duplication across 8 routes

**Alternatives Considered:**
- Throw HTTP exceptions from database layer (mixes concerns) ❌
- Custom error middleware (still need try/catch in routes) ⚠️ Keep for 500s

### Decision 3: Response Format
**Choice:** Envelope pattern with `{ success: boolean, data?: T, error?: string, code?: string }`

**Rationale:**
- Consistent structure across all endpoints (success/error both have envelope)
- Include error code (e.g., "UNIQUE_CONSTRAINT") for frontend conditional rendering
- Data nullable (errors don't include data field)

**Example Success:**
```json
{ "success": true, "data": { "id": "uuid", "symbol": "EURUSD", ... } }
```

**Example Error:**
```json
{ "success": false, "error": "Duplicate trade: broker_trade_id already exists", "code": "23505" }
```

### Decision 4: Input Validation
**Choice:** Zod schemas for request body validation in middleware, before route handler

```typescript
const createTradeSchema = z.object({
  broker_id: z.string().min(1),
  symbol: z.string().regex(/^[A-Z]{6}$/),
  entry_price: z.number().positive(),
  quantity: z.number().positive(),
  entry_time: z.string().datetime(),
  trade_type: z.enum(['buy', 'sell', 'long', 'short']).nullable(),
});
```

**Rationale:**
- Zod provides type inference → TypeScript safety
- Lightweight (small bundle), no runtime dependencies on types
- Reusable schemas across multiple endpoints
- Clear 422 response on validation failure

**Alternatives Considered:**
- joi (heavier, less TypeScript native) ❌
- Manual req.body checks (error-prone, code duplication) ❌
- OpenAPI schema generation (over-engineered for MVP) ❌

### Decision 5: Route Structure
**Choice:** Organize routes by resource (trades.ts, accounts.ts, snapshots.ts, brokers.ts, audit.ts), mount at `/api/v1`

```
backend/src/routes/
  ├── trades.ts        → POST/GET/PUT /api/v1/trades
  ├── accounts.ts      → POST/GET/PUT /api/v1/accounts
  ├── snapshots.ts     → GET /api/v1/snapshots
  ├── brokers.ts       → POST /api/v1/broker-sync
  └── audit.ts         → GET /api/v1/audit/export
```

**Rationale:**
- RESTful convention: /resources/ID
- Scales to 50+ endpoints without monolithic router
- Easy to locate endpoint handler (grep for resource name)
- Version prefix (`/api/v1`) allows future `/api/v2` without conflicts

**Alternatives Considered:**
- Single router.js with all 50 routes (unmaintainable) ❌
- Feature-based structure (auth, trades, etc. are features not separate) ⚠️

### Decision 6: JWT Auth Implementation
**Choice:** Supabase auth.getUser() middleware → inject `req.user` context for RLS enforcement

```typescript
export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const { data, error } = await adminClient.auth.getUser(token);
  if (error) return res.status(401).json({ success: false, error: 'Unauthorized' });
  req.user = data.user;
  next();
}
```

**Rationale:**
- Supabase auth already handles JWT validation (no duplicate validation)
- `getUser()` verifies signature + expiration
- Inject user context into all routes (required for RLS + audit logging)

**Alternatives Considered:**
- jwt.verify() (manual, duplicates Supabase work) ❌
- Supabase session middleware (intended for web, not for server) ⚠️

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **N+1 queries** (account lookup in RLS checks) | Index on account_id, cache account list in memory if <1000 accounts |
| **Error messages leak schema info** | Sanitize constraint names in production (show "Duplicate entry" not "unique index idx_trades_dedup") |
| **JWT expiration mid-request** | Client retries with refreshed token; server rejects with 401, client redirects to login |
| **Audit logs grow quickly** | Implement log rotation/archival (200k rows/month) in Sprint 5 |
| **RLS policies bypass if user context missing** | Test auth middleware explicitly; fail closed (401) if user context not present |

## Migration Plan

**Deployment Steps:**
1. Deploy `backend/src/routes/` and middleware (feature-flagged with FEATURE_API_V1)
2. Run integration tests against staging Supabase
3. Enable FEATURE_API_V1 flag in production
4. Monitor 401/500 error rates for 1 hour
5. Coordinate with frontend to migrate from direct Supabase calls to API endpoints

**Rollback:**
- Disable FEATURE_API_V1 flag (immediate, no database changes)
- Frontend falls back to direct Supabase client (backward compatible)

## Open Questions

1. Should rate-limiting be in Express middleware or API gateway (Cloudflare, Kong)? → Defer to Sprint 5
2. Should validation schemas be shared with frontend (monorepo) or duplicated? → Duplicate for now (different validation rules on client vs server)
3. What log level for audit trail (all requests vs mutations only)? → All POST/PUT/DELETE, SELECT if compliance required
4. Should error responses include request trace ID for debugging? → Yes, add uuid to req.id in logging middleware
