/**
 * Centralized error handler for Express.
 */

import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[API Error]', err);

  if (err instanceof Error && err.message.startsWith('Missing required environment')) {
    res.status(503).json({
      message: 'Server configuration incomplete. Check environment variables.',
      code: 'CONFIG_ERROR',
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({
    message: env.isDev ? message : 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
