/**
 * Express application setup.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimit } from './middleware/rateLimit.js';
import { verifyRouter } from './routes/verify.routes.js';
import { loanRouter } from './routes/loan.routes.js';
import { paymentRouter } from './routes/payment.routes.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet({
    contentSecurityPolicy: env.isDev ? false : undefined,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  app.use(cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json({ limit: '16kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'loan-repayment-api', timestamp: new Date().toISOString() });
  });

  app.use('/api/verify', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: 'verify' }), verifyRouter);
  app.use('/api/loan', loanRouter);
  app.use('/api/payment', rateLimit({ windowMs: 60 * 1000, max: 30, keyPrefix: 'payment' }), paymentRouter);

  app.use(errorHandler);

  return app;
}
