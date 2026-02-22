## ADDED Requirements

### Requirement: User isolation via RLS (Row Level Security)
The system SHALL enforce RLS policies so that User A cannot access data created by User B, even if they have valid JWT tokens.

#### Scenario: User A cannot see User B's trades
- **WHEN** User A performs GET /trades with User A's JWT
- **THEN** returns only User A's trades, not User B's trades

#### Scenario: User A cannot see User B's accounts
- **WHEN** User A performs GET /accounts with User A's JWT
- **THEN** returns only User A's accounts, not User B's accounts

#### Scenario: User A cannot query trades by User B's account_id
- **WHEN** User A performs GET /trades?account_id=<user-b-account-id> with User A's JWT
- **THEN** returns 403 Forbidden or empty array (RLS blocks query)

#### Scenario: Cross-user update is blocked
- **WHEN** User A performs PATCH /accounts/<user-b-account-id> with User A's JWT
- **THEN** returns 403 Forbidden (RLS policy violation)

### Requirement: Account filtering respects ownership
The system SHALL only return accounts belonging to the authenticated user, never shared or admin-visible accounts outside user's scope.

#### Scenario: User sees only owned accounts
- **WHEN** authenticated user performs GET /accounts
- **THEN** returns accounts where `user_id = auth.uid()`

#### Scenario: User cannot update account type to 'admin'
- **WHEN** authenticated user performs PATCH /accounts/<own-account-id> with `type: 'admin'`
- **THEN** either returns 403 or ignores the change (only personal/prop_firm/crypto allowed)

### Requirement: Multi-account aggregation respects permissions
The system SHALL aggregate data (risk metrics, P/L) across user's accounts only, never exposing other users' data.

#### Scenario: Risk aggregation includes only owned accounts
- **WHEN** user performs GET /risk/aggregated with valid JWT
- **THEN** returns risk metrics for user's accounts only (not org-wide or other users)

#### Scenario: User cannot spoof account ownership
- **WHEN** a JWT is forged or tampered with to claim different user_id
- **THEN** Supabase RLS policies reject the query (PostgreSQL enforced)
