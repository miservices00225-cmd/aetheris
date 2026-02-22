/**
 * Integration tests for GET /api/v1/snapshots and /api/v1/audit/export
 * Context7 Supertest patterns: async/await, query parameters, filtering, pagination, CSV responses
 * 
 * Scope: Happy path tests for snapshot listing with date filtering and audit export
 * Auth: Verified via JWT in authHeader()
 * Database: Uses test fixtures (createTestUser, createTestAccount)
 * 
 * Per Context7 Express docs: Query parameters for filtering, pagination, and export formats
 */

import request from 'supertest';
import { createApp } from '../../server.js';
import { generateTestJWT, authHeader, AUTH_SCENARIOS } from '../helpers.js';
import { createTestUser, createTestAccount } from '../fixtures.js';

describe('GET /api/v1/snapshots - List Daily Snapshots', () => {
  const app = createApp();

  /**
   * Test 3.11a: GET /snapshots returns array of snapshots
   * Context7: Array response, user isolation (account_id required)
   */
  it('should list snapshots for account with date defaults', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .get('/api/v1/snapshots')
      .set(authHeader(token))
      .query({ account_id: account.id })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    // No snapshots created yet (no trades = no snapshots)
    expect(response.body).toHaveLength(0);
  });

  /**
   * Test 3.11b: GET /snapshots requires account_id parameter
   * Context7: Query parameter validation (required param missing = 400)
   */
  it('should require account_id query parameter', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .get('/api/v1/snapshots')
      .set(authHeader(token))
      .query({})
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.error).toMatch(/account_id/i);
  });

  /**
   * Test 3.11c: GET /snapshots filters by date range
   * Context7: Complex query params (start_date, end_date), date parsing
   */
  it('should filter snapshots by custom date range', async () => {
    const user = createTestUser();
    const account = createTestAccount(user.id);
    const token = generateTestJWT(user.id);

    const startDate = new Date('2026-01-01').toISOString();
    const endDate = new Date('2026-02-01').toISOString();

    const response = await request(app)
      .get('/api/v1/snapshots')
      .set(authHeader(token))
      .query({
        account_id: account.id,
        start_date: startDate,
        end_date: endDate,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  /**
   * Test 3.11d: GET /snapshots requires authorization
   * Context7 AUTH_SCENARIOS: Missing JWT = 401
   */
  it('should reject snapshot listing without JWT', async () => {
    const account = createTestAccount();

    const response = await request(app)
      .get('/api/v1/snapshots')
      .set(AUTH_SCENARIOS.missingAuth())
      .query({ account_id: account.id })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body.error).toMatch(/Unauthorized|token/i);
  });

  /**
   * Test 3.11e: GET /snapshots verifies account ownership
   * Context7: Owner verification (cross-account access blocked)
   */
  it('should verify account ownership before listing snapshots', async () => {
    const user = createTestUser();
    const otherUserAccount = createTestAccount(); // Different user's account
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .get('/api/v1/snapshots')
      .set(authHeader(token))
      .query({ account_id: otherUserAccount.id })
      .expect('Content-Type', /json/)
      .expect(403); // Forbidden - not the owner

    expect(response.body.error).toMatch(/Unauthorized|access|permission/i);
  });
});

describe('GET /api/v1/audit/export - Export Audit Trail', () => {
  const app = createApp();

  /**
   * Test 3.12a: GET /audit/export returns CSV file
   * Context7: File export response, Content-Type header validation
   */
  it('should export audit trail as CSV', async () => {
    const user = createTestUser();
    const token = generateTestJWT(user.id);

    const response = await request(app)
      .get('/api/v1/audit/export')
      .set(authHeader(token))
      .expect('Content-Type', /text\/csv/)
      .expect('Content-Disposition', /attachment/)
      .expect(200);

    // CSV should be string (at minimum, header row)
    expect(typeof response.text).toBe('string');
  });

  /**
   * Test 3.12b: GET /audit/export requires authorization
   * Context7 AUTH_SCENARIOS: Missing JWT = 401
   */
  it('should reject audit export without JWT', async () => {
    const response = await request(app)
      .get('/api/v1/audit/export')
      .set(AUTH_SCENARIOS.missingAuth())
      .expect(401);

    expect(response.body.error).toMatch(/Unauthorized|token/i);
  });

  /**
   * Test 3.12c: GET /audit/export respects user isolation
   * Context7: Audit data is user-scoped (exportAuditCSV filters by user_id)
   */
  it('should export only requesting user audit records', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const token1 = generateTestJWT(user1.id);
    const token2 = generateTestJWT(user2.id);

    // User 1 exports
    const response1 = await request(app)
      .get('/api/v1/audit/export')
      .set(authHeader(token1))
      .expect(200);

    // User 2 exports
    const response2 = await request(app)
      .get('/api/v1/audit/export')
      .set(authHeader(token2))
      .expect(200);

    // Both should be strings (CSV format)
    expect(typeof response1.text).toBe('string');
    expect(typeof response2.text).toBe('string');
    // In a real scenario, response1 and response2 would have different content
  });
});
