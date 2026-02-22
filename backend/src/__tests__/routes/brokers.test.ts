/**
 * Integration tests for POST /api/v1/brokers/:accountId/sync
 * Context7 Supertest patterns: async/await, promise chaining, async operation responses
 * 
 * Scope: Happy path tests for broker sync triggering (202 Accepted for async jobs)
 * Auth: Verified via JWT in authHeader()
 * Database: Uses test fixtures (createTestUser, createTestAccount, createTestBrokerConnection)
 */

import request from 'supertest';
import { createApp } from '../../server.js';
import { generateTestJWT, authHeader, AUTH_SCENARIOS } from '../helpers.js';
import {
  createTestUser,
  createTestAccount,
} from '../fixtures.js';

describe('POST /api/v1/brokers/:accountId - Broker Sync', () => {
  const app = createApp();

  /**
   * Test 3.10a: POST /brokers/:accountId with valid account
   * Context7: async/await, path parameter, 200 response (placeholder for Sprint 5)
   */
  it('should trigger broker sync and return status', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post(`/api/v1/brokers/${account.id}`)
      .set(authHeader(token))
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('account_id');
    expect(response.body.account_id).toEqual(account.id);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('sync_timestamp');
  });

  /**
   * Test 3.10b: POST /brokers/:accountId requires authorization
   * Context7 AUTH_SCENARIOS: Missing JWT = 401
   */
  it('should reject broker sync without JWT', async () => {
    const account = createTestAccount();

    const response = await request(app)
      .post(`/api/v1/brokers/${account.id}`)
      .set(AUTH_SCENARIOS.missingAuth())
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body.error).toMatch(/Unauthorized|token/i);
  });

  /**
   * Test 3.10c: POST /brokers/:accountId verifies account ownership
   * Context7: Owner verification (implicitly tested via verifyAccountOwnership)
   */
  it('should verify account ownership before sync', async () => {
    const user = createTestUser();
    const otherUserAccount = createTestAccount(); // Different user's account
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post(`/api/v1/brokers/${otherUserAccount.id}`)
      .set(authHeader(token))
      .expect('Content-Type', /json/)
      .expect(403); // Forbidden - not the owner

    expect(response.body.error).toMatch(/Unauthorized|access|permission/i);
  });
});

/**
 * Phase 4: Error Cases for Broker Sync
 * Context7: Test invalid inputs, non-existent accounts, authorization failures
 */
describe('POST /api/v1/brokers/:accountId - Error Cases', () => {
  const app = createApp();

  /**
   * Test 4.14: Invalid account_id format (malformed UUID)
   */
  it('should reject sync with invalid account_id format', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/brokers/not-a-uuid')
      .set(authHeader(token))
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.details).toBeDefined();
  });

  /**
   * Test 4.15: Non-existent account (404)
   */
  it('should return 404 for non-existent account', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);
    const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

    const response = await request(app)
      .post(`/api/v1/brokers/${nonExistentId}`)
      .set(authHeader(token))
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body.error).toBeDefined();
  });

  /**
   * Test 4.16: No broker connection configured (422)
   * Context7: Missing prerequisite data (no broker_connections record)
   */
  it('should reject sync if no broker connection configured', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);
    // Note: account created but no broker_connections record

    const response = await request(app)
      .post(`/api/v1/brokers/${account.id}`)
      .set(authHeader(token))
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.error).toBeDefined();
  });
});
