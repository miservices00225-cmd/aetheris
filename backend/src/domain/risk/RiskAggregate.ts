/**
 * RiskAggregate
 * Root Aggregate for risk domain. Owns account-specific risk state and enforces invariants.
 * Emits domain events on significant state transitions.
 */

import { DrawdownPercentage, PropFirmThreshold } from './value-objects';
import {
  DomainEvent,
  PropFirmRuleViolated,
  RiskDangerZoneEntered,
} from './events';

export interface RiskAggregateProps {
  account_id: string;
  current_drawdown: number; // percentage
  max_drawdown: number; // percentage
  prop_firm_threshold: PropFirmThreshold | null;
  balance_start_of_day: number;
  balance_current: number;
}

export class RiskAggregate {
  private account_id: string;
  private current_drawdown: DrawdownPercentage;
  private max_drawdown: DrawdownPercentage;
  private prop_firm_threshold: PropFirmThreshold | null;
  private balance_start_of_day: number;
  private balance_current: number;

  private uncommittedEvents: DomainEvent[] = [];
  private previousWasInDangerZone: boolean = false;
  private previousWasViolated: boolean = false;

  constructor(props: RiskAggregateProps) {
    this.account_id = props.account_id;
    this.current_drawdown = DrawdownPercentage.create(
      props.current_drawdown
    );
    this.max_drawdown = DrawdownPercentage.create(props.max_drawdown);
    this.prop_firm_threshold = props.prop_firm_threshold;
    this.balance_start_of_day = props.balance_start_of_day;
    this.balance_current = props.balance_current;

    this.previousWasInDangerZone = this.computeIsInDangerZone();
    this.previousWasViolated = this.computeIsViolated();
  }

  /**
   * Get account ID.
   */
  getAccountId(): string {
    return this.account_id;
  }

  /**
   * Get current drawdown.
   */
  getCurrentDrawdown(): DrawdownPercentage {
    return this.current_drawdown;
  }

  /**
   * Get max drawdown.
   */
  getMaxDrawdown(): DrawdownPercentage {
    return this.max_drawdown;
  }

  /**
   * Get prop firm threshold (nullable).
   */
  getPropFirmThreshold(): PropFirmThreshold | null {
    return this.prop_firm_threshold;
  }

  /**
   * Calculate daily loss as percentage of start-of-day balance.
   * (balance_start - balance_current) / balance_start * 100
   */
  dailyLossPercent(): DrawdownPercentage {
    if (this.balance_start_of_day === 0) {
      return DrawdownPercentage.zero();
    }

    const loss =
      ((this.balance_start_of_day - this.balance_current) /
        this.balance_start_of_day) *
      100;

    return DrawdownPercentage.create(Math.max(0, Math.min(loss, 100)));
  }

  /**
   * Check if risk is in danger zone (proximity > 80% of threshold).
   * Only meaningful if prop_firm_threshold is set.
   */
  isInDangerZone(): boolean {
    return this.computeIsInDangerZone();
  }

  private computeIsInDangerZone(): boolean {
    if (!this.prop_firm_threshold) {
      return false;
    }

    const proximityMDL = this.prop_firm_threshold.dailyLossProximityPercent(
      this.current_drawdown
    );
    const proximityTrailing =
      this.prop_firm_threshold.trailingDDProximityPercent(this.max_drawdown);

    return proximityMDL > 80 || proximityTrailing > 80;
  }

  /**
   * Check if risk is critical (proximity > 90% of threshold).
   */
  isCritical(): boolean {
    if (!this.prop_firm_threshold) {
      return false;
    }

    const proximityMDL = this.prop_firm_threshold.dailyLossProximityPercent(
      this.current_drawdown
    );
    const proximityTrailing =
      this.prop_firm_threshold.trailingDDProximityPercent(this.max_drawdown);

    return proximityMDL > 90 || proximityTrailing > 90;
  }

  /**
   * Check if prop firm rule is violated (crossed 100% of threshold).
   */
  isViolated(): boolean {
    return this.computeIsViolated();
  }

  private computeIsViolated(): boolean {
    if (!this.prop_firm_threshold) {
      return false;
    }

    return this.prop_firm_threshold.isViolated(
      this.current_drawdown,
      this.max_drawdown
    );
  }

  /**
   * Update current state. Detects state transitions and emits events.
   */
  updateState(props: Partial<RiskAggregateProps>): void {
    if (props.current_drawdown !== undefined) {
      this.current_drawdown = DrawdownPercentage.create(
        props.current_drawdown
      );
    }

    if (props.max_drawdown !== undefined) {
      this.max_drawdown = DrawdownPercentage.create(props.max_drawdown);
    }

    if (props.balance_current !== undefined) {
      this.balance_current = props.balance_current;
    }

    if (props.balance_start_of_day !== undefined) {
      this.balance_start_of_day = props.balance_start_of_day;
    }

    // Detect and emit events on state transitions
    this.detectStateTransitions();
  }

  /**
   * Detect state transitions and emit domain events.
   */
  private detectStateTransitions(): void {
    const nowIsInDangerZone = this.computeIsInDangerZone();
    const nowIsViolated = this.computeIsViolated();

    // Detect danger zone entry
    if (nowIsInDangerZone && !this.previousWasInDangerZone) {
      const severity = this.isCritical() ? 'CRITICAL' : 'WARNING';
      this.emitDangerZoneEvent(severity);
    }

    // Detect violation (only on false → true transition)
    if (nowIsViolated && !this.previousWasViolated) {
      this.emitViolationEvent();
    }

    this.previousWasInDangerZone = nowIsInDangerZone;
    this.previousWasViolated = nowIsViolated;
  }

  /**
   * Emit RiskDangerZoneEntered event.
   */
  private emitDangerZoneEvent(severity: 'WARNING' | 'CRITICAL'): void {
    if (!this.prop_firm_threshold) {
      return;
    }

    // Determine which rule triggered the danger zone
    const proximityMDL = this.prop_firm_threshold.dailyLossProximityPercent(
      this.current_drawdown
    );
    const proximityTrailing =
      this.prop_firm_threshold.trailingDDProximityPercent(this.max_drawdown);

    let rule: 'MDL' | 'TRAILING_DD';
    let proximity: number;
    let currentValue: number;
    let threshold: number;

    if (proximityMDL >= proximityTrailing) {
      rule = 'MDL';
      proximity = proximityMDL;
      currentValue = this.current_drawdown.value;
      threshold = this.prop_firm_threshold.max_daily_loss_percent.value;
    } else {
      rule = 'TRAILING_DD';
      proximity = proximityTrailing;
      currentValue = this.max_drawdown.value;
      threshold = this.prop_firm_threshold.max_trailing_drawdown_percent.value;
    }

    const event = new RiskDangerZoneEntered({
      account_id: this.account_id,
      rule_name: rule,
      current_value: currentValue,
      threshold_value: threshold,
      proximity_percent: proximity,
      severity,
      firm_name: this.prop_firm_threshold.firm_name,
    });

    this.uncommittedEvents.push(event);
  }

  /**
   * Emit PropFirmRuleViolated event.
   */
  private emitViolationEvent(): void {
    if (!this.prop_firm_threshold) {
      return;
    }

    // Determine which rule was violated
    const mdlViolated = this.prop_firm_threshold.isDailyLossViolated(
      this.current_drawdown
    );
    const trailingViolated = this.prop_firm_threshold.isTrailingDDViolated(
      this.max_drawdown
    );

    if (mdlViolated) {
      this.uncommittedEvents.push(
        new PropFirmRuleViolated({
          account_id: this.account_id,
          rule_name: 'MDL',
          current_value: this.current_drawdown.value,
          threshold_value: this.prop_firm_threshold.max_daily_loss_percent.value,
          firm_name: this.prop_firm_threshold.firm_name,
        })
      );
    }

    if (trailingViolated) {
      this.uncommittedEvents.push(
        new PropFirmRuleViolated({
          account_id: this.account_id,
          rule_name: 'TRAILING_DD',
          current_value: this.max_drawdown.value,
          threshold_value:
            this.prop_firm_threshold.max_trailing_drawdown_percent.value,
          firm_name: this.prop_firm_threshold.firm_name,
        })
      );
    }
  }

  /**
   * Get uncommitted domain events.
   */
  getUncommittedEvents(): DomainEvent[] {
    return this.uncommittedEvents;
  }

  /**
   * Clear uncommitted events (after persistence).
   */
  clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }

  /**
   * Serialize to JSON for persistence.
   */
  toJSON(): RiskAggregateProps {
    return {
      account_id: this.account_id,
      current_drawdown: this.current_drawdown.value,
      max_drawdown: this.max_drawdown.value,
      prop_firm_threshold: this.prop_firm_threshold
        ? this.prop_firm_threshold.toJSON()
        : null,
      balance_start_of_day: this.balance_start_of_day,
      balance_current: this.balance_current,
    };
  }
}
