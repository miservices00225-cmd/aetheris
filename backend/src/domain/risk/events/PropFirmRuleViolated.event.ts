/**
 * PropFirmRuleViolated Domain Event
 * Emitted when a prop firm risk threshold is violated (crosses 100% of threshold).
 */

import { DomainEvent } from './DomainEvent.base';

export interface PropFirmRuleViolatedProps {
  account_id: string;
  rule_name: 'MDL' | 'TRAILING_DD';
  current_value: number;
  threshold_value: number;
  firm_name: string;
}

export class PropFirmRuleViolated extends DomainEvent {
  readonly account_id: string;
  readonly rule_name: 'MDL' | 'TRAILING_DD';
  readonly current_value: number;
  readonly threshold_value: number;
  readonly firm_name: string;

  constructor(props: PropFirmRuleViolatedProps, correlationId?: string) {
    super(correlationId);
    this.account_id = props.account_id;
    this.rule_name = props.rule_name;
    this.current_value = props.current_value;
    this.threshold_value = props.threshold_value;
    this.firm_name = props.firm_name;
  }

  getEventName(): string {
    return 'PropFirmRuleViolated';
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      account_id: this.account_id,
      rule_name: this.rule_name,
      current_value: this.current_value,
      threshold_value: this.threshold_value,
      firm_name: this.firm_name,
    };
  }
}
