import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  const passwordHash = await bcrypt.hash('1234', SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: 'zebeng@shelter.local' },
    update: {
      username: 'zebeng',
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: 'zebeng@shelter.local',
      username: 'zebeng',
      passwordHash,
      role: 'ADMIN',
    },
  });
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seed OK: admin user zebeng / 1234');
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
