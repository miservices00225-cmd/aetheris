## ADDED Requirements

### Requirement: User Registration and KYC/AML Status

The system SHALL allow users to create accounts with email/password authentication. User KYC/AML verification status SHALL be tracked for compliance. Users SHALL only access data after passing KYC verification.

#### Scenario: New user registration
- **WHEN** user submits email and password
- **THEN** system creates user record in `users` table with `kycaml_status = 'pending'`

#### Scenario: User KYC verification
- **WHEN** admin marks user as verified in Supabase dashboard
- **THEN** user's `kycaml_status` becomes `'verified'` and user can access trading features

#### Scenario: User sees own data only
- **WHEN** user queries their trades via API
- **THEN** Row-Level Security policy ensures only user's own trades are returned (not other users' data)

### Requirement: JWT-Based Authentication

The system SHALL use Supabase JWT tokens for authentication. All protected API endpoints SHALL verify JWT tokens before allowing access.

#### Scenario: User login
- **WHEN** user submits valid credentials
- **THEN** system returns JWT token valid for 1 hour

#### Scenario: Expired token rejection
- **WHEN** user sends request with expired JWT
- **THEN** system returns 401 Unauthorized

### Requirement: Audit Trail for Authentication

The system SHALL log all login/logout events and KYC status changes for compliance verification.

#### Scenario: Login audit log
- **WHEN** user successfully authenticates
- **THEN** audit trail records timestamp, user_id, and `event_type = 'login'`

#### Scenario: KYC status change audit
- **WHEN** user's KYC status changes from pending to verified
- **THEN** audit trail records change with timestamp and actor (admin)
