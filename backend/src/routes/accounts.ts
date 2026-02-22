import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import {
  createAccountSchema,
  updateAccountSchema,
} from '../schemas/index.js';
import {
  createAccount,
  selectAccounts,
  updateRiskLimits,
} from '../database/accounts.js';
import { sendSuccess, sendError } from '../utils/responses.js';
import { verifyAccountOwnership } from '../utils/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * POST /api/v1/accounts
 * Create new account for authenticated user
 */
router.post(
  '/',
  validateBody(createAccountSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const account = await createAccount(req.user.id, req.body);
    sendSuccess(res, account, 201);
  })
);

/**
 * GET /api/v1/accounts
 * List all accounts for authenticated user
 */
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const accounts = await selectAccounts(req.user.id);
    sendSuccess(res, accounts, 200);
  })
);

/**
 * PUT /api/v1/accounts/:id
 * Update risk limits for account
 */
router.put(
  '/:id',
  validateBody(updateAccountSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const { id } = req.params;

    // Verify account ownership
    const hasAccess = await verifyAccountOwnership(req.user.id, id, res);
    if (!hasAccess) return;

    const updated = await updateRiskLimits(id, req.body);
    sendSuccess(res, updated, 200);
  })
);

export default router;
