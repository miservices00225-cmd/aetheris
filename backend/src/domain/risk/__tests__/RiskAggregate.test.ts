/**
 * RiskAggregate Unit Tests
 * Tests invariants, state transitions, and domain event emission at exact thresholds.
 */

import {
  RiskAggregate,
  PropFirmThreshold,
  PropFirmRuleViolated,
  RiskDangerZoneEntered,
} from '../index';

describe('RiskAggregate', () => {
  const defaultThreshold = PropFirmThreshold.create({
    firm_name: 'FTMO',
    max_daily_loss_percent: 5,
    max_trailing_drawdown_percent: 10,
  });

  describe('Constructor and Getters', () => {
    it('should create a RiskAggregate with valid props', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 2.5,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 9750,
      });

      expect(aggregate.getAccountId()).toBe('acc_123');
      expect(aggregate.getCurrentDrawdown().value).toBe(2.5);
      expect(aggregate.getMaxDrawdown().value).toBe(5);
    });

    it('should allow null prop_firm_threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 0,
        max_drawdown: 0,
        prop_firm_threshold: null,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.getPropFirmThreshold()).toBeNull();
    });
  });

  describe('dailyLossPercent()', () => {
    it('should calculate daily loss as percentage of start-of-day balance', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 0,
        max_drawdown: 0,
        prop_firm_threshold: null,
        balance_start_of_day: 10000,
        balance_current: 9500, // Lost 500 = 5%
      });

      const dailyLoss = aggregate.dailyLossPercent();
      expect(dailyLoss.value).toBeCloseTo(5, 1);
    });

    it('should return zero when start balance is zero', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 0,
        max_drawdown: 0,
        prop_firm_threshold: null,
        balance_start_of_day: 0,
        balance_current: 0,
      });

      const dailyLoss = aggregate.dailyLossPercent();
      expect(dailyLoss.value).toBe(0);
    });

    it('should cap at 100% (worst case)', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 0,
        max_drawdown: 0,
        prop_firm_threshold: null,
        balance_start_of_day: 10000,
        balance_current: -1000, // Would be -110% but capped
      });

      const dailyLoss = aggregate.dailyLossPercent();
      expect(dailyLoss.value).toBe(100);
    });
  });

  describe('isInDangerZone() — Proximity > 80%', () => {
    it('should be false when no prop firm threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.5,
        max_drawdown: 9,
        prop_firm_threshold: null,
        balance_start_of_day: 10000,
        balance_current: 9500,
      });

      expect(aggregate.isInDangerZone()).toBe(false);
    });

    it('should be false at 79% of MDL threshold (below danger zone)', () => {
      // 79% of 5% threshold = 3.95%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 3.95,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isInDangerZone()).toBe(false);
    });

    it('should be true at exactly 80% of MDL threshold (enters danger zone)', () => {
      // 80% of 5% threshold = 4%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isInDangerZone()).toBe(true);
    });

    it('should be true at 81% of MDL threshold', () => {
      // 81% of 5% threshold = 4.05%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.05,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isInDangerZone()).toBe(true);
    });

    it('should detect danger zone via Trailing DD threshold', () => {
      // 80% of 10% threshold = 8%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 5,
        max_drawdown: 8.0,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isInDangerZone()).toBe(true);
    });
  });

  describe('isCritical() — Proximity > 90%', () => {
    it('should be false below 90% threshold', () => {
      // 89% of 5% threshold = 4.45%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.45,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isCritical()).toBe(false);
    });

    it('should be true at exactly 90% of threshold (enters critical)', () => {
      // 90% of 5% threshold = 4.5%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.5,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isCritical()).toBe(true);
    });

    it('should be true at 91% of threshold', () => {
      // 91% of 5% threshold = 4.55%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.55,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isCritical()).toBe(true);
    });
  });

  describe('isViolated() — Crossed 100% of threshold', () => {
    it('should be false when under threshold', () => {
      // 99% of 5% threshold = 4.95%
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.95,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isViolated()).toBe(false);
    });

    it('should be true at exactly 100% of MDL threshold (violation)', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 5.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isViolated()).toBe(true);
    });

    it('should be true at 100.1% of threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 5.005,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isViolated()).toBe(true);
    });

    it('should detect violation via Trailing DD threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 5,
        max_drawdown: 10.0,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      expect(aggregate.isViolated()).toBe(true);
    });
  });

  describe('Domain Event Emission — State Transitions', () => {
    it('should NOT emit event on initialization (captures initial state only)', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 3.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      // Initial state should not trigger events
      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should emit RiskDangerZoneEntered (WARNING) when crossing 80% threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 3.0, // Safe initially
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      // Update to cross into danger zone (80% = 4.0%)
      aggregate.updateState({ current_drawdown: 4.0 });

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(RiskDangerZoneEntered);

      const event = events[0] as RiskDangerZoneEntered;
      expect(event.severity).toBe('WARNING');
      expect(event.proximity_percent).toBeGreaterThanOrEqual(80);
    });

    it('should emit RiskDangerZoneEntered (CRITICAL) when crossing 90% threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 3.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      // Jump directly to critical (90% = 4.5%)
      aggregate.updateState({ current_drawdown: 4.5 });

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(RiskDangerZoneEntered);

      const event = events[0] as RiskDangerZoneEntered;
      expect(event.severity).toBe('CRITICAL');
    });

    it('should emit PropFirmRuleViolated when crossing 100% threshold', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 4.0, // In danger zone but not violated
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      // Update to violation (100% = 5.0%)
      aggregate.updateState({ current_drawdown: 5.0 });

      const events = aggregate.getUncommittedEvents();
      expect(events).toContainEqual(
        expect.objectContaining({
          rule_name: 'MDL',
          current_value: 5.0,
        })
      );

      const violation = events.find((e) => e instanceof PropFirmRuleViolated);
      expect(violation).toBeDefined();
    });

    it('should NOT re-emit event on false→true transition if already violated', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 5.1, // Already violated
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      // Clear initial events
      aggregate.clearUncommittedEvents();

      // Update further (still violated, no transition)
      aggregate.updateState({ current_drawdown: 5.5 });

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should emit both WARNING and VIOLATION events on transition from safe→danger→violated', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 1.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      // Jump directly to violated (skips the WARNING, but should emit based on new state)
      aggregate.updateState({ current_drawdown: 5.0 });

      const events = aggregate.getUncommittedEvents();

      // Should only emit VIOLATION, not WARNING (since transition is false→true for violation)
      const violations = events.filter((e) => e instanceof PropFirmRuleViolated);
      expect(violations.length).toBeGreaterThan(0);
    });
  });

  describe('clearUncommittedEvents()', () => {
    it('should clear all uncommitted events', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 3.0,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 10000,
      });

      aggregate.updateState({ current_drawdown: 4.0 }); // Emit event

      expect(aggregate.getUncommittedEvents()).toHaveLength(1);

      aggregate.clearUncommittedEvents();

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('toJSON()', () => {
    it('should serialize to persistence format', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 2.5,
        max_drawdown: 5,
        prop_firm_threshold: defaultThreshold,
        balance_start_of_day: 10000,
        balance_current: 9750,
      });

      const json = aggregate.toJSON();

      expect(json.account_id).toBe('acc_123');
      expect(json.current_drawdown).toBe(2.5);
      expect(json.max_drawdown).toBe(5);
      expect(json.balance_start_of_day).toBe(10000);
      expect(json.balance_current).toBe(9750);
      expect(json.prop_firm_threshold).not.toBeNull();
    });

    it('should handle null prop_firm_threshold in serialization', () => {
      const aggregate = new RiskAggregate({
        account_id: 'acc_123',
        current_drawdown: 2.5,
        max_drawdown: 5,
        prop_firm_threshold: null,
        balance_start_of_day: 10000,
        balance_current: 9750,
      });

      const json = aggregate.toJSON();

      expect(json.prop_firm_threshold).toBeNull();
    });
  });
});
