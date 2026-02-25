/**
 * RiskRepositoryAdapter — PostgreSQL Implementation
 * Implements IRiskRepository for M3 risk aggregation.
 * Calculates RiskAggregate from account balances.
 */

import { Result, ok, err } from 'neverthrow';
import { Pool } from 'pg';
import { IRiskRepository } from '../../../application/ports/risk/IRiskRepository';
import { RiskAggregate, PropFirmThreshold } from '../../../domain/risk';

/**
 * Database connection pool (singleton)
 */
let pool: Pool | null = null;

export function setDatabasePool(dbPool: Pool): void {
  pool = dbPool;
}

export class RiskRepositoryAdapter implements IRiskRepository {
  constructor(private dbPool: Pool = pool!) {}

  /**
   * Find RiskAggregate for a single account.
   * Calculates current drawdown from account balance changes.
   */
  async findByAccount(accountId: string): Promise<Result<RiskAggregate | null, Error>> {
    try {
      const query = `
        SELECT id, user_id, broker, balance, max_balance, currency,
               prop_firm_max_drawdown, prop_firm_trailing_dd
        FROM accounts
        WHERE id = $1
      `;
      const result = await this.dbPool.query(query, [accountId]);

      if (result.rows.length === 0) {
        return ok(null);
      }

      const aggregate = this.rowToRiskAggregate(result.rows[0]);
      return ok(aggregate);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Find RiskAggregates for multiple accounts (batch query).
   * Prevents N+1 by using a single SELECT with IN clause.
   */
  async findByAccounts(accountIds: string[]): Promise<Result<RiskAggregate[], Error>> {
    try {
      if (accountIds.length === 0) {
        return ok([]);
      }

      // Build parameterized query with placeholders
      const placeholders = accountIds.map((_, i) => `$${i + 1}`).join(',');
      const query = `
        SELECT id, user_id, broker, balance, max_balance, currency,
               prop_firm_max_drawdown, prop_firm_trailing_dd
        FROM accounts
        WHERE id IN (${placeholders})
      `;
      
      const result = await this.dbPool.query(query, accountIds);
      const aggregates = result.rows.map((row) => this.rowToRiskAggregate(row));
      return ok(aggregates);
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Save (persist) a RiskAggregate.
   * Note: Currently a no-op because RiskAggregate is calculated on-the-fly
   * from account balances. Could be extended to persist snapshots if needed.
   */
  async save(): Promise<Result<void, Error>> {
    // No-op: Risk is calculated on-the-fly from account state
    // Future: Could persist to a risk_snapshots table for archival/audit
    return ok(void 0);
  }

  /**
   * Convert account row to RiskAggregate.
   * Calculates drawdown as percentage of balance loss.
   */
  private rowToRiskAggregate(row: Record<string, any>): RiskAggregate {
    const currentBalance = parseFloat(row.balance);
    const maxBalance = parseFloat(row.max_balance);

    // Current drawdown: (maxBalance - currentBalance) / maxBalance × 100
    const currentDrawdown = maxBalance > 0 ? ((maxBalance - currentBalance) / maxBalance) * 100 : 0;
    // Max drawdown from max observed balance (same as current for simplicity)
    const maxDrawdown = currentDrawdown;

    // Build prop firm threshold if configured
    let propFirmThreshold: ReturnType<typeof PropFirmThreshold.create> | null = null;
    if (row.prop_firm_max_drawdown || row.prop_firm_trailing_dd) {
      propFirmThreshold = PropFirmThreshold.create({
        firm_name: row.broker || 'Unknown',
        max_daily_loss_percent: row.prop_firm_max_drawdown || 5,
        max_trailing_drawdown_percent: row.prop_firm_trailing_dd || 10,
      });
    }

    // Create aggregate
    const aggregate = new RiskAggregate({
      account_id: row.id,
      current_drawdown: Math.min(currentDrawdown, 100),
      max_drawdown: Math.min(maxDrawdown, 100),
      prop_firm_threshold: propFirmThreshold,
      balance_start_of_day: maxBalance,
      balance_current: currentBalance,
    });

    return aggregate;
  }
}

