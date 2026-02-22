## ADDED Requirements

### Requirement: Daily snapshots aggregate trade metrics
The system SHALL generate daily snapshots that aggregate P/L, win rate, and other metrics for the heatmap visualization.

#### Scenario: POST /snapshots triggers daily aggregation
- **WHEN** POST /snapshots with date parameter
- **THEN** system calculates daily P/L, win count, loss count, and stores in daily_snapshots table

#### Scenario: Snapshot includes date and account_id
- **WHEN** snapshot is generated
- **THEN** includes `date`, `account_id`, `user_id`, `pnl`, `win_count`, `loss_count`

#### Scenario: GET /snapshots returns paginated results
- **WHEN** GET /snapshots with optional date range
- **THEN** returns snapshots in descending date order (newest first)

### Requirement: KPI calculation computes metrics
The system SHALL calculate KPIs (Win Rate, Profit Factor, Expectancy, Sharpe Ratio, etc.) from trade data.

#### Scenario: Win Rate calculated correctly
- **WHEN** account has 10 trades (6 wins, 4 losses)
- **THEN** Win Rate = 60%

#### Scenario: Profit Factor calculated correctly
- **WHEN** account has Gross Profit = 1000, Gross Loss = 500
- **THEN** Profit Factor = 1000 / 500 = 2.0

#### Scenario: Expectancy calculated correctly
- **WHEN** account has Win Rate 60%, Avg Win 100, Loss Rate 40%, Avg Loss 50
- **THEN** Expectancy = (0.6 × 100) − (0.4 × 50) = 40 per trade

### Requirement: Heatmap data feeds visual calendar
The system SHALL return heatmap data (date × P/L color) for the GitHub-style visual calendar.

#### Scenario: Heatmap includes all trading days
- **WHEN** user requests heatmap data for a month
- **THEN** includes entries for every day user had trades (date, pnl_value, color_indicator)

#### Scenario: Heatmap color based on P/L
- **WHEN** a day has positive P/L
- **THEN** color is emerald (green); if negative, crimson (red); if zero/no trades, slate (gray)

#### Scenario: Heatmap includes 7×5 week grid
- **WHEN** heatmap is rendered
- **THEN** includes data structured as 7 days/week × 5 weeks (35 cells for month view)
