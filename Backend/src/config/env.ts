/**
 * Environment configuration — loaded once at startup.
 */

import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const env = {
  port: Number(optional('PORT', '3001')),
  nodeEnv: optional('NODE_ENV', 'development'),
  isDev: optional('NODE_ENV', 'development') === 'development',

  supabaseUrl: () => required('SUPABASE_URL'),
  supabaseServiceRoleKey: () => required('SUPABASE_SERVICE_ROLE_KEY'),

  jwtSecret: () => required('JWT_SECRET'),
  jwtExpiresIn: optional('JWT_EXPIRES_IN', '1h'),

  frontendUrl: optional('FRONTEND_URL', 'http://localhost:5173'),

  skipRecaptcha: optional('SKIP_RECAPTCHA', 'true') === 'true',
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,

  encryptionSecret: () => required('ENCRYPTION_SECRET'),

  /** simulated = demo 1Pay OTP sandbox; live = real gateway (future) */
  paymentMode: optional('PAYMENT_MODE', 'simulated'),
  isSimulatedPayment: optional('PAYMENT_MODE', 'simulated') === 'simulated',
  demoOtp: optional('DEMO_OTP', '1562'),
};
