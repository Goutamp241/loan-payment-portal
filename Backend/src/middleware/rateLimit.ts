/**
 * Simple in-memory rate limiter (per IP + route prefix).
 */

import type { Request, Response, NextFunction } from 'express';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(options: { windowMs: number; max: number; keyPrefix?: string }) {
  const { windowMs, max, keyPrefix = '' } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (bucket.count >= max) {
      res.status(429).json({
        message: 'Too many requests. Please wait and try again.',
        code: 'RATE_LIMITED',
      });
      return;
    }

    bucket.count += 1;
    next();
  };
}

/** OTP brute-force guard — max attempts per transaction */
const otpAttempts = new Map<string, { count: number; resetAt: number }>();
const OTP_MAX_ATTEMPTS = 5;
const OTP_WINDOW_MS = 15 * 60 * 1000;

export function trackOtpAttempt(transactionId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = otpAttempts.get(transactionId);

  if (!entry || now > entry.resetAt) {
    otpAttempts.set(transactionId, { count: 1, resetAt: now + OTP_WINDOW_MS });
    return { allowed: true, remaining: OTP_MAX_ATTEMPTS - 1 };
  }

  if (entry.count >= OTP_MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: OTP_MAX_ATTEMPTS - entry.count };
}

export function clearOtpAttempts(transactionId: string): void {
  otpAttempts.delete(transactionId);
}
