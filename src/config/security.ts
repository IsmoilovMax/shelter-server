import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
  credentials: true,
};

export const helmetMiddleware = helmet();

export const createRateLimiter = () =>
  rateLimit({
    windowMs: Number(env.RATE_LIMIT_WINDOW_MS),
    max: Number(env.RATE_LIMIT_MAX),
    standardHeaders: true,
    legacyHeaders: false,
  });

export const corsMiddleware = cors(corsOptions);

