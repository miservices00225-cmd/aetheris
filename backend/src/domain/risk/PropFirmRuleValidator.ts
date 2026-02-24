/**
 * PropFirmRuleValidator Domain Service
 * Validates RiskAggregate against prop firm rules and produces actionable warnings/violations.
 */

import { DrawdownPercentage } from './value-objects';
import { RiskAggregate } from './RiskAggregate';

export type RuleType = 'MDL' | 'TRAILING_DD';
export type SeverityLevel = 'WARNING' | 'CRITICAL' | 'VIOLATED';

export interface RuleViolation {
  rule: RuleType;
  threshold: number;
  current: number;
  severity: 'VIOLATED';
  percentage: number;
}

export interface RuleWarning {
  rule: RuleType;
  threshold: number;
  current: number;
  severity: 'WARNING' | 'CRITICAL';
  proximity_percent: number;
}

export interface ValidationResult {
  isValid: boolean;
  violations: RuleViolation[];
  warnings: RuleWarning[];
}

export class PropFirmRuleValidator {
  /**
   * Validate a RiskAggregate against its prop firm threshold rules.
   * @returns ValidationResult with violations and warnings categorized by severity
   */
  validate(aggregate: RiskAggregate): ValidationResult {
    const violations: RuleViolation[] = [];
    const warnings: RuleWarning[] = [];

    // If no prop firm threshold, always valid
    const threshold = aggregate.getPropFirmThreshold();
    if (!threshold) {
      return { isValid: true, violations, warnings };
    }

    const currentDrawdown = aggregate.getCurrentDrawdown();
    const maxDrawdown = aggregate.getMaxDrawdown();

    // Validate MDL (Daily Loss)
    this.validateRule(
      currentDrawdown,
      'MDL',
      threshold.max_daily_loss_percent,
      violations,
      warnings
    );

    // Validate Trailing DD
    this.validateRule(
      maxDrawdown,
      'TRAILING_DD',
      threshold.max_trailing_drawdown_percent,
      violations,
      warnings
    );

    return {
      isValid: violations.length === 0,
      violations,
      warnings,
    };
  }

  /**
   * Validate a single rule (MDL or Trailing DD).
   */
  private validateRule(
    current: DrawdownPercentage,
    ruleType: RuleType,
    thresholdValue: DrawdownPercentage,
    violations: RuleViolation[],
    warnings: RuleWarning[]
  ): void {
    const proximityPercent = current.proximityPercent(thresholdValue.value);

    // VIOLATED: exceeded threshold (>100%)
    if (current.isAbove(thresholdValue.value)) {
      violations.push({
        rule: ruleType,
        threshold: thresholdValue.value,
        current: current.value,
        severity: 'VIOLATED',
        percentage: proximityPercent,
      });
      return;
    }

    // WARNING (80%) or CRITICAL (90%)
    if (proximityPercent > 80) {
      const severity = proximityPercent > 90 ? 'CRITICAL' : 'WARNING';
      warnings.push({
        rule: ruleType,
        threshold: thresholdValue.value,
        current: current.value,
        severity,
        proximity_percent: proximityPercent,
      });
    }
  }

  /**
   * Get the highest severity level from validation result.
   */
  getOverallSeverity(result: ValidationResult): SeverityLevel | 'OK' {
    if (result.violations.length > 0) {
      return 'VIOLATED';
    }

    const hasWarnings = result.warnings.some((w) => w.severity === 'WARNING');
    const hasCritical = result.warnings.some((w) => w.severity === 'CRITICAL');

    if (hasCritical) {
      return 'CRITICAL';
    }

    if (hasWarnings) {
      return 'WARNING';
    }

    return 'OK';
  }

  /**
   * Format validation result for logging/debugging.
   */
  format(result: ValidationResult): string {
    if (!result.violations.length && !result.warnings.length) {
      return 'Status: OK';
    }

    const lines: string[] = [];

    if (result.violations.length > 0) {
      lines.push(`VIOLATIONS (${result.violations.length}):`);
      result.violations.forEach((v) => {
        lines.push(
          `  - ${v.rule}: ${v.current.toFixed(2)}% (threshold: ${v.threshold.toFixed(2)}%)`
        );
      });
    }

    if (result.warnings.length > 0) {
      lines.push(`WARNINGS (${result.warnings.length}):`);
      result.warnings.forEach((w) => {
        lines.push(
          `  - ${w.rule} [${w.severity}]: ${w.current.toFixed(2)}% (${w.proximity_percent.toFixed(0)}% of threshold)`
        );
      });
    }

    return lines.join('\n');
  }
}
