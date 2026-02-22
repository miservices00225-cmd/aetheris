# Trade CRUD API Specification

## Overview
Defines Express REST endpoints for trade CRUD operations (Create, Read, Update, Delete) with automatic deduplication, validation, and audit logging.

## Requirements

### POST /api/v1/trades — Create Trade
**Purpose:** Insert a new trade record with automatic duplicate detection

**Request:**
```json
{
  "broker_id": "mt4",
  "broker_trade_id": "mt4-20260222-001",
  "symbol": "EURUSD",
  "trade_type": "long",
  "entry_price": 1.0850,
  "entry_time": "2026-02-22T10:30:00Z",
  "quantity": 1.0,
  "commission": 10.0,
  "slippage": 0.5
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "account_id": "account-uuid",
    "broker_id": "mt4",
    "symbol": "EURUSD",
    "entry_price": 1.0850,
    "entry_time": "2026-02-22T10:30:00Z",
    "quantity": 1.0,
    "pnl": null,
    "created_at": "2026-02-22T12:30:00Z"
  }
}
```

**Error (409 Conflict - Duplicate):**
```json
{
  "success": false,
  "error": "Duplicate trade: broker_trade_id 'mt4-20260222-001' already exists in account",
  "code": "23505"
}
```

**Behavior:**
- Extract account_id from JWT user context
- Call detectDuplicate(broker_id, broker_trade_id, account_id)
- If duplicate exists, return 409 with existing trade ID
- If new, call insertTrade() and return 201 with created trade
- Log to audit_trail: INSERT operation with trade data

### GET /api/v1/trades — List Account Trades
**Purpose:** Retrieve all trades for authenticated user's account(s) with optional filtering

**Query Parameters:**
- `account_id` (required): Account UUID
- `start_date` (optional): ISO date string (filters entry_time >= start_date)
- `end_date` (optional): ISO date string (filters entry_time <= end_date)
- `symbol` (optional): Exact symbol filter (e.g., "EURUSD")
- `limit` (optional): Default 100, max 1000
- `offset` (optional): For pagination, default 0

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "id": "uuid1", "symbol": "EURUSD", "entry_price": 1.0850, ... },
    { "id": "uuid2", "symbol": "GBPUSD", "entry_price": 1.2650, ... }
  ],
  "meta": { "total": 2, "limit": 100, "offset": 0 }
}
```

**Behavior:**
- Verify account_id belongs to authenticated user (RLS check at application layer)
- Call selectTrades(account_id, start_date, end_date)
- Apply symbol filter in memory (optional optimization: SQL WHERE)
- Return paginated results with total count
- Log to audit_trail: SELECT operation (minimal logging)

### PUT /api/v1/trades/:id — Update Trade
**Purpose:** Modify an existing trade (exit price, P/L, notes)

**Request:**
```json
{
  "exit_price": 1.0900,
  "exit_time": "2026-02-22T14:45:00Z",
  "pnl": 500.0,
  "notes": "Sold at resistance level"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { "id": "uuid", "exit_price": 1.0900, "pnl": 500.0, ... }
}
```

**Error (403 Forbidden - Not Owner):**
```json
{
  "success": false,
  "error": "Unauthorized: trade belongs to different account",
  "code": "RLS"
}
```

**Behavior:**
- Verify trade_id exists and belongs to authenticated user's account
- Call updateTrade(trade_id, updates)
- Return 200 with updated trade
- Log to audit_trail: UPDATE operation with old/new values (captured by database trigger)

### DELETE /api/v1/trades/:id — Delete Trade
**Purpose:** Soft or hard delete a trade record

**Response (204 No Content or 200 OK):**
```json
{
  "success": true,
  "message": "Trade deleted"
}
```

**Behavior:**
- Verify trade_id belongs to authenticated user
- Delete trade from database
- Log to audit_trail: DELETE operation
- Return 204 (no body) or 200 with success message

---

## Error Responses

All endpoints return standardized error format:
```json
{
  "success": false,
  "error": "<message>",
  "code": "<error_code>"
}
```

**Status Codes:**
| Code | Reason |
|------|--------|
| 201 | Trade created successfully |
| 200 | GET/PUT successful |
| 204 | DELETE successful (no content) |
| 400 | Invalid input (missing required fields, invalid types) |
| 401 | Unauthorized (missing/invalid JWT) |
| 403 | Forbidden (RLS violation, not user's account) |
| 404 | Trade not found |
| 409 | Conflict (duplicate broker_trade_id) |
| 422 | Validation failed (invalid symbol, bad date format) |
| 500 | Internal server error |

---

## Constraints

1. **Deduplication:** Unique constraint (broker_id, broker_trade_id, account_id) prevents duplicates
2. **RLS Enforcement:** Only user's own trades visible (account.user_id = auth.uid())
3. **Immutability:** entry_price, entry_time, quantity CANNOT be updated (core trade params)
4. **Audit Trail:** All operations logged to audit_trail table via database triggers

---

## Success Criteria

- ✅ All 4 endpoints (POST, GET, PUT, DELETE) implemented
- ✅ JWT auth required on all endpoints (401 if missing)
- ✅ RLS checked at application layer (403 if not user's account)
- ✅ Duplicate detection returns existing trade (409)
- ✅ Input validation rejects invalid symbols, negative prices, bad dates (400/422)
- ✅ Audit trail captures all mutations (INSERT/UPDATE/DELETE)
- ✅ Integration tests cover all happy paths + error cases
