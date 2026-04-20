import jwt, { JwtPayload } from 'jsonwebtoken';

import { env } from '../config/env';

export type AccessTokenPayload = {
  sub: string;
  role: string;
};

export type RefreshTokenPayload = {
  sub: string;
  tokenId: string;
};

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });

export const signRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });

export const verifyAccessToken = (token: string): JwtPayload & AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload & AccessTokenPayload;

export const verifyRefreshToken = (token: string): JwtPayload & RefreshTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload & RefreshTokenPayload;

