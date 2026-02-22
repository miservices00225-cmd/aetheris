import { adminClient } from '../config/supabase.js';
import { DatabaseError, wrapDatabaseError } from './errors.js';

/**
 * Account record type from database
 */
export interface Account {
  id: string;
  user_id: string;
  name: string;
  broker_id: string;
  account_number: string;
  account_type: 'LIVE' | 'DEMO' | 'PAPER' | 'PROP_FIRM';
  currency: string;
  initial_balance: number;
  current_balance: number;
  max_drawdown_percent: number;
  leverage: number;
  trailing_drawdown_percent: number | null;
  status: 'ACTIVE' | 'ARCHIVED' | 'CLOSED';
  api_key: string | null;
  api_secret: string | null;
  connected_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new account for a user
 */
export async function createAccount(
  userId: string,
  accountData: Partial<Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Account> {
  try {
    const { data, error } = await adminClient
      .from('accounts')
      .insert([{ user_id: userId, ...accountData }])
      .select('*')
      .single();

    if (error) {
      throw wrapDatabaseError(error, 'INSERT', 'accounts');
    }

    return data as Account;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'INSERT', 'accounts');
  }
}

/**
 * Select all accounts for a user
 */
export async function selectAccounts(userId: string): Promise<Account[]> {
  try {
    const { data, error } = await adminClient
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw wrapDatabaseError(error, 'SELECT', 'accounts');
    }

    return (data as Account[]) || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'SELECT', 'accounts');
  }
}

/**
 * Update risk limits for an account
 */
export async function updateRiskLimits(
  accountId: string,
  limits: {
    max_drawdown_percent?: number;
    trailing_drawdown_percent?: number;
  }
): Promise<Account> {
  try {
    const { data, error } = await adminClient
      .from('accounts')
      .update(limits)
      .eq('id', accountId)
      .select('*')
      .single();

    if (error) {
      throw wrapDatabaseError(error, 'UPDATE', 'accounts', accountId);
    }

    return data as Account;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'UPDATE', 'accounts', accountId);
  }
}

/**
 * Select accounts with risk violations (admin query)
 */
export async function selectByRiskViolation(): Promise<Account[]> {
  try {
    const { data, error } = await adminClient
      .from('accounts')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('updated_at', { ascending: true });

    if (error) {
      throw wrapDatabaseError(error, 'SELECT', 'accounts');
    }

    return (data as Account[]) || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'SELECT', 'accounts');
  }
}
