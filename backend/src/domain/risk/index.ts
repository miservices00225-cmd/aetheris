// Domain layer — risk module
export { RiskAggregate, type RiskAggregateProps } from './RiskAggregate';
export {
  DrawdownPercentage,
  PropFirmThreshold,
  type PropFirmThresholdProps,
} from './value-objects';
export {
  DomainEvent,
  PropFirmRuleViolated,
  RiskDangerZoneEntered,
  type PropFirmRuleViolatedProps,
  type RiskDangerZoneEnteredProps,
} from './events';
export {
  PropFirmRuleValidator,
  type ValidationResult,
  type RuleViolation,
  type RuleWarning,
  type RuleType,
  type SeverityLevel,
} from './PropFirmRuleValidator';
