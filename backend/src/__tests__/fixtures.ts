/**
 * Test fixtures: Reusable mock data builders
 * Context7 best practices: Lightweight, minimal setup, DRY patterns
 * 
 * Use these to build test data without repetition.
 * Keeps tests fast and readable.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Lightweight cleanup helper for afterEach
 * Context7: Clean separation between setup and teardown
 * Only delete what's actually needed in tests
 */
export const createTestUser = () => {
  const userId = uuidv4();
  return {
    id: userId,
    email: `test-${userId.substring(0, 8)}@test.local`,
    created_at: new Date().toISOString(),
  };
};

export const createTestAccount = (userId?: string) => {
  const accountId = uuidv4();
  return {
    id: accountId,
    user_id: userId || uuidv4(),
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
  const tradeId = uuidv4();
  const brokerTradeId = `BT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  return {
    id: tradeId,
    account_id: accountId || uuidv4(),
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
  const connectionId = uuidv4();
  return {
    id: connectionId,
    account_id: accountId || uuidv4(),
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
    this.userId = userId || uuidv4();
  }

  user() {
    return { id: this.userId, email: `user-${this.userId.substring(0, 8)}@test.local` };
  }

  account(overrides?: Record<string, unknown>) {
    return {
      id: uuidv4(),
      user_id: this.userId,
      account_name: `Account-${uuidv4().substring(0, 8)}`,
      account_type: 'personal' as const,
      ...overrides,
    };
  }

  trade(accountId: string, overrides?: Record<string, unknown>) {
    return {
      id: uuidv4(),
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
