import { add } from 'date-fns';
import { env } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';
import { hashPassword, verifyPassword } from '../../utils/password';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import type { User } from '@prisma/client';

import type { LoginDto, RegisterDto } from './auth.dto';
import { AuthRepository } from './auth.repository';

const authRepository = new AuthRepository();

const toPublicUser = (user: User) => {
  const { passwordHash: _p, ...rest } = user;
  return rest;
};

const parseDurationToDate = (duration: string) => {
  // Very small helper: supports Xm, Xh, Xd
  const match = duration.match(/^(\d+)([mhd])$/);
  if (!match) {
    return add(new Date(), { days: 7 });
  }
  const value = Number(match[1]);
  const unit = match[2];
  if (unit === 'm') return add(new Date(), { minutes: value });
  if (unit === 'h') return add(new Date(), { hours: value });
  return add(new Date(), { days: value });
};

export class AuthService {
  async register(dto: RegisterDto) {
    const existing = await authRepository.findUserByEmailOrUsername(dto.email);
    if (existing) {
      throw new AppError('User already exists', 409);
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await authRepository.createUser({
      email: dto.email,
      username: dto.username,
      passwordHash,
      role: 'USER',
    });

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, tokenId: crypto.randomUUID() });
    const expiresAt = parseDurationToDate(env.REFRESH_TOKEN_EXPIRES_IN);

    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return { user: toPublicUser(user), accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await authRepository.findUserByEmailOrUsername(dto.username);
    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    const valid = await verifyPassword(dto.password, user.passwordHash);
    if (!valid) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, tokenId: crypto.randomUUID() });
    const expiresAt = parseDurationToDate(env.REFRESH_TOKEN_EXPIRES_IN);

    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return { user: toPublicUser(user), accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }

    const newRefreshToken = signRefreshToken({
      sub: payload.sub,
      tokenId: crypto.randomUUID(),
    });
    const expiresAt = parseDurationToDate(env.REFRESH_TOKEN_EXPIRES_IN);

    const rotated = await authRepository.rotateRefreshToken(
      refreshToken,
      newRefreshToken,
      expiresAt,
    );

    if (!rotated) {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await authRepository.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401);
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    await authRepository.revokeRefreshToken(refreshToken);
  }
}

