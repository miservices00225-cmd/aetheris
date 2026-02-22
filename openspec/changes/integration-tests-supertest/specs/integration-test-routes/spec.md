## ADDED Requirements

### Requirement: POST /trades creates a new trade record
The trades API SHALL accept POST requests with trade data (account_id, entry_price, exit_price, etc.) and create a new trade in the database.

#### Scenario: Valid trade created successfully
- **WHEN** POST /trades with valid payload and valid JWT
- **THEN** returns 201 Created with trade object including generated `id`, `created_at`

#### Scenario: Missing required field returns 422
- **WHEN** POST /trades omits a required field (e.g., `account_id`)
- **THEN** returns 422 Unprocessable Entity with details array

#### Scenario: Duplicate broker_trade_id returns 409
- **WHEN** POST /trades with duplicate `broker_trade_id` for same account
- **THEN** returns 409 Conflict (UNIQUE constraint on broker_trade_id)

### Requirement: GET /trades lists user's trades with filtering
The trades API SHALL return a paginated list of trades for the authenticated user, with optional date/account filtering.

#### Scenario: List all trades for user
- **WHEN** GET /trades with valid JWT
- **THEN** returns 200 OK with paginated array of trades (max 50 per page)

#### Scenario: Filter trades by date range
- **WHEN** GET /trades?start_date=2026-01-01&end_date=2026-02-01
- **THEN** returns only trades within date range

#### Scenario: Filter trades by account
- **WHEN** GET /trades?account_id=<account-uuid>
- **THEN** returns only trades for that account (RLS enforced)

### Requirement: GET /accounts lists user's accounts
The accounts API SHALL return all accounts belonging to the authenticated user.

#### Scenario: List all accounts
- **WHEN** GET /accounts with valid JWT
- **THEN** returns 200 OK with array of user's accounts

#### Scenario: Cannot access other user's accounts
- **WHEN** User A attempts GET /accounts (with User A's JWT)
- **THEN** returns only User A's accounts, not User B's accounts (RLS enforced)

### Requirement: PATCH /accounts/:id updates account settings
The accounts API SHALL allow users to update their own account settings (account type, leverage limit, etc.).

#### Scenario: User updates own account
- **WHEN** PATCH /accounts/<own-account-id> with valid payload and JWT
- **THEN** returns 200 OK with updated account

#### Scenario: User cannot update other's account
- **WHEN** PATCH /accounts/<other-user-account-id> with JWT
- **THEN** returns 403 Forbidden (RLS violation)

### Requirement: GET /brokers lists broker connections
The brokers API SHALL return all broker connections configured by the authenticated user.

#### Scenario: List all broker connections
- **WHEN** GET /brokers with valid JWT
- **THEN** returns 200 OK with array of broker_connections

### Requirement: GET /audit returns audit trail
The audit API SHALL return the audit trail (user actions, changes) for the authenticated user, with optional date filtering.

#### Scenario: List audit trail
- **WHEN** GET /audit with valid JWT
- **THEN** returns 200 OK with paginated audit records

#### Scenario: Filter audit by date range
- **WHEN** GET /audit?start_date=2026-01-01&end_date=2026-02-01
- **THEN** returns only audit records within date range
