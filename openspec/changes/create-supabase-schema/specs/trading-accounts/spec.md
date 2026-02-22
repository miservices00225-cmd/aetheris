## ADDED Requirements

### Requirement: Multi-Account Management

The system SHALL support users managing multiple trading accounts (personal, prop firm, crypto). Each account SHALL have independent risk limits and sync status.

#### Scenario: User adds new account
- **WHEN** user adds a new trading account
- **THEN** system creates account record in `accounts` table with `user_id`, `broker_type`, and `risk_limits`

#### Scenario: Account selection
- **WHEN** user selects an account to view
- **THEN** all dashboard data (trades, metrics, risk) is filtered to that account only

#### Scenario: Account risk limits
- **WHEN** user configures max daily loss for an account
- **THEN** system stores limit in `accounts.max_loss_per_day` and enforces it during trade sync

### Requirement: Prop Firm Template Management

The system SHALL manage prop firm-specific constraints (MDL, trailing DD, etc.). Users SHALL be able to select prop firm templates during account creation.

#### Scenario: FTMO prop firm template
- **WHEN** user selects FTMO as prop firm for account
- **THEN** system applies FTMO constraints: max daily loss, trailing drawdown rules

#### Scenario: Custom risk limits
- **WHEN** user modifies prop firm rules for their account
- **THEN** system updates `accounts.prop_firm_rules` JSONB and applies new rules
