import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

import { env } from '../config/env'

export type AccessTokenPayload = {
  sub: string
  role: string
}

export type RefreshTokenPayload = {
  sub: string
  tokenId: string
}

export const signAccessToken = (payload: AccessTokenPayload) => {
  const options: SignOptions = {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  }

  return jwt.sign(payload, env.JWT_ACCESS_SECRET as string, options)
}

export const signRefreshToken = (payload: RefreshTokenPayload) => {
  const options: SignOptions = {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  }

  return jwt.sign(payload, env.JWT_REFRESH_SECRET as string, options)
}

export const verifyAccessToken = (token: string): JwtPayload & AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload & AccessTokenPayload

export const verifyRefreshToken = (token: string): JwtPayload & RefreshTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload & RefreshTokenPayload;

