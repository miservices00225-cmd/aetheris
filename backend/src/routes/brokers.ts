import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/responses.js';
import { verifyAccountOwnership } from '../utils/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * POST /api/v1/brokers/:accountId
 * Trigger broker sync job (placeholder for Sprint 5)
 * 
 * Sprint 5 will implement:
 * - Broker API connection
 * - Fetch trades from broker
 * - Deduplication logic
 * - Async job queue
 */
router.post(
  '/:accountId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const { accountId } = req.params;

    // Verify account ownership
    const hasAccess = await verifyAccountOwnership(req.user.id, accountId, res);
    if (!hasAccess) return;

    // Placeholder: return mock sync status
    sendSuccess(res, {
      account_id: accountId,
      status: 'pending',
      trades_new: 0,
      trades_duplicate: 0,
      trades_error: 0,
      sync_timestamp: new Date().toISOString(),
      message: 'Broker sync not yet implemented (Sprint 5)',
    }, 200);
  })
);

export default router;
