import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/responses.js';

/**
 * Zod validation middleware factory for request body
 * Validates against schema and returns 422 on error
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        sendError(res, 'Validation failed', 422, 'VALIDATION_ERROR', { details });
      } else {
        next(error);
      }
    }
  };
}

/**
 * Zod validation middleware factory for query parameters
 * Validates against schema and returns 400 on error
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        sendError(res, 'Invalid query parameters', 400, 'VALIDATION_ERROR', { details });
      } else {
        next(error);
      }
    }
  };
}
