## ADDED Requirements

### Requirement: Auth middleware validates JWT tokens
The auth middleware SHALL verify JWT bearer tokens in Authorization headers and attach user identity to requests. Valid tokens SHALL pass through; invalid/expired tokens SHALL return 401 Unauthorized.

#### Scenario: Valid JWT token accepted
- **WHEN** a request includes `Authorization: Bearer <valid-jwt>`
- **THEN** the middleware sets `req.user.id` and calls `next()`

#### Scenario: Expired JWT token rejected
- **WHEN** a request includes `Authorization: Bearer <expired-jwt>`
- **THEN** the middleware returns 401 with message "Token expired"

#### Scenario: Missing Authorization header rejected
- **WHEN** a request omits the Authorization header
- **THEN** the middleware returns 401 with message "Missing authorization token"

#### Scenario: Malformed bearer format rejected
- **WHEN** a request includes `Authorization: InvalidJWT <token>` (not "Bearer")
- **THEN** the middleware returns 401 with message "Invalid authorization format"

### Requirement: Validation middleware enforces Zod schemas
The validation middleware SHALL validate request bodies against Zod schemas and return structured error details on failure.

#### Scenario: Valid payload passes validation
- **WHEN** a request body matches the Zod schema
- **THEN** the middleware calls `next()` and validation succeeds

#### Scenario: Invalid payload returns 422 with details
- **WHEN** a request body violates the Zod schema (e.g., missing required field)
- **THEN** the middleware returns 422 Unprocessable Entity with `details` array containing field paths and error messages

#### Scenario: Error response format includes field paths
- **WHEN** validation fails on nested fields (e.g., `account.type`)
- **THEN** the response details array includes `path: ["account", "type"]` for client-side form mapping

### Requirement: Error handler maps PostgreSQL codes to HTTP status
The error handler middleware SHALL map database error codes to appropriate HTTP status codes for client-friendly responses.

#### Scenario: UNIQUE constraint violation returns 409
- **WHEN** an INSERT/UPDATE violates a UNIQUE constraint (PostgreSQL code 23505)
- **THEN** the error handler returns 409 Conflict

#### Scenario: NOT NULL constraint violation returns 422
- **WHEN** an INSERT/UPDATE violates a NOT NULL constraint (PostgreSQL code 23502)
- **THEN** the error handler returns 422 Unprocessable Entity

#### Scenario: RLS policy violation returns 403
- **WHEN** a query violates a RLS policy (PostgreSQL code 42501)
- **THEN** the error handler returns 403 Forbidden with message "Access denied"

#### Scenario: Unhandled errors return 500
- **WHEN** an error occurs that doesn't map to a known code
- **THEN** the error handler returns 500 Internal Server Error
