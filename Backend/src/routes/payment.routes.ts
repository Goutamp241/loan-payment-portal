/**
 * Payment routes — simulated 1Pay sandbox with demo OTP verification.
 */

import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { requireActiveSession } from '../middleware/requireActiveSession.js';
import { clearOtpAttempts, trackOtpAttempt } from '../middleware/rateLimit.js';
import { env } from '../config/env.js';
import { decryptPayload } from '../utils/crypto.js';
import { getPaymentSession } from '../services/customer.service.js';
import {
  applySuccessfulPayment,
  completeTransaction,
  createTransaction,
  countSessionTransactions,
  getTransactionForCustomer,
  listTransactionsForCustomer,
  markSessionCompleted,
  markTransactionProcessing,
  toHistoryItemDto,
  toTransactionDto,
} from '../services/transaction.service.js';
import type { DecryptedPaymentRequest } from '../types/api.js';

const encryptedBodySchema = z.object({
  encryptedPayload: z.string().min(1),
  algorithm: z.literal('AES-256-GCM'),
});

const verifyOtpSchema = z.object({
  transactionId: z.string().uuid(),
  otp: z.string().regex(/^\d{4,6}$/, 'OTP must be 4–6 digits'),
  paymentMethod: z.string().min(1).max(32),
  paymentMethodLabel: z.string().min(1).max(120),
});

export const paymentRouter = Router();

/** Read-only — available after payment (session may be completed). */
paymentRouter.get('/history', requireAuth, async (req, res, next) => {
  try {
    const auth = req.auth!;
    const transactions = await listTransactionsForCustomer(auth.sub);
    res.json({ transactions: transactions.map(toHistoryItemDto) });
  } catch (err) {
    next(err);
  }
});

paymentRouter.use(requireAuth, requireActiveSession);

paymentRouter.post('/initiate', async (req, res, next) => {
  try {
    const parsed = encryptedBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid encrypted payment request', code: 'VALIDATION_ERROR' });
      return;
    }

    const paymentData = decryptPayload<DecryptedPaymentRequest>(parsed.data.encryptedPayload);

    if (!paymentData.acceptedPrivacyPolicy || !paymentData.acceptedTerms) {
      res.status(400).json({
        message: 'Privacy Policy and Terms must be accepted',
        code: 'TERMS_NOT_ACCEPTED',
      });
      return;
    }

    if (!paymentData.selection?.amount || paymentData.selection.amount <= 0) {
      res.status(400).json({ message: 'Invalid payment amount', code: 'INVALID_AMOUNT' });
      return;
    }

    const auth = req.auth!;
    const session = await getPaymentSession(auth.sessionId);

    if (!session || session.status !== 'active' || new Date(session.expires_at) < new Date()) {
      res.status(401).json({ message: 'Session expired. Please verify again.', code: 'SESSION_EXPIRED' });
      return;
    }

    const txnCount = await countSessionTransactions(auth.sessionId);
    if (txnCount >= 10) {
      res.status(429).json({
        message: 'Too many payment attempts in this session. Please verify again.',
        code: 'SESSION_TXN_LIMIT',
      });
      return;
    }

    const txn = await createTransaction({
      sessionId: auth.sessionId,
      customerId: auth.sub,
      amount: paymentData.selection.amount,
      paymentOption: paymentData.selection.option,
    });

    res.json({
      id: txn.id,
      transactionId: txn.external_txn_id ?? txn.id,
      amount: Number(txn.amount),
      status: 'pending',
      paymentMode: env.isSimulatedPayment ? 'simulated' : 'live',
      gatewayPath: '/onepay',
    });
  } catch (err) {
    next(err);
  }
});

paymentRouter.post('/verify-otp', async (req, res, next) => {
  try {
    if (!env.isSimulatedPayment) {
      res.status(501).json({ message: 'Live 1Pay OTP verification is not configured.', code: 'NOT_IMPLEMENTED' });
      return;
    }

    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid OTP verification request', code: 'VALIDATION_ERROR' });
      return;
    }

    const auth = req.auth!;
    const txn = await getTransactionForCustomer(parsed.data.transactionId, auth.sub);

    if (!txn) {
      res.status(404).json({ message: 'Transaction not found', code: 'NOT_FOUND' });
      return;
    }

    if (txn.status === 'success' || txn.status === 'failed') {
      res.status(409).json({
        message: 'This transaction has already been processed.',
        code: 'ALREADY_PROCESSED',
        transaction: toTransactionDto(txn),
      });
      return;
    }

    const attempt = trackOtpAttempt(txn.id);
    if (!attempt.allowed) {
      await completeTransaction({
        transactionId: txn.id,
        status: 'failed',
        failureReason: 'Too many invalid OTP attempts — payment blocked',
      });
      res.status(429).json({
        message: 'Too many invalid OTP attempts. Please start a new payment.',
        code: 'OTP_LOCKED',
      });
      return;
    }

    await markTransactionProcessing(txn.id);

    const otpValid = parsed.data.otp === env.demoOtp;
    const methodLabel = parsed.data.paymentMethodLabel;

    if (otpValid) {
      clearOtpAttempts(txn.id);
      const completed = await completeTransaction({ transactionId: txn.id, status: 'success' });
      if (txn.session_id) await markSessionCompleted(txn.session_id);
      await applySuccessfulPayment(auth.sub, Number(txn.amount));

      res.json({ transaction: toTransactionDto(completed, { paymentMethod: methodLabel }) });
      return;
    }

    const failed = await completeTransaction({
      transactionId: txn.id,
      status: 'failed',
      failureReason: 'Invalid OTP — payment declined by 1Pay',
    });

    res.json({ transaction: toTransactionDto(failed, { paymentMethod: methodLabel }) });
  } catch (err) {
    next(err);
  }
});

paymentRouter.get('/status/:transactionId', async (req, res, next) => {
  try {
    const auth = req.auth!;
    const txn = await getTransactionForCustomer(String(req.params.transactionId), auth.sub);

    if (!txn) {
      res.status(404).json({ message: 'Transaction not found', code: 'NOT_FOUND' });
      return;
    }

    res.json({ transaction: toTransactionDto(txn) });
  } catch (err) {
    next(err);
  }
});

/** Simulated 1Pay webhook — optional; OTP verify handles the sandbox flow */
paymentRouter.post('/callback', (_req, res) => {
  res.status(501).json({ message: 'Use /api/payment/verify-otp in simulated mode.', code: 'NOT_IMPLEMENTED' });
});

/** Create a new pending transaction after a failed payment (retry flow). */
paymentRouter.post('/retry', async (req, res, next) => {
  try {
    const body = z.object({
      amount: z.number().positive(),
      paymentOption: z.string().min(1),
    }).safeParse(req.body);

    if (!body.success) {
      res.status(400).json({ message: 'Invalid retry request', code: 'VALIDATION_ERROR' });
      return;
    }

    const auth = req.auth!;
    const session = await getPaymentSession(auth.sessionId);

    if (!session) {
      res.status(401).json({ message: 'Session expired. Please verify again.', code: 'SESSION_EXPIRED' });
      return;
    }

    const txn = await createTransaction({
      sessionId: auth.sessionId,
      customerId: auth.sub,
      amount: body.data.amount,
      paymentOption: body.data.paymentOption,
    });

    res.json({
      id: txn.id,
      transactionId: txn.external_txn_id ?? txn.id,
      amount: Number(txn.amount),
      status: 'pending',
      paymentMode: env.isSimulatedPayment ? 'simulated' : 'live',
      gatewayPath: '/onepay',
    });
  } catch (err) {
    next(err);
  }
});
