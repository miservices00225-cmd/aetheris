import { Response } from 'express';

/**
 * Standardized API response envelope
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: any;
  meta?: Record<string, any>;
}

/**
 * Send success response with data
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: Record<string, any>
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  if (meta) {
    response.meta = meta;
  }
  return res.status(statusCode).json(response);
}

/**
 * Send error response with optional details
 */
export function sendError(
  res: Response,
  error: string,
  statusCode: number = 400,
  code?: string,
  details?: Record<string, any>
): Response {
  const response: ApiResponse = {
    success: false,
    error,
  };
  if (code) {
    response.code = code;
  }
  if (details) {
    response.details = details;
  }
  return res.status(statusCode).json(response);
}

/**
 * Send no-content response (204)
 */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}
