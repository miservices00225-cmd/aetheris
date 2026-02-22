import { Request, Response, NextFunction } from 'express';

/**
 * Async route wrapper
 * Catches async errors and passes them to error handler middleware
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
