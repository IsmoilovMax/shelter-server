import { createApp } from './app'
import { prisma } from './config/database'
import { env } from './config/env'
import { logger } from './config/logger'

const app = createApp()

const port = Number(env.PORT)

app.listen(port, "0.0.0.0", async () => {
  try {
    await prisma.$connect()
    logger.info({ port }, 'Server listening')
  } catch (err) {
    logger.error({ err }, 'Failed to connect to database')
    process.exit(1)
  }
})



