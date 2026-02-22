## ADDED Requirements

### Requirement: Trading Session Tracking

The system SHALL track individual trading sessions (start time, end time, trades count, session P/L, tilt flags) for discipline analysis.

#### Scenario: Session creation
- **WHEN** user opens first trade of day
- **THEN** system creates `sessions` record with `session_start`, linked to account

#### Scenario: Session closure
- **WHEN** user closes final trade of session
- **THEN** system calculates `session_pnl`, `trades_count`, updates `session_end`

#### Scenario: Tilt detection
- **WHEN** session shows signs of tilt (revenge trading, escalating size)
- **THEN** system sets `tilt_flag = true` for coaching/review
