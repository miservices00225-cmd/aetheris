## ADDED Requirements

### Requirement: Individual Trade Record Storage

The system SHALL store each executed trade with entry/exit details, fees, slippage, and P/L calculation. All trades SHALL be linked to user accounts via RLS.

#### Scenario: Trade entry creation
- **WHEN** trade synced from broker
- **THEN** system creates `trades` record with `entry_price`, `entry_time`, `symbol`, `quantity`, `broker_trade_id`

#### Scenario: Trade exit update
- **WHEN** trade closes on broker
- **THEN** system updates `trades.exit_price`, `exit_time`, `realized_pnl` on same record

#### Scenario: Trade fee and slippage calculation
- **WHEN** trade is finalized
- **THEN** system calculates `pnl_after_fees = gross_pnl - broker_fee - entry_slippage - exit_slippage`

### Requirement: Trade Risk Metrics

The system SHALL calculate MFE (Max Favorable Excursion) and MAE (Max Adverse Excursion) for each trade to measure execution quality.

#### Scenario: MFE calculation
- **WHEN** trade closes
- **THEN** system calculates `mfe = (highest_price_during_trade - entry_price) / entry_price * 100`

#### Scenario: MAE calculation
- **WHEN** trade closes
- **THEN** system calculates `mae = (lowest_price_during_trade - entry_price) / entry_price * 100`

### Requirement: Trade Duration Tracking

The system SHALL record trade duration for analysis of holding period distribution and bias patterns.

#### Scenario: Trade duration calculation
- **WHEN** trade closes
- **THEN** system stores `duration_seconds = exit_time - entry_time`
