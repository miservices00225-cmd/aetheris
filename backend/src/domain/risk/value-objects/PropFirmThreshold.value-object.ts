/**
 * PropFirmThreshold Value Object
 * Encapsulates prop firm risk thresholds (MDL, Trailing DD) with violation detection.
 * Immutable by design.
 */

import { DrawdownPercentage } from './DrawdownPercentage.value-object';

export interface PropFirmThresholdProps {
  firm_name: string;
  max_daily_loss_percent: number;
  max_trailing_drawdown_percent: number;
}

export class PropFirmThreshold {
  readonly firm_name: string;
  readonly max_daily_loss_percent: DrawdownPercentage;
  readonly max_trailing_drawdown_percent: DrawdownPercentage;

  private constructor(
    firm_name: string,
    maxDailyLoss: DrawdownPercentage,
    maxTrailingDD: DrawdownPercentage
  ) {
    this.firm_name = firm_name;
    this.max_daily_loss_percent = maxDailyLoss;
    this.max_trailing_drawdown_percent = maxTrailingDD;
  }

  /**
   * Factory method with validation.
   * @throws {Error} if values are invalid
   */
  static create(props: PropFirmThresholdProps): PropFirmThreshold {
    if (!props.firm_name || props.firm_name.trim().length === 0) {
      throw new Error('PropFirmThreshold: firm_name cannot be empty');
    }

    const mdl = DrawdownPercentage.create(props.max_daily_loss_percent);
    const trailingDD = DrawdownPercentage.create(
      props.max_trailing_drawdown_percent
    );

    if (trailingDD.value < mdl.value) {
      throw new Error(
        'PropFirmThreshold: trailing drawdown must be >= daily loss threshold'
      );
    }

    return new PropFirmThreshold(props.firm_name, mdl, trailingDD);
  }

  /**
   * Check if a drawdown violates the daily loss threshold.
   */
  isDailyLossViolated(current: DrawdownPercentage): boolean {
    return current.isAbove(this.max_daily_loss_percent.value);
  }

  /**
   * Check if a drawdown violates the trailing drawdown threshold.
   */
  isTrailingDDViolated(current: DrawdownPercentage): boolean {
    return current.isAbove(this.max_trailing_drawdown_percent.value);
  }

  /**
   * Check if any threshold is violated.
   */
  isViolated(dailyLoss: DrawdownPercentage, trailingDD: DrawdownPercentage): boolean {
    return (
      this.isDailyLossViolated(dailyLoss) ||
      this.isTrailingDDViolated(trailingDD)
    );
  }

  /**
   * Calculate proximity to daily loss threshold as percentage.
   * Example: if threshold=5 and current=4, proximity=80%
   */
  dailyLossProximityPercent(current: DrawdownPercentage): number {
    return current.proximityPercent(this.max_daily_loss_percent.value);
  }

  /**
   * Calculate proximity to trailing DD threshold as percentage.
   */
  trailingDDProximityPercent(current: DrawdownPercentage): number {
    return current.proximityPercent(this.max_trailing_drawdown_percent.value);
  }

  /**
   * Get the most restrictive threshold (lowest % value).
   * Useful for UI to display the tightest constraint.
   */
  getStrictestThreshold(): { type: 'daily_loss' | 'trailing_dd'; value: number } {
    if (
      this.max_daily_loss_percent.value <=
      this.max_trailing_drawdown_percent.value
    ) {
      return {
        type: 'daily_loss',
        value: this.max_daily_loss_percent.value,
      };
    }
    return {
      type: 'trailing_dd',
      value: this.max_trailing_drawdown_percent.value,
    };
  }

  /**
   * Serialize to JSON.
   */
  toJSON(): PropFirmThresholdProps {
    return {
      firm_name: this.firm_name,
      max_daily_loss_percent: this.max_daily_loss_percent.value,
      max_trailing_drawdown_percent: this.max_trailing_drawdown_percent.value,
    };
  }

  /**
   * Equals comparison.
   */
  equals(other: PropFirmThreshold): boolean {
    return (
      this.firm_name === other.firm_name &&
      this.max_daily_loss_percent.equals(other.max_daily_loss_percent) &&
      this.max_trailing_drawdown_percent.equals(
        other.max_trailing_drawdown_percent
      )
    );
  }

  /**
   * String representation for debugging.
   */
  toString(): string {
    return `PropFirmThreshold(${this.firm_name}: MDL=${this.max_daily_loss_percent.formatted()}, TrailingDD=${this.max_trailing_drawdown_percent.formatted()})`;
  }
}
