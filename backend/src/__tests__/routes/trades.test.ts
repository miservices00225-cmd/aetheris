/**
 * Integration tests for POST/GET /api/v1/trades
 * Context7 Supertest patterns: async/await, promise chaining, clean assertions
 * 
 * Scope: Happy path tests for trade creation, listing, filtering, and pagination
 * Auth: Verified via JWT in authHeader()
 * Database: Uses test fixtures (createTestUser, createTestTrade, createTestAccount)
 */

import request from 'supertest';
import { createApp } from '../../server.js';
import { generateTestJWT, authHeader, AUTH_SCENARIOS } from '../helpers.js';
import {
  createTestUser,
  createTestAccount,
  VALID_TRADE_PAYLOAD,
  INVALID_TRADE_PAYLOAD,
  TestDataFactory,
} from '../fixtures.js';

describe('POST /api/v1/trades - Create Trade', () => {
  const app = createApp();
  const factory = new TestDataFactory();

  beforeEach(() => {
    // Reset factory state before each test
    factory.reset();
  });

  /**
   * Test 3.1: POST /trades with valid payload
   * Context7: async/await, clean assertion chain
   */
  it('should create trade with valid payload and return 201', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/trades')
      .set(authHeader(token))
      .send({
        ...VALID_TRADE_PAYLOAD,
        account_id: account.id,
      })
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.account_id).toEqual(account.id);
    expect(response.body.entry_price).toEqual(VALID_TRADE_PAYLOAD.entry_price);
    expect(response.body.exit_price).toEqual(VALID_TRADE_PAYLOAD.exit_price);
  });

  /**
   * Test 3.2: POST /trades requires authorization
   * Context7 AUTH_SCENARIOS: Missing JWT = 401
   */
  it('should reject trade creation without JWT', async () => {
    const account = createTestAccount();

    const response = await request(app)
      .post('/api/v1/trades')
      .set(AUTH_SCENARIOS.missingAuth())
      .send({
        ...VALID_TRADE_PAYLOAD,
        account_id: account.id,
      })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body.error).toMatch(/Unauthorized|token/i);
  });

  /**
   * Test 3.3: POST /trades rejects invalid schema
   * Context7: 422 response with details array (per validation middleware)
   */
  it('should reject trade with invalid schema and return 422', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/trades')
      .set(authHeader(token))
      .send({
        ...INVALID_TRADE_PAYLOAD,
        account_id: account.id,
      })
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.details).toBeDefined();
    expect(Array.isArray(response.body.details)).toBe(true);
  });
});

describe('GET /api/v1/trades - List Trades', () => {
  const app = createApp();
  const factory = new TestDataFactory();

  beforeEach(() => {
    factory.reset();
  });

  /**
   * Test 3.4: GET /trades returns list with pagination
   * Context7: Query params (limit, offset), response array
   */
  it('should list trades with default pagination', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .get('/api/v1/trades')
      .set(authHeader(token))
      .query({ account_id: account.id, limit: 10, offset: 0 })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0); // No trades created yet
  });

  /**
   * Test 3.5: GET /trades filters by account_id
   * Context7: Query parameter validation, owner verification
   */
  it('should require account_id query parameter', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .get('/api/v1/trades')
      .set(authHeader(token))
      .query({ limit: 10 })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.error).toMatch(/account_id/i);
  });

  /**
   * Test 3.6: GET /trades with date range filtering
   * Context7: Complex query params (start_date, end_date), date parsing
   */
  it('should filter trades by date range', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const startDate = new Date('2026-01-01').toISOString();
    const endDate = new Date('2026-02-28').toISOString();

    const response = await request(app)
      .get('/api/v1/trades')
      .set(authHeader(token))
      .query({
        account_id: account.id,
        start_date: startDate,
        end_date: endDate,
        limit: 10,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});

/**
 * Phase 4: Error Cases for Trades
 * Context7: Test invalid inputs, constraint violations, authorization failures
 */
describe('POST /api/v1/trades - Error Cases', () => {
  const app = createApp();

  /**
   * Test 4.1: Invalid trade payload (missing required fields)
   */
  it('should reject trade with missing required fields and return 422', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/trades')
      .set(authHeader(token))
      .send({
        // Missing entry_price, exit_price, quantity
        account_id: account.id,
      })
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.details).toBeDefined();
  });

  /**
   * Test 4.2: Unauthorized - user cannot create trade for another user's account
   * Context7: verifyAccountOwnership should reject
   */
  it('should reject trade creation for account not owned by user', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account = createTestAccount(user2.id); // Account owned by user2
    const token = generateTestJWT(user1.id); // But user1 is creating

    const response = await request(app)
      .post('/api/v1/trades')
      .set(authHeader(token))
      .send({
        ...VALID_TRADE_PAYLOAD,
        account_id: account.id,
      })
      .expect('Content-Type', /json/)
      .expect(403); // Forbidden - not the owner

    expect(response.body.error).toBeDefined();
  });

  /**
   * Test 4.3: Invalid account_id format (malformed UUID)
   */
  it('should reject trade with invalid account_id format', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/trades')
      .set(authHeader(token))
      .send({
        ...VALID_TRADE_PAYLOAD,
        account_id: 'not-a-uuid',
      })
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.details).toBeDefined();
  });

  /**
   * Test 4.4: Invalid numeric values (negative quantity, prices)
   */
  it('should reject trade with negative prices or quantities', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .post('/api/v1/trades')
      .set(authHeader(token))
      .send({
        ...VALID_TRADE_PAYLOAD,
        account_id: account.id,
        entry_price: -100.5, // Invalid - negative
        quantity: -10,        // Invalid - negative
      })
      .expect('Content-Type', /json/)
      .expect(422);

    expect(response.body.details).toBeDefined();
  });
});

describe('GET /api/v1/trades - Error Cases', () => {
  const app = createApp();

  /**
   * Test 4.5: Invalid date format in query
   */
  it('should reject query with invalid date format', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .get('/api/v1/trades')
      .set(authHeader(token))
      .query({
        account_id: account.id,
        start_date: 'not-a-date',
      })
      .expect('Content-Type', /json/);

    // Either 400 (bad request) or 422 (validation error)
    expect([400, 422]).toContain(response.status);
  });

  /**
   * Test 4.6: Cross-account access prevention
   */
  it('should not list trades for account not owned by user', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account = createTestAccount(user2.id); // Owned by user2
    const token = generateTestJWT(user1.id); // But user1 requests

    const response = await request(app)
      .get('/api/v1/trades')
      .set(authHeader(token))
      .query({ account_id: account.id })
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body.error).toBeDefined();
  });
});
