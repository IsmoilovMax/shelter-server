import cors, { CorsOptions } from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

import { env } from './env'

export const corsOptions: CorsOptions = {
  origin: [
    'https://zebeng.co.kr',
    "https://api.zebeng.co.kr",
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}


export const helmetMiddleware = helmet()

export const createRateLimiter = () =>
  rateLimit({
    windowMs: Number(env.RATE_LIMIT_WINDOW_MS),
    max: Number(env.RATE_LIMIT_MAX),
    standardHeaders: true,
    legacyHeaders: false,
  })

export const corsMiddleware = cors(corsOptions);

