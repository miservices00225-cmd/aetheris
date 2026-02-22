import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validation.js';
import {
  createTradeSchema,
  updateTradeSchema,
  dateRangeSchema,
} from '../schemas/index.js';
import {
  insertTrade,
  selectTrades,
  updateTrade,
  detectDuplicate,
} from '../database/trades.js';
import { adminClient } from '../config/supabase.js';
import { sendSuccess, sendError, sendNoContent } from '../utils/responses.js';
import { verifyAccountOwnership } from '../utils/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * POST /api/v1/trades
 * Create new trade with automatic deduplication
 */
router.post(
  '/',
  validateBody(createTradeSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const { account_id, ...tradeData } = req.body;

    // Verify account ownership
    const hasAccess = await verifyAccountOwnership(req.user.id, account_id, res);
    if (!hasAccess) return;

    // Check for duplicates
    const existing = await detectDuplicate(
      tradeData.broker_id,
      tradeData.broker_trade_id,
      account_id
    );

    if (existing) {
      sendError(res, 'Duplicate trade: this broker_trade_id already exists', 409, '23505');
      return;
    }

    // Create new trade
    const trade = await insertTrade(account_id, tradeData);
    sendSuccess(res, trade, 201);
  })
);

/**
 * GET /api/v1/trades
 * List trades for account with optional filtering
 */
router.get(
  '/',
  validateQuery(dateRangeSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const { account_id, start_date, end_date, symbol, limit, offset } = req.query as any;

    if (!account_id) {
      sendError(res, 'account_id query param required', 400);
      return;
    }

    // Verify account ownership
    const hasAccess = await verifyAccountOwnership(req.user.id, account_id, res);
    if (!hasAccess) return;

    // Parse dates
    const startDate = start_date ? new Date(start_date) : undefined;
    const endDate = end_date ? new Date(end_date) : undefined;

    // Select trades
    const trades = await selectTrades(account_id, startDate, endDate);

    // Filter by symbol if provided
    let filtered = trades;
    if (symbol) {
      filtered = trades.filter((t: any) => t.symbol === symbol);
    }

    // Paginate
    const paginatedTrades = filtered.slice(offset || 0, (offset || 0) + (limit || 100));

    sendSuccess(res, paginatedTrades, 200, {
      total: filtered.length,
      limit: limit || 100,
      offset: offset || 0,
    });
  })
);

/**
 * PUT /api/v1/trades/:id
 * Update trade exit price, P&L, notes
 */
router.put(
  '/:id',
  validateBody(updateTradeSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const { id } = req.params;

    // Verify trade exists and belongs to user
    const { data: trade, error } = await adminClient
      .from('trades')
      .select('id, account_id')
      .eq('id', id)
      .single();

    if (error || !trade) {
      sendError(res, 'Trade not found', 404);
      return;
    }

    // Verify account ownership
    const hasAccess = await verifyAccountOwnership(req.user.id, trade.account_id, res);
    if (!hasAccess) return;

    // Update trade
    const updated = await updateTrade(id, req.body);
    sendSuccess(res, updated, 200);
  })
);

/**
 * DELETE /api/v1/trades/:id
 * Delete trade record
 */
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const { id } = req.params;

    // Verify trade exists and belongs to user
    const { data: trade, error } = await adminClient
      .from('trades')
      .select('id, account_id')
      .eq('id', id)
      .single();

    if (error || !trade) {
      sendError(res, 'Trade not found', 404);
      return;
    }

    // Verify account ownership
    const hasAccess = await verifyAccountOwnership(req.user.id, trade.account_id, res);
    if (!hasAccess) return;

    // Delete trade
    await adminClient.from('trades').delete().eq('id', id);
    sendNoContent(res);
  })
);

export default router;
