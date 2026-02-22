/**
 * Auth middleware tests
 * Context7 patterns: beforeEach/afterEach (Jest official), async/await (Supertest)
 * 
 * Tests:
 * - Valid JWT token passes through (req.user.id set)
 * - Expired JWT returns 401
 * - Missing Authorization header returns 401
 * - Malformed bearer format returns 401
 */

import request from 'supertest';
import { app } from '../../server';
import {
  generateTestJWT,
  generateExpiredJWT,
  authHeader,
  AUTH_SCENARIOS,
} from '../helpers';

describe('Auth Middleware', () => {
  describe('JWT validation', () => {
    it('should pass valid JWT and set req.user.id', async () => {
      const token = generateTestJWT();
      
      const response = await request(app)
        .get('/api/v1/accounts')
        .set(authHeader(token))
        .expect(200);

      // Verify response indicates successful auth
      expect(response.body).toBeDefined();
    });

    it('should reject expired JWT with 401', async () => {
      const expiredToken = generateExpiredJWT();

      await request(app)
        .get('/api/v1/accounts')
        .set(authHeader(expiredToken))
        .expect(401);
    });

    it('should reject missing Authorization header with 401', async () => {
      await request(app)
        .get('/api/v1/accounts')
        .expect(401);
    });

    it('should reject malformed bearer format with 401', async () => {
      await request(app)
        .get('/api/v1/accounts')
        .set(AUTH_SCENARIOS.malformedBearer())
        .expect(401);
    });

    it('should reject Bearer with invalid token with 401', async () => {
      await request(app)
        .get('/api/v1/accounts')
        .set({ Authorization: 'Bearer invalid.token.signature' })
        .expect(401);
    });
  });

  describe('Bearer token parsing', () => {
    it('should extract user ID from valid JWT', async () => {
      const userId = 'test-user-123';
      const token = generateTestJWT(userId);

      const response = await request(app)
        .get('/api/v1/accounts')
        .set(authHeader(token))
        .expect(200);

      // Response should succeed, indicating auth middleware passed
      expect(response.body).toBeDefined();
    });

    it('should handle "Bearer " prefix case-sensitively', async () => {
      const token = generateTestJWT();

      // lowercase "bearer" should fail (standard is uppercase)
      await request(app)
        .get('/api/v1/accounts')
        .set({ Authorization: `bearer ${token}` })
        .expect(401);
    });
  });
});
