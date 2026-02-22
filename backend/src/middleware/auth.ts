import { Request, Response, NextFunction } from 'express';
import { adminClient } from '../config/supabase.js';
import { sendError } from '../utils/responses.js';

/**
 * Express Request with authenticated user context
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    user_metadata?: Record<string, any>;
  };
}

/**
 * JWT authentication middleware
 * Validates Supabase JWT token from Authorization header
 * Injects user context or responds with 401
 */
export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    // Validate Bearer token format
    if (!authHeader?.startsWith('Bearer ')) {
      sendError(res, 'Missing or invalid authorization header', 401, 'UNAUTHORIZED');
      return;
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const { data, error } = await adminClient.auth.getUser(token);

    if (error || !data.user) {
      sendError(res, 'Invalid or expired token', 401, 'UNAUTHORIZED');
      return;
    }

    // Inject user context for downstream middleware
    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      user_metadata: data.user.user_metadata,
    };

    next();
  } catch (err) {
    // Token validation error (e.g., malformed JWT)
    sendError(res, 'Token validation failed', 401, 'UNAUTHORIZED');
  }
}
