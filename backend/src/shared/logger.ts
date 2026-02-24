/**
 * Logger — Simple logging interface.
 * Can be replaced with Winston, Pino, etc. in production.
 */
export interface Logger {
  info(context: string, data?: Record<string, unknown>): void;
  warn(context: string, data?: Record<string, unknown>): void;
  error(context: string, error: Error | Record<string, unknown>): void;
}

/**
 * ConsoleLogger — Simple console-based logger.
 */
export class ConsoleLogger implements Logger {
  info(context: string, data?: Record<string, unknown>): void {
    console.log(`[INFO] ${context}`, data || '');
  }

  warn(context: string, data?: Record<string, unknown>): void {
    console.warn(`[WARN] ${context}`, data || '');
  }

  error(context: string, error: Error | Record<string, unknown>): void {
    if (error instanceof Error) {
      console.error(`[ERROR] ${context}`, error.message, error.stack);
    } else {
      console.error(`[ERROR] ${context}`, error);
    }
  }
}

/**
 * NoOpLogger — Logger that does nothing (for testing).
 */
export class NoOpLogger implements Logger {
  info(): void {}
  warn(): void {}
  error(): void {}
}
