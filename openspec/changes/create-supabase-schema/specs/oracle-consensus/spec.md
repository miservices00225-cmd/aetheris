## ADDED Requirements

### Requirement: Oracle Pre-Trade Consensus (Phase 3)

The system SHALL store institutional intelligence scores (whale flows, COT data, shadow index) for pre-trade decision support.

#### Scenario: Oracle score calculation
- **WHEN** Oracle processes institutional data
- **THEN** system creates `oracle_scores` record with whale_flow_score, cot_score, shadow_index_score

#### Scenario: Pre-trade signal
- **WHEN** user considers trade entry
- **THEN** system displays Oracle consensus score (0-100) for decision support
