import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';

const app = createApp();

const port = Number(env.PORT);

app.listen(port, async () => {
  try {
    await prisma.$connect();
    logger.info({ port }, 'Server listening');
  } catch (err) {
    logger.error({ err }, 'Failed to connect to database');
    process.exit(1);
  }
});

