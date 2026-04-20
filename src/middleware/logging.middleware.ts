import type { Request, Response, NextFunction } from 'express';
import pinoHttp from 'pino-http';

import { logger } from '../config/logger';

export const loggingMiddleware = pinoHttp({
  logger,
  autoLogging: true,
});

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] ?? crypto.randomUUID();
  res.setHeader('x-request-id', String(requestId));
  (req as Request & { id?: string }).id = String(requestId);
  next();
};

