## ADDED Requirements

### Requirement: Emotion Logging

The system SHALL allow users to log trading biases (FOMO, REVENGE, OVERCONFIDENCE, etc.) for each trade to quantify emotional cost.

#### Scenario: Bias tag creation
- **WHEN** user marks trade with emotion tag
- **THEN** system creates `emotion_logs` record with emotion type and trade_id

#### Scenario: Financial cost attribution
- **WHEN** bias tagged trade closes
- **THEN** system calculates emotional_cost = actual_pnl - rational_pnl (for training)
