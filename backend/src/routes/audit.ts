import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validation.js';
import { dateRangeSchema } from '../schemas/index.js';
import { selectSnapshots } from '../database/dailySnapshots.js';
import { exportAuditCSV } from '../database/audit.js';
import { sendSuccess, sendError } from '../utils/responses.js';
import { verifyAccountOwnership } from '../utils/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * GET /api/v1/snapshots
 * List daily snapshots for account with date filtering
 */
router.get(
  '/',
  validateQuery(dateRangeSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const { account_id, start_date, end_date } = req.query as any;

    if (!account_id) {
      sendError(res, 'account_id query param required', 400);
      return;
    }

    // Verify account ownership
    const hasAccess = await verifyAccountOwnership(req.user.id, account_id, res);
    if (!hasAccess) return;

    // Parse dates (provide defaults if missing)
    const startDate = start_date ? new Date(start_date) : new Date('2024-01-01');
    const endDate = end_date ? new Date(end_date) : new Date();

    // Select snapshots
    const snapshots = await selectSnapshots(account_id, startDate, endDate);
    sendSuccess(res, snapshots, 200);
  })
);

/**
 * GET /api/v1/audit/export
 * Export audit trail as CSV
 */
router.get(
  '/export',
  validateQuery(dateRangeSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    // Export audit trail
    const csv = await exportAuditCSV(req.user.id);

    // Return CSV file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-trail.csv"');
    res.send(csv);
  })
);

export default router;
