import { Request, Response, NextFunction } from 'express';
import { DatabaseError } from '../database/errors.js';
import { sendError } from '../utils/responses.js';

/**
 * Centralized error handling middleware (4-parameter signature required by Express)
 * Maps PostgreSQL error codes to HTTP status codes
 * Must be registered AFTER all other middleware and routes
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ERROR]', error);

  // Handle DatabaseError with PostgreSQL error codes
  if (error instanceof DatabaseError) {
    const code = error.code || 'UNKNOWN';
    let statusCode = 500;
    let message = error.message;

    // Map PostgreSQL error codes to HTTP status
    if (code === '23505') {
      statusCode = 409;
      message = 'Duplicate entry: this record already exists';
    } else if (code === '23503') {
      statusCode = 400;
      message = 'Invalid reference: related record not found';
    } else if (code === '23502') {
      statusCode = 422;
      message = 'Validation failed: required field missing';
    } else if (code === '42501') {
      statusCode = 403;
      message = 'Forbidden: you do not have access to this resource';
    } else if (code === '22P02') {
      statusCode = 400;
      message = 'Invalid input: invalid UUID format';
    } else if (code.startsWith('42')) {
      statusCode = 400;
      message = 'Invalid request: database error';
    }

    sendError(res, message, statusCode, code);
    return;
  }

  // Handle generic errors
  if (error instanceof Error) {
    sendError(res, 'Internal server error', 500);
    return;
  }

  // Fallback for non-Error objects
  sendError(res, 'Internal server error', 500);
}
