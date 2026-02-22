## Why

Phase 1 MVP requires a fully operational backend connected to Supabase. Sprint 1 & 2 completed the database schema (15 tables), RLS policies, and audit logging. Sprint 3 now bridges the gap between schema and API by implementing strongly-typed database client helpers, deduplication logic, and comprehensive test coverage. This unblocks API endpoint development (POST /trades, GET /accounts, etc.) and ensures data integrity at the application layer.

## What Changes

- **New:** Supabase admin client initialization (backend/src/config/supabase.ts) with service role + anon key support
- **New:** Database query helper modules (trades, accounts, audit, daily snapshots) with typed Promise returns and RLS enforcement
- **New:** Deduplication detection logic for broker trades with IGNORE/OVERWRITE conflict resolution strategy
- **New:** Jest test suite (20+ tests) covering CRUD operations, RLS isolation, deduplication constraints, and error handling
- **Modification:** backend/package.json to ensure @supabase/supabase-js is installed
- **Impact:** Backend now ready for API route layer (Phase 4); database operations fully tested and type-safe

## Capabilities

### New Capabilities
- `supabase-client-config`: Initialize and export Supabase admin + anon clients with credential validation
- `database-crud-helpers`: Implement query helpers for trades, accounts, audit, snapshots with typed returns
- `deduplication-logic`: Detect duplicate broker trades and handle IGNORE/OVERWRITE conflict resolution
- `database-testing`: Comprehensive Jest test suite validating CRUD, RLS, dedup, error handling (20+ tests)

### Modified Capabilities
<!-- No existing capabilities modified in this sprint; all are new implementations -->

## Impact

**Affected Code:**
- backend/src/config/ (NEW)
- backend/src/database/ (NEW)
- backend/src/__tests__/ (NEW)
- backend/package.json (may need @supabase/supabase-js)

**Dependencies:**
- @supabase/supabase-js (client library)
- jest (test framework)
- @types/jest (type definitions)
- dotenv (environment variables from .env.local)

**APIs & Interfaces:**
- Supabase service role client (for backend operations)
- Supabase anon client (for frontend/mobile)
- Custom error class for DB operations

**Testing:**
- Jest unit tests for all CRUD helpers
- RLS policy enforcement tests
- Deduplication constraint tests
