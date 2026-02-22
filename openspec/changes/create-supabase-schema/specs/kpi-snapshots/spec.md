## ADDED Requirements

### Requirement: KPI Snapshot Storage

The system SHALL store 200+ pre-computed metrics (Expectancy, Profit Factor, Sharpe, Kelly, MFE/MAE, Drawdown, etc.) with daily snapshots.

#### Scenario: KPI snapshot calculation
- **WHEN** daily snapshot created
- **THEN** system calculates all 200+ KPIs and stores in `kpi_snapshots` table

#### Scenario: KPI historical retrieval
- **WHEN** user views metrics dashboard
- **THEN** system queries `kpi_snapshots` for selected date range
