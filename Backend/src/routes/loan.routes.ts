/**
 * GET /api/loan/details — returns AES-encrypted loan + session payload.
 * POST /api/loan/refresh-session — new session + fresh balances after a completed payment.
 */

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireActiveSession } from '../middleware/requireActiveSession.js';
import {
  createPaymentSession,
  getCustomerById,
  getPaymentSession,
} from '../services/customer.service.js';
import {
  buildEncryptedLoanResponse,
  getActivePaymentSession,
} from '../services/loan.service.js';
import { signToken } from '../utils/jwt.js';

export const loanRouter = Router();

/** Start a new payment session with up-to-date loan balances (after prior payment). */
loanRouter.post('/refresh-session', requireAuth, async (req, res, next) => {
  try {
    const auth = req.auth!;
    const customer = await getCustomerById(auth.sub);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found', code: 'NOT_FOUND' });
      return;
    }

    const session = await createPaymentSession(customer.id);
    const token = signToken({
      sub: customer.id,
      customerId: customer.customer_id,
      mobile: customer.mobile,
      sessionId: session.id,
    });

    const loanPayload = await buildEncryptedLoanResponse(customer.id, session);

    res.json({
      token,
      ...loanPayload,
    });
  } catch (err) {
    next(err);
  }
});

loanRouter.use(requireAuth, requireActiveSession);

loanRouter.get('/details', async (req, res, next) => {
  try {
    const auth = req.auth!;
    const session = await getActivePaymentSession(auth.sessionId);

    if (!session) {
      res.status(401).json({ message: 'Session expired. Please verify again.', code: 'SESSION_EXPIRED' });
      return;
    }

    const response = await buildEncryptedLoanResponse(auth.sub, session);
    res.json(response);
  } catch (err) {
    if (err instanceof Error && err.message === 'Loan account not found') {
      res.status(404).json({ message: 'No loan account found', code: 'LOAN_NOT_FOUND' });
      return;
    }
    next(err);
  }
});
