import { z } from 'zod';

/**
 * Trade creation schema
 */
export const createTradeSchema = z.object({
  broker_id: z.string().min(1, 'broker_id required'),
  broker_trade_id: z.string().min(1, 'broker_trade_id required'),
  symbol: z.string().regex(/^[A-Z]{3,12}$/, 'Invalid symbol format'),
  trade_type: z.enum(['buy', 'sell', 'long', 'short']).nullable().optional(),
  entry_price: z.number().positive('entry_price must be positive'),
  quantity: z.number().positive('quantity must be positive'),
  entry_time: z.string().datetime('Invalid ISO datetime'),
  commission: z.number().min(0).optional(),
  slippage: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type CreateTradeInput = z.infer<typeof createTradeSchema>;

/**
 * Trade update schema (only exit/P&L fields)
 */
export const updateTradeSchema = z.object({
  exit_price: z.number().positive().optional(),
  exit_time: z.string().datetime().optional(),
  pnl: z.number().optional(),
  pnl_percent: z.number().optional(),
  mfe: z.number().optional(),
  mae: z.number().optional(),
  notes: z.string().optional(),
});

export type UpdateTradeInput = z.infer<typeof updateTradeSchema>;

/**
 * Account creation schema
 */
export const createAccountSchema = z.object({
  account_name: z.string().min(1, 'account_name required'),
  account_type: z.enum(['personal', 'prop_firm', 'crypto']),
  broker_type: z.string().optional(),
  risk_limit_percent: z.number().min(0).max(100).optional(),
  max_drawdown_percent: z.number().min(0).max(100).optional(),
  daily_loss_limit: z.number().min(0).optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

/**
 * Account update schema
 */
export const updateAccountSchema = z.object({
  risk_limit_percent: z.number().min(0).max(100).optional(),
  max_drawdown_percent: z.number().min(0).max(100).optional(),
  daily_loss_limit: z.number().min(0).optional(),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

/**
 * Date range query params
 */
export const dateRangeSchema = z.object({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  limit: z.coerce.number().min(1).max(1000).default(100),
  offset: z.coerce.number().min(0).default(0),
});

export type DateRangeInput = z.infer<typeof dateRangeSchema>;
