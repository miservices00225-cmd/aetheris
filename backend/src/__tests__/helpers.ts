/**
 * Test helpers: JWT generation + auth helpers
 * Context7 best practices: Lightweight, focused on single responsibility
 * Data builders moved to fixtures.ts to keep separation of concerns
 */

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Mock JWT secret for testing (NEVER use in production)
const TEST_JWT_SECRET = 'test-secret-key-do-not-use-in-production';

/**
 * Generate a valid JWT token for testing
 * Context7 best practice: Minimal, focused function
 */
export const generateTestJWT = (userId: string = uuidv4()): string => {
  const options: jwt.SignOptions = { expiresIn: 3600, algorithm: 'HS256' };
  return jwt.sign(
    { sub: userId, iat: Math.floor(Date.now() / 1000) },
    TEST_JWT_SECRET,
    options
  );
};

/**
 * Generate expired JWT for 401 testing
 */
export const generateExpiredJWT = (userId: string = uuidv4()): string => {
  const options: jwt.SignOptions = { expiresIn: 3600, algorithm: 'HS256' };
  return jwt.sign(
    { sub: userId, iat: Math.floor(Date.now() / 1000) - 7200 }, // 2h ago
    TEST_JWT_SECRET,
    options
  );
};

/**
 * Create Authorization header with JWT
 * Context7: Reusable header builder
 */
export const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

/**
 * Common auth scenarios for testing
 */
export const AUTH_SCENARIOS = {
  validJWT: (userId = uuidv4()) => authHeader(generateTestJWT(userId)),
  expiredJWT: (userId = uuidv4()) => authHeader(generateExpiredJWT(userId)),
  malformedBearer: () => ({ Authorization: 'InvalidJWT token123' }),
  missingAuth: () => ({}),
};
