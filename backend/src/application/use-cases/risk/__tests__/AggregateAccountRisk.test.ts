import { AggregateAccountRisk, IAccountRepository } from '../AggregateAccountRisk.usecase';
import { IRiskRepository } from '../../../ports/risk/IRiskRepository';
import { PropFirmRuleValidator, RiskAggregate, PropFirmThreshold } from '../../../../domain/risk';
import { NoOpLogger } from '../../../../shared/logger';
import { ok, err } from 'neverthrow';

/**
 * Test suite for AggregateAccountRisk use case.
 * Tests multi-account risk aggregation, weighted drawdown calculation, and authorization.
 */
describe('AggregateAccountRisk Use Case', () => {
  let useCase: AggregateAccountRisk;
  let riskRepository: IRiskRepository;
  let accountRepository: IAccountRepository;
  let validator: PropFirmRuleValidator;
  let logger = new NoOpLogger();

  beforeEach(() => {
    // Create in-memory fake repositories
    riskRepository = createFakeRiskRepository();
    accountRepository = createFakeAccountRepository();
    validator = new PropFirmRuleValidator();
    useCase = new AggregateAccountRisk(riskRepository, accountRepository, validator, logger);
  });

  describe('execute', () => {
    it('should aggregate risk for a single account', async () => {
      const result = await useCase.execute({
        accountIds: ['account-1'],
        userId: 'user-1',
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const consolidated = result.value;
        expect(consolidated.accounts.length).toBe(1);
        expect(consolidated.accounts[0].account_id).toBe('account-1');
        expect(consolidated.weighted_drawdown).toBeGreaterThanOrEqual(0);
        expect(consolidated.total_balance).toBeGreaterThan(0);
      }
    });

    it('should calculate weighted drawdown correctly for multiple accounts', async () => {
      const result = await useCase.execute({
        accountIds: ['account-1', 'account-2'],
        userId: 'user-1',
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const consolidated = result.value;
        expect(consolidated.accounts.length).toBe(2);
        // Weighted drawdown = (5 * 1000 + 10 * 1000) / (1000 + 1000) = 7.5
        expect(consolidated.weighted_drawdown).toBe(7.5);
        expect(consolidated.total_balance).toBe(2000);
      }
    });

    it('should count accounts in danger zone', async () => {
      const result = await useCase.execute({
        accountIds: ['account-1', 'account-3'], // account-3 is in danger zone
        userId: 'user-1',
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const consolidated = result.value;
        expect(consolidated.accounts_in_danger).toBeGreaterThanOrEqual(1);
      }
    });

    it('should count accounts with rule violations', async () => {
      const result = await useCase.execute({
        accountIds: ['account-4'], // account-4 is violated
        userId: 'user-1',
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const consolidated = result.value;
        expect(consolidated.accounts_violated).toBeGreaterThanOrEqual(1);
      }
    });

    it('should return 403-equivalent error if account does not belong to user', async () => {
      const result = await useCase.execute({
        accountIds: ['account-1'],
        userId: 'user-999', // Different user
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('Unauthorized');
      }
    });

    it('should return error if repository fails', async () => {
      // Simulate repository failure
      const failingRepository: IRiskRepository = {
        findByAccount: () => err(new Error('DB error')),
        findByAccounts: () => err(new Error('DB error')),
        save: () => err(new Error('DB error')),
      };

      const useCase2 = new AggregateAccountRisk(failingRepository, accountRepository, validator, logger);

      const result = await useCase2.execute({
        accountIds: ['account-1'],
        userId: 'user-1',
      });

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('DB error');
      }
    });

    it('should include validation results for each account', async () => {
      const result = await useCase.execute({
        accountIds: ['account-1'],
        userId: 'user-1',
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const summary = result.value.accounts[0];
        expect(summary.validation).toBeDefined();
        expect(typeof summary.validation.isValid).toBe('boolean');
        expect(Array.isArray(summary.validation.violations)).toBe(true);
        expect(Array.isArray(summary.validation.warnings)).toBe(true);
      }
    });

    it('should include prop firm threshold in summary', async () => {
      const result = await useCase.execute({
        accountIds: ['account-1'],
        userId: 'user-1',
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const summary = result.value.accounts[0];
        expect(summary.prop_firm_threshold).toBeDefined();
        if (summary.prop_firm_threshold) {
          expect(summary.prop_firm_threshold.firm_name).toBeDefined();
        }
      }
    });

    it('should include timestamp in response', async () => {
      const result = await useCase.execute({
        accountIds: ['account-1'],
        userId: 'user-1',
      });

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.timestamp).toBeDefined();
        expect(new Date(result.value.timestamp).getTime()).toBeGreaterThan(0);
      }
    });
  });
});

// ===== FAKE IMPLEMENTATIONS =====

function createFakeRiskRepository(): IRiskRepository {
  const data = {
    'account-1': new RiskAggregate({
      account_id: 'account-1',
      current_drawdown: 5,
      max_drawdown: 5,
      prop_firm_threshold: PropFirmThreshold.create({
        firm_name: 'FTMO',
        max_daily_loss_percent: 5,
        max_trailing_drawdown_percent: 10,
      }),
      balance_start_of_day: 1000,
      balance_current: 950,
    }),
    'account-2': new RiskAggregate({
      account_id: 'account-2',
      current_drawdown: 10,
      max_drawdown: 10,
      prop_firm_threshold: PropFirmThreshold.create({
        firm_name: 'MyForexFunds',
        max_daily_loss_percent: 5,
        max_trailing_drawdown_percent: 10,
      }),
      balance_start_of_day: 1000,
      balance_current: 900,
    }),
    'account-3': new RiskAggregate({
      account_id: 'account-3',
      current_drawdown: 4.5, // 90% of 5% threshold
      max_drawdown: 4.5,
      prop_firm_threshold: PropFirmThreshold.create({
        firm_name: 'FTMO',
        max_daily_loss_percent: 5,
        max_trailing_drawdown_percent: 10,
      }),
      balance_start_of_day: 1000,
      balance_current: 955,
    }),
    'account-4': new RiskAggregate({
      account_id: 'account-4',
      current_drawdown: 6, // 120% of 5% threshold = VIOLATED
      max_drawdown: 6,
      prop_firm_threshold: PropFirmThreshold.create({
        firm_name: 'FTMO',
        max_daily_loss_percent: 5,
        max_trailing_drawdown_percent: 10,
      }),
      balance_start_of_day: 1000,
      balance_current: 940,
    }),
  };

  return {
    findByAccount: async (accountId: string) => {
      return ok(data[accountId as keyof typeof data] || null);
    },
    findByAccounts: async (accountIds: string[]) => {
      return ok(accountIds.map((id) => data[id as keyof typeof data]).filter(Boolean));
    },
    save: async () => ok(void 0),
  };
}

function createFakeAccountRepository(): IAccountRepository {
  const data = {
    'account-1': { id: 'account-1', user_id: 'user-1', broker_name: 'MetaTrader 4' },
    'account-2': { id: 'account-2', user_id: 'user-1', broker_name: 'cTrader' },
    'account-3': { id: 'account-3', user_id: 'user-1', broker_name: 'MetaTrader 4' },
    'account-4': { id: 'account-4', user_id: 'user-1', broker_name: 'Interactive Brokers' },
  };

  return {
    findById: async (accountId: string) => {
      return ok(data[accountId as keyof typeof data] || null);
    },
  };
}
