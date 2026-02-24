/**
 * DomainEvent base class
 * All domain events inherit from this for consistent structure.
 */

export abstract class DomainEvent {
  readonly timestamp: Date;
  readonly correlationId: string;

  constructor(correlationId?: string) {
    this.timestamp = new Date();
    this.correlationId = correlationId || this.generateCorrelationId();
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  abstract getEventName(): string;

  toJSON(): Record<string, unknown> {
    return {
      eventName: this.getEventName(),
      timestamp: this.timestamp,
      correlationId: this.correlationId,
    };
  }
}
