## ADDED Requirements

### Requirement: Whale Flow Detection (Phase 3)

The system SHALL store whale-level trading flow data correlated with user trades for institutional intelligence.

#### Scenario: Whale flow event logging
- **WHEN** whale flow detected on symbol
- **THEN** system creates `whale_events` record with flow direction (buy/sell) and correlated user trades

#### Scenario: Correlation analysis
- **WHEN** user views trade analysis
- **THEN** system shows if trade coincided with whale flow patterns
