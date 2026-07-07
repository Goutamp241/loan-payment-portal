/**
 * Ensures JWT session is still active in Supabase before protected actions.
 */

import type { Request, Response, NextFunction } from 'express';
import { getPaymentSession } from '../services/customer.service.js';

export async function requireActiveSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const auth = req.auth;
    if (!auth?.sessionId) {
      res.status(401).json({ message: 'Authentication required', code: 'UNAUTHORIZED' });
      return;
    }

    const session = await getPaymentSession(auth.sessionId);
    if (!session || session.status !== 'active' || new Date(session.expires_at) < new Date()) {
      res.status(401).json({
        message: 'Session expired. Please verify again.',
        code: 'SESSION_EXPIRED',
      });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
}
