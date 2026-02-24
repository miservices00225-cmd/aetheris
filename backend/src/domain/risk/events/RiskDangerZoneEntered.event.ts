/**
 * RiskDangerZoneEntered Domain Event
 * Emitted when risk proximity enters danger zone (> 80% of threshold).
 */

import { DomainEvent } from './DomainEvent.base';

export interface RiskDangerZoneEnteredProps {
  account_id: string;
  rule_name: 'MDL' | 'TRAILING_DD';
  current_value: number;
  threshold_value: number;
  proximity_percent: number;
  severity: 'WARNING' | 'CRITICAL';
  firm_name: string;
}

export class RiskDangerZoneEntered extends DomainEvent {
  readonly account_id: string;
  readonly rule_name: 'MDL' | 'TRAILING_DD';
  readonly current_value: number;
  readonly threshold_value: number;
  readonly proximity_percent: number;
  readonly severity: 'WARNING' | 'CRITICAL';
  readonly firm_name: string;

  constructor(props: RiskDangerZoneEnteredProps, correlationId?: string) {
    super(correlationId);
    this.account_id = props.account_id;
    this.rule_name = props.rule_name;
    this.current_value = props.current_value;
    this.threshold_value = props.threshold_value;
    this.proximity_percent = props.proximity_percent;
    this.severity = props.severity;
    this.firm_name = props.firm_name;
  }

  getEventName(): string {
    return 'RiskDangerZoneEntered';
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      account_id: this.account_id,
      rule_name: this.rule_name,
      current_value: this.current_value,
      threshold_value: this.threshold_value,
      proximity_percent: this.proximity_percent,
      severity: this.severity,
      firm_name: this.firm_name,
    };
  }
}
