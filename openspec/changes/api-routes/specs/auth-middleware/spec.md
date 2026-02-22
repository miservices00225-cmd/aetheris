# Auth Middleware Specification

## Overview
JWT authentication middleware for Express that validates Supabase JWT tokens and injects user context into all protected routes.

## Requirements

### Middleware: authMiddleware()
**Purpose:** Validate JWT token and extract user context

**Behavior:**
1. Extract token from `Authorization: Bearer <token>` header
2. Call Supabase `auth.getUser(token)` to validate
3. If valid: inject `req.user` object with user_id, email, role
4. If invalid/missing: return 401 Unauthorized

**Response on 401:**
```json
{
  "success": false,
  "error": "Unauthorized: missing or invalid token",
  "code": "UNAUTHORIZED"
}
```

**Usage in Express:**
```typescript
app.use('/api/v1', authMiddleware); // Protect all v1 routes
app.get('/api/v1/trades', authMiddleware, tradeHandler);
```

**req.user Object:**
```typescript
{
  id: "user-uuid",
  email: "user@example.com",
  user_metadata?: { role: "admin" | "user" }
}
```

---

## Implementation Notes

1. **Token Extraction:** Support both `Authorization: Bearer TOKEN` and `X-API-Key: TOKEN` (future)
2. **Caching:** Cache JWT verification for 5 minutes (optional, for performance)
3. **Refresh Handling:** On token expiration, return 401 (client refreshes token)
4. **CORS:** Allow OPTIONS requests (no auth required for preflight)

---

## Error Responses

| Code | Reason |
|------|--------|
| 401 | Missing token, invalid signature, expired |
| 403 | Token valid but user lacks permission (future) |

---

## Success Criteria

- ✅ JWT token validated via Supabase auth.getUser()
- ✅ req.user injected into authenticated requests
- ✅ Invalid/missing tokens return 401
- ✅ Works with all downstream route handlers
- ✅ Logs failed auth attempts to audit trail
