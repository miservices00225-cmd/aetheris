import { Result } from 'neverthrow';
import { RiskAggregate } from '../../../domain/risk';

/**
 * IRiskRepository — Port for persisting and retrieving RiskAggregate entities.
 * Implementations must prevent N+1 queries for multi-account scenarios.
 */
export interface IRiskRepository {
  /**
   * Find risk aggregate for a single account.
   * @param accountId Account ID
   * @returns RiskAggregate if found, null if not found
   */
  findByAccount(accountId: string): Promise<Result<RiskAggregate | null, Error>>;

  /**
   * Find risk aggregates for multiple accounts (batch query).
   * Must use SQL JOIN or similar to prevent N+1 queries.
   * @param accountIds Array of account IDs
   * @returns Array of RiskAggregate (only for accounts that exist)
   */
  findByAccounts(accountIds: string[]): Promise<Result<RiskAggregate[], Error>>;

  /**
   * Persist (insert or update) a RiskAggregate.
   * If aggregate.id exists, update; otherwise insert.
   * @param aggregate RiskAggregate to save
   * @returns void on success, Error on failure
   */
  save(aggregate: RiskAggregate): Promise<Result<void, Error>>;
}
