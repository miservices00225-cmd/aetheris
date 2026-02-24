import { PropFirmThreshold, RuleViolation, RuleWarning, ValidationResult } from '../../../domain/risk';

/**
 * AccountRiskSummary — DTO for a single account's risk state in consolidated view.
 * Serializable to JSON for API responses.
 */
export interface AccountRiskSummary {
  account_id: string;
  broker_name: string;
  current_drawdown: number; // percentage (0–100)
  max_drawdown: number; // percentage (0–100)
  daily_loss_percent: number; // percentage (0–100)
  balance_current: number; // absolute value in account currency
  prop_firm_threshold: PropFirmThreshold | null; // null if no prop firm configured
  validation: ValidationResult; // violations and warnings
}

/**
 * ConsolidatedRisk — DTO for multi-account risk aggregation response.
 * Used by API endpoint GET /api/v1/risk/aggregated
 */
export interface ConsolidatedRisk {
  accounts: AccountRiskSummary[];
  weighted_drawdown: number; // percentage (0–100), weighted by account balance
  total_balance: number; // sum of all account balances
  accounts_in_danger: number; // count of accounts where isInDangerZone() = true
  accounts_violated: number; // count of accounts where isViolated() = true
  timestamp: string; // ISO 8601 timestamp of calculation
}

/**
 * AggregateRiskCommand — Input for AggregateAccountRisk use case.
 */
export interface AggregateRiskCommand {
  accountIds: string[];
  userId: string; // authenticated user ID for authorization check
}

/**
 * Serialized versions for JSON transport (remove class instances, keep primitives)
 */
export interface AccountRiskSummaryDTO extends Omit<AccountRiskSummary, 'prop_firm_threshold' | 'validation'> {
  prop_firm_threshold: {
    firm_name: string;
    max_daily_loss_percent: number;
    max_trailing_drawdown_percent: number;
  } | null;
  validation: {
    isValid: boolean;
    violations: RuleViolation[];
    warnings: RuleWarning[];
  };
}

export interface ConsolidatedRiskDTO extends Omit<ConsolidatedRisk, 'accounts'> {
  accounts: AccountRiskSummaryDTO[];
}
