## ADDED Requirements

### Requirement: Daily P/L Aggregation

The system SHALL pre-compute daily P/L snapshots for heatmap rendering. Each day's snapshot includes closed trades P/L sum.

#### Scenario: Daily snapshot creation
- **WHEN** trading day ends (UTC midnight)
- **THEN** system creates `daily_snapshots` record with date, net P/L, trade count

#### Scenario: Heatmap data retrieval
- **WHEN** user opens dashboard heatmap
- **THEN** system queries `daily_snapshots` (fast single-row lookups, not 1000s of trades)

### Requirement: Metrics Pre-Computation

The system SHALL store pre-computed KPI snapshots daily to avoid expensive recalculations during UI load.

#### Scenario: Daily metrics snapshot
- **WHEN** daily snapshot created
- **THEN** system calculates 200+ KPIs and stores in `kpi_snapshots` linked to that day
