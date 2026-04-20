import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import { logger } from '../config/logger'
import { error } from '../utils/response'

// Simple application error type for controlled failures
export class AppError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 REAL ERROR:', err)
  if (err instanceof AppError) {
    logger.warn({ err, path: req.path }, 'Handled AppError')
    return error(res, err.statusCode, err.message)
  }

  if (err instanceof ZodError) {
    logger.warn({ issues: err.issues, path: req.path }, 'Validation error')
    return error(res, 400, 'Validation error', err.flatten())
  }

  logger.error({ err, path: req.path }, 'Unhandled error')
  return error(res, 500, 'Internal server error')
};

