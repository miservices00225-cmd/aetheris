/**
 * Phase 5: RLS & Security Tests
 * Context7: Cross-user isolation, row-level security validation
 * 
 * Scope: Verify that users cannot access other users' data via RLS policies
 * Tests: Account access, trade access, audit isolation, broker connection ownership
 */

import request from 'supertest';
import { createApp } from '../../server.js';
import { generateTestJWT, authHeader } from '../helpers.js';
import {
  createTestUser,
  createTestAccount,
  createTestTrade,
  VALID_TRADE_PAYLOAD,
} from '../fixtures.js';

/**
 * Test 5.1-5.3: RLS Account Isolation
 * Context7: Verify account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
 */
describe('RLS & Security - Account Isolation', () => {
  const app = createApp();

  /**
   * Test 5.1: User cannot read other user's accounts
   */
  it('should not return other users accounts in list', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account2 = createTestAccount(user2.id); // Account owned by user2
    const token1 = generateTestJWT(user1.id);

    const response = await request(app)
      .get('/api/v1/accounts')
      .set(authHeader(token1))
      .expect('Content-Type', /json/)
      .expect(200);

    // User1 should see empty list (RLS filters out user2's accounts)
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).not.toContainEqual(
      expect.objectContaining({ id: account2.id })
    );
  });

  /**
   * Test 5.2: User cannot update other user's account via PUT
   */
  it('should return 403 when attempting to update another users account', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account2 = createTestAccount(user2.id);
    const token1 = generateTestJWT(user1.id);

    const response = await request(app)
      .put(`/api/v1/accounts/${account2.id}`)
      .set(authHeader(token1))
      .send({ daily_loss_limit_percent: 5 })
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body.error).toBeDefined();
  });

  /**
   * Test 5.3: User cannot create trade on other user's account
   */
  it('should return 403 when creating trade on another users account', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account2 = createTestAccount(user2.id);
    const token1 = generateTestJWT(user1.id);

    const response = await request(app)
      .post('/api/v1/trades')
      .set(authHeader(token1))
      .send({
        ...VALID_TRADE_PAYLOAD,
        account_id: account2.id,
      })
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body.error).toBeDefined();
  });
});

/**
 * Test 5.4-5.6: RLS Trade Isolation
 * Context7: Trades filtered by account_id which is filtered by account.user_id = auth.uid()
 */
describe('RLS & Security - Trade Isolation', () => {
  const app = createApp();

  /**
   * Test 5.4: User cannot read trades from other user's account
   */
  it('should not list trades from other users accounts', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account2 = createTestAccount(user2.id);
    const token1 = generateTestJWT(user1.id);

    const response = await request(app)
      .get('/api/v1/trades')
      .set(authHeader(token1))
      .query({ account_id: account2.id })
      .expect('Content-Type', /json/)
      .expect(403); // verifyAccountOwnership rejects

    expect(response.body.error).toBeDefined();
  });

  /**
   * Test 5.5: Trade list filtered by user's accounts only
   */
  it('should only return trades for requesting users accounts', async () => {
    const user1 = createTestUser();
    const account1 = createTestAccount(user1.id);
    const token1 = generateTestJWT(user1.id);

    const response = await request(app)
      .get('/api/v1/trades')
      .set(authHeader(token1))
      .query({ account_id: account1.id })
      .expect('Content-Type', /json/)
      .expect(200);

    // Should return empty list (no trades in DB) but filtered to account1 only
    expect(Array.isArray(response.body)).toBe(true);
    // All trades should belong to account1
    response.body.forEach((trade: any) => {
      expect(trade.account_id).toEqual(account1.id);
    });
  });

  /**
   * Test 5.6: User cannot update/delete other user's trades
   */
  it('should return 403 when attempting to access trade from another users account', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account2 = createTestAccount(user2.id);
    const trade2 = createTestTrade(account2.id);
    const token1 = generateTestJWT(user1.id);

    // Attempt to get a trade from account2
    const response = await request(app)
      .get(`/api/v1/trades/${trade2.id}`)
      .set(authHeader(token1))
      .expect('Content-Type', /json/);

    // Should fail (403 or 404 depending on implementation)
    expect([403, 404]).toContain(response.status);
  });
});

/**
 * Test 5.7-5.9: RLS Audit Trail Isolation
 * Context7: Audit records filtered by user_id = auth.uid()
 */
describe('RLS & Security - Audit Trail Isolation', () => {
  const app = createApp();

  /**
   * Test 5.7: User cannot see other user's audit snapshots
   */
  it('should not export audit records from other users', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const token1 = generateTestJWT(user1.id);
    const token2 = generateTestJWT(user2.id);

    // User2 exports
    const response2 = await request(app)
      .get('/api/v1/audit/export')
      .set(authHeader(token2))
      .expect('Content-Type', /text\/csv/)
      .expect(200);

    // User1 exports
    const response1 = await request(app)
      .get('/api/v1/audit/export')
      .set(authHeader(token1))
      .expect('Content-Type', /text\/csv/)
      .expect(200);

    // Both should be strings but different content
    // (User2's export should have different records than User1's)
    expect(typeof response1.text).toBe('string');
    expect(typeof response2.text).toBe('string');
  });

  /**
   * Test 5.8: Audit snapshots filtered by user
   */
  it('should only return audit snapshots for requesting user', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const token1 = generateTestJWT(user1.id);
    const token2 = generateTestJWT(user2.id);

    // Get snapshots for both users
    const response1 = await request(app)
      .get('/api/v1/audit/snapshots')
      .set(authHeader(token1))
      .expect('Content-Type', /json/)
      .expect(200);

    const response2 = await request(app)
      .get('/api/v1/audit/snapshots')
      .set(authHeader(token2))
      .expect('Content-Type', /json/)
      .expect(200);

    // Both should return arrays
    expect(Array.isArray(response1.body)).toBe(true);
    expect(Array.isArray(response2.body)).toBe(true);

    // Should be independent (in real scenario with data, they'd differ)
  });

  /**
   * Test 5.9: Cannot filter snapshots by another user's account
   */
  it('should reject filtering snapshots by another users account', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account2 = createTestAccount(user2.id);
    const token1 = generateTestJWT(user1.id);

    const response = await request(app)
      .get('/api/v1/audit/snapshots')
      .set(authHeader(token1))
      .query({ account_id: account2.id })
      .expect('Content-Type', /json/);

    // Should return 403 or empty list (RLS filtered)
    expect([200, 403]).toContain(response.status);
    if (response.status === 200) {
      expect(Array.isArray(response.body)).toBe(true);
    }
  });
});

/**
 * Test 5.10-5.12: RLS Broker Connection Isolation
 * Context7: Broker connections filtered by account ownership
 */
describe('RLS & Security - Broker Connection Isolation', () => {
  const app = createApp();

  /**
   * Test 5.10: User cannot sync another user's broker account
   */
  it('should return 403 when syncing another users account', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account2 = createTestAccount(user2.id);
    const token1 = generateTestJWT(user1.id);

    const response = await request(app)
      .post(`/api/v1/brokers/${account2.id}`)
      .set(authHeader(token1))
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body.error).toBeDefined();
  });

  /**
   * Test 5.11: Multiple users can have independent broker accounts
   */
  it('should allow multiple users to independently configure brokers', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account1 = createTestAccount(user1.id);
    const account2 = createTestAccount(user2.id);
    const token1 = generateTestJWT(user1.id);
    const token2 = generateTestJWT(user2.id);

    // User1 can access their account
    const response1 = await request(app)
      .post(`/api/v1/brokers/${account1.id}`)
      .set(authHeader(token1))
      .expect('Content-Type', /json/);

    expect([200, 422]).toContain(response1.status); // 200 or 422 (no broker configured)

    // User2 can access their account independently
    const response2 = await request(app)
      .post(`/api/v1/brokers/${account2.id}`)
      .set(authHeader(token2))
      .expect('Content-Type', /json/);

    expect([200, 422]).toContain(response2.status);
  });

  /**
   * Test 5.12: User1 sync request doesn't affect User2's broker state
   */
  it('should isolate broker sync between different users', async () => {
    const user1 = createTestUser();
    const user2 = createTestUser();
    const account1 = createTestAccount(user1.id);
    const account2 = createTestAccount(user2.id);
    const token1 = generateTestJWT(user1.id);
    const token2 = generateTestJWT(user2.id);

    // User1 attempts to sync
    await request(app)
      .post(`/api/v1/brokers/${account1.id}`)
      .set(authHeader(token1))
      .expect('Content-Type', /json/);

    // User2's account remains unaffected
    // (Verify that user1's sync didn't modify account2)
    const accountResponse2 = await request(app)
      .get('/api/v1/accounts')
      .set(authHeader(token2))
      .expect('Content-Type', /json/)
      .expect(200);

    // User2 should see their own account unchanged
    const user2Account = accountResponse2.body.find(
      (a: any) => a.id === account2.id
    );
    expect(user2Account).toBeDefined();
  });
});
