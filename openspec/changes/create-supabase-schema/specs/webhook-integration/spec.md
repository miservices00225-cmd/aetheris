## ADDED Requirements

### Requirement: Webhook Event Storage

The system SHALL store Armor breach events and other critical events for delivery to user-defined webhooks with retry logic.

#### Scenario: Webhook event creation
- **WHEN** Armor Level 3 breach triggered
- **THEN** system creates `webhook_events` record with payload, webhook URL, `status = 'pending'`

#### Scenario: Webhook retry logic
- **WHEN** webhook delivery fails
- **THEN** system increments `retry_count` and schedules next retry with exponential backoff

#### Scenario: Webhook delivery success
- **WHEN** user webhook receives event successfully
- **THEN** system marks `webhook_events.status = 'success'`
