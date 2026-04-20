import cookieParser from 'cookie-parser';
import express, { Router } from 'express';

import { corsMiddleware, helmetMiddleware } from './config/security';
import { loggingMiddleware, requestIdMiddleware } from './middleware/logging.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { createRateLimiter } from './config/security';
import { router } from './routes';

export const createApp = () => {
  const app = express();

  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(requestIdMiddleware);
  app.use(loggingMiddleware);

  // Global rate limiter; can be refined per-route
  app.use(createRateLimiter());


  app.use('/api', router);


  app.use(errorMiddleware);

  return app;
};

