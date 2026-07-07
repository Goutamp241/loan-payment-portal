/**
 * JWT authentication middleware — protects loan and payment routes.
 */

import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import type { JwtPayload } from '../types/auth.js';

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required', code: 'UNAUTHORIZED' });
    return;
  }

  const token = header.slice(7).trim();
  if (!token || token.length < 20 || token.length > 4096) {
    res.status(401).json({ message: 'Invalid authentication token', code: 'INVALID_TOKEN' });
    return;
  }

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token', code: 'INVALID_TOKEN' });
  }
}
