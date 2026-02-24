/**
 * DrawdownPercentage Value Object
 * Encapsulates a drawdown percentage (0–100) with invariant validation.
 * Immutable by design.
 */

export class DrawdownPercentage {
  readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * Factory method with validation.
   * @throws {Error} if value is outside [0, 100] range
   */
  static create(value: number): DrawdownPercentage {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('DrawdownPercentage: value must be a valid number');
    }

    if (value < 0 || value > 100) {
      throw new Error(
        `DrawdownPercentage: value must be between 0 and 100, got ${value}`
      );
    }

    return new DrawdownPercentage(value);
  }

  /**
   * Create from an existing DrawdownPercentage (copy constructor).
   */
  static copy(other: DrawdownPercentage): DrawdownPercentage {
    return new DrawdownPercentage(other.value);
  }

  /**
   * Zero drawdown (no loss).
   */
  static zero(): DrawdownPercentage {
    return new DrawdownPercentage(0);
  }

  /**
   * Check if drawdown exceeds a threshold.
   * @param threshold Percentage threshold (0–100)
   * @returns true if this.value > threshold
   */
  isAbove(threshold: number): boolean {
    if (threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be between 0 and 100');
    }
    return this.value > threshold;
  }

  /**
   * Calculate distance to a threshold.
   * @param threshold Percentage threshold (0–100)
   * @returns absolute difference (this.value - threshold)
   */
  distanceTo(threshold: number): number {
    if (threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be between 0 and 100');
    }
    return this.value - threshold;
  }

  /**
   * Proximity to a threshold as percentage of threshold.
   * Example: if threshold=5 and value=4, proximity=80%
   * @param threshold Percentage threshold (0–100)
   * @returns proximity as percentage (0–∞, capped at 100+ for violations)
   */
  proximityPercent(threshold: number): number {
    if (threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be between 0 and 100');
    }

    if (threshold === 0) {
      return 0;
    }

    return (this.value / threshold) * 100;
  }

  /**
   * Format as percentage string with 2 decimal places.
   * @returns e.g., "12.34%"
   */
  formatted(): string {
    return `${this.value.toFixed(2)}%`;
  }

  /**
   * Serialize to JSON (for API responses, persistence).
   */
  toJSON(): number {
    return this.value;
  }

  /**
   * Equals comparison.
   */
  equals(other: DrawdownPercentage): boolean {
    return this.value === other.value;
  }

  /**
   * String representation for debugging.
   */
  toString(): string {
    return this.formatted();
  }
}
