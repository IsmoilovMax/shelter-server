import type { Request, Response } from 'express'

import { prisma } from '../../config/database'
import { created, noContent, ok } from '../../utils/response'
import { AuthService } from './auth.service'

const authService = new AuthService()

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, username, password } = req.body

    const result = await authService.register({ email, username, password })
    return created(res, result, 'Registered successfully')
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body
    const result = await authService.login({ username, password })
    return res.status(200).json({
      data: {
        code: 'OK',
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })
  }

  async getMyInfo(req: any, res: Response) {

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }


    return ok(res, user, "My info retrieved successfully")
  }


  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body
    const result = await authService.refresh(refreshToken)
    return ok(res, result, 'Token refreshed')
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body
    await authService.logout(refreshToken)
    return noContent(res)
  }
}

