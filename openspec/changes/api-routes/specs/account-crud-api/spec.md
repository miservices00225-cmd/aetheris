# Account CRUD API Specification

## Overview
Express endpoints for account management (create, read, update) with user isolation and risk limit enforcement.

## Requirements

### POST /api/v1/accounts — Create Account
**Request:**
```json
{
  "account_name": "MT4 Live",
  "account_type": "personal",
  "broker_type": "mt4",
  "risk_limit_percent": 2.0,
  "max_drawdown_percent": 10.0,
  "daily_loss_limit": 500.0
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "account-uuid",
    "user_id": "user-uuid",
    "account_name": "MT4 Live",
    "account_type": "personal",
    "risk_limit_percent": 2.0,
    "max_drawdown_percent": 10.0,
    "created_at": "2026-02-22T13:00:00Z"
  }
}
```

### GET /api/v1/accounts — List User Accounts
**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": "account-uuid1", "account_name": "MT4 Live", ... },
    { "id": "account-uuid2", "account_name": "Demo", ... }
  ]
}
```

**Behavior:**
- Extract user_id from JWT
- Call selectAccounts(user_id)
- Return user's accounts only (RLS enforcement)

### PUT /api/v1/accounts/:id — Update Risk Limits
**Request:**
```json
{
  "risk_limit_percent": 2.5,
  "max_drawdown_percent": 15.0
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "account-uuid", "risk_limit_percent": 2.5, ... }
}
```

---

## Error Responses

| Code | Reason |
|------|--------|
| 201 | Account created |
| 200 | GET/PUT successful |
| 400 | Invalid input (negative risk %, bad account_type) |
| 401 | Unauthorized |
| 403 | Forbidden (not user's account) |
| 409 | Conflict (duplicate account_name) |
| 422 | Validation failed |
| 500 | Server error |

---

## Success Criteria

- ✅ POST creates account linked to authenticated user
- ✅ GET returns only user's accounts (RLS)
- ✅ PUT updates risk limits with validation
- ✅ All endpoints require JWT auth (401 if missing)
- ✅ Audit trail logs all mutations
