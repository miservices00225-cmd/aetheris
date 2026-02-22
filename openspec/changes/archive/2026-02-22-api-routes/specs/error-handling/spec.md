# Error Handling Specification

## Overview
Centralized error handling middleware that catches all errors from database layer and converts them to standardized HTTP responses.

## Requirements

### Middleware: errorHandler()
**Purpose:** Catch and standardize all error responses

**Behavior:**
1. Catch DatabaseError from database helpers
2. Detect error type (UNIQUE constraint, FK, NOT NULL, RLS, etc.)
3. Map to appropriate HTTP status code
4. Return standardized error envelope with code

**Error Type → HTTP Status Mapping:**

| Error Type | Status | Message |
|-----------|--------|---------|
| UNIQUE constraint (23505) | 409 | Duplicate entry |
| FK constraint (23503) | 400 | Invalid reference (account_id) |
| NOT NULL (23502) | 422 | Required field missing |
| RLS violation (42501) | 403 | Forbidden - not your resource |
| Invalid UUID (22P02) | 400 | Invalid input format |
| TypeError, ValidationError | 422 | Validation failed |
| Other DatabaseError | 500 | Internal database error |
| Uncaught Error | 500 | Internal server error |

**Response (409 Duplicate):**
```json
{
  "success": false,
  "error": "Duplicate trade: broker_trade_id already exists",
  "code": "23505"
}
```

**Response (403 RLS):**
```json
{
  "success": false,
  "error": "Forbidden: you do not have access to this account",
  "code": "42501"
}
```

### Constraint Detection Utility
**Source:** `DatabaseError.getDetailedMessage()`

**Detects:**
- `isUniqueConstraintError(code)` → 409
- `isForeignKeyError(code)` → 400
- `isNotNullError(code)` → 422
- `isRLSError(code)` → 403

---

## Implementation Notes

1. **Request ID:** Assign UUID to each request, include in error responses for debugging
2. **Logging:** Log all errors with request ID, user_id, stack trace (for 500s)
3. **Sensitive Data:** Never expose raw database errors in production (sanitize constraint names)
4. **Client-Friendly Messages:** Generic message on 500, specific message on 4xx

---

## Error Response Format

All errors follow this envelope:
```json
{
  "success": false,
  "error": "<human-readable message>",
  "code": "<error_code>",
  "requestId": "<uuid>" // Optional, for support tickets
}
```

---

## Success Criteria

- ✅ All DatabaseError types mapped to correct HTTP status
- ✅ Error messages are helpful but don't leak schema details
- ✅ Request ID tracked for debugging
- ✅ Uncaught errors return 500 (not 200 with error body)
- ✅ Integration tests verify error mappings
