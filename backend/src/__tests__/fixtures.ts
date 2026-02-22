/**
 * Test fixtures: Reusable mock data builders
 * Context7 best practices: Lightweight, minimal setup, DRY patterns
 * 
 * Use these to build test data without repetition.
 * Keeps tests fast and readable.
 */

import { randomUUID } from 'crypto';

// Simple ID generator for tests (native crypto.randomUUID - no external dependencies)
const generateId = (): string => randomUUID();

/**
 * Lightweight cleanup helper for afterEach
 * Context7: Clean separation between setup and teardown
 * Only delete what's actually needed in tests
 */
export const createTestUser = () => {
  const userId = generateId();
  return {
    id: userId,
    email: `test-${userId.substring(0, 8)}@test.local`,
    created_at: new Date().toISOString(),
  };
};

export const createTestAccount = (userId?: string) => {
  const accountId = generateId();
  return {
    id: accountId,
    user_id: userId || generateId(),
    account_name: `Test-Account-${accountId.substring(0, 8)}`,
    account_type: 'personal' as const,
    leverage: 1,
    daily_loss_limit_percent: 2,
    created_at: new Date().toISOString(),
  };
};

export const createTestTrade = (
  accountId?: string,
  overrides?: Record<string, unknown>
) => {
  const tradeId = generateId();
  const brokerTradeId = `BT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  return {
    id: tradeId,
    account_id: accountId || generateId(),
    broker_trade_id: brokerTradeId,
    entry_price: 100.5,
    exit_price: 102.0,
    quantity: 10,
    entry_time: new Date().toISOString(),
    exit_time: new Date(Date.now() + 3600000).toISOString(),
    pnl: 150,
    created_at: new Date().toISOString(),
    ...overrides,
  };
};

export const createTestBrokerConnection = (accountId?: string) => {
  const connectionId = generateId();
  return {
    id: connectionId,
    account_id: accountId || generateId(),
    broker_type: 'mt4' as const,
    connection_status: 'connected' as const,
    last_sync_at: null,
    created_at: new Date().toISOString(),
  };
};

/**
 * Context7 pattern: Test data factory with builder pattern
 * Minimal memory footprint, lazy construction
 */
export class TestDataFactory {
  private userId: string;

  constructor(userId?: string) {
    this.userId = userId || generateId();
  }

  user() {
    return { id: this.userId, email: `user-${this.userId.substring(0, 8)}@test.local` };
  }

  account(overrides?: Record<string, unknown>) {
    return {
      id: generateId(),
      user_id: this.userId,
      account_name: `Account-${generateId().substring(0, 8)}`,
      account_type: 'personal' as const,
      ...overrides,
    };
  }

  trade(accountId: string, overrides?: Record<string, unknown>) {
    return {
      id: generateId(),
      account_id: accountId,
      broker_trade_id: `BT-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      entry_price: 100.5,
      exit_price: 102.0,
      quantity: 10,
      entry_time: new Date().toISOString(),
      exit_time: new Date(Date.now() + 3600000).toISOString(),
      pnl: 150,
      ...overrides,
    };
  }

  reset() {
    this.userId = generateId();
  }
}

/**
 * Common test payloads (reuse to avoid duplication)
 * Context7: Centralize test data, reduce boilerplate
 */
export const VALID_TRADE_PAYLOAD = {
  entry_price: 100.5,
  exit_price: 102.0,
  quantity: 10,
  entry_time: new Date().toISOString(),
  exit_time: new Date(Date.now() + 3600000).toISOString(),
};

export const VALID_ACCOUNT_PAYLOAD = {
  account_name: 'My Trading Account',
  account_type: 'personal' as const,
  leverage: 1,
  daily_loss_limit_percent: 2,
};

export const INVALID_TRADE_PAYLOAD = {
  entry_price: 'not-a-number', // Invalid
  exit_price: 102.0,
  quantity: 10,
};

export const INVALID_ACCOUNT_PAYLOAD = {
  account_name: 'Test Account',
  account_type: 'invalid_type', // Invalid enum
  leverage: 1,
};

export const VALID_BROKER_PAYLOAD = {
  broker_type: 'mt4' as const,
  broker_api_key: 'test-api-key',
  broker_api_secret: 'test-api-secret',
};
