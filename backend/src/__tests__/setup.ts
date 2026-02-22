import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load .env.local before any tests run
dotenv.config({ path: '.env.local' });

// Set test environment
process.env.NODE_ENV = 'test';

// ============================================================================
// TEST JWT SECRET (same as helpers.ts for consistent token validation)
// ============================================================================
const TEST_JWT_SECRET = 'test-secret-key-do-not-use-in-production';

/**
 * Mock authMiddleware for integration tests
 * Context7: Bypass Supabase for unit tests, validate JWT locally
 * 
 * This intercepts Express requests and validates our test JWTs
 * without requiring a real Supabase connection
 */
export function mockAuthMiddleware(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;

    // Validate Bearer token format
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    // Verify test JWT locally
    const decoded = jwt.verify(token, TEST_JWT_SECRET, { algorithms: ['HS256'] }) as any;

    // Inject user context
    req.user = {
      id: decoded.sub,
      email: `user-${decoded.sub.substring(0, 8)}@test.local`,
    };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Verify critical env vars
beforeAll(() => {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  for (const env of required) {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
});
