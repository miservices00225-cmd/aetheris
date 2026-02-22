/**
 * Integration tests for POST/GET/PUT /api/v1/accounts
 * Context7 Supertest patterns: async/await, promise chaining, clean assertions
 * 
 * Scope: Happy path tests for account creation, listing, and updates
 * Auth: Verified via JWT in authHeader()
 * Database: Uses test fixtures (createTestUser, createTestAccount)
 */

import request from 'supertest';
import { createApp } from '../../server.js';
import { generateTestJWT, authHeader, AUTH_SCENARIOS } from '../helpers.js';
import {
  createTestUser,
  createTestAccount,
  VALID_ACCOUNT_PAYLOAD,
} from '../fixtures.js';

// Helper to generate valid UUIDs for tests
const generateId = () => {
  const chars = '0123456789abcdef';
  let uuid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) uuid += '-';
    else uuid += chars.charAt(Math.floor(Math.random() * 16));
  }
  return uuid;
};

describe('POST /api/v1/accounts - Create Account', () => {
  const app = createApp();

  /**
   * Test 3.7a: POST /accounts with valid payload
   * Context7: async/await, clean assertion chain
   */
  it('should create account with valid payload and return 201', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/accounts')
      .set(authHeader(token))
      .send(VALID_ACCOUNT_PAYLOAD)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.user_id).toEqual(user.id);
    expect(response.body.account_name).toEqual(VALID_ACCOUNT_PAYLOAD.account_name);
    expect(response.body.account_type).toEqual(VALID_ACCOUNT_PAYLOAD.account_type);
  });

  /**
   * Test 3.7b: POST /accounts requires authorization
   */
  it('should reject account creation without JWT', async () => {
    const response = await request(app)
      .post('/api/v1/accounts')
      .set(AUTH_SCENARIOS.missingAuth())
      .send(VALID_ACCOUNT_PAYLOAD)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body.error).toMatch(/Unauthorized|token/i);
  });
});

describe('GET /api/v1/accounts - List Accounts', () => {
  const app = createApp();

  /**
   * Test 3.8: GET /accounts returns list of user's accounts
   * Context7: Array response, user isolation implicit (selectAccounts filters by user_id)
   */
  it('should list accounts for authenticated user', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .get('/api/v1/accounts')
      .set(authHeader(token))
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    // No accounts created yet
    expect(response.body).toHaveLength(0);
  });

  /**
   * Test 3.8b: GET /accounts requires authorization
   */
  it('should reject account listing without JWT', async () => {
    const response = await request(app)
      .get('/api/v1/accounts')
      .set(AUTH_SCENARIOS.missingAuth())
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body.error).toMatch(/Unauthorized|token/i);
  });
});

describe('PUT /api/v1/accounts/:id - Update Account', () => {
  const app = createApp();

  /**
   * Test 3.9: PUT /accounts/:id with valid update payload
   * Context7: Path parameter, partial update response
   */
  it('should update account risk limits and return 200', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const updatePayload = {
      daily_loss_limit_percent: 5,
      leverage: 10,
    };

    const response = await request(app)
      .put(`/api/v1/accounts/${account.id}`)
      .set(authHeader(token))
      .send(updatePayload)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.id).toEqual(account.id);
    expect(response.body.daily_loss_limit_percent).toEqual(5);
    expect(response.body.leverage).toEqual(10);
  });

  /**
   * Test 3.9b: PUT /accounts/:id requires authorization
   */
  it('should reject account update without JWT', async () => {
    const account = createTestAccount();

    const response = await request(app)
      .put(`/api/v1/accounts/${account.id}`)
      .set(AUTH_SCENARIOS.missingAuth())
      .send({ daily_loss_limit_percent: 5 })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body.error).toMatch(/Unauthorized|token/i);
  });
});

/**
 * Phase 4: Error Cases for Accounts
 * Context7: Test invalid inputs, constraint violations, authorization failures
 */
describe('POST /api/v1/accounts - Error Cases', () => {
  const app = createApp();

  /**
   * Test 4.7: Missing required fields
   */
  it('should reject account creation with missing required fields', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/accounts')
      .set(authHeader(token))
      .send({
        // Missing account_type, broker_id
      })
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.details).toBeDefined();
  });

  /**
   * Test 4.8: Invalid account_type enum
   */
  it('should reject account with invalid account_type', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/accounts')
      .set(authHeader(token))
      .send({
        ...VALID_ACCOUNT_PAYLOAD,
        account_type: 'invalid_type', // Not in enum
      })
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.details).toBeDefined();
  });

  /**
   * Test 4.9: Invalid numeric limits (negative daily loss)
   */
  it('should reject account with negative daily_loss_limit_percent', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/accounts')
      .set(authHeader(token))
      .send({
        ...VALID_ACCOUNT_PAYLOAD,
        daily_loss_limit_percent: -10, // Negative not allowed
      })
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.details).toBeDefined();
  });
});

describe('GET /api/v1/accounts - Error Cases', () => {
  const app = createApp();

  /**
   * Test 4.10: Unauthorized access to other user's accounts
   */
  it('should not list accounts for different user', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    createTestAccount(user2.id); // Create account for user2
    const token = generateTestJWT(user1.id); // Request as user1

    const response = await request(app)
      .get('/api/v1/accounts')
      .set(authHeader(token))
      .expect('Content-Type', /json/)
      .expect(200);

    // Should return empty list (RLS filters out user2's accounts)
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});

describe('PUT /api/v1/accounts/:id - Error Cases', () => {
  const app = createApp();

  /**
   * Test 4.11: Update non-existent account (404)
   */
  it('should return 404 when updating non-existent account', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);
    const nonExistentId = generateId();

    const response = await request(app)
      .put(`/api/v1/accounts/${nonExistentId}`)
      .set(authHeader(token))
      .send({ daily_loss_limit_percent: 5 })
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body.error).toBeDefined();
  });

  /**
   * Test 4.12: Unauthorized update (trying to update another user's account)
   */
  it('should return 403 when updating account not owned by user', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account = createTestAccount(user2.id); // Owned by user2
    const token = generateTestJWT(user1.id); // But user1 updates

    const response = await request(app)
      .put(`/api/v1/accounts/${account.id}`)
      .set(authHeader(token))
      .send({ daily_loss_limit_percent: 5 })
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body.error).toBeDefined();
  });

  /**
   * Test 4.13: Invalid update payload
   */
  it('should reject invalid account update values', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .put(`/api/v1/accounts/${account.id}`)
      .set(authHeader(token))
      .send({
        daily_loss_limit_percent: 150, // Out of range (should be 0-100)
      })
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.details).toBeDefined();
  });
});
