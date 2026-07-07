/**
 * Verifies Google reCAPTCHA v2 tokens server-side.
 */

import { env } from '../config/env.js';

interface RecaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  if (env.skipRecaptcha) {
    return token.length > 0;
  }

  const secret = env.recaptchaSecretKey;
  if (!secret) {
    throw new Error('RECAPTCHA_SECRET_KEY is required when SKIP_RECAPTCHA=false');
  }

  // Reject demo placeholder when production reCAPTCHA is required
  if (token === 'dev-captcha-token') {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = (await response.json()) as RecaptchaVerifyResponse;
  return data.success === true;
}
