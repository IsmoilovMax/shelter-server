import cookieParser from 'cookie-parser'
import express from 'express'

import { corsMiddleware, createRateLimiter, helmetMiddleware } from './config/security'
import { errorMiddleware } from './middleware/error.middleware'
import { loggingMiddleware, requestIdMiddleware } from './middleware/logging.middleware'
import { router } from './routes'

export const createApp = () => {
  const app = express()

  app.use(helmetMiddleware)
  app.use(corsMiddleware)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(requestIdMiddleware)
  app.use(loggingMiddleware)

  // Global rate limiter; can be refined per-route
  app.use(createRateLimiter())


  app.use('/api', router)


  app.use(errorMiddleware)

  return app
};

