import type { User } from '@prisma/client';

import { prisma } from '../../config/database';

export class AuthRepository {
  findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  findUserByEmailOrUsername(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  }

  findUserByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  createUser(data: Pick<User, 'email' | 'username' | 'passwordHash' | 'role'>) {
    return prisma.user.create({ data });
  }

  createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
    userAgent?: string;
    ip?: string;
  }) {
    return prisma.refreshToken.create({ data });
  }

  revokeRefreshToken(token: string) {
    return prisma.refreshToken.updateMany({
      where: { token, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async rotateRefreshToken(oldToken: string, newToken: string, expiresAt: Date) {
    const existing = await prisma.refreshToken.findUnique({ where: { token: oldToken } });
    if (!existing || existing.revokedAt) {
      return null;
    }

    await prisma.refreshToken.update({
      where: { token: oldToken },
      data: { revokedAt: new Date() },
    });

    return prisma.refreshToken.create({
      data: {
        token: newToken,
        userId: existing.userId,
        expiresAt,
      },
    });
  }
}

