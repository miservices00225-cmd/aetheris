## ADDED Requirements

### Requirement: Armor Breach Event Logging

The system SHALL log Armor breach events (soft/hard) with timestamps for dispute prevention and coaching.

#### Scenario: Soft breach logging
- **WHEN** account drawdown reaches 50% of MDL
- **THEN** system creates `armor_breaches` record with `breach_type = 'soft'` and timestamp

#### Scenario: Hard breach logging
- **WHEN** account hits 100% drawdown limit
- **THEN** system creates `armor_breaches` record with `breach_type = 'hard'` and triggers webhook/email
