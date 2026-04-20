import type { NextFunction, Request, Response } from 'express'
import type { ZodObject } from 'zod'

export const validate =
  (schema: ZodObject<any>) =>
    (req: Request, _res: Response, next: NextFunction) => {

      const parsed = schema.safeParse(req.body)

      if (!parsed.success) {
        return next(parsed.error)
      }

      req.body = parsed.data
      next()
    };

