import 'dotenv/config'
import { NextFunction, Response } from "express"
import jwt from "jsonwebtoken"


import { Request } from 'express'

interface JwtPayload {
	sub: string
	role: string
}

// req ga user qo‘shish uchun extend
export interface AuthRequest extends Request {
	user?: {
		id: string
		role: string
	}
}

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Response | void => {
	try {
		const authHeader = req.headers.authorization

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		const token = authHeader.split(' ')[1]

		if (!process.env.JWT_ACCESS_SECRET) {
			return res.status(500).json({ message: 'Server error' })
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_ACCESS_SECRET
		) as JwtPayload

		req.user = {
			id: decoded.sub,
			role: decoded.role,
		}

		return next() // 🔥 MUHIM
	} catch (err: any) {
		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Token expired' })
		}

		if (err.name === 'JsonWebTokenError') {
			return res.status(401).json({ message: 'Invalid token' })
		}

		return res.status(401).json({ message: 'Unauthorized' }) // 🔥 MUHIM
	}
}