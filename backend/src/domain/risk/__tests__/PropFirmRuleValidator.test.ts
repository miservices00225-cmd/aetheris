/**
 * PropFirmRuleValidator Unit Tests
 * Tests validation logic: WARNING (80%), CRITICAL (90%), VIOLATED (100%+)
 */

import {
  PropFirmRuleValidator,
  RiskAggregate,
  PropFirmThreshold,
  ValidationResult,
} from '../index';

describe('PropFirmRuleValidator', () => {
  const validator = new PropFirmRuleValidator();

  const defaultThreshold = PropFirmThreshold.create({
    firm_name: 'FTMO',
    max_daily_loss_percent: 5,
    max_trailing_drawdown_percent: 10,
  });

  describe('validate() — No Threshold', () => {
    it('should always be valid when no prop_firm_threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 50, // Even extreme values
        max_drawdown: 100,
        prop_firm_threshold: null,
        balance_start_of_day: 10000,
        balance_current: 5000,
      });

      const result = validator.validate(aggregate);

      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('validate() — Safe Zone (< 80%)', () => {
    it('should have no violations or warnings when below 80% proximity', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 3.0, // 60% of 5% MDL threshold
        max_drawdown: 7.0, // 70% of 10% Trailing threshold
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('validate() — WARNING Zone (80%–89%)', () => {
    it('should emit WARNING at exactly 80% of MDL threshold', () => {
      // 80% of 5% = 4.0%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.warnings).toHaveLength(1);

      const warning = result.warnings[0];
      expect(warning.rule).toBe('MDL');
      expect(warning.severity).toBe('WARNING');
      expect(warning.proximity_percent).toBeGreaterThanOrEqual(80);
      expect(warning.proximity_percent).toBeLessThan(90);
    });

    it('should emit WARNING at 85% of MDL threshold', () => {
      // 85% of 5% = 4.25%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.25,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].severity).toBe('WARNING');
    });

    it('should emit WARNING on Trailing DD threshold at 80%', () => {
      // 80% of 10% = 8.0%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 2.0,
        max_drawdown: 8.0,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].rule).toBe('TRAILING_DD');
      expect(result.warnings[0].severity).toBe('WARNING');
    });
  });

  describe('validate() — CRITICAL Zone (90%–99%)', () => {
    it('should emit CRITICAL at exactly 90% of MDL threshold', () => {
      // 90% of 5% = 4.5%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.5,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.warnings).toHaveLength(1);

      const warning = result.warnings[0];
      expect(warning.rule).toBe('MDL');
      expect(warning.severity).toBe('CRITICAL');
      expect(warning.proximity_percent).toBeGreaterThanOrEqual(90);
      expect(warning.proximity_percent).toBeLessThan(100);
    });

    it('should emit CRITICAL at 95% of threshold', () => {
      // 95% of 5% = 4.75%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.75,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].severity).toBe('CRITICAL');
    });

    it('should emit CRITICAL on Trailing DD at 90%', () => {
      // 90% of 10% = 9.0%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 1.0,
        max_drawdown: 9.0,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].rule).toBe('TRAILING_DD');
      expect(result.warnings[0].severity).toBe('CRITICAL');
    });
  });

  describe('validate() — VIOLATED Zone (≥ 100%)', () => {
    it('should emit VIOLATED at exactly 100% of MDL threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 5.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.isValid).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.warnings).toHaveLength(0);

      const violation = result.violations[0];
      expect(violation.rule).toBe('MDL');
      expect(violation.severity).toBe('VIOLATED');
      expect(violation.percentage).toBeGreaterThanOrEqual(100);
    });

    it('should emit VIOLATED at 100.1% of threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 5.005,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.isValid).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].severity).toBe('VIOLATED');
    });

    it('should emit VIOLATED on Trailing DD at 100%', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 2.0,
        max_drawdown: 10.0,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.isValid).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].rule).toBe('TRAILING_DD');
    });

    it('should emit multiple violations if both rules are violated', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 5.5, // Over 5% MDL
        max_drawdown: 10.5, // Over 10% Trailing
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result = validator.validate(aggregate);

      expect(result.isValid).toBe(false);
      expect(result.violations).toHaveLength(2);

      const rules = result.violations.map((v) => v.rule);
      expect(rules).toContain('MDL');
      expect(rules).toContain('TRAILING_DD');
    });
  });

  describe('Boundary Testing — Exact Transitions', () => {
    it('should transition 79%→80% from safe to WARNING', () => {
      // 79% = 3.95%
      const aggregate79 = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 3.95,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result79 = validator.validate(aggregate79);
      expect(result79.warnings).toHaveLength(0);

      // 80% = 4.0%
      const aggregate80 = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result80 = validator.validate(aggregate80);
      expect(result80.warnings).toHaveLength(1);
    });

    it('should transition 89%→90% from WARNING to CRITICAL', () => {
      // 89% = 4.45%
      const aggregate89 = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.45,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result89 = validator.validate(aggregate89);
      expect(result89.warnings[0]?.severity).toBe('WARNING');

      // 90% = 4.5%
      const aggregate90 = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.5,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result90 = validator.validate(aggregate90);
      expect(result90.warnings[0]?.severity).toBe('CRITICAL');
    });

    it('should transition 99%→100% from CRITICAL to VIOLATED', () => {
      // 99% = 4.95%
      const aggregate99 = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.95,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result99 = validator.validate(aggregate99);
      expect(result99.violations).toHaveLength(0);
      expect(result99.warnings[0]?.severity).toBe('CRITICAL');

      // 100% = 5.0%
      const aggregate100 = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 5.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      const result100 = validator.validate(aggregate100);
      expect(result100.violations).toHaveLength(1);
      expect(result100.warnings).toHaveLength(0);
    });
  });

  describe('getOverallSeverity()', () => {
    it('should return OK when no violations or warnings', () => {
      const result: ValidationResult = {
        isValid: true,
        violations: [],
        warnings: [],
      };

      expect(validator.getOverallSeverity(result)).toBe('OK');
    });

    it('should return WARNING when only warnings exist', () => {
      const result: ValidationResult = {
        isValid: true,
        violations: [],
        warnings: [
          {
            rule: 'MDL',
            threshold: 5,
            current: 4.0,
            severity: 'WARNING',
            proximity_percent: 80,
          },
        ],
      };

      expect(validator.getOverallSeverity(result)).toBe('WARNING');
    });

    it('should return CRITICAL when any warning is CRITICAL', () => {
      const result: ValidationResult = {
        isValid: true,
        violations: [],
        warnings: [
          {
            rule: 'MDL',
            threshold: 5,
            current: 4.5,
            severity: 'CRITICAL',
            proximity_percent: 90,
          },
        ],
      };

      expect(validator.getOverallSeverity(result)).toBe('CRITICAL');
    });

    it('should return VIOLATED when any violations exist', () => {
      const result: ValidationResult = {
        isValid: false,
        violations: [
          {
            rule: 'MDL',
            threshold: 5,
            current: 5.1,
            severity: 'VIOLATED',
            percentage: 102,
          },
        ],
        warnings: [],
      };

      expect(validator.getOverallSeverity(result)).toBe('VIOLATED');
    });
  });

  describe('format()', () => {
    it('should format validation result for logging', () => {
      const result: ValidationResult = {
        isValid: false,
        violations: [
          {
            rule: 'MDL',
            threshold: 5,
            current: 5.1,
            severity: 'VIOLATED',
            percentage: 102,
          },
        ],
        warnings: [
          {
            rule: 'TRAILING_DD',
            threshold: 10,
            current: 9.0,
            severity: 'WARNING',
            proximity_percent: 90,
          },
        ],
      };

      const formatted = validator.format(result);

      expect(formatted).toContain('VIOLATIONS');
      expect(formatted).toContain('MDL');
      expect(formatted).toContain('WARNINGS');
      expect(formatted).toContain('TRAILING_DD');
    });

    it('should format OK state', () => {
      const result: ValidationResult = {
        isValid: true,
        violations: [],
        warnings: [],
      };

      const formatted = validator.format(result);

      expect(formatted).toBe('Status: OK');
    });
  });
});
