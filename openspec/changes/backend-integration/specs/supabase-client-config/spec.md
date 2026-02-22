## ADDED Requirements

### Requirement: Supabase Client Initialization

The system SHALL initialize and export both Supabase admin client (with service role) and anon client (with public key) for backend operations.

#### Scenario: Admin client initialization with service role
- **WHEN** backend server starts
- **THEN** admin client is initialized with SERVICE_KEY from environment variables
- **AND** admin client can execute privileged operations (migrations, audit access)

#### Scenario: Anon client initialization with public key
- **WHEN** backend server starts
- **THEN** anon client is initialized with VITE_SUPABASE_ANON_KEY from environment variables
- **AND** anon client enforces RLS on all queries

#### Scenario: Credential validation on startup
- **WHEN** backend server starts with missing VITE_SUPABASE_URL
- **THEN** system logs error and stops
- **AND** error message specifies which environment variable is missing

### Requirement: Supabase Client Export

The system SHALL export both clients from config module for use in database helpers.

#### Scenario: Import admin client
- **WHEN** database helper module imports from config/supabase.ts
- **THEN** admin client is available for use
- **AND** client has credentials with service role permissions

#### Scenario: Import anon client  
- **WHEN** frontend or test module imports from config/supabase.ts
- **THEN** anon client is available for use
- **AND** client enforces RLS policies automatically

### Requirement: Error Handling for Missing Credentials

The system SHALL provide clear error messages when Supabase credentials are missing or invalid.

#### Scenario: Missing VITE_SUPABASE_URL
- **WHEN** .env.local does not contain VITE_SUPABASE_URL
- **THEN** system throws error "VITE_SUPABASE_URL not configured"
- **AND** error prevents server from starting

#### Scenario: Missing SERVICE_KEY
- **WHEN** .env.local does not contain SERVICE_KEY
- **THEN** system logs warning but allows server to start with anon client only
- **AND** admin operations will fail with clear permission error
