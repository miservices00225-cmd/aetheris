import { adminClient } from '../config/supabase.js';
import { DatabaseError, wrapDatabaseError } from './errors.js';

/**
 * Trade record type from database
 */
export interface Trade {
  id: string;
  account_id: string;
  broker_id: string;
  broker_trade_id: string | null;
  entry_time: string;
  entry_price: number;
  exit_time: string | null;
  exit_price: number | null;
  quantity: number;
  pnl: number | null;
  commission: number;
  slippage: number;
  instrument: string;
  direction: 'LONG' | 'SHORT';
  strategy: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Insert a single trade
 * Checks for duplicates first; throws on constraint violations
 */
export async function insertTrade(
  accountId: string,
  tradeData: Partial<Omit<Trade, 'id' | 'account_id' | 'created_at' | 'updated_at'>>
): Promise<Trade> {
  try {
    // Check for duplicate first
    if (tradeData.broker_id && tradeData.broker_trade_id) {
      const duplicate = await detectDuplicate(
        tradeData.broker_id,
        tradeData.broker_trade_id,
        accountId
      );
      if (duplicate) {
        throw new DatabaseError(
          `Trade already exists with broker_trade_id=${tradeData.broker_trade_id}`,
          'INSERT',
          'trades',
          '',
          '23505'
        );
      }
    }

    const { data, error } = await adminClient
      .from('trades')
      .insert([{ account_id: accountId, ...tradeData }])
      .select('*')
      .single();

    if (error) {
      throw wrapDatabaseError(error, 'INSERT', 'trades');
    }

    return data as Trade;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'INSERT', 'trades');
  }
}

/**
 * Detect duplicate trade by broker_trade_id
 * Returns existing trade if found, null otherwise
 */
export async function detectDuplicate(
  brokerId: string,
  brokerTradeId: string,
  accountId: string
): Promise<Trade | null> {
  try {
    const { data, error } = await adminClient
      .from('trades')
      .select('*')
      .eq('broker_id', brokerId)
      .eq('broker_trade_id', brokerTradeId)
      .eq('account_id', accountId)
      .maybeSingle();

    if (error) {
      throw wrapDatabaseError(error, 'SELECT', 'trades');
    }

    return (data as Trade) || null;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'SELECT', 'trades');
  }
}

/**
 * Select trades for an account
 */
export async function selectTrades(
  accountId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Trade[]> {
  try {
    let query = adminClient
      .from('trades')
      .select('*')
      .eq('account_id', accountId);

    if (startDate) {
      query = query.gte('entry_time', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('entry_time', endDate.toISOString());
    }

    const { data, error } = await query.order('entry_time', { ascending: false });

    if (error) {
      throw wrapDatabaseError(error, 'SELECT', 'trades');
    }

    return (data as Trade[]) || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'SELECT', 'trades');
  }
}

/**
 * Update a trade
 */
export async function updateTrade(
  tradeId: string,
  updates: Partial<Omit<Trade, 'id' | 'account_id' | 'created_at'>>
): Promise<Trade> {
  try {
    const { data, error } = await adminClient
      .from('trades')
      .update(updates)
      .eq('id', tradeId)
      .select('*')
      .single();

    if (error) {
      throw wrapDatabaseError(error, 'UPDATE', 'trades', tradeId);
    }

    return data as Trade;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'UPDATE', 'trades', tradeId);
  }
}
