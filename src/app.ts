import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { corsOptions, createRateLimiter, helmetMiddleware } from './config/security'
import { errorMiddleware } from './middleware/error.middleware'
import { loggingMiddleware, requestIdMiddleware } from './middleware/logging.middleware'
import { router } from './routes'

export const createApp = () => {
  const app = express()

  // 🔥 1. security first
  app.use(helmetMiddleware)

  // 🔥 2. CORS (ONLY ONCE)
  app.use(cors(corsOptions))

  // 🔥 3. parsers
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  // 🔥 4. proxy trust (JUDAYAM MUHIM NGINX UCHUN)
  app.set('trust proxy', 1)

  // 🔥 5. logging
  app.use(requestIdMiddleware)
  app.use(loggingMiddleware)

  // 🔥 6. rate limit
  app.use(createRateLimiter())

  // 🔥 7. routes
  app.use('/api', router)

  // 🔥 8. error handler
  app.use(errorMiddleware)

  return app
}

