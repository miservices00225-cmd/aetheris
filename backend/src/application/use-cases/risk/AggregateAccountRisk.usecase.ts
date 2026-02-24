import { Result, ok, err } from 'neverthrow';
import { Logger } from '../../../shared/logger';
import { IRiskRepository } from '../../ports/risk/IRiskRepository';
import {
  AggregateRiskCommand,
  ConsolidatedRisk,
  AccountRiskSummary,
} from '../../dtos/risk';
import { PropFirmRuleValidator } from '../../../domain/risk';

/**
 * IAccountRepository — Port for retrieving account data.
 * Used to verify account ownership (authorization) and fetch broker info.
 */
export interface IAccountRepository {
  findById(accountId: string): Promise<Result<{ id: string; user_id: string; broker_name: string } | null, Error>>;
}

/**
 * AggregateAccountRisk — Use case for consolidating multi-account risk.
 *
 * Flow:
 * 1. Verify all accountIds belong to userId (authorization check)
 * 2. Load RiskAggregate for each account (batch query)
 * 3. Validate each aggregate against prop firm rules
 * 4. Calculate weighted drawdown (drawdown × balance) / sum(balances)
 * 5. Count accounts in danger/violated
 * 6. Return ConsolidatedRisk DTO
 */
export class AggregateAccountRisk {
  constructor(
    private readonly riskRepository: IRiskRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly validator: PropFirmRuleValidator,
    private readonly logger: Logger,
  ) {}

  async execute(command: AggregateRiskCommand): Promise<Result<ConsolidatedRisk, Error>> {
    try {
      const { accountIds, userId } = command;

      this.logger.info('AggregateAccountRisk', {
        userId,
        accountCount: accountIds.length,
      });

      // Step 1: Verify account ownership for all accountIds
      const authorizationResult = await this.verifyAccountOwnership(accountIds, userId);
      if (authorizationResult.isErr()) {
        return err(authorizationResult.error);
      }

      const accountMetadata = authorizationResult.value;

      // Step 2: Load RiskAggregate for all accounts (batch query)
      const aggregatesResult = await this.riskRepository.findByAccounts(accountIds);
      if (aggregatesResult.isErr()) {
        this.logger.error('Failed to load risk aggregates', aggregatesResult.error);
        return err(aggregatesResult.error);
      }

      const aggregates = aggregatesResult.value;

      // Step 3: Validate and build AccountRiskSummary for each
      const accountSummaries: AccountRiskSummary[] = [];
      let accountsInDanger = 0;
      let accountsViolated = 0;
      let totalBalance = 0;
      let weightedDrawdownSum = 0;

      for (const aggregate of aggregates) {
        const metadata = accountMetadata[aggregate.getAccountId()];
        if (!metadata) {
          this.logger.warn('Account metadata not found', {
            accountId: aggregate.getAccountId(),
          });
          continue;
        }

        // Validate rules
        const validation = this.validator.validate(aggregate);

        // Build summary
        const summary: AccountRiskSummary = {
          account_id: aggregate.getAccountId(),
          broker_name: metadata.broker_name,
          current_drawdown: aggregate.getCurrentDrawdown().value,
          max_drawdown: aggregate.getMaxDrawdown().value,
          daily_loss_percent: aggregate.dailyLossPercent().value,
          balance_current: aggregate.getBalanceCurrent(),
          prop_firm_threshold: aggregate.getPropFirmThreshold(),
          validation,
        };

        accountSummaries.push(summary);
        totalBalance += aggregate.getBalanceCurrent();
        weightedDrawdownSum += aggregate.getCurrentDrawdown().value * aggregate.getBalanceCurrent();

        // Track danger/violation status
        if (aggregate.isViolated()) {
          accountsViolated++;
        } else if (aggregate.isInDangerZone()) {
          accountsInDanger++;
        }
      }

      // Step 4: Calculate weighted drawdown
      const weightedDrawdown = totalBalance > 0 ? weightedDrawdownSum / totalBalance : 0;

      // Step 5: Build consolidated response
      const consolidated: ConsolidatedRisk = {
        accounts: accountSummaries,
        weighted_drawdown: Math.round(weightedDrawdown * 100) / 100, // Round to 2 decimals
        total_balance: totalBalance,
        accounts_in_danger: accountsInDanger,
        accounts_violated: accountsViolated,
        timestamp: new Date().toISOString(),
      };

      this.logger.info('AggregateAccountRisk completed', {
        accountCount: accountSummaries.length,
        weightedDrawdown: consolidated.weighted_drawdown,
        accountsViolated,
        accountsInDanger,
      });

      return ok(consolidated);
    } catch (error) {
      const err_obj = error instanceof Error ? error : new Error(String(error));
      this.logger.error('AggregateAccountRisk failed', err_obj);
      return err(err_obj);
    }
  }

  /**
   * Verify all accountIds belong to authenticated userId.
   * Returns map of accountId → metadata if authorized.
   * Throws if any account doesn't belong to user.
   */
  private async verifyAccountOwnership(
    accountIds: string[],
    userId: string,
  ): Promise<
    Result<
      Record<string, { broker_name: string }>,
      Error
    >
  > {
    const metadata: Record<string, { broker_name: string }> = {};

    for (const accountId of accountIds) {
      const accountResult = await this.accountRepository.findById(accountId);

      if (accountResult.isErr()) {
        return err(accountResult.error);
      }

      const account = accountResult.value;
      if (!account) {
        // Don't reveal if account doesn't exist (security)
        return err(new Error('Unauthorized'));
      }

      if (account.user_id !== userId) {
        // Account belongs to different user (security)
        return err(new Error('Unauthorized'));
      }

      metadata[accountId] = {
        broker_name: account.broker_name,
      };
    }

    return ok(metadata);
  }
}
