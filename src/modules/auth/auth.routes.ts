import { Router } from 'express'
import multer from 'multer'

import { createRateLimiter } from '../../config/security'
import { validate } from '../../middleware/validate.middleware'
import { AuthController } from './auth.controller'
import { loginSchema, refreshSchema, registerSchema } from './auth.dto'
import { authMiddleware } from './auth.middleware'

const controller = new AuthController()
const upload = multer()

export const authRouter = Router()

const authLimiter = createRateLimiter()

authRouter.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  (req, res, next) => controller.register(req, res).catch(next),

)

authRouter.post(
  '/login',
  authLimiter,
  upload.none(),
  validate(loginSchema),
  (req, res, next) => controller.login(req, res).catch(next),
)

authRouter.get(
  "/myinfo",
  authLimiter,
  authMiddleware,
  (req, res, next) => controller.getMyInfo(req, res).catch(next)
)

authRouter.post(
  '/refresh',
  authLimiter,
  validate(refreshSchema),
  (req, res, next) => controller.refresh(req, res).catch(next),
)

authRouter.post(
  '/logout',
  authLimiter,
  validate(refreshSchema),
  (req, res, next) => controller.logout(req, res).catch(next),
);

