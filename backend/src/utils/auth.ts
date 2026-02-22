import { Response } from 'express';
import { selectAccounts } from '../database/accounts.js';
import { sendError } from '../utils/responses.js';

/**
 * Verify that account belongs to authenticated user
 * Returns false and sends 403 if not authorized
 */
export async function verifyAccountOwnership(
  userId: string,
  accountId: string,
  res: Response
): Promise<boolean> {
  try {
    const accounts = await selectAccounts(userId);
    const hasAccess = accounts.some(acc => acc.id === accountId);

    if (!hasAccess) {
      sendError(res, 'Forbidden: you do not have access to this account', 403, 'RLS');
      return false;
    }

    return true;
  } catch (error) {
    // On database error, fail safely
    sendError(res, 'Authorization check failed', 500);
    return false;
  }
}
