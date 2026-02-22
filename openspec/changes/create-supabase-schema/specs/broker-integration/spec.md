## ADDED Requirements

### Requirement: Broker API Credential Storage

The system SHALL store broker API credentials securely encrypted. Credentials SHALL be accessible only to the authenticated user who owns them.

#### Scenario: User connects MT4 broker
- **WHEN** user enters MT4 API credentials
- **THEN** system encrypts credentials and stores in `broker_connections` table linked to user account

#### Scenario: Credential access via RLS
- **WHEN** user queries broker connections via API
- **THEN** Row-Level Security ensures only user's own credentials are returned

#### Scenario: Credential rotation
- **WHEN** user rotates broker API credentials
- **THEN** system updates encrypted `api_key` in `broker_connections` with timestamp logged

### Requirement: Broker Sync Status Tracking

The system SHALL track sync status (success/failed/pending) and last sync timestamp for each broker connection.

#### Scenario: Sync status after import
- **WHEN** broker sync completes successfully
- **THEN** system updates `broker_connections.last_sync_at` and `sync_status = 'success'`

#### Scenario: Sync failure logging
- **WHEN** broker API returns error during sync
- **THEN** system sets `sync_status = 'failed'` and logs error details for user troubleshooting

### Requirement: Trade Deduplication Logic

The system SHALL store `broker_trade_id` (UNIQUE constraint) to prevent duplicate imports of same trade.

#### Scenario: Duplicate trade rejected
- **WHEN** same trade imported twice with identical `broker_trade_id`
- **THEN** system rejects duplicate (UNIQUE constraint violation)

#### Scenario: Updated trade metadata
- **WHEN** user re-syncs and trade data changed (e.g., exit price updated)
- **THEN** system updates existing trade record instead of creating duplicate
