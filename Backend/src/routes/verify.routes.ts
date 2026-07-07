/**
 * POST /api/verify — identity verification (mobile + card last 4 + reCAPTCHA).
 */

import { Router } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import {
  createPaymentSession,
  findCustomerByCredentials,
} from '../services/customer.service.js';
import { verifyRecaptchaToken } from '../services/recaptcha.service.js';
import { signToken } from '../utils/jwt.js';
import type { VerifyResponseDto } from '../types/api.js';

const verifySchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  cardLast4: z.string().regex(/^\d{4}$/, 'Card must be 4 digits'),
  captchaToken: z.string().min(1),
});

export const verifyRouter = Router();

verifyRouter.post('/', async (req, res, next) => {
  try {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.errors[0]?.message ?? 'Invalid request',
        code: 'VALIDATION_ERROR',
      });
      return;
    }

    const { mobile, cardLast4, captchaToken } = parsed.data;

    if (!env.skipRecaptcha) {
      const captchaValid = await verifyRecaptchaToken(captchaToken);
      if (!captchaValid) {
        res.status(400).json({
          message: 'reCAPTCHA verification failed. Please try again.',
          code: 'CAPTCHA_FAILED',
        });
        return;
      }
    }

    const customer = await findCustomerByCredentials(mobile, cardLast4);
    if (!customer) {
      res.status(401).json({
        message: 'Invalid mobile number or card details. Please try again.',
        code: 'VERIFICATION_FAILED',
      });
      return;
    }

    const session = await createPaymentSession(customer.id);
    const verifiedAt = new Date().toISOString();

    const token = signToken({
      sub: customer.id,
      customerId: customer.customer_id,
      mobile: customer.mobile,
      sessionId: session.id,
    });

    const response: VerifyResponseDto = {
      token,
      verification: {
        mobile: customer.mobile,
        cardLast4: customer.card_last4,
        verifiedAt,
      },
      encryptedLoanDetails: null,
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});
