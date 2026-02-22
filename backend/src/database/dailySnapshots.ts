import { adminClient } from '../config/supabase.js';
import { DatabaseError, wrapDatabaseError } from './errors.js';
import { selectTrades } from './trades.js';

/**
 * Daily snapshot record type - matches actual Supabase schema
 */
export interface DailySnapshot {
  id: string;
  account_id: string;
  snapshot_date: string; // UTC date
  net_pnl: number | null;
  gross_profit: number | null;
  gross_loss: number | null;
  trade_count: number;
  win_count: number;
  loss_count: number;
  largest_win: number | null;
  largest_loss: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Create a daily snapshot by calculating metrics from trades
 */
export async function createDailySnapshot(
  accountId: string,
  date: Date
): Promise<DailySnapshot> {
  try {
    // Set date to midnight UTC
    const snapshotDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const startOfDay = snapshotDate;
    const endOfDay = new Date(snapshotDate.getTime() + 86400000); // +1 day

    // Get all trades for this day
    const trades = await selectTrades(accountId, startOfDay, endOfDay);

    // Calculate metrics
    let netPnl = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let winCount = 0;
    let lossCount = 0;

    trades.forEach((trade) => {
      if (trade.pnl !== null) {
        netPnl += trade.pnl;
        if (trade.pnl > 0) {
          grossProfit += trade.pnl;
          winCount++;
        } else if (trade.pnl < 0) {
          grossLoss += Math.abs(trade.pnl);
          lossCount++;
        }
      }
    });

    // Calculate derived metrics
    let largestWin = 0;
    let largestLoss = 0;
    
    if (trades.length > 0) {
      largestWin = Math.max(0, ...trades.map(t => t.pnl || 0).filter(p => p > 0));
      largestLoss = Math.max(0, ...trades.map(t => Math.abs(t.pnl || 0)).filter(p => p > 0 && (trades.find(tr => tr.pnl === -p * (p > 0 ? 1 : -1))?.pnl || 0) < 0));
    }

    // Insert snapshot with only actual table columns
    const { data, error } = await adminClient
      .from('daily_snapshots')
      .insert([
        {
          account_id: accountId,
          snapshot_date: snapshotDate.toISOString().split('T')[0], // YYYY-MM-DD format
          net_pnl: netPnl,
          gross_profit: grossProfit,
          gross_loss: grossLoss,
          trade_count: trades.length,
          win_count: winCount,
          loss_count: lossCount,
          largest_win: largestWin || null,
          largest_loss: largestLoss || null,
        },
      ])
      .select('*')
      .single();

    if (error) {
      throw wrapDatabaseError(error, 'INSERT', 'daily_snapshots');
    }

    return data as DailySnapshot;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'INSERT', 'daily_snapshots');
  }
}

/**
 * Select snapshots for an account within a date range
 */
export async function selectSnapshots(
  accountId: string,
  startDate: Date,
  endDate: Date
): Promise<DailySnapshot[]> {
  try {
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const { data, error } = await adminClient
      .from('daily_snapshots')
      .select('*')
      .eq('account_id', accountId)
      .gte('snapshot_date', startStr)
      .lte('snapshot_date', endStr)
      .order('snapshot_date', { ascending: false });

    if (error) {
      throw wrapDatabaseError(error, 'SELECT', 'daily_snapshots');
    }

    return (data as DailySnapshot[]) || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'SELECT', 'daily_snapshots');
  }
}
