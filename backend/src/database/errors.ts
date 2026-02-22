/**
 * Custom DatabaseError class for consistent error handling
 * Wraps Supabase errors with additional context
 */
export class DatabaseError extends Error {
  operation: string;
  table?: string;
  recordId?: string;
  code?: string;

  constructor(
    message: string,
    operation: string,
    table?: string,
    recordId?: string,
    code?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
    this.operation = operation;
    this.table = table;
    this.recordId = recordId;
    this.code = code;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get human-readable error message with context
   */
  getDetailedMessage(): string {
    let msg = `${this.name}: ${this.message}`;
    if (this.table) {
      msg += ` [table: ${this.table}]`;
    }
    if (this.recordId) {
      msg += ` [record: ${this.recordId}]`;
    }
    if (this.code) {
      msg += ` [code: ${this.code}]`;
    }
    msg += ` [operation: ${this.operation}]`;
    return msg;
  }
}

/**
 * Check if error is due to UNIQUE constraint violation
 */
export function isUniqueConstraintError(error: any): boolean {
  const code = error?.code || error?.message || '';
  return code.includes('23505') || code.includes('unique constraint');
}

/**
 * Check if error is due to FK constraint violation
 */
export function isForeignKeyError(error: any): boolean {
  const code = error?.code || error?.message || '';
  return code.includes('23503') || code.includes('foreign key');
}

/**
 * Check if error is due to NOT NULL constraint
 */
export function isNotNullError(error: any): boolean {
  const code = error?.code || error?.message || '';
  return code.includes('23502') || code.includes('not-null');
}

/**
 * Check if error is an RLS policy violation
 */
export function isRLSError(error: any): boolean {
  const code = error?.code || error?.message || '';
  return (
    code.includes('42501') ||
    code.includes('permission denied') ||
    code.includes('row security')
  );
}

/**
 * Wrap Supabase error with DatabaseError
 */
export function wrapDatabaseError(
  error: any,
  operation: string,
  table?: string,
  recordId?: string
): DatabaseError {
  const code = error?.code;
  let message = error?.message || 'Unknown database error';

  // Enhance message based on error type
  if (isUniqueConstraintError(error)) {
    message = `Duplicate record: ${message}`;
  } else if (isForeignKeyError(error)) {
    message = `Referenced record not found: ${message}`;
  } else if (isNotNullError(error)) {
    message = `Required field missing: ${message}`;
  } else if (isRLSError(error)) {
    message = `Access denied - RLS policy violation: ${message}`;
  }

  return new DatabaseError(message, operation, table, recordId, code);
}
